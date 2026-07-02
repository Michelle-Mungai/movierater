# Database Setup

Start PostgreSQL:

docker compose up postgres

Connect:

docker exec -it postgres psql -U postgres -d moviereviews

Tables:
- users
- reviews

Views:
- review_statistics
- weekly_review_stats
- user_review_stats