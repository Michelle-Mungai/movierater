import { useState } from "react";

export default function RatingStars({
  value = 0,
  onChange,
  size = "md",
  readOnly = false,
}) {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: "w-4 h-4 sm:w-5 sm:h-5",
    md: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8",
    lg: "w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11",
  };

  const activeValue = hover || value;

  return (
    <div
      className="flex flex-wrap items-center gap-1 sm:gap-1.5"
      role="radiogroup"
      aria-label="Rating"
    >
      {[...Array(10)].map((_, index) => {
        const star = index + 1;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`${star} Star${star > 1 ? "s" : ""}`}
            aria-checked={value === star}
            role="radio"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onFocus={() => !readOnly && setHover(star)}
            onBlur={() => !readOnly && setHover(0)}
            className={`
              ${sizes[size]}
              transition-all
              duration-300
              ${
                star <= activeValue
                  ? "text-yellow-400 scale-110"
                  : "text-[var(--text-muted)]"
              }
              ${
                readOnly
                  ? "cursor-default"
                  : "cursor-pointer hover:scale-125 hover:text-yellow-300 active:scale-95"
              }
            `}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full drop-shadow-md"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}

      {/* Numeric Rating */}

      <span
        className="
        ml-2
        text-xs
        sm:text-sm
        font-semibold
        text-yellow-400
        whitespace-nowrap
        "
      >
        {activeValue}/10
      </span>
    </div>
  );
}