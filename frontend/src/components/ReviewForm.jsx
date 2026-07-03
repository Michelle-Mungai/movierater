import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import RatingStars from "./RatingStars";

const CATEGORIES = [
  { key: "cinematography", label: "Cinematography" },
  { key: "acting", label: "Acting" },
  { key: "storyline", label: "Storyline" },
  { key: "graphics", label: "Visual Effects" },
  { key: "soundtrack", label: "Soundtrack" },
  { key: "rewatch_value", label: "Rewatch Value" },
];

const defaultRatings = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, 5])
);

// Small read-only 10-segment star bar for displaying the computed overall
// score (no onChange — this value isn't directly editable by the user).
function ReadOnlyStars({ value }) {
  const rounded = Math.round(value);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={
            i < rounded ? "text-yellow-400" : "text-zinc-700"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewForm({
  movie,
  mediaType = "movie",
  existingReview = null,
  onSubmitted,
  onCancel,
}) {
  const isEditing = Boolean(existingReview);

  const [ratings, setRatings] = useState(
    isEditing
      ? Object.fromEntries(
          CATEGORIES.map((c) => [
            c.key,
            existingReview[c.key] ?? 5,
          ])
        )
      : defaultRatings
  );

  const [positives, setPositives] = useState(
    isEditing ? existingReview.positives || "" : ""
  );

  const [negatives, setNegatives] = useState(
    isEditing ? existingReview.negatives || "" : ""
  );

  const [recommendation, setRecommendation] = useState(
    isEditing ? Boolean(existingReview.recommendation) : true
  );

  const [submitting, setSubmitting] = useState(false);

  const setRating = (key, value) => {
    setRatings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // CHANGED: overall is no longer a separate manual input. It's derived
  // from the average of the six category scores, updating live as the
  // user adjusts them.
  const overall = useMemo(() => {
    const values = CATEGORIES.map((c) => ratings[c.key]);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    return Math.round(avg * 10) / 10;
  }, [ratings]);

  const submit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first.");
      return;
    }

    if (
      positives.trim().length < 5 &&
      negatives.trim().length < 5
    ) {
      toast.error(
        "Please write at least a short review."
      );
      return;
    }

    // overall is stored as a whole number (1-10) to match the rest of the
    // schema/display, even though we compute it with one decimal of
    // precision for a more accurate live preview.
    const overallToSubmit = Math.round(overall);

    try {
      setSubmitting(true);

      if (isEditing) {
        await api.put(
          `/reviews/${existingReview.id}`,
          {
            overall: overallToSubmit,
            positives,
            negatives,
            recommendation,
            ...ratings,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Review updated!");
      } else {
        await api.post(
          "/reviews",
          {
            tmdb_id: movie.id,
            media_type: mediaType,
            title: movie.title || movie.name,
            poster: movie.poster_path,
            overall: overallToSubmit,
            positives,
            negatives,
            recommendation,
            ...ratings,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Review submitted!");

        setRatings(defaultRatings);
        setPositives("");
        setNegatives("");
        setRecommendation(true);
      }

      onSubmitted?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "submit"} review.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="
      bg-zinc-900
      border border-zinc-800
      rounded-2xl
      p-3
      sm:p-5
      space-y-4
      sm:space-y-5
      shadow-xl
      "
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-white">
          {isEditing ? "Edit Your Review" : "Write a Review"}
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400">
          {isEditing
            ? "Update your ratings and thoughts."
            : "Share your thoughts and help other movie lovers."}
        </p>
      </div>

      {/* Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
        {CATEGORIES.map(({ key, label }) => (
          <div
            key={key}
            className="
            bg-zinc-800/50
            rounded-lg
            p-2.5
            sm:p-3
            border border-zinc-700
            "
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-xs sm:text-sm font-medium">
                {label}
              </p>

              <span className="text-yellow-400 font-bold text-xs sm:text-sm">
                {ratings[key]}/10
              </span>
            </div>

            <RatingStars
              value={ratings[key]}
              onChange={(v) =>
                setRating(key, v)
              }
              size="sm"
            />
          </div>
        ))}
      </div>

      {/* Overall — computed, not editable */}
      <div className="border-t border-zinc-700 pt-4 sm:pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Overall Rating
            </h3>
          </div>

          <div className="text-xl sm:text-2xl font-bold text-yellow-400">
            {overall.toFixed(1)}
            <span className="text-sm text-zinc-500">
              /10
            </span>
          </div>
        </div>

        <ReadOnlyStars value={overall} />
      </div>

      {/* Review Text */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-green-400 mb-1.5">
            👍 What did you like?
          </label>

          <textarea
            rows={2}
            value={positives}
            onChange={(e) =>
              setPositives(e.target.value)
            }
            placeholder="Story, acting, soundtrack..."
            className="
            w-full
            bg-zinc-800
            border border-zinc-700
            rounded-lg
            p-2
            text-sm
            text-white
            placeholder:text-zinc-500
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-red-600
            "
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-red-400 mb-1.5">
            👎 What could be improved?
          </label>

          <textarea
            rows={2}
            value={negatives}
            onChange={(e) =>
              setNegatives(e.target.value)
            }
            placeholder="Anything you disliked..."
            className="
            w-full
            bg-zinc-800
            border border-zinc-700
            rounded-lg
            p-2
            text-sm
            text-white
            placeholder:text-zinc-500
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-red-600
            "
          />
        </div>
      </div>

      {/* Recommend */}
      <div
        className="
        bg-zinc-800
        border border-zinc-700
        rounded-lg
        p-2
        sm:p-3
        flex
        items-center
        justify-between
        gap-2
        "
      >
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-white">
            Would you recommend this?
          </h3>

          <p className="text-zinc-500 text-xs">
            Let other users know if it's worth watching.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setRecommendation(!recommendation)
          }
          className={`
          relative
          w-12
          h-6
          sm:w-14
          sm:h-7
          rounded-full
          transition
          shrink-0
          ${
            recommendation
              ? "bg-red-600"
              : "bg-zinc-600"
          }
          `}
        >
          <span
            className={`
            absolute
            top-0.5
            left-0.5
            w-5
            h-5
            sm:w-6
            sm:h-6
            rounded-full
            bg-white
            transition
            ${
              recommendation
                ? "translate-x-6 sm:translate-x-7"
                : ""
            }
            `}
          />
        </button>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          disabled={submitting}
          className="
          flex-1
          py-2.5
          sm:py-3
          rounded-lg
          font-semibold
          text-sm
          sm:text-base
          bg-red-600
          hover:bg-red-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
          shadow-lg
          shadow-red-900/30
          "
        >
          {submitting
            ? isEditing
              ? "Saving Changes..."
              : "Submitting Review..."
            : isEditing
              ? "Save Changes"
              : "Submit Review"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="
            px-4
            sm:px-6
            py-2.5
            sm:py-3
            rounded-lg
            font-semibold
            text-sm
            sm:text-base
            bg-zinc-800
            hover:bg-zinc-700
            transition
            "
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}