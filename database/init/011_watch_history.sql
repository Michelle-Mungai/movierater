CREATE TABLE watch_history
(
 id UUID PRIMARY KEY
 DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL
 REFERENCES users(id)
 ON DELETE CASCADE,

 tmdb_id INTEGER NOT NULL,

 watched_at TIMESTAMP
 DEFAULT NOW()
);