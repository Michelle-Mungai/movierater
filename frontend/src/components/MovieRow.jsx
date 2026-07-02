import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies = [] }) {
  const rowRef = useRef(null);

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

  if (!movies.length) return null;

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
          {title}
        </h2>

        <span className="text-zinc-500 text-xs sm:text-sm">
          {movies.length} titles
        </span>
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

      {/* Movie List */}

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
        {movies.map((movie) => (
          <div
            key={`${movie.media_type || "movie"}-${movie.id}`}
            className="snap-start shrink-0"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}