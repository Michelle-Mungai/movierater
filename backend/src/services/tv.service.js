// src/services/tv.service.js

const tmdb = require("./tmdb.service");
const ApiError = require("../utils/ApiError");

exports.getTrending = async () => {
  return tmdb.getTrendingTV();
};

exports.getPopular = async () => {
  return tmdb.getPopularTV();
};

exports.getTopRated = async () => {
  return tmdb.getTopRatedTV();
};

exports.getAiringToday = async () => {
  return tmdb.getAiringToday();
};

exports.getOnTheAir = async () => {
  return tmdb.getOnTheAir();
};

exports.getTVShow = async (id) => {
  const show = await tmdb.getTVDetails(id);

  if (!show || show.success === false) {
    throw new ApiError(404, "TV show not found");
  }

  return show;
};

exports.searchTV = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  return tmdb.searchTV(query.trim());
};

exports.getRecommendations = async (id) => {
  return tmdb.getTVRecommendations(id);
};

function pickTrailer(videos) {
  const youtubeVideos = videos.filter((v) => v.site === "YouTube");

  const officialTrailer = youtubeVideos.find(
    (v) => v.type === "Trailer" && v.official
  );

  const anyTrailer = youtubeVideos.find((v) => v.type === "Trailer");
  const teaser = youtubeVideos.find((v) => v.type === "Teaser");

  return officialTrailer || anyTrailer || teaser || youtubeVideos[0] || null;
}

// FIXED: no TV trailer endpoint existed at all - the frontend's
// MoviePage "Watch Trailer" button for TV shows had nothing to call.
exports.getTrailer = async (id) => {
  const videos = await tmdb.getTVVideos(id);
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

exports.getGenres = async () => {
  return tmdb.getTVGenres();
};