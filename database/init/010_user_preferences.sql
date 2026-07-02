CREATE TABLE user_preferences
(
 user_id UUID PRIMARY KEY
 REFERENCES users(id)
 ON DELETE CASCADE,

 cinematography_avg NUMERIC(3,2) DEFAULT 0,

 actors_avg NUMERIC(3,2) DEFAULT 0,

 acting_avg NUMERIC(3,2) DEFAULT 0,

 graphics_avg NUMERIC(3,2) DEFAULT 0,

 storyline_avg NUMERIC(3,2) DEFAULT 0,

 soundtrack_avg NUMERIC(3,2) DEFAULT 0,

 rewatch_value_avg NUMERIC(3,2) DEFAULT 0,

 overall_avg NUMERIC(3,2) DEFAULT 0,

 reviews_count INTEGER DEFAULT 0,

 updated_at TIMESTAMP DEFAULT NOW()
);