// Requirements
const router = require("express").Router();
const apiRoutes = require("./api");

// Mount API routes
router.use("/api", apiRoutes);

// 404 handler
router.use((req, res) => {
  res.status(404).send("<h1>404 Error!</h1>");
});

module.exports = router;