require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("CONNECTED SUCCESSFULLY");
    console.log(result.rows[0]);
  } catch (err) {
    console.error("DATABASE ERROR:");
    console.error(err);
  } finally {
    await pool.end();
  }
})();