import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { X } from "lucide-react";
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
border-[var(--border-color)]
hover:border-[var(--accent)]
transition
rounded-2xl
p-4
sm:p-6
space-y-4
sm:space-y-6
">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--accent-hover)] flex items-center justify-center text-[var(--text-primary)] font-bold text-sm sm:text-lg uppercase">
            {review.username?.[0] || "?"}
          </div>
          <div>
            <p className="text-[var(--text-primary)] text-sm sm:text-base font-semibold">{review.username}</p>
            <p className="text-[var(--text-muted)] text-xs">{date}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-yellow-400 font-bold text-lg sm:text-2xl">
            {review.overall}<span className="text-[var(--text-muted)] text-xs sm:text-base font-normal">/10</span>
          </span>
          {review.recommendation && (
            <span className="text-[10px] sm:text-xs bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">
              ✓ Recommends
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
border-[var(--border-color)]
rounded-xl
px-3
py-2.5
hover:border-[var(--accent)]
transition">
            <p className="text-[var(--text-secondary)] text-[10px] sm:text-xs uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--bg-card-hover)] rounded-full h-1.5">
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
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {review.positives && (
            <div className="space-y-1">
              <p className="text-green-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">✦ What Worked</p>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{review.positives}</p>
            </div>
          )}
          {review.negatives && (
            <div className="space-y-1">
              <p className="text-[var(--accent)] text-[10px] sm:text-xs font-bold uppercase tracking-widest">✦ What Didn't</p>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{review.negatives}</p>
            </div>
          )}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-3 pt-2 border-t border-[var(--border-color)]">
          <button
            onClick={() => onEdit?.(review)}
            className="
            mt-3
            sm:mt-4
            px-3
            sm:px-4
            py-1.5
            sm:py-2
            rounded-lg
            text-xs
            sm:text-sm
            font-semibold
            bg-[var(--bg-card-hover)]
            hover:bg-[var(--bg-card-hover)]
            transition
            "
          >
            ✎ Edit
          </button>

          <button
            onClick={() => onDelete?.(review)}
            className="
            mt-3
            sm:mt-4
            px-3
            sm:px-4
            py-1.5
            sm:py-2
            rounded-lg
            text-xs
            sm:text-sm
            font-semibold
            bg-[var(--accent)]/10
            text-[var(--accent)]
            border border-[var(--accent)]/60
            hover:bg-[var(--accent)]/20
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
border-[var(--border-color)]
rounded-2xl
p-4
sm:p-6
space-y-4
sm:space-y-6
">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h3 className="text-[var(--text-primary)] font-bold text-sm sm:text-lg">Community Score</h3>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold text-2xl sm:text-4xl">{avgs.overall.toFixed(1)}</span>
          <div>
            <p className="text-[var(--text-secondary)] text-xs">/10</p>
            <p className="text-[var(--text-muted)] text-xs">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {keys.map(k => (
          <div key={k} className="flex items-center gap-3">
            <span className="text-[var(--text-secondary)] text-xs w-24 sm:w-28 shrink-0">{labels[k]}</span>
            <div className="flex-1 bg-[var(--bg-card-hover)] rounded-full h-2">
              <div
                className="bg-linear-to-r from-red-600 to-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${(avgs[k] / 10) * 100}%` }}
              />
            </div>
            <span className="text-yellow-400 text-xs font-bold w-6 text-right">{avgs[k].toFixed(1)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3 sm:pt-4">
        <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Would recommend</span>
        <span className="text-green-400 font-bold text-sm sm:text-base">{recommendPct}%</span>
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
      <div className="bg-[var(--bg-primary)] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] text-sm sm:text-base">Loading movie details…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-primary)] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[var(--text-primary)] text-lg sm:text-xl">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
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
  // FIXED: guests could previously write straight to localStorage with
  // no auth check. Now unauthenticated users are sent to /login instead.
  if (!isLoggedIn) {
    toast("Please sign in to add to your list.");
    navigate("/login");
    return;
  }

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
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
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

        {/* NEW: close button — quick way to leave the page from the top,
            independent of the "Back" button further down in the content. */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="
            absolute
            top-4
            right-4
            sm:top-6
            sm:right-6
            z-20
            w-9
            h-9
            sm:w-10
            sm:h-10
            rounded-full
            bg-black/60
            hover:bg-black/80
            backdrop-blur
            flex
            items-center
            justify-center
            text-white
            transition
          "
        >
          <X size={18} className="sm:hidden" />
          <X size={20} className="hidden sm:block" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 lg:-mt-44 relative z-10 pb-20">

  <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">

    <div className="flex justify-center lg:block shrink-0">
      <img
        src={posterUrl}
        alt={movie.title || movie.name}
        className="
        w-36
        sm:w-52
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
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">{movie.title || movie.name}</h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 mb-4 sm:mb-6 text-xs sm:text-sm">
              {movie.release_date && (
                <span className="text-[var(--text-secondary)]">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime > 0 && (
                <>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-secondary)]">{movie.runtime} min</span>
                </>
              )}
              {avgOverall && (
                <>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="flex items-center gap-1 text-yellow-400 font-bold">
                    ★ {avgOverall}
                    <span className="text-[var(--text-muted)] font-normal">({reviews.length} reviews)</span>
                  </span>
                </>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
                {movie.genres.map(g => (
                  <span key={g.id} className="bg-[var(--bg-card-hover)] text-[var(--text-secondary)] text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--border-color)]">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-3xl mb-6 sm:mb-8">
              {movie.overview || "No description available."}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button className="w-full
sm:w-auto
bg-white
text-black
px-5
sm:px-7
py-2.5
sm:py-3
rounded-lg
text-sm
sm:text-base
font-semibold
hover:bg-gray-200
transition" onClick={watchTrailer}>
                ▶ Watch Trailer
              </button>
              <button className="w-full
sm:w-auto
bg-[var(--accent)]
hover:bg-[var(--accent-hover)]
text-[var(--text-primary)]
px-5
sm:px-7
py-2.5
sm:py-3
rounded-lg
text-sm
sm:text-base
font-semibold
transition" onClick={addToList}>
                ❤ Add to List
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full
sm:w-auto
bg-[var(--bg-card-hover)]
hover:bg-[var(--bg-card-hover)]
border
border-[var(--border-color)]
text-[var(--text-primary)]
px-5
sm:px-7
py-2.5
sm:py-3
rounded-lg
text-sm
sm:text-base
font-semibold
transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10 sm:mt-16 lg:mt-20 space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Ratings & Reviews
              {reviews.length > 0 && (
                <span className="ml-2 sm:ml-3 text-[var(--text-muted)] font-normal text-base sm:text-lg">({reviews.length})</span>
              )}
            </h2>
            {isLoggedIn ? (
              <button
                onClick={() => setState(prev => ({ ...prev, showForm: !prev.showForm }))}
                className={`self-start sm:self-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
                  showForm
                    ? "bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)]"
                }`}
              >
                {showForm ? "✕ Cancel" : "+ Write a Review"}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="self-start sm:self-auto bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border-color)] px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors"
              >
                Sign in to review
              </button>
            )}
          </div>

          {showForm && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-3 sm:mb-4">Your Review</h3>
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
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-3 sm:mb-4">Edit Review</h3>
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
          bg-[var(--accent)]
          hover:bg-[var(--accent-hover)]
          text-[var(--text-primary)]
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
            <div className="grid gap-4 sm:gap-6">
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
            <div className="text-center py-14 sm:py-20 border border-dashed border-[var(--border-color)] rounded-2xl">
              <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎬</p>
              <p className="text-[var(--text-secondary)] text-sm sm:text-lg font-medium">No reviews yet</p>
              <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-1">Be the first to share your thoughts on this film.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}