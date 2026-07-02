ALTER TABLE reviews
ADD CONSTRAINT unique_user_movie_review
UNIQUE(user_id, tmdb_id);