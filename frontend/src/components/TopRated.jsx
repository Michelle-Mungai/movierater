import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function TopRated() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchTopRated() {
      try {
        const res = await api.get("/stats/top-rated");
        setMovies(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load top rated movies.");
      } finally {
        setLoading(false);
      }
    }

    fetchTopRated();
  }, []);

  const scroll = (direction) => {
    if (!rowRef.current) return;

    const amount = window.innerWidth * 0.8;

    rowRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleWheel = (e) => {
    if (!rowRef.current) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();

      rowRef.current.scrollLeft += e.deltaY;
    }
  };

  if (loading) {
    return (
      <section className="relative mb-10 sm:mb-14 md:mb-16">
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5">
          ⭐ Top Rated By Users
        </h2>

        <div className="flex gap-4 sm:gap-5 lg:gap-6 overflow-hidden pb-3 px-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="
              shrink-0
              w-36 sm:w-44 md:w-52 lg:w-56 xl:w-60
              bg-zinc-900
              rounded-xl
              overflow-hidden
              animate-pulse
              "
            >
              <div className="aspect-2/3 bg-zinc-800" />

              <div className="p-3 space-y-2">
                <div className="h-4 bg-zinc-800 rounded" />
                <div className="h-3 bg-zinc-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!movies.length) {
    return (
      <section className="relative mb-10 sm:mb-14 md:mb-16">
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5">
          ⭐ Top Rated By Users
        </h2>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl py-16 text-center">
          <p className="text-zinc-400">
            No community ratings yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mb-10 sm:mb-14 md:mb-16">
      {/* Header */}

      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2
          className="
          text-white
          text-xl
          sm:text-2xl
          md:text-3xl
          font-bold
          "
        >
          ⭐ Top Rated By Users
        </h2>
      </div>

      {/* Left Arrow */}

      <button
        onClick={() => scroll("left")}
        className="
        hidden
        lg:flex

        absolute
        left-2
        top-1/2
        -translate-y-1/2

        z-20

        h-14
        w-14

        rounded-full

        bg-black/70
        hover:bg-red-600

        text-white
        text-2xl

        items-center
        justify-center

        transition
        "
      >
        ❮
      </button>

      {/* Right Arrow */}

      <button
        onClick={() => scroll("right")}
        className="
        hidden
        lg:flex

        absolute
        right-2
        top-1/2
        -translate-y-1/2

        z-20

        h-14
        w-14

        rounded-full

        bg-black/70
        hover:bg-red-600

        text-white
        text-2xl

        items-center
        justify-center

        transition
        "
      >
        ❯
      </button>

      {/* Row */}

      <div
        ref={rowRef}
        onWheel={handleWheel}
        className="
        flex
        gap-4
        sm:gap-5
        lg:gap-6

        overflow-x-auto

        scroll-smooth
        snap-x
        snap-mandatory

        scrollbar-hide

        pb-3

        px-1
        "
      >
        {movies.map((movie, index) => (
          <Link
            key={`${movie.media_type || "movie"}-${movie.tmdb_id}`}
            to={`/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.tmdb_id}`}
            className="
            group
            shrink-0
            snap-start

            w-36 sm:w-44 md:w-52 lg:w-56 xl:w-60
            "
          >
            <div
              className="
              relative
              overflow-hidden
              rounded-xl
              bg-zinc-900
              border border-zinc-800
              hover:border-red-600
              transition
              duration-300
              hover:-translate-y-2
              "
            >
              {/* Rank Badge */}
              <div className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {index + 1}
              </div>

              {/* Poster */}
              <img
                src={
                  movie.poster
                    ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                    : "https://placehold.co/500x750?text=No+Poster"
                }
                alt={movie.title}
                loading="lazy"
                className="
                w-full

                h-52
                sm:h-64
                md:h-72
                lg:h-80

                object-cover
                transition-transform
                duration-500
                group-hover:scale-110
                "
              />
            </div>

            {/* Info */}
            <div className="mt-3">
              <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1 group-hover:text-red-400 transition">
                {movie.title}
              </h3>

              <div className="mt-1 flex items-center gap-2 text-zinc-400 text-xs sm:text-sm">
                <span className="text-yellow-400 font-bold">
                  ⭐ {Number(movie.rating).toFixed(1)}
                </span>

                <span>•</span>

                <span>
                  {movie.reviews} review{movie.reviews !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
