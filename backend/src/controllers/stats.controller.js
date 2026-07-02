// src/controllers/stats.controller.js

const statsService = require("../services/stats.service");
const asyncHandler = require("../middleware/asyncHandler");
const { ok } = require("../utils/response");

exports.getDashboard = asyncHandler(async (req, res) => {
  return ok(
    res,
    await statsService.getDashboardStats(
      req.user.id
    )
  );
});

exports.getGlobalStats = asyncHandler(async (req, res) => {
  return ok(
    res,
    await statsService.getGlobalStats()
  );
});

exports.getTopRated = asyncHandler(async (req, res) => {
  return ok(res, await statsService.getTopRated());
});