// src/routes/auth.routes.js

const router = require("express").Router();
const passport = require("passport");

const controller = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get(
  "/google",
  (req, res, next) => {
    // Preserve "this request came from the Android app" across the whole
    // Google OAuth round-trip using the OAuth `state` param, since query
    // params don't otherwise survive the redirect to accounts.google.com.
    const state = req.query.platform === "android" ? "android" : undefined;

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  controller.googleSuccess
);

router.get(
  "/profile",
  authenticate,
  controller.profile
);

router.post(
  "/logout",
  authenticate,
  controller.logout
);

module.exports = router;