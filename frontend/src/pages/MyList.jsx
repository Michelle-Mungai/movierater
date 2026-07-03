import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MyList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    function loadMovies() {
      try {
        const saved = JSON.parse(
          localStorage.getItem("myList") || "[]"
        );

        setMovies(saved);
      } catch {
        setMovies([]);
      }
    }

    loadMovies();

    function handleStorage() {
      loadMovies();
    }

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "focus",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "focus",
        handleStorage
      );
    };
  }, []);

  function removeMovie(id, mediaType) {
    const updated = movies.filter(
      (movie) =>
        !(movie.id === id && (movie.media_type || "movie") === mediaType)
    );

    setMovies(updated);

    localStorage.setItem(
      "myList",
      JSON.stringify(updated)
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <Navbar />

      <div className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl">❤️</span> My List
              </h1>

              <p className="text-[var(--text-muted)] text-sm mt-1">
                Your saved movies and TV shows.
              </p>
            </div>
          </div>

          {movies.length === 0 ? (
            <div className="border border-dashed border-[var(--border-color)] rounded-3xl py-16 sm:py-24 px-6 text-center">

              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">
                🎬
              </div>

              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">
                Your list is empty
              </h2>

              <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-xl mx-auto mb-6 sm:mb-8">
                Save your favourite movies and TV
                shows by pressing the
                <span className="text-[var(--accent)] font-semibold">
                  {" "}
                  Add to List
                </span>
                {" "}button.
              </p>

              <Link
                to="/"
                className="inline-flex bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                Browse Movies
              </Link>

            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-5">

              {movies.map((movie) => (
                <div
                  key={`${movie.media_type || "movie"}-${movie.id}`}
                  className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-[var(--accent)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300"
                >

                  <Link
                    to={
                      movie.media_type === "tv"
                        ? `/tv/${movie.id}`
                        : `/movie/${movie.id}`
                    }
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/fallback.jpg"
                      }
                      alt={
                        movie.title ||
                        movie.name
                      }
                      className="w-full aspect-2/3 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </Link>

                  <div className="p-2 sm:p-4">

                    <Link
                      to={
                        movie.media_type === "tv"
                          ? `/tv/${movie.id}`
                          : `/movie/${movie.id}`
                      }
                    >
                      <h3 className="text-xs sm:text-base font-medium sm:font-semibold line-clamp-2 group-hover:text-[var(--accent)] transition">
                        {movie.title ||
                          movie.name}
                      </h3>
                    </Link>

                    <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-1 sm:mt-2">
                      {movie.release_date ||
                      movie.first_air_date
                        ? new Date(
                            movie.release_date ||
                              movie.first_air_date
                          ).getFullYear()
                        : "Unknown"}
                    </p>

                    <button
                      onClick={() =>
                        removeMovie(movie.id, movie.media_type || "movie")
                      }
                      className="mt-2 sm:mt-4 w-full bg-[var(--bg-card-hover)] hover:bg-[var(--accent)] transition py-1.5 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium sm:font-semibold"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}