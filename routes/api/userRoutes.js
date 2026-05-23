// Requirements
const router = require("express").Router();
const { User } = require("../../models");
const { signToken } = require("../../utils/auth");

// POST /api/users/register - Create a new user
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json(err);
  }
});

//POST /api/users/login - Authenticate a user and return a token
router.post("/login", async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ emai: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    // Verify password
    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    // Sign and return token
    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
