// src/routes/tv.routes.js

const express = require("express");

const router = express.Router();

const controller = require("../controllers/tv.controller");

router.get("/trending", controller.getTrending);

router.get("/popular", controller.getPopular);

router.get("/top-rated", controller.getTopRated);

router.get("/airing-today", controller.getAiringToday);

router.get("/on-the-air", controller.getOnTheAir);

router.get("/search", controller.searchTV);

router.get("/:id/recommendations", controller.getRecommendations);

router.get("/:id/trailer", controller.getTrailer);

router.get("/:id", controller.getTVShow);

module.exports = router;