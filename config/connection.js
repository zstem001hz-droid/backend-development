// Requirements
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

module.exports = mongoose.connection;