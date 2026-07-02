INSERT INTO users
(
    username,
    email,
    password_hash,
    role
)
VALUES
(
    'admin',
    'admin@example.com',
    '$2b$10$gQ7Gv8dJ4rR2mGmG2Q1jGu6a0s2U4kP7M4v7uQ0JfQn4wN1w8lS6W',
    'admin'
)
ON CONFLICT DO NOTHING;