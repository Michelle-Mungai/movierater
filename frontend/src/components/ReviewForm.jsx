import { useState } from "react";
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

  const [overall, setOverall] = useState(
    isEditing ? existingReview.overall : 5
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

    try {
      setSubmitting(true);

      if (isEditing) {
        await api.put(
          `/reviews/${existingReview.id}`,
          {
            overall,
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
            overall,
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
        setOverall(5);
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
      p-4
      sm:p-6
      lg:p-8
      space-y-8
      shadow-xl
      "
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {isEditing ? "Edit Your Review" : "Write a Review"}
        </h2>

        <p className="text-sm text-zinc-400">
          {isEditing
            ? "Update your ratings and thoughts."
            : "Share your thoughts and help other movie lovers."}
        </p>
      </div>

      {/* Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map(({ key, label }) => (
          <div
            key={key}
            className="
            bg-zinc-800/50
            rounded-xl
            p-4
            border border-zinc-700
            "
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">
                {label}
              </p>

              <span className="text-yellow-400 font-bold text-lg">
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

      {/* Overall */}
      <div className="border-t border-zinc-700 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h3 className="text-xl font-bold text-white">
              Overall Rating
            </h3>

            <p className="text-zinc-400 text-sm">
              Your final score
            </p>
          </div>

          <div className="text-4xl font-black text-yellow-400">
            {overall}
            <span className="text-xl text-zinc-500">
              /10
            </span>
          </div>
        </div>

        <RatingStars
          value={overall}
          onChange={setOverall}
          size="lg"
        />
      </div>

      {/* Review Text */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-green-400 mb-2">
            👍 What did you like?
          </label>

          <textarea
            rows={6}
            value={positives}
            onChange={(e) =>
              setPositives(e.target.value)
            }
            placeholder="Story, acting, soundtrack..."
            className="
            w-full
            bg-zinc-800
            border border-zinc-700
            rounded-xl
            p-4
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
          <label className="block text-sm font-semibold text-red-400 mb-2">
            👎 What could be improved?
          </label>

          <textarea
            rows={6}
            value={negatives}
            onChange={(e) =>
              setNegatives(e.target.value)
            }
            placeholder="Anything you disliked..."
            className="
            w-full
            bg-zinc-800
            border border-zinc-700
            rounded-xl
            p-4
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
        rounded-xl
        p-5
        flex
        items-center
        justify-between
        gap-4
        "
      >
        <div>
          <h3 className="font-semibold text-white">
            Would you recommend this?
          </h3>

          <p className="text-zinc-400 text-sm">
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
          w-16
          h-8
          rounded-full
          transition
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
            top-1
            left-1
            w-6
            h-6
            rounded-full
            bg-white
            transition
            ${
              recommendation
                ? "translate-x-8"
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
          py-4
          rounded-xl
          font-bold
          text-lg
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
            px-6
            py-4
            rounded-xl
            font-bold
            text-lg
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