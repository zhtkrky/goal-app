const jwt = require("jsonwebtoken");
const bycrpt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc Register new user
//@route POST /api/users
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  // check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  // hash password
  const salt = await bycrpt.genSalt(10);
  const hashedPassword = await bycrpt.hash(password, salt);
  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Authenticate a new user
//@route POST /api/users/login
//@access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check for user email
  const user = await User.findOne({ email });
  if (user && (await bycrpt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
  res.json({ message: "Login User" });
});

//@desc Get user data
//@route GET /api/users/me
//@access Private

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, loginUser, getMe };
