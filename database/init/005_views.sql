CREATE OR REPLACE VIEW review_statistics AS

SELECT

    tmdb_id,

    title,

    COUNT(*) AS total_reviews,

    ROUND(AVG(cinematography),2) AS avg_cinematography,

    ROUND(AVG(actors),2) AS avg_actors,

    ROUND(AVG(acting),2) AS avg_acting,

    ROUND(AVG(graphics),2) AS avg_graphics,

    ROUND(AVG(storyline),2) AS avg_storyline,

    ROUND(AVG(soundtrack),2) AS avg_soundtrack,

    ROUND(AVG(rewatch_value),2) AS avg_rewatch,

    ROUND(AVG(overall),2) AS avg_overall

FROM reviews

GROUP BY
    tmdb_id,
    title;


CREATE OR REPLACE VIEW weekly_review_stats AS

SELECT

    DATE_TRUNC('week', created_at) AS week_start,

    COUNT(*) AS reviews_count,

    ROUND(AVG(overall),2) AS average_rating

FROM reviews

GROUP BY DATE_TRUNC('week', created_at)

ORDER BY week_start DESC;


CREATE OR REPLACE VIEW user_review_stats AS

SELECT

    u.id,

    u.username,

    COUNT(r.id) AS reviews_written,

    ROUND(AVG(r.overall),2) AS average_rating

FROM users u

LEFT JOIN reviews r
ON u.id = r.user_id

GROUP BY
    u.id,
    u.username;