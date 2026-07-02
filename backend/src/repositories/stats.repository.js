// src/repositories/stats.repository.js

const db = require("../config/database");

exports.getReviewCount =
async (
  userId
) => {
  const { rows } = await db.query(
    `
    SELECT COUNT(*)::int total
    FROM reviews
    WHERE user_id=$1
    `,
    [userId]
  );

  return rows[0].total;
};

exports.getAverageRating =
async (
  userId
) => {
  const { rows } = await db.query(
    `
    SELECT
    COALESCE(
      ROUND(AVG(overall),1),
      0
    ) average
    FROM reviews
    WHERE user_id=$1
    `,
    [userId]
  );

  return Number(rows[0].average);
};

exports.getFavoriteCount =
async (
  userId
) => {
  const { rows } = await db.query(
    `
    SELECT COUNT(*)::int total
    FROM favorites
    WHERE user_id=$1
    `,
    [userId]
  );

  return rows[0].total;
};

exports.getWatchlistCount =
async (
  userId
) => {
  const { rows } = await db.query(
    `
    SELECT COUNT(*)::int total
    FROM watchlist
    WHERE user_id=$1
    `,
    [userId]
  );

  return rows[0].total;
};

exports.getRecentReviews =
async (
  userId
) => {
  const { rows } = await db.query(
    `
    SELECT *
    FROM reviews
    WHERE user_id=$1
    ORDER BY created_at DESC
    LIMIT 10
    `,
    [userId]
  );

  return rows;
};

exports.getGlobalStats =
async () => {
  const { rows } = await db.query(
    `
    SELECT
      (SELECT COUNT(*) FROM users) users,
      (SELECT COUNT(*) FROM reviews) reviews
    `
  );

  return rows[0];
};

// FIXED: TopRated.jsx (the "Top Rated By Users" community section) has
// always called GET /stats/top-rated, but no controller, service, or
// repository method for it existed anywhere in the backend, so the
// component (and the feature) was completely non-functional/unwired.
exports.getTopRated = async (limit = 10) => {
  const { rows } = await db.query(
    `
    SELECT
      tmdb_id,
      media_type,
      title,
      MAX(poster) AS poster,
      ROUND(AVG(overall),1) AS rating,
      COUNT(*)::int AS reviews
    FROM reviews
    GROUP BY tmdb_id, media_type, title
    HAVING COUNT(*) > 0
    ORDER BY AVG(overall) DESC, COUNT(*) DESC
    LIMIT $1
    `,
    [limit]
  );

  return rows;
};