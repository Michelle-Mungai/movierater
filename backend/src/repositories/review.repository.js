// src/repositories/review.repository.js
//
// FIXED: the original INSERT/UPDATE statements referenced columns
// (movie_id, rating, review) that don't exist on the `reviews` table.
// The real schema (see database/init/003_reviews.sql) stores tmdb_id,
// title, poster, and the individual rating categories the frontend
// actually submits.

const db = require("../config/database");

exports.create = async (review) => {
  const { rows } = await db.query(
    `
    INSERT INTO reviews
    (
      user_id,
      tmdb_id,
      media_type,
      title,
      poster,
      cinematography,
      acting,
      graphics,
      storyline,
      soundtrack,
      rewatch_value,
      overall,
      positives,
      negatives,
      recommendation
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    RETURNING *
    `,
    [
      review.userId,
      review.tmdbId,
      review.mediaType,
      review.title,
      review.poster,
      review.cinematography,
      review.acting,
      review.graphics,
      review.storyline,
      review.soundtrack,
      review.rewatchValue,
      review.overall,
      review.positives,
      review.negatives,
      review.recommendation,
    ]
  );

  return rows[0];
};

exports.findById = async (id) => {
  const { rows } = await db.query(
    `
    SELECT *
    FROM reviews
    WHERE id=$1
    `,
    [id]
  );

  return rows[0];
};

exports.findByMovie = async (movieId) => {
  const { rows } = await db.query(
    `
    SELECT
      r.*,
      u.username
    FROM reviews r
    JOIN users u
    ON u.id=r.user_id
    WHERE tmdb_id=$1
    ORDER BY created_at DESC
    `,
    [movieId]
  );

  return rows;
};

exports.findByUser = async (userId) => {
  const { rows } = await db.query(
    `
    SELECT *
    FROM reviews
    WHERE user_id=$1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
};

exports.update = async (id, data) => {
  const { rows } = await db.query(
    `
    UPDATE reviews
    SET
      cinematography=$1,
      acting=$2,
      graphics=$3,
      storyline=$4,
      soundtrack=$5,
      rewatch_value=$6,
      overall=$7,
      positives=$8,
      negatives=$9,
      recommendation=$10,
      updated_at=NOW()
    WHERE id=$11
    RETURNING *
    `,
    [
      data.cinematography,
      data.acting,
      data.graphics,
      data.storyline,
      data.soundtrack,
      data.rewatchValue,
      data.overall,
      data.positives,
      data.negatives,
      data.recommendation,
      id,
    ]
  );

  return rows[0];
};

exports.remove = async (id) => {
  await db.query(
    `
    DELETE FROM reviews
    WHERE id=$1
    `,
    [id]
  );
};
