-- 014_reviews_media_type.sql
--
-- TMDB's movie IDs and TV IDs are separate namespaces that can collide
-- (e.g. movie #100 and TV show #100 are unrelated). The reviews table
-- only ever stored tmdb_id with no way to tell which namespace it came
-- from, so any code trying to use a review's tmdb_id against the wrong
-- TMDB endpoint (e.g. calling /movie/:id/recommendations for a review
-- that was actually a TV show) could silently return wrong or empty
-- results. This adds the missing type flag.
--
-- Existing rows default to 'movie' since that's the majority case;
-- any existing TV reviews will need to be re-saved to get corrected,
-- but all new reviews from this point on will be tagged correctly by
-- the frontend/backend changes shipped alongside this migration.

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS media_type VARCHAR(10) NOT NULL DEFAULT 'movie';

ALTER TABLE reviews
  ADD CONSTRAINT reviews_media_type_check
  CHECK (media_type IN ('movie', 'tv'));
