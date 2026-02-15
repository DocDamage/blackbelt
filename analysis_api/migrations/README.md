# Database Migrations

This directory contains Alembic database migrations for the Six Sigma Analysis API.

## Setup

1. Install dependencies:
```bash
pip install alembic sqlalchemy
```

2. The database URL is configured via the `DATABASE_URL` environment variable.
   Default: `sqlite:///./six_sigma_analysis.db`

## Commands

### Run migrations (upgrade to latest version)
```bash
alembic upgrade head
```

### Downgrade to previous version
```bash
alembic downgrade -1
```

### Create a new migration
```bash
alembic revision -m "description of changes"
```

### View current version
```bash
alembic current
```

### View migration history
```bash
alembic history
```

## Migration Files

- `001_initial_schema.py` - Initial database schema with analysis_results, users, and api_keys tables

## Database Schema

### analysis_results
Stores analysis results from statistical calculations.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key |
| analysis_type | String | Type of analysis (descriptive, capability, etc.) |
| results | Text | JSON-encoded results |
| metadata | Text | JSON-encoded metadata |
| created_at | DateTime | Creation timestamp |

### users
Stores user accounts for authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key |
| email | String | Unique email address |
| password_hash | String | Hashed password |
| name | String | User's name |
| role | String | User role (user, admin) |
| is_active | Boolean | Account status |
| created_at | DateTime | Creation timestamp |

### api_keys
Stores API keys for programmatic access.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key |
| user_id | String | Foreign key to users |
| name | String | Key name/description |
| key_hash | String | Hashed API key |
| is_active | Boolean | Key status |
| created_at | DateTime | Creation timestamp |
| last_used_at | DateTime | Last usage timestamp |
