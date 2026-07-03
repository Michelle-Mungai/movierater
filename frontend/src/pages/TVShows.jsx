import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import api from "../services/api";

export default function TVShows() {
  const mountedRef = useRef(false);

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    mountedRef.current = true;

    async function loadTVShows() {
      try {
        const { data } = await api.get(
          "/tv/top-rated"
        );

        if (!mountedRef.current) return;

        setShows(
          (data || []).map((show) => ({
            ...show,
            media_type: "tv",
          }))
        );
      } catch (err) {
        console.error(err);

        if (mountedRef.current) {
          setError(
            "Unable to load TV shows."
          );
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadTVShows();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--bg-primary)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-[var(--text-secondary)] text-sm sm:text-base">
            Loading TV Shows...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-primary)] min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-[var(--text-primary)] text-xl sm:text-2xl font-bold mb-3">
            Something went wrong
          </h2>

          <p className="text-[var(--text-muted)] text-sm mb-6">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      <Navbar />

      <main className="pt-24 pb-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-[var(--text-primary)] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Top Rated TV Shows
            </h1>

            <p className="text-[var(--text-muted)] text-sm mt-1">
              Browse the highest-rated
              television series.
            </p>
          </div>

          {shows.length === 0 ? (
            <div className="flex justify-center py-16">
              <p className="text-[var(--text-muted)] text-base">
                No TV shows found.
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-3
                sm:grid-cols-4
                md:grid-cols-5
                lg:grid-cols-6
                gap-3
                sm:gap-5
              "
            >
              {shows.map((show) => (
                <MovieCard
                  key={show.id}
                  movie={show}
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