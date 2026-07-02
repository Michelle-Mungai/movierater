import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import api from "../services/api";

export default function Movies() {
  const mountedRef = useRef(false);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    mountedRef.current = true;

    async function loadMovies() {
      try {
        const { data } = await api.get(
          "/movies/top-rated"
        );

        if (!mountedRef.current) return;

        setMovies(data || []);
      } catch (err) {
        console.error(err);

        if (mountedRef.current) {
          setError(
            "Unable to load movies."
          );
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadMovies();

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
        <div className="text-center">

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

      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-10">

        <div className="max-w-7xl mx-auto">

          <div className="mb-10">

            <h1 className="text-white text-4xl md:text-5xl font-black">
              Top Rated Movies
            </h1>

            <p className="text-gray-400 mt-3">
              Browse the highest-rated movies available.
            </p>

          </div>

          {movies.length === 0 ? (
            <div className="flex justify-center py-24">

              <p className="text-gray-400 text-xl">
                No movies found.
              </p>

            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                gap-5
              "
            >
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  fullWidth
                />
              ))}
            </div>
          )}

        </div>

      </main>
    </div>
  );
}