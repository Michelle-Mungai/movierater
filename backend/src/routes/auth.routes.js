// src/routes/auth.routes.js

const router = require("express").Router();
const passport = require("passport");

const controller = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
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