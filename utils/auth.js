// Requirements
const jwt = require("jsonwebtoken");

// Secret and expiration
const secret = process.env.JWT_SECRET;
const expiration = "2h";

module.exports = {
  // Sign token with non-sensitive user data
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // Authenticate and decode JWT from request
  authMiddleware: function (req, res, next) {
    // Allow token to be sent via body, query, or headers
    let token =
      (req.body && req.body.token) ||
      req.query.token ||
      req.headers.authorization;

    // Extract token from Bearer scheme
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "You must be loggeed in to do that." });
    }

    try {
      //Verify token and attach decoded user data to request
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
      return res.status(401).json({ message: "Invalid token." });
    }

    next();
  },
};
