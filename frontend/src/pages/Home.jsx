import { useEffect, useRef, useState } from "react";

import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import RecommendationRow from "../components/RecommendationRow";
import TopRated from "../components/TopRated";

import api from "../services/api";

export default function Home() {
  const mountedRef = useRef(false);

  const [slideshowMovies, setSlideshowMovies] =
    useState([]);

  const [trendingMovies, setTrendingMovies] =
    useState([]);

  const [popularMovies, setPopularMovies] =
    useState([]);

  const [topRatedMovies, setTopRatedMovies] =
    useState([]);

  const [topRatedTV, setTopRatedTV] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    mountedRef.current = true;

    async function loadHome() {
      try {
        const [
          popular,
          trending,
          topRated,
          topRatedTVShows,
        ] = await Promise.all([
          api.get("/movies/popular"),
          api.get("/movies/trending"),
          api.get("/movies/top-rated"),
          api.get("/tv/top-rated"),
        ]);

        if (!mountedRef.current) return;

        const popularData =
          popular.data || [];

        const trendingData =
          trending.data || [];

        const topRatedData =
          topRated.data || [];

        const topRatedTVData =
          topRatedTVShows.data || [];

        setSlideshowMovies(
          popularData.slice(0, 8)
        );

        setPopularMovies(
          popularData.slice(0, 20)
        );

        setTrendingMovies(
          trendingData.slice(0, 20)
        );

        setTopRatedMovies(
          topRatedData.slice(0, 20)
        );

        setTopRatedTV(
          topRatedTVData.slice(0, 20)
        );
      } catch (err) {
        console.error(err);

        if (mountedRef.current) {
          setError(
            "Failed to load movies."
          );
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadHome();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <p className="text-gray-300 text-lg">
            Loading movies...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-lg">

          <h2 className="text-white text-3xl font-bold mb-4">
            Something went wrong
          </h2>

          <p className="text-gray-400 mb-8">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Reload
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <main className="pt-20">

        <HeroBanner
          movies={slideshowMovies}
        />

        <div className="px-4 sm:px-6 lg:px-10 py-10 space-y-12">

          <RecommendationRow />

          <MovieRow
            title="🔥 Trending This Week"
            movies={trendingMovies}
          />

          <MovieRow
            title="⭐ Top Rated Movies"
            movies={topRatedMovies}
          />

          {/* FIXED: the homepage never fetched or rendered TV data at
              all - only movies - even though /api/tv/top-rated has
              always worked correctly on the backend. */}
          <MovieRow
            title="📺 Top Rated TV Shows"
            movies={topRatedTV}
          />

          <MovieRow
            title="👑 Popular Movies"
            movies={popularMovies}
          />

          {/* FIXED: this component was fully built (and now has a
              working backend endpoint at /stats/top-rated) but was
              never rendered anywhere in the app. */}
          <TopRated />

        </div>

      </main>
    </div>
  );
}