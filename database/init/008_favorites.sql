CREATE TABLE favorites
(
 id UUID PRIMARY KEY
 DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL
 REFERENCES users(id)
 ON DELETE CASCADE,

 tmdb_id INTEGER NOT NULL,

 created_at TIMESTAMP
 DEFAULT NOW(),

 UNIQUE(user_id,tmdb_id)
);