// src/repositories/recommendation.repository.js
//
// IMPROVED:
//  1. Now selects media_type alongside tmdb_id, so movie and TV
//     reviews are never confused with each other (their TMDB IDs are
//     separate namespaces that can collide).
//  2. Only reviews the user actually LIKED (overall >= 6 on the 1-10
//     scale) are used as recommendation seeds. Previously this just
//     took the "top N by rating" regardless of whether that rating was
//     good or bad, which could mean using a 4/10 review as if it were
//     a strong positive signal for someone who has only reviewed a
//     handful of things.
//  3. Added getReviewedItems, which returns every tmdb_id/media_type
//     pair the user has ever reviewed, so recommendations can exclude
//     titles the user has already watched and rated (good or bad) -
//     previously nothing prevented re-recommending something the user
//     already reviewed.

const db = require("../config/database");

exports.getLikedItems = async (userId, limit = 8) => {
  const { rows } = await db.query(
    `
    SELECT tmdb_id, media_type
    FROM reviews
    WHERE user_id=$1
      AND overall >= 6
    ORDER BY overall DESC, created_at DESC
    LIMIT $2
    `,
    [userId, limit]
  );

  return rows;
};

exports.getReviewedItems = async (userId) => {
  const { rows } = await db.query(
    `
    SELECT tmdb_id, media_type
    FROM reviews
    WHERE user_id=$1
    `,
    [userId]
  );

  return rows;
};
