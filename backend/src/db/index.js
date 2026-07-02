// src/db/index.js

const pool = require("../config/database");

module.exports = {
  query(text, params) {
    return pool.query(text, params);
  },

  getClient() {
    return pool.connect();
  },
};