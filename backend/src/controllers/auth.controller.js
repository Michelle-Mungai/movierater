// src/controllers/auth.controller.js

const authService = require("../services/auth.service");
const asyncHandler = require("../middleware/asyncHandler");
const { ok, created } = require("../utils/response");

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return created(res, result);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return ok(res, result);
});

exports.profile = asyncHandler(async (req, res) => {
  const user = await authService.findById(req.user.id);
  return ok(res, user);
});

exports.logout = asyncHandler(async (req, res) => {
  return ok(res, {
    message: "Logged out successfully",
  });
});

exports.googleSuccess = asyncHandler(async (req, res) => {
  const result = await authService.googleLogin(req.user);

  // FIXED: the frontend route is "/google-success" (see App.jsx /
  // GoogleSuccess.jsx), but this redirected to "/oauth-success", a route
  // that doesn't exist, so Google sign-in always landed on a 404.
  res.redirect(
    `${process.env.FRONTEND_URL}/google-success?token=${result.token}`
  );
});