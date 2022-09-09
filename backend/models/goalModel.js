const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Goal = mongoose.model("Goal", goalSchema);
