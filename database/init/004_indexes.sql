CREATE INDEX idx_reviews_user
ON reviews(user_id);

CREATE INDEX idx_reviews_tmdb
ON reviews(tmdb_id);

CREATE INDEX idx_reviews_created
ON reviews(created_at DESC);

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_username
ON users(username);