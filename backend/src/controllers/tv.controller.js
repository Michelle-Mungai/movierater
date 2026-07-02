// src/controllers/tv.controller.js

const tvService = require("../services/tv.service");
const asyncHandler = require("../middleware/asyncHandler");
const { ok } = require("../utils/response");

exports.getTrending = asyncHandler(async (req, res) => {
  return ok(res, await tvService.getTrending());
});

exports.getPopular = asyncHandler(async (req, res) => {
  return ok(res, await tvService.getPopular());
});

exports.getTopRated = asyncHandler(async (req, res) => {
  return ok(res, await tvService.getTopRated());
});

exports.getAiringToday = asyncHandler(async (req, res) => {
  return ok(res, await tvService.getAiringToday());
});

exports.getOnTheAir = asyncHandler(async (req, res) => {
  return ok(res, await tvService.getOnTheAir());
});

exports.getTVShow = asyncHandler(async (req, res) => {
  return ok(
    res,
    await tvService.getTVShow(req.params.id)
  );
});

exports.searchTV = asyncHandler(async (req, res) => {
  return ok(
    res,
    await tvService.searchTV(req.query.query)
  );
});

exports.getRecommendations = asyncHandler(async (req, res) => {
  return ok(
    res,
    await tvService.getRecommendations(req.params.id)
  );
});

exports.getTrailer = asyncHandler(async (req, res) => {
  return ok(res, await tvService.getTrailer(req.params.id));
});