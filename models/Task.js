// Requirements
const { Schema, model } = require("mongoose");

// Task Schema
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // Task lifecycle status
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },
  // Associate task with parent project
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Task = model("Task", taskSchema);

module.exports = Task;
