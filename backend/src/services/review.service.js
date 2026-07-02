// src/services/review.service.js
//
// FIXED: createReview previously took { userId, movieId, rating, review }
// none of which match what the frontend sends or what the reviews table
// stores. It also looked up a `movies` table that doesn't exist in any
// migration, which would throw on every call. The review data (tmdb_id,
// title, poster) already comes from the client, who fetched it straight
// from TMDB, so no local movie lookup is needed.

const reviewRepository = require("../repositories/review.repository");
const ApiError = require("../utils/ApiError");

exports.createReview = async ({
  userId,
  tmdbId,
  mediaType,
  title,
  poster,
  cinematography,
  acting,
  graphics,
  storyline,
  soundtrack,
  rewatchValue,
  overall,
  positives,
  negatives,
  recommendation,
}) => {
  if (!tmdbId || !title) {
    throw ApiError.badRequest("Missing movie information for review");
  }

  return await reviewRepository.create({
    userId,
    tmdbId,
    mediaType: mediaType === "tv" ? "tv" : "movie",
    title,
    poster,
    cinematography,
    acting,
    graphics,
    storyline,
    soundtrack,
    rewatchValue,
    overall,
    positives,
    negatives,
    recommendation,
  });
};

exports.updateReview = async (reviewId, userId, data) => {
  const existing = await reviewRepository.findById(reviewId);

  if (!existing) {
    throw ApiError.notFound("Review not found");
  }

  if (existing.user_id !== userId) {
    throw ApiError.forbidden("Unauthorized");
  }

  return await reviewRepository.update(reviewId, data);
};

exports.deleteReview = async (reviewId, userId) => {
  const existing = await reviewRepository.findById(reviewId);

  if (!existing) {
    throw ApiError.notFound("Review not found");
  }

  if (existing.user_id !== userId) {
    throw ApiError.forbidden("Unauthorized");
  }

  await reviewRepository.remove(reviewId);

  return {
    message: "Review deleted successfully",
  };
};

exports.getMovieReviews = async (movieId) => {
  return await reviewRepository.findByMovie(movieId);
};

exports.getUserReviews = async (userId) => {
  return await reviewRepository.findByUser(userId);
};

exports.getReview = async (reviewId) => {
  const review = await reviewRepository.findById(reviewId);

  if (!review) {
    throw ApiError.notFound("Review not found");
  }

  return review;
};
