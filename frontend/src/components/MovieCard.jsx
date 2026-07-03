import { Link } from "react-router-dom";

export default function MovieCard({ movie, fullWidth = false }) {
  const title = movie.title || movie.name;

  const year = (
    movie.release_date ||
    movie.first_air_date ||
    ""
  ).slice(0, 4);

  const type =
    movie.media_type === "tv"
      ? "TV"
      : "Movie";

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Poster";

  return (
    <Link
      to={`/${
        movie.media_type === "tv"
          ? "tv"
          : "movie"
      }/${movie.id}`}
      className={`
      group
      shrink-0

      ${
        fullWidth
          ? "w-full"
          : "w-28 sm:w-44 md:w-52 lg:w-56 xl:w-60"
      }

      transition-transform
      duration-300
      hover:-translate-y-1
      sm:hover:-translate-y-2
      `}
    >
      <div
        className="
        relative
        overflow-hidden
        rounded-lg
        sm:rounded-xl
        bg-zinc-900
        shadow-lg
        "
      >
        {/* FIX: fixed pixel heights (h-52/h-64/h-72/h-80) meant the poster
            didn't scale with card width, so on denser mobile grids (3+
            columns) it would look stretched/cropped. aspect-2/3 keeps the
            correct poster ratio at any card width. */}
        <img
          loading="lazy"
          src={poster}
          alt={title}
          className="
          w-full
          aspect-2/3
          object-cover
          transition-transform
          duration-500
          group-hover:scale-110
          "
        />

        {/* Gradient */}

        <div
          className="
          absolute
          inset-0
          bg-linear-to-t
          from-black
          via-black/20
          to-transparent
          opacity-0
          group-hover:opacity-100
          transition
          duration-300
          "
        />

        {/* Rating */}

        {movie.vote_average > 0 && (
          <div
            className="
            absolute
            top-1.5
            left-1.5
            sm:top-3
            sm:left-3

            bg-black/80
            backdrop-blur

            text-yellow-400

            text-[9px]
            sm:text-xs
            font-semibold

            px-1.5
            py-0.5
            sm:px-2
            sm:py-1

            rounded-full
            "
          >
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Media Type */}

        <div
          className="
          absolute
          top-1.5
          right-1.5
          sm:top-3
          sm:right-3

          bg-red-600

          text-white

          text-[9px]
          sm:text-xs

          px-1.5
          py-0.5
          sm:px-2
          sm:py-1

          rounded-full
          font-semibold
          "
        >
          {type}
        </div>

        {/* Hover Buttons */}

        <div
          className="
          absolute
          bottom-0
          left-0
          right-0

          p-4

          opacity-0
          translate-y-6

          group-hover:opacity-100
          group-hover:translate-y-0

          transition-all
          duration-300
          hidden
          md:block
          "
        >
          <button
            className="
            w-full

            bg-red-600
            hover:bg-red-700

            text-white

            py-2

            rounded-lg

            font-semibold
            "
          >
            View Details
          </button>
        </div>
      </div>

      {/* Information */}

      <div className="mt-1.5 sm:mt-3">
        <h3
          className="
          text-white

          font-medium
          sm:font-semibold

          text-xs
          sm:text-sm
          md:text-base

          line-clamp-1
          "
        >
          {title}
        </h3>

        <div
          className="
          mt-0.5
          sm:mt-1

          flex
          items-center
          gap-1.5
          sm:gap-2

          text-zinc-500

          text-[10px]
          sm:text-xs
          md:text-sm
          "
        >
          {year && <span>{year}</span>}

          <span>•</span>

          <span>{type}</span>
        </div>
      </div>
    </Link>
  );
}