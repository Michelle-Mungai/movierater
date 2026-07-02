import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../context/useAuth";

function ReviewCard({ review, currentUserId, onEdit, onDelete }) {
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isOwner =
    currentUserId != null &&
    review.user_id === currentUserId;

  return (
    <div className="
bg-linear-to-br
from-zinc-900
to-zinc-950
border
border-zinc-800
hover:border-red-600
transition
rounded-2xl
p-5
sm:p-6
space-y-6
">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-lg uppercase">
            {review.username?.[0] || "?"}
          </div>
          <div>
            <p className="text-white font-semibold">{review.username}</p>
            <p className="text-gray-500 text-xs">{date}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-yellow-400 font-black text-2xl">
            {review.overall}<span className="text-gray-500 text-base font-normal">/10</span>
          </span>
          {review.recommendation && (
            <span className="text-xs bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">
              ✓ Recommends
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Cinematography", val: review.cinematography },
          { label: "Acting", val: review.acting },
          { label: "Storyline", val: review.storyline },
          { label: "VFX", val: review.graphics },
          { label: "Soundtrack", val: review.soundtrack },
          { label: "Rewatch", val: review.rewatch_value },
        ].map(({ label, val }) => (
          <div key={label} className="bg-black/30
border
border-zinc-700
rounded-xl
px-4
py-3
hover:border-red-600
transition">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-700 rounded-full h-1.5">
                <div
                  className="bg-yellow-400 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${(val / 10) * 100}%` }}
                />
              </div>
              <span className="text-yellow-400 text-xs font-bold w-4">{val}</span>
            </div>
          </div>
        ))}
      </div>

      {(review.positives || review.negatives) && (
        <div className="grid md:grid-cols-2 gap-6">
          {review.positives && (
            <div className="space-y-1">
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest">✦ What Worked</p>
              <p className="text-gray-300 text-sm leading-relaxed">{review.positives}</p>
            </div>
          )}
          {review.negatives && (
            <div className="space-y-1">
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest">✦ What Didn't</p>
              <p className="text-gray-300 text-sm leading-relaxed">{review.negatives}</p>
            </div>
          )}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-3 pt-2 border-t border-zinc-800">
          <button
            onClick={() => onEdit?.(review)}
            className="
            mt-4
            px-4
            py-2
            rounded-lg
            text-sm
            font-semibold
            bg-zinc-800
            hover:bg-zinc-700
            transition
            "
          >
            ✎ Edit
          </button>

          <button
            onClick={() => onDelete?.(review)}
            className="
            mt-4
            px-4
            py-2
            rounded-lg
            text-sm
            font-semibold
            bg-red-900/40
            text-red-400
            border border-red-800
            hover:bg-red-900/70
            transition
            "
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
}

function AggregateStats({ reviews }) {
  if (!reviews.length) return null;

  const keys = ["cinematography", "acting", "storyline", "graphics", "soundtrack", "rewatch_value"];
  const labels = {
    cinematography: "Cinematography",
    acting: "Acting",
    storyline: "Storyline",
    graphics: "Visual Effects",
    soundtrack: "Soundtrack",
    rewatch_value: "Rewatch Value",
  };

  const avgs = Object.fromEntries(
    [...keys, "overall"].map(k => [
      k,
      reviews.reduce((sum, r) => sum + (r[k] || 0), 0) / reviews.length,
    ])
  );

  const recommendPct = Math.round(
    (reviews.filter(r => r.recommendation).length / reviews.length) * 100
  );

  return (
    <div className="
bg-linear-to-br
from-zinc-900
to-zinc-950
border
border-zinc-800
rounded-2xl
p-6
space-y-6
">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-white font-bold text-lg">Community Score</h3>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-black text-4xl">{avgs.overall.toFixed(1)}</span>
          <div>
            <p className="text-gray-400 text-xs">/10</p>
            <p className="text-gray-500 text-xs">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {keys.map(k => (
          <div key={k} className="flex items-center gap-3">
            <span className="text-gray-400 text-xs w-24 sm:w-28 shrink-0">{labels[k]}</span>
            <div className="flex-1 bg-zinc-700 rounded-full h-2">
              <div
                className="bg-linear-to-r from-red-600 to-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${(avgs[k] / 10) * 100}%` }}
              />
            </div>
            <span className="text-yellow-400 text-xs font-bold w-6 text-right">{avgs[k].toFixed(1)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-700 pt-4">
        <span className="text-gray-400 text-sm">Would recommend</span>
        <span className="text-green-400 font-bold">{recommendPct}%</span>
      </div>
    </div>
  );
}


export default function MoviePage() {
  const params = useParams();
  const id = params.id;
  const location = useLocation();
  const isTv = location.pathname.includes("/tv/");
  const navigate = useNavigate();
  const mountedRef = useRef(false);

   const [state, setState] = useState(() => ({
    movie: null,
    reviews: [],
    loading: true,
    error: null,
    showForm: false,
  }));

   // Alias for cleaner JSX
  const { movie, reviews, loading, error, showForm } = state;
  const isLoggedIn = !!localStorage.getItem("token");
  const { user } = useAuth();
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      setShowTrailer(false);
    }
  };

  if (showTrailer) {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = "auto";
  };
}, [showTrailer]);

const watchTrailer = async () => {
  try {

    // FIXED: was `/movies/tv/${id}/trailer`, which doesn't match any
    // backend route (movie routes only know /movies/:id/trailer; TV
    // trailers live under /tv/:id/trailer).
    const endpoint = isTv
      ? `/tv/${id}/trailer`
      : `/movies/${id}/trailer`;

    const res =
      await api.get(endpoint);

    if (!res.data?.key) {
      toast.error("Trailer unavailable.");
      return;
    }

    setTrailerKey(res.data.key);
    setShowTrailer(true);

  } catch (err) {
    console.error(err);
    toast.error("Trailer unavailable.");
  }
};

  const fetchReviews = useCallback(() => {
    api.get(`/reviews/movie/${id}`)
      .then(res => {
        if (mountedRef.current) setState(prev => ({ ...prev, reviews: res.data }));
      })
      .catch(() => {});
  }, [id]);

  const deleteReview = async (review) => {
    const confirmed = window.confirm(
      "Delete this review? This can't be undone."
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      await api.delete(`/reviews/${review.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Review deleted.");
      fetchReviews();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete review."
      );
    }
  };

useEffect(() => {
  mountedRef.current = true;

  // FIXED: was `/movies/tv/${id}`, which never matched any backend
  // route - viewing a TV show's detail page always failed silently.
  const endpoint = isTv
    ? `/tv/${id}`
    : `/movies/${id}`;

  api.get(endpoint)
    .then((res) => {
      if (!mountedRef.current) return;

      setState((prev) => ({
        ...prev,
        movie: res.data,
        loading: false,
        error: null,
      }));
    })
    .catch((err) => {
      if (!mountedRef.current) return;

      console.error("Error fetching movie:", err);

      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load movie details. Please try again.",
      }));
    });

  api.get(`/reviews/movie/${id}`)
    .then((res) => {
      if (!mountedRef.current) return;

      setState((prev) => ({
        ...prev,
        reviews: res.data,
      }));
    })
    .catch((err) => {
      console.warn("Reviews unavailable:", err.message);
    });

  return () => {
    mountedRef.current = false;
  };
}, [id, isTv]);
    

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-lg">Loading movie details…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white text-2xl">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/fallback.jpg";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : posterUrl;

  const avgOverall = reviews.length
    ? (reviews.reduce((s, r) => s + r.overall, 0) / reviews.length).toFixed(1)
    : null;

  function addToList() {
  const list =
    JSON.parse(localStorage.getItem("myList")) || [];

  // FIXED: previously deduped and stored using only `id`, but movie and
  // TV IDs share the same numeric namespace and can collide. Not
  // storing media_type also meant My List always linked to /movie/:id
  // even for TV shows.
  const mediaType = isTv ? "tv" : "movie";

  const alreadyInList = list.find(
    (x) => x.id === movie.id && x.media_type === mediaType
  );

  if (!alreadyInList) {
    list.push({
  id: movie.id,
  title: movie.title || movie.name,
  poster_path: movie.poster_path,
  media_type: mediaType,
  release_date: movie.release_date || movie.first_air_date,
});

    localStorage.setItem(
      "myList",
      JSON.stringify(list)
    );

    toast.success("Added to My List");
  } else {
    toast("Already in your list");
  }
}
 

  return (
    <div className="bg-black min-h-screen text-white">
      <div
        className="relative
h-[35vh]
sm:h-[45vh]
lg:h-[55vh]
bg-cover
bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/40 to-black" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 lg:-mt-44 relative z-10 pb-32">

  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

    <div className="flex justify-center lg:block shrink-0">
      <img
        src={posterUrl}
        alt={movie.title || movie.name}
        className="
        w-44
        sm:w-56
        md:w-64
        lg:w-72
        aspect-2/3
        object-cover
        rounded-2xl
        shadow-2xl
        ring-1
        ring-white/10
        "
      />
    </div>

    <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">{movie.title || movie.name}</h1>

            <div className="flex flex-wrap items-center gap-3 mt-4 mb-6 text-sm sm:text-base">
              {movie.release_date && (
                <span className="text-gray-400 text-base">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime > 0 && (
                <>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-400 text-base">{movie.runtime} min</span>
                </>
              )}
              {avgOverall && (
                <>
                  <span className="text-gray-500">·</span>
                  <span className="flex items-center gap-1 text-yellow-400 font-bold">
                    ★ {avgOverall}
                    <span className="text-gray-500 font-normal text-sm">({reviews.length} reviews)</span>
                  </span>
                </>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {movie.genres.map(g => (
                  <span key={g.id} className="bg-zinc-800 text-gray-300 text-xs font-medium px-3 py-1 rounded-full border border-zinc-700">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mb-8">
              {movie.overview || "No description available."}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <button className="w-full
sm:w-auto
bg-white
text-black
px-8
py-3.5
rounded-xl
font-bold
hover:bg-gray-200
transition" onClick={watchTrailer}>
                ▶ Watch Trailer
              </button>
              <button className="w-full
sm:w-auto
bg-red-600
hover:bg-red-700
text-white
px-8
py-3.5
rounded-xl
font-bold
transition" onClick={addToList}>
                ❤ Add to List
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full
sm:w-auto
bg-zinc-800
hover:bg-zinc-700
border
border-zinc-700
text-white
px-8
py-3.5
rounded-xl
font-bold
transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ratings & Reviews
              {reviews.length > 0 && (
                <span className="ml-3 text-gray-500 font-normal text-xl">({reviews.length})</span>
              )}
            </h2>
            {isLoggedIn ? (
              <button
                onClick={() => setState(prev => ({ ...prev, showForm: !prev.showForm }))}
                className={`self-start sm:self-auto px-6 py-3 rounded-lg font-bold transition-colors text-sm ${
                  showForm
                    ? "bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {showForm ? "✕ Cancel" : "+ Write a Review"}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="self-start sm:self-auto bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-zinc-700 px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Sign in to review
              </button>
            )}
          </div>

          {showForm && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Your Review</h3>
              <ReviewForm
                movie={movie}
                mediaType={isTv ? "tv" : "movie"}
                onSubmitted={() => {
                  setState(prev => ({ ...prev, showForm: false }));
                  fetchReviews();
                }}
              />
            </div>
          )}

          {editingReview && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Edit Review</h3>
              <ReviewForm
                movie={movie}
                mediaType={isTv ? "tv" : "movie"}
                existingReview={editingReview}
                onSubmitted={() => {
                  setEditingReview(null);
                  fetchReviews();
                }}
                onCancel={() => setEditingReview(null)}
              />
            </div>
          )}

          {showTrailer && (
  <div
    className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
    onClick={() => setShowTrailer(false)}
  >
    <div
      className="relative w-full max-w-7xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setShowTrailer(false)}
        className="
          absolute
          -top-10 sm:-top-14
          right-0
          w-10 h-10 sm:w-12 sm:h-12
          rounded-full
          bg-red-600
          hover:bg-red-700
          text-white
          text-xl sm:text-2xl
          font-bold
          z-[10000]
          flex items-center justify-center
        "
      >
        ✕
      </button>

      <iframe
        className="w-full aspect-video rounded-2xl shadow-2xl"
        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  </div>
)}         


          {reviews.length > 0 && <AggregateStats reviews={reviews} />}

          {reviews.length > 0 ? (
            <div className="grid gap-6">
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={user?.id}
                  onEdit={setEditingReview}
                  onDelete={deleteReview}
                />
              ))}
            </div>
          ) : !showForm && (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-5xl mb-4">🎬</p>
              <p className="text-gray-400 text-lg font-medium">No reviews yet</p>
              <p className="text-gray-600 text-sm mt-1">Be the first to share your thoughts on this film.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}