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
