// src/middleware/auth.middleware.js

const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

module.exports = async function (req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = header.split(" ")[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await userRepository.findById(
      payload.id
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    delete user.password;

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};