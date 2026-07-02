// src/routes/stats.routes.js

const router = require("express").Router();

const controller = require("../controllers/stats.controller");
const authenticate = require("../middleware/auth.middleware");

router.get(
  "/dashboard",
  authenticate,
  controller.getDashboard
);

router.get(
  "/global",
  controller.getGlobalStats
);

router.get(
  "/top-rated",
  controller.getTopRated
);

module.exports = router;