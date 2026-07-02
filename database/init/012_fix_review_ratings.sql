-- 012_fix_review_ratings.sql
--
-- The frontend review form (RatingStars) collects ratings on a 1-10 scale,
-- but the original CHECK constraints only allowed 1-5, so every review
-- submission was rejected by Postgres. This migration widens the allowed
-- range to match the UI.
--
-- The "actors" column was never collected by the UI (it was superseded by
-- "acting") but was left as NOT NULL, which also caused every insert to
-- fail. We make it nullable instead of dropping it so existing views
-- (review_statistics) keep working without modification.

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_cinematography_check;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_actors_check;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_acting_check;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_graphics_check;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_storyline_check;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_soundtrack_check;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_rewatch_value_check;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_overall_check;

ALTER TABLE reviews ALTER COLUMN actors DROP NOT NULL;

ALTER TABLE reviews ADD CONSTRAINT reviews_cinematography_check CHECK (cinematography BETWEEN 1 AND 10);
ALTER TABLE reviews ADD CONSTRAINT reviews_actors_check CHECK (actors IS NULL OR actors BETWEEN 1 AND 10);
ALTER TABLE reviews ADD CONSTRAINT reviews_acting_check CHECK (acting BETWEEN 1 AND 10);
ALTER TABLE reviews ADD CONSTRAINT reviews_graphics_check CHECK (graphics BETWEEN 1 AND 10);
ALTER TABLE reviews ADD CONSTRAINT reviews_storyline_check CHECK (storyline BETWEEN 1 AND 10);
ALTER TABLE reviews ADD CONSTRAINT reviews_soundtrack_check CHECK (soundtrack BETWEEN 1 AND 10);
ALTER TABLE reviews ADD CONSTRAINT reviews_rewatch_value_check CHECK (rewatch_value BETWEEN 1 AND 10);
ALTER TABLE reviews ADD CONSTRAINT reviews_overall_check CHECK (overall BETWEEN 1 AND 10);
