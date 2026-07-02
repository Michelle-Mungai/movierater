// src/routes/recommendation.routes.js

const router = require("express").Router();

const controller = require("../controllers/recommendation.controller");
const authenticate = require("../middleware/auth.middleware");

// FIXED: the frontend (RecommendationRow.jsx, Dashboard.jsx) calls
// GET /recommendations directly - there was no route at all for the
// bare path, only "/personal", so it always 404'd.
router.get(
  "/",
  authenticate,
  controller.getPersonalizedRecommendations
);

router.get(
  "/personal",
  authenticate,
  controller.getPersonalizedRecommendations
);

router.get(
  "/movie/:id",
  controller.getMovieRecommendations
);

router.get(
  "/tv/:id",
  controller.getTVRecommendations
);

module.exports = router;