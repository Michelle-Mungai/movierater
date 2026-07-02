// src/config/tmdb.js

const axios = require("axios");

module.exports = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
});