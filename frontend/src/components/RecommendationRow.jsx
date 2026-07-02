import { useEffect, useState } from "react";
import MovieRow from "./MovieRow";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

export default function RecommendationRow() {
  const { isLoggedIn } = useAuth();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  
    useEffect(() => {
    let ignore = false;

    async function load() {
        if (!isLoggedIn) {
            if (!ignore) {
                setMovies([]);
                setLoading(false);
            }
            return;
        }

        try {
            const { data } = await api.get("/recommendations");

            if (!ignore) {
                setMovies(
                    Array.isArray(data)
                        ? data
                        : data.results || []
                );
            }
        } finally {
            if (!ignore) {
                setLoading(false);
            }
        }
    }

    load();

    return () => {
        ignore = true;
    };
}, [isLoggedIn]);

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-5">
          Recommended For You
        </h2>

        <div className="flex gap-5 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-40 sm:w-48 lg:w-56"
            >
              <div className="h-72 rounded-xl bg-zinc-800 animate-pulse" />

              <div className="h-4 mt-3 rounded bg-zinc-800 animate-pulse" />

              <div className="h-4 mt-2 w-2/3 rounded bg-zinc-800 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!movies.length) return null;

  return (
    <MovieRow
      title="Recommended For You"
      movies={movies}
    />
  );
}