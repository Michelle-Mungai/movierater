import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();

  const mountedRef = useRef(false);

  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    mountedRef.current = true;

    async function loadDashboard() {
      try {
        const [reviewsRes, recRes] =
          await Promise.allSettled([
            api.get("/reviews"),
            api.get("/recommendations"),
          ]);

        if (!mountedRef.current) return;

        if (
          reviewsRes.status ===
          "fulfilled"
        ) {
          setReviews(
            reviewsRes.value.data || []
          );
        }

        if (
          recRes.status ===
          "fulfilled"
        ) {
          setRecommendations(
            recRes.value.data || []
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce(
              (sum, review) =>
                sum + review.overall,
              0
            ) / totalReviews
          ).toFixed(1)
        : "0.0";

    const recommendedCount =
      reviews.filter(
        (review) =>
          review.recommendation
      ).length;

    return {
      totalReviews,
      averageRating,
      recommendedCount,
    };
  }, [reviews]);

  if (!user) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <p className="text-gray-400">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-6 lg:px-8 pb-10">

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Welcome, {user.username}
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Track your movie activity.
          </p>
        </div>

        {/* Stats — always side by side, even on mobile */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5 text-center">
            <p className="text-gray-500 text-[11px] sm:text-sm">
              Total Reviews
            </p>

            <h2 className="text-xl sm:text-3xl font-bold mt-1">
              {stats.totalReviews}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5 text-center">
            <p className="text-gray-500 text-[11px] sm:text-sm">
              Avg Rating
            </p>

            <h2 className="text-xl sm:text-3xl font-bold text-yellow-400 mt-1">
              {stats.averageRating}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5 text-center">
            <p className="text-gray-500 text-[11px] sm:text-sm">
              Recommended
            </p>

            <h2 className="text-xl sm:text-3xl font-bold text-green-400 mt-1">
              {stats.recommendedCount}
            </h2>
          </div>

        </div>

        <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-5">
          Recommended For You
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-5 mb-10">

          {recommendations.map(
            (movie) => (
              <Link
                key={`${movie.media_type || "movie"}-${movie.id}`}
                to={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
                className="group bg-zinc-900 rounded-lg sm:rounded-xl overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/fallback.jpg"
                  }
                  alt={movie.title || movie.name}
                  className="w-full aspect-2/3 object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="p-1.5 sm:p-3">
                  <h3 className="text-xs sm:text-base font-medium sm:font-semibold line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                </div>
              </Link>
            )
          )}

        </div>

        <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-5">
          Your Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 text-center">

            <h3 className="text-lg sm:text-2xl font-bold mb-2">
              No Reviews Yet
            </h3>

            <p className="text-gray-500 text-sm mb-5">
              Start reviewing movies.
            </p>

            <Link
              to="/"
              className="inline-block bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Browse Movies
            </Link>

          </div>
        ) : (
          <div className="grid gap-4">

            {reviews.map(
              (review) => (
                <div
                  key={review.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-6 flex flex-row gap-3 sm:gap-6"
                >

                  <img
                    src={
                      review.poster
                        ? `https://image.tmdb.org/t/p/w500${review.poster}`
                        : "/fallback.jpg"
                    }
                    alt={
                      review.title
                    }
                    className="w-20 sm:w-44 shrink-0 aspect-2/3 object-cover rounded-lg sm:rounded-xl"
                  />

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-4">

                      <h3 className="text-base sm:text-3xl font-bold truncate">
                        {review.title}
                      </h3>

                      <span className="bg-yellow-400 text-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-base font-bold shrink-0">
                        ⭐{" "}
                        {
                          review.overall
                        }
                        /10
                      </span>

                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 sm:gap-6 mb-3 sm:mb-6">
                      <div>
                        <h4 className="text-green-400 text-xs sm:text-base font-semibold mb-1 sm:mb-2">
                          Positives
                        </h4>

                        <p className="text-gray-400 text-xs sm:text-base line-clamp-3 sm:line-clamp-none">
                          {review.positives ||
                            "No comments"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-red-400 text-xs sm:text-base font-semibold mb-1 sm:mb-2">
                          Negatives
                        </h4>

                        <p className="text-gray-400 text-xs sm:text-base line-clamp-3 sm:line-clamp-none">
                          {review.negatives ||
                            "No comments"}
                        </p>
                      </div>

                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-4">

                      <div className="bg-black/30 rounded-lg p-1.5 sm:p-4 text-[10px] sm:text-base">
                        <span className="hidden sm:inline">Cinematography: </span>
                        <span className="sm:hidden">Cinema: </span>
                        {
                          review.cinematography
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-lg p-1.5 sm:p-4 text-[10px] sm:text-base">
                        Acting:{" "}
                        {
                          review.acting
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-lg p-1.5 sm:p-4 text-[10px] sm:text-base">
                        Story:{" "}
                        {
                          review.storyline
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-lg p-1.5 sm:p-4 text-[10px] sm:text-base">
                        VFX:{" "}
                        {
                          review.graphics
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-lg p-1.5 sm:p-4 text-[10px] sm:text-base">
                        Sound:{" "}
                        {
                          review.soundtrack
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-lg p-1.5 sm:p-4 text-[10px] sm:text-base">
                        Rewatch:{" "}
                        {
                          review.rewatch_value
                        }
                        /10
                      </div>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </>
  );
}