// Requirements
const router = require("express").Router();
const { Task, Project } = require("../../models");
const { authMiddleware } = require("../../utils/auth");

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
