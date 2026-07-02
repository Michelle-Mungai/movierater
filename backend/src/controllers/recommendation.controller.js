// src/controllers/recommendation.controller.js

const recommendationService = require("../services/recommendation.service");
const asyncHandler = require("../middleware/asyncHandler");
const { ok } = require("../utils/response");

exports.getPersonalizedRecommendations =
  asyncHandler(async (req, res) => {
    return ok(
      res,
      await recommendationService.getPersonalizedRecommendations(
        req.user.id
      )
    );
  });

exports.getMovieRecommendations =
  asyncHandler(async (req, res) => {
    return ok(
      res,
      await recommendationService.getMovieRecommendations(
        req.params.id
      )
    );
  });

exports.getTVRecommendations =
  asyncHandler(async (req, res) => {
    return ok(
      res,
      await recommendationService.getTVRecommendations(
        req.params.id
      )
    );
  });