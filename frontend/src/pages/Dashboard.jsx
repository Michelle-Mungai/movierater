import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();

  console.log("Dashboard user:", user);

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

      <div className="min-h-screen bg-black text-white pt-28 px-4 sm:px-6 lg:px-8 pb-12">

        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black">
            Welcome, {user.username}
          </h1>

          <p className="text-gray-400 mt-3">
            Track your movie activity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-gray-400">
              Total Reviews
            </p>

            <h2 className="text-4xl font-black mt-2">
              {stats.totalReviews}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-gray-400">
              Average Rating
            </p>

            <h2 className="text-4xl font-black text-yellow-400 mt-2">
              {stats.averageRating}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-gray-400">
              Recommended
            </p>

            <h2 className="text-4xl font-black text-green-400 mt-2">
              {stats.recommendedCount}
            </h2>
          </div>

        </div>

        <h2 className="text-3xl font-black mb-6">
          Recommended For You
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-14">

          {recommendations.map(
            (movie) => (
              <Link
                key={`${movie.media_type || "movie"}-${movie.id}`}
                to={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`}
                className="group bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition"
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

                <div className="p-3">
                  <h3 className="font-semibold line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                </div>
              </Link>
            )
          )}

        </div>

        <h2 className="text-3xl font-black mb-6">
          Your Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">

            <h3 className="text-2xl font-bold mb-3">
              No Reviews Yet
            </h3>

            <p className="text-gray-400 mb-6">
              Start reviewing movies.
            </p>

            <Link
              to="/"
              className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
            >
              Browse Movies
            </Link>

          </div>
        ) : (
          <div className="grid gap-6">

            {reviews.map(
              (review) => (
                <div
                  key={review.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col lg:flex-row gap-6"
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
                    className="w-full sm:w-44 aspect-2/3 object-cover rounded-xl"
                  />

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3 mb-4">

                      <h3 className="text-3xl font-bold">
                        {review.title}
                      </h3>

                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
                        ⭐{" "}
                        {
                          review.overall
                        }
                        /10
                      </span>

                    </div>

                    <p className="text-gray-400 mb-6">
                      Reviewed by{" "}
                      {
                        review.username
                      }
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-6">

                      <div>
                        <h4 className="text-green-400 font-semibold mb-2">
                          Positives
                        </h4>

                        <p className="text-gray-300">
                          {review.positives ||
                            "No comments"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-red-400 font-semibold mb-2">
                          Negatives
                        </h4>

                        <p className="text-gray-300">
                          {review.negatives ||
                            "No comments"}
                        </p>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                      <div className="bg-black/30 rounded-xl p-4">
                        Cinematography:{" "}
                        {
                          review.cinematography
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-xl p-4">
                        Acting:{" "}
                        {
                          review.acting
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-xl p-4">
                        Storyline:{" "}
                        {
                          review.storyline
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-xl p-4">
                        VFX:{" "}
                        {
                          review.graphics
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-xl p-4">
                        Soundtrack:{" "}
                        {
                          review.soundtrack
                        }
                        /10
                      </div>

                      <div className="bg-black/30 rounded-xl p-4">
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