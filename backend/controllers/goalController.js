const asyncHandler = require("express-async-handler");

const Goal = require("../models/goalModel");
const User = require("../models/userModel");

//@desc Get goals
//@route GET /api/goals
//@access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.status(200).json(goals);
});

//@desc Set goals
//@route POST /api/goals
//@access Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const goal = await Goal.create({
    text: req.body.text,
    user: req.user._id,
  });
  res.status(200).json(goal);
});

//@desc Update goal
//@route PUT /api/goals/:id
//@access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }
  const user = await User.findById(req.user._id);
  //check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Make sure the logged in user is the owner of the goal
  if (user._id.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedGoal);
});

//@desc Delete goals
//@route DELETE /api/goals
//@access Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }
  const user = await User.findById(req.user._id);
  //check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Make sure the logged in user is the owner of the goal
  if (user._id.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Goal.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: `Delete goal ${req.params.id}` });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
