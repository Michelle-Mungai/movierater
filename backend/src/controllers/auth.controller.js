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

  // req.query.state round-trips through Google's OAuth flow untouched,
  // so this tells us whether the login started from the Android app's
  // Custom Tab (see auth.routes.js) or from a normal browser tab.
  const isAndroidApp = req.query.state === "android";

  if (isAndroidApp) {
    // Custom Tabs run in Chrome's own storage, completely separate from
    // the app's WebView, so we can't just leave the user here — hand
    // control back to the app via a deep link carrying the token. The
    // app's WebView then loads /google-success itself, which writes the
    // token into ITS OWN localStorage (see MainActivity.kt).
    return res.redirect(`movierater://auth-callback?token=${result.token}`);
  }

  // FIXED: the frontend route is "/google-success" (see App.jsx /
  // GoogleSuccess.jsx), but this redirected to "/oauth-success", a route
  // that doesn't exist, so Google sign-in always landed on a 404.
  res.redirect(
    `${process.env.FRONTEND_URL}/google-success?token=${result.token}`
  );
});