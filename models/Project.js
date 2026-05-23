// Requirements
const { Schema, model } = require("mongoose");

// Project Schema
const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  //Associate project with owner
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Project = model("Project", projectSchema);

module.exports = Project;
