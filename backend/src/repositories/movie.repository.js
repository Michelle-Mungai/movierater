// src/repositories/movie.repository.js

const db = require("../config/database");

exports.findById = async (
  id
) => {
  const { rows } = await db.query(
    `
    SELECT *
    FROM movies
    WHERE tmdb_id=$1
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

exports.createMovie = async (
  movie
) => {
  const { rows } = await db.query(
    `
    INSERT INTO movies
    (
      tmdb_id,
      title,
      poster_path,
      backdrop_path,
      release_date
    )
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (tmdb_id)
    DO UPDATE SET
      title=EXCLUDED.title
    RETURNING *
    `,
    [
      movie.id,
      movie.title,
      movie.poster_path,
      movie.backdrop_path,
      movie.release_date,
    ]
  );

  return rows[0];
};