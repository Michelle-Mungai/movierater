// src/routes/review.routes.js
//
// FIXED: added "GET /" -> getUserReviews. The frontend Dashboard page
// calls api.get("/reviews") (no sub-path) expecting the logged-in user's
// own reviews, but no such route existed (only "/me" did), so the
// dashboard's review list always 404'd.

const router = require("express").Router();

const controller = require("../controllers/review.controller");
const authenticate = require("../middleware/auth.middleware");

router.get("/", authenticate, controller.getUserReviews);

router.get("/movie/:movieId", controller.getMovieReviews);

router.get("/me", authenticate, controller.getUserReviews);

router.get("/:id", controller.getReview);

router.post("/", authenticate, controller.createReview);

router.put("/:id", authenticate, controller.updateReview);

router.delete("/:id", authenticate, controller.deleteReview);

module.exports = router;
