# Database — Neon PostgreSQL

## Overview

The app uses Neon serverless PostgreSQL in production, with SQLite as a local fallback when no `DATABASE_URL` is set.

## Connection

Configured via `dj-database-url` in `config/settings.py`:

```python
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///' + str(BASE_DIR / 'db.sqlite3'),
        conn_max_age=600,
    )
}
```

The `DATABASE_URL` environment variable is loaded from `backend/.env` by `python-dotenv`.

## Schema

### auth_user (Django built-in)

Standard Django user model. Username is auto-generated from email prefix on registration.

### todos_category

| Column | Type         | Constraints                |
| ------ | ------------ | -------------------------- |
| id     | serial (PK)  | Auto                       |
| user_id| int (FK)     | → auth_user, CASCADE       |
| name   | varchar(100) | Not null                   |
| color  | varchar(7)   | Default `#D4903C`          |

### todos_note

| Column      | Type          | Constraints                    |
| ----------- | ------------- | ------------------------------ |
| id          | serial (PK)   | Auto                           |
| user_id     | int (FK)      | → auth_user, CASCADE           |
| category_id | int (FK)      | → todos_category, SET NULL, nullable |
| title       | varchar(255)  | Default empty, blank allowed   |
| content     | text          | Default empty, blank allowed   |
| created_at  | timestamptz   | Auto on create                 |
| updated_at  | timestamptz   | Auto on save                   |

## Migrations

Two migrations exist:
1. `0001_initial.py` — original Todo model (now deleted)
2. `0002_category_note_delete_todo.py` — creates Category + Note, drops Todo

## Neon-Specific Notes

- Connection uses `sslmode=require`
- Connection pooling is handled by Neon's pooler endpoint (the `-pooler` suffix in the hostname)
- `conn_max_age=600` keeps connections alive for 10 minutes to reduce cold start latency
