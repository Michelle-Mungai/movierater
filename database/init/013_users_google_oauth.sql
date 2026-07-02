-- 013_users_google_oauth.sql
--
-- The application code (user.repository.js, passport.js) has always
-- referenced a "google_id" column on users for Google OAuth sign-in, but
-- that column was never created in the schema, so every Google login or
-- registration failed with "column google_id does not exist".
--
-- password_hash must also become nullable: a user who signs up purely
-- through Google never sets a local password.

ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
