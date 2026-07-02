// src/controllers/movie.controller.js
//
// FIXED: this file was previously broken in several ways:
//  1. `exports.search` was assigned *inside* the body of getTopRatedTV,
//     after that function's try/catch, using `asyncHandler`/`ok` helpers
//     that were never imported. Since the assignment only ran when
//     getTopRatedTV() was invoked, `controller.search` was `undefined`
//     at the time movie.routes.js registered it, which crashes Express
//     on startup ("argument handler must be a function").
//  2. getUpcoming, getNowPlaying, and getRecommendations were referenced
//     by movie.routes.js but never exported here at all - same crash.
//  3. getTV, getTvTrailer, getTopRatedTV called movieService methods that
//     don't exist (TV belongs in tv.controller.js / tv.service.js).
//
// This rewrite exports exactly what movie.routes.js needs, using the
// same asyncHandler/ok pattern as the rest of the codebase (see
// tv.controller.js, review.controller.js).

const movieService = require("../services/movie.service");
const asyncHandler = require("../middleware/asyncHandler");
const { ok } = require("../utils/response");

exports.getTrending = asyncHandler(async (req, res) => {
  return ok(res, await movieService.getTrending());
});

exports.getPopular = asyncHandler(async (req, res) => {
  return ok(res, await movieService.getPopular());
});

exports.getTopRated = asyncHandler(async (req, res) => {
  return ok(res, await movieService.getTopRated());
});

exports.getUpcoming = asyncHandler(async (req, res) => {
  return ok(res, await movieService.getUpcoming());
});

exports.getNowPlaying = asyncHandler(async (req, res) => {
  return ok(res, await movieService.getNowPlaying());
});

exports.search = asyncHandler(async (req, res) => {
  return ok(res, await movieService.search(req.query.query));
});

exports.getRecommendations = asyncHandler(async (req, res) => {
  return ok(
    res,
    await movieService.getRecommendations(req.params.id)
  );
});

exports.getMovie = asyncHandler(async (req, res) => {
  return ok(res, await movieService.getMovie(req.params.id));
});

exports.getTrailer = asyncHandler(async (req, res) => {
  return ok(res, await movieService.getTrailer(req.params.id));
});
