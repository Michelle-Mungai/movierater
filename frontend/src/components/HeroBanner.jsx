import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function HeroBanner({ movies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  const resumeTimer = useRef(null);

  /* ---------------------------------- */
  /* Auto Play                          */
  /* ---------------------------------- */

  useEffect(() => {
    if (!autoPlay || movies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [autoPlay, movies.length]);

  /* ---------------------------------- */
  /* Keyboard Navigation                */
  /* ---------------------------------- */

  useEffect(() => {
    if (!movies.length) return;

    function handle(e) {
      if (e.key === "ArrowRight") {
        setCurrentIndex((i) => (i + 1) % movies.length);
      }

      if (e.key === "ArrowLeft") {
        setCurrentIndex((i) =>
          i === 0 ? movies.length - 1 : i - 1
        );
      }
    }

    window.addEventListener("keydown", handle);

    return () => window.removeEventListener("keydown", handle);
  }, [movies.length]);

  /* ---------------------------------- */
  /* Resume autoplay after manual click */
  /* ---------------------------------- */

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setAutoPlay(false);

    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
    }

    resumeTimer.current = setTimeout(() => {
      setAutoPlay(true);
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (resumeTimer.current) {
        clearTimeout(resumeTimer.current);
      }
    };
  }, []);

  /* ---------------------------------- */
  /* Preload next 
  
  
  
  
  
  
  
  */
  /* ---------------------------------- */

  useEffect(() => {
    if (!movies.length) return;

    const nextMovie =
      movies[(currentIndex + 1) % movies.length];

    if (nextMovie?.backdrop_path) {
      const img = new Image();

      img.src = `https://image.tmdb.org/t/p/original${nextMovie.backdrop_path}`;
    }
  }, [currentIndex, movies]);

  /* ---------------------------------- */
  /* Trailer Modal                      */
  /* ---------------------------------- */

   const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerKey(null);
  };

  useEffect(() => {
    function esc(e) {
      if (e.key === "Escape") {
        closeTrailer();
      }
    }

    if (showTrailer) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", esc);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", esc);
    };
  }, [showTrailer]);

  /* ---------------------------------- */
  /* Loading Screen                     */
  /* ---------------------------------- */

  if (!movies.length) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <p className="text-zinc-300 text-xl">
            Loading featured movies...
          </p>
        </div>
      </div>
    );
  }

  const movie = movies[currentIndex];

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://placehold.co/1280x720?text=No+Image";

  /* ---------------------------------- */
  /* Trailer                            */
  /* ---------------------------------- */

  const watchTrailer = async () => {
    try {
      setLoadingTrailer(true);

      const endpoint =
        movie.media_type === "tv"
          ? `/tv/${movie.id}/trailer`
          : `/movies/${movie.id}/trailer`;

      const res = await api.get(endpoint);

      if (!res.data?.key) {
        toast.error("Trailer unavailable.");
        return;
      }

      setTrailerKey(res.data.key);
      setShowTrailer(true);
    } catch (err) {
      console.error(err);
      toast.error("Trailer unavailable.");
    } finally {
      setLoadingTrailer(false);
    }
  };

  /* ---------------------------------- */
  /* My List                            */
  /* ---------------------------------- */

  const addToList = () => {
    const list =
      JSON.parse(localStorage.getItem("myList")) || [];

    const mediaType = movie.media_type || "movie";

    const alreadyInList = list.find(
      (item) => item.id === movie.id && item.media_type === mediaType
    );

    if (!alreadyInList) {
      list.push({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        media_type: mediaType,
        release_date:
          movie.release_date || movie.first_air_date,
      });

      localStorage.setItem(
        "myList",
        JSON.stringify(list)
      );

      toast.success("Added to My List");
    } else {
      toast("Already in your list");
    }
  };

  return (<div className="relative h-[60vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">

  {/* Backdrop */}
  <div
    className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-1000"
    style={{
      backgroundImage: `url(${backdrop})`,
    }}
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

  {/* Content */}
  <div className="absolute inset-0 flex items-end">

    <div className="relative z-10 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl px-4 pb-10 sm:px-8 sm:pb-18 md:px-12 md:pb-20 lg:px-20 lg:pb-24">

      {/* Title */}

      <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-lg">
        {movie.title || movie.name}
      </h1>

      {/* Year */}

      {(movie.release_date || movie.first_air_date) && (
        <p className="mt-3 text-gray-300 text-base sm:text-lg">
          {new Date(
            movie.release_date || movie.first_air_date
          ).getFullYear()}
        </p>
      )}

      {/* Overview */}

      <p className="mt-5 text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed line-clamp-4 lg:line-clamp-5">
        {movie.overview || "No description available."}
      </p>

      {/* Rating */}

      {movie.vote_average > 0 && (

        <div className="flex items-center gap-3 mt-6">

          <span className="text-yellow-400 text-xl">
            ⭐
          </span>

          <span className="text-white font-semibold text-lg">
            {movie.vote_average.toFixed(1)}
          </span>

          <span className="text-gray-400">
            /10
          </span>

        </div>

      )}

      {/* Buttons */}

      <div className="mt-8 flex flex-col sm:flex-row gap-4">

        <button
          onClick={watchTrailer}
          disabled={loadingTrailer}
          className="bg-white text-black font-semibold rounded-lg px-7 py-3 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >

          {loadingTrailer ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            <>
              ▶ Watch Trailer
            </>
          )}

        </button>

        <button
          onClick={addToList}
          className="bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all text-white rounded-lg px-7 py-3 font-semibold"
        >
          ❤ Add To List
        </button>

      </div>

    </div>

  </div>

  {/* Dots */}

  <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">

    {movies.map((_, index) => (

      <button
        key={index}
        onClick={() => handleDotClick(index)}
        aria-label={`Slide ${index + 1}`}
        className={`transition-all rounded-full ${
          currentIndex === index
            ? "bg-red-600 w-8 h-3"
            : "bg-gray-400 hover:bg-white w-3 h-3"
        }`}
      />

    ))}

  </div>

  {/* Trailer Modal */}

  {showTrailer && (

    <div
      onClick={closeTrailer}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    >

      <div
        className="relative w-full max-w-6xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={closeTrailer}
          className="absolute -top-12 right-0 text-white text-4xl hover:text-red-500 transition"
        >
          ✕
        </button>

        <iframe
          key={trailerKey}
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
          title="Movie Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

      </div>

    </div>

  )}


</div>
);
}