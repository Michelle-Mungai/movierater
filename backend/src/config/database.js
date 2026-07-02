// src/config/database.js

const { Pool } = require("pg");

// Cloud Postgres providers (Neon, Render, Supabase, etc.) are reached
// over a single connection string and require SSL. Local development
// (Docker Postgres on localhost) uses the individual DB_* vars with no
// SSL, since a local connection doesn't need or support it.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

pool.on("error", (err) => {
  console.error(err);
});

module.exports = pool;