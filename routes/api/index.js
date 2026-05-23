// Requirements
const router = require("express").Router();
const userRoutes = require("./userRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");

// Mount user, project, and task routes
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);

// Mount task routes at root — handles both nested and standalone task routes
router.use("/", taskRoutes);

module.exports = router;
