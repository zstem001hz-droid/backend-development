// Requirements
const router = require("express").Router();
const { Project } = require("../../models");
const { authMiddleware } = require("../../utils/auth");

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// POST /api/projects - Create a new project
router.post("/", async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      // Associate project with logged-in user
      user: req.user._id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET /api/projects - Get all projects for logged-in user
router.get("/", async (req, res) => {
  try {
    // Only return projects owned by the logged-in user
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET /api/projects/:id - Get a single project by ID
router.get("/:id", async (req, res) => {
  try {
    // Find project by ID
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "No project found with this id!" });
    }

    // Check ownership before returning
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "User is not authorized to view this project." });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});