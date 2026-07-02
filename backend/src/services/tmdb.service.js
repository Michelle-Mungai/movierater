// src/services/tmdb.service.js

const tmdb = require("../config/tmdb");

const api = process.env.TMDB_API_KEY;

async function request(url, params = {}) {
  const { data } = await tmdb.get(url, {
    params: {
      api_key: api,
      language: "en-US",
      ...params,
    },
  });

  return data;
}

/* -------------------- MOVIES -------------------- */

exports.getTrendingMovies = async () => {
  const data = await request("/trending/movie/week");
  return data.results;
};

exports.getPopularMovies = async () => {
  const data = await request("/movie/popular");
  return data.results;
};

exports.getTopRatedMovies = async () => {
  const data = await request("/movie/top_rated");
  return data.results;
};

exports.getNowPlayingMovies = async () => {
  const data = await request("/movie/now_playing");
  return data.results;
};

exports.getUpcomingMovies = async () => {
  const data = await request("/movie/upcoming");
  return data.results;
};

exports.getMovieDetails = async (id) => {
  return request(`/movie/${id}`, {
    append_to_response:
      "credits,videos,images,recommendations,similar",
  });
};

exports.getMovieRecommendations = async (id) => {
  const data = await request(
    `/movie/${id}/recommendations`
  );

  return data.results.map((item) => ({
    ...item,
    media_type: "movie",
  }));
};

// FIXED: there was previously no way to fetch a trailer at all, even
// though the frontend's "Watch Trailer" button calls this endpoint.
exports.getMovieVideos = async (id) => {
  const data = await request(`/movie/${id}/videos`);
  return data.results || [];
};

exports.searchMovies = async (query) => {
  const data = await request(
    "/search/movie",
    { query }
  );

  return data.results;
};

exports.discoverMoviesByGenres =
async (genres) => {
  const data = await request(
    "/discover/movie",
    {
      with_genres: genres,
      sort_by: "popularity.desc",
    }
  );

  return data.results;
};

/* -------------------- TV -------------------- */

// FIXED: TMDB's dedicated /tv/* endpoints (unlike /trending/all or
// /search/multi) don't include a media_type field on their results.
// MovieCard.jsx relies on media_type === "tv" to route to /tv/:id
// instead of /movie/:id, so without this tag every TV show rendered
// via these endpoints linked to the wrong (movie) detail page.
function tagAsTV(results) {
  return results.map((item) => ({
    ...item,
    media_type: "tv",
  }));
}

exports.getTrendingTV = async () => {
  const data = await request("/trending/tv/week");
  return tagAsTV(data.results);
};

exports.getPopularTV = async () => {
  const data = await request("/tv/popular");
  return tagAsTV(data.results);
};

exports.getTopRatedTV = async () => {
  const data = await request("/tv/top_rated");
  return tagAsTV(data.results);
};

exports.getAiringToday = async () => {
  const data = await request(
    "/tv/airing_today"
  );

  return tagAsTV(data.results);
};

exports.getOnTheAir = async () => {
  const data = await request(
    "/tv/on_the_air"
  );

  return tagAsTV(data.results);
};

exports.getTVDetails = async (id) => {
  return request(`/tv/${id}`, {
    append_to_response:
      "credits,videos,images,recommendations,similar",
  });
};

exports.getTVRecommendations =
async (id) => {
  const data = await request(
    `/tv/${id}/recommendations`
  );

  return tagAsTV(data.results);
};

// FIXED: matching getMovieVideos above - no TV trailer source existed.
exports.getTVVideos = async (id) => {
  const data = await request(`/tv/${id}/videos`);
  return data.results || [];
};

exports.searchTV = async (query) => {
  const data = await request(
    "/search/tv",
    { query }
  );

  return tagAsTV(data.results);
};

/* -------------------- MULTI SEARCH -------------------- */

exports.multiSearch = async (query) => {
  const data = await request(
    "/search/multi",
    { query }
  );

  return data.results.filter(
    (item) =>
      item.media_type === "movie" ||
      item.media_type === "tv"
  );
};

/* -------------------- GENRES -------------------- */

exports.getMovieGenres = async () => {
  const data = await request(
    "/genre/movie/list"
  );

  return data.genres;
};

exports.getTVGenres = async () => {
  const data = await request(
    "/genre/tv/list"
  );

  return data.genres;
};