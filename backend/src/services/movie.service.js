// src/services/movie.service.js

const tmdb = require("./tmdb.service");
const ApiError = require("../utils/ApiError");

function pickTrailer(videos) {
  const youtubeVideos = videos.filter(
    (v) => v.site === "YouTube"
  );

  const officialTrailer = youtubeVideos.find(
    (v) => v.type === "Trailer" && v.official
  );

  const anyTrailer = youtubeVideos.find(
    (v) => v.type === "Trailer"
  );

  const teaser = youtubeVideos.find(
    (v) => v.type === "Teaser"
  );

  return officialTrailer || anyTrailer || teaser || youtubeVideos[0] || null;
}

exports.getTrending = async () => {
  return tmdb.getTrendingMovies();
};

exports.getPopular = async () => {
  return tmdb.getPopularMovies();
};

exports.getTopRated = async () => {
  return tmdb.getTopRatedMovies();
};

exports.getNowPlaying = async () => {
  return tmdb.getNowPlayingMovies();
};

exports.getUpcoming = async () => {
  return tmdb.getUpcomingMovies();
};

exports.getMovie = async (id) => {
  const movie = await tmdb.getMovieDetails(id);

  if (!movie || movie.success === false) {
    throw new ApiError(404, "Movie not found");
  }

  return movie;
};

// FIXED: this endpoint did not exist before, so the "Watch Trailer"
// button on the homepage/movie page had nothing to call.
exports.getTrailer = async (id) => {
  const videos = await tmdb.getMovieVideos(id);
  const trailer = pickTrailer(videos);

  if (!trailer) {
    throw new ApiError(404, "Trailer not found");
  }

  return {
    key: trailer.key,
    name: trailer.name,
    site: trailer.site,
  };
};

exports.search = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  return tmdb.multiSearch(query.trim());
};

exports.getRecommendations = async (id) => {
  return tmdb.getMovieRecommendations(id);
};

exports.getGenres = async () => {
  return tmdb.getMovieGenres();
};
