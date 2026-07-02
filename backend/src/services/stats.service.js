// src/services/stats.service.js

const statsRepository = require("../repositories/stats.repository");

exports.getDashboardStats = async (userId) => {
  const [
    totalReviews,
    averageRating,
    favorites,
    watchlist,
    recentReviews,
  ] = await Promise.all([
    statsRepository.getReviewCount(userId),
    statsRepository.getAverageRating(userId),
    statsRepository.getFavoriteCount(userId),
    statsRepository.getWatchlistCount(userId),
    statsRepository.getRecentReviews(userId),
  ]);

  return {
    totalReviews,
    averageRating,
    favorites,
    watchlist,
    recentReviews,
  };
};

exports.getGlobalStats = async () => {
  return await statsRepository.getGlobalStats();
};

exports.getTopRated = async () => {
  return await statsRepository.getTopRated();
};