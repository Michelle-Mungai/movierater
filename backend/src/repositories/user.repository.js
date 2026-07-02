// src/repositories/user.repository.js
//
// FIXED: createUser inserted into a column called "password", but the
// actual users table (database/init/002_users.sql) calls it
// "password_hash". Every registration was failing with
// "column password does not exist". google_id now exists thanks to
// migration 013_users_google_oauth.sql.

const db = require("../config/database");

exports.createUser = async (username, email, passwordHash) => {
  const { rows } = await db.query(
    `
    INSERT INTO users
    (username,email,password_hash)
    VALUES ($1,$2,$3)
    RETURNING id,username,email,google_id,created_at
    `,
    [username, email, passwordHash]
  );

  return rows[0];
};

exports.createGoogleUser = async (profile) => {
  const { rows } = await db.query(
    `
    INSERT INTO users
    (
      username,
      email,
      google_id
    )
    VALUES ($1,$2,$3)
    RETURNING id,username,email,google_id,created_at
    `,
    [
      profile.displayName,
      profile.emails[0].value,
      profile.id,
    ]
  );

  return rows[0];
};

exports.findByEmail = async (email) => {
  const { rows } = await db.query(
    `
    SELECT *
    FROM users
    WHERE email=$1
    LIMIT 1
    `,
    [email]
  );

  return rows[0];
};

exports.findById = async (id) => {
  const { rows } = await db.query(
    `
    SELECT
      id,
      username,
      email,
      google_id,
      created_at
    FROM users
    WHERE id=$1
    `,
    [id]
  );

  return rows[0];
};

exports.findByGoogleId = async (googleId) => {
  const { rows } = await db.query(
    `
    SELECT *
    FROM users
    WHERE google_id=$1
    LIMIT 1
    `,
    [googleId]
  );

  return rows[0];
};
