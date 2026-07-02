// src/utils/jwt.js

const jwt = require("jsonwebtoken");

exports.createJWT = (payload) =>
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

exports.verifyJWT = (token) =>
  jwt.verify(
    token,
    process.env.JWT_SECRET
  );