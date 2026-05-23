// Requirements
require("dotenv").config();
const express = require("express");
const db = require("./config/connection");

// App and Port
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// const routes = require("./routes");
// app.use(routes);

// Start server after database connection opens
db.once("open", () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
