// Requirements
const router = require("express").Router();
const { Task, Project } = require("../../models");
const { authMiddleware } = require("../../utils/auth");

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// POST /api/projects/:projectId/tasks - Create a new task for a specific project
router.post("/projects/:projectId/tasks", async (req, res) => {
  try {
    // Find parent project
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found with this id!" });
    }

    // Check ownership of parent project before creating task
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "User is not authorized to add tasks to this project.",
      });
    }

    // Create task associated with the project
    const task = await Task.create({
      ...req.body,
      project: req.params.projectId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET /api/projects/:projectId/tasks - Get all tasks for a specific project
router.get("/projects/:projectId/tasks", async (req, res) => {
  try {
    // Find parent project
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found with this id!" });
    }

    // Check ownership of parent project
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "User is not authorized to view tasks for this project.",
      });
    }

    // Get all tasks for the project
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT /api/tasks/:taskId - Update a single task
router.put("/tasks/:taskId", async (req, res) => {
  try {
    // Find task by ID
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "No task found with this id!" });
    }

    // Find parent project to check ownership
    const project = await Project.findById(task.project);

    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found for this task!" });
    }

    // Check ownership of parent project
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update this task." });
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true },
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE /api/tasks/:taskId - Delete a single task
router.delete("/tasks/:taskId", async (req, res) => {
  try {
    // Find task by ID
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "No task found with this id!" });
    }

    // Find parent project to check ownership
    const project = await Project.findById(task.project);

    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found for this task!" });
    }

    // Check ownership of parent project
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete this task." });
    }

    // Delete the task
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: "Task deleted!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
