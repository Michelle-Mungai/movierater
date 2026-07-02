// src/routes/movie.routes.js
//
// FIXED: added "/:id/trailer" - the frontend's HeroBanner and MoviePage
// "Watch Trailer" buttons call GET /movies/:id/trailer, which had no
// matching route at all.

const router = require("express").Router();

const controller = require("../controllers/movie.controller");

router.get("/trending", controller.getTrending);

router.get("/popular", controller.getPopular);

router.get("/top-rated", controller.getTopRated);

router.get("/upcoming", controller.getUpcoming);

router.get("/now-playing", controller.getNowPlaying);

router.get("/search", controller.search);

router.get(
  "/:id/recommendations",
  controller.getRecommendations
);

router.get("/:id/trailer", controller.getTrailer);

router.get("/:id", controller.getMovie);

module.exports = router;
