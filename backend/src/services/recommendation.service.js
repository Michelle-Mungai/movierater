// src/services/recommendation.service.js

const recommendationRepository = require("../repositories/recommendation.repository");
const tmdb = require("./tmdb.service");

function itemKey(item) {
  return `${item.media_type}:${item.id}`;
}

// IMPROVED: previously merged all sources with a simple flat
// concat-then-dedupe, which meant whichever favorite happened to come
// back first in Promise.all could dominate the final list if it had
// many recommendations. Round-robining across sources spreads the
// result more evenly across everything the user actually liked.
function roundRobinMerge(lists) {
  const merged = [];
  const seen = new Set();

  let index = 0;
  let addedSomething = true;

  while (addedSomething) {
    addedSomething = false;

    for (const list of lists) {
      const item = list[index];

      if (!item) continue;

      const key = itemKey(item);

      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
        addedSomething = true;
      }
    }

    index += 1;
  }

  return merged;
}

exports.getPersonalizedRecommendations = async (userId) => {
  const [liked, reviewed] = await Promise.all([
    recommendationRepository.getLikedItems(userId),
    recommendationRepository.getReviewedItems(userId),
  ]);

  if (!liked.length) {
    return tmdb.getTrendingMovies();
  }

  // IMPROVED: never recommend something the user has already reviewed,
  // regardless of whether they liked or disliked it - previously there
  // was no exclusion at all.
  const alreadyReviewed = new Set(
    reviewed.map(
      (item) => `${item.media_type}:${item.tmdb_id}`
    )
  );

  const sources = await Promise.all(
    liked.map((item) => {
      const fetch =
        item.media_type === "tv"
          ? tmdb.getTVRecommendations(item.tmdb_id)
          : tmdb.getMovieRecommendations(item.tmdb_id);

      return fetch.catch(() => []);
    })
  );

  const merged = roundRobinMerge(sources).filter(
    (item) => !alreadyReviewed.has(`${item.media_type}:${item.id}`)
  );

  return merged.length ? merged.slice(0, 20) : tmdb.getTrendingMovies();
};

exports.getMovieRecommendations = async (movieId) => {
  return tmdb.getMovieRecommendations(movieId);
};

exports.getTVRecommendations = async (tvId) => {
  return tmdb.getTVRecommendations(tvId);
};

exports.getTrending = async () => {
  return tmdb.getTrendingMovies();
};
