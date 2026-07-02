CREATE TABLE IF NOT EXISTS reviews
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    tmdb_id INTEGER NOT NULL,

    title TEXT NOT NULL,

    poster TEXT,

    cinematography INTEGER NOT NULL CHECK (cinematography BETWEEN 1 AND 5),

    actors INTEGER NOT NULL CHECK (actors BETWEEN 1 AND 5),

    acting INTEGER NOT NULL CHECK (acting BETWEEN 1 AND 5),

    graphics INTEGER NOT NULL CHECK (graphics BETWEEN 1 AND 5),

    storyline INTEGER NOT NULL CHECK (storyline BETWEEN 1 AND 5),

    soundtrack INTEGER NOT NULL CHECK (soundtrack BETWEEN 1 AND 5),

    rewatch_value INTEGER NOT NULL CHECK (rewatch_value BETWEEN 1 AND 5),

    overall INTEGER NOT NULL CHECK (overall BETWEEN 1 AND 5),

    positives TEXT,

    negatives TEXT,

    recommendation BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);