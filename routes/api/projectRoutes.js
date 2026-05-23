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