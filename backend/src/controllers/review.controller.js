// src/controllers/review.controller.js
//
// FIXED: previously pulled req.body.movieId / rating / review, which the
// frontend never sends (it sends tmdb_id, overall, positives, negatives,
// recommendation, and the six category scores). That mismatch meant every
// review was created with `undefined` values and failed the database's
// NOT NULL / CHECK constraints.

const reviewService = require("../services/review.service");
const asyncHandler = require("../middleware/asyncHandler");
const { ok, created } = require("../utils/response");

exports.createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview({
    userId: req.user.id,
    tmdbId: req.body.tmdb_id,
    mediaType: req.body.media_type,
    title: req.body.title,
    poster: req.body.poster,
    cinematography: req.body.cinematography,
    acting: req.body.acting,
    graphics: req.body.graphics,
    storyline: req.body.storyline,
    soundtrack: req.body.soundtrack,
    rewatchValue: req.body.rewatch_value,
    overall: req.body.overall,
    positives: req.body.positives,
    negatives: req.body.negatives,
    recommendation: req.body.recommendation,
  });

  return created(res, review);
});

exports.updateReview = asyncHandler(async (req, res) => {
  return ok(
    res,
    await reviewService.updateReview(req.params.id, req.user.id, {
      cinematography: req.body.cinematography,
      acting: req.body.acting,
      graphics: req.body.graphics,
      storyline: req.body.storyline,
      soundtrack: req.body.soundtrack,
      rewatchValue: req.body.rewatch_value,
      overall: req.body.overall,
      positives: req.body.positives,
      negatives: req.body.negatives,
      recommendation: req.body.recommendation,
    })
  );
});

exports.deleteReview = asyncHandler(async (req, res) => {
  return ok(
    res,
    await reviewService.deleteReview(req.params.id, req.user.id)
  );
});

exports.getMovieReviews = asyncHandler(async (req, res) => {
  return ok(
    res,
    await reviewService.getMovieReviews(req.params.movieId)
  );
});

exports.getUserReviews = asyncHandler(async (req, res) => {
  return ok(res, await reviewService.getUserReviews(req.user.id));
});

exports.getReview = asyncHandler(async (req, res) => {
  return ok(res, await reviewService.getReview(req.params.id));
});
