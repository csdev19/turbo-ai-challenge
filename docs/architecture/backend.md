# Backend Architecture

## Overview

Django 6 REST API with two apps: `accounts` (auth) and `todos` (notes + categories). Uses Django REST Framework for API views and SimpleJWT for token-based authentication.

## Apps

### accounts

Handles user registration, login, logout, and profile retrieval.

| File              | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `serializers.py`  | RegisterSerializer (email-based), LoginSerializer, UserSerializer |
| `views.py`        | RegisterView, LoginView, LogoutView, MeView          |
| `urls.py`         | Routes under `/api/auth/`                            |

### todos

Despite the name, this app handles **Notes and Categories** (renamed from the original todo concept).

| File              | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `models.py`       | Category and Note models                             |
| `serializers.py`  | CategorySerializer (with note_count), NoteSerializer (with category_name, category_color) |
| `views.py`        | CategoryListCreateView, CategoryDetailView, NoteListCreateView, NoteDetailView |
| `urls.py`         | Routes under `/api/categories/` and `/api/notes/`    |

## Authentication Flow

1. Register/Login returns `{ user, tokens: { access, refresh } }`
2. All protected endpoints require `Authorization: Bearer <access_token>`
3. Access tokens expire after 30 minutes
4. Refresh tokens expire after 7 days and support blacklisting on logout

## Settings

Key configuration in `config/settings.py`:

- **Database** — `dj_database_url.config()` reads `DATABASE_URL` env var, falls back to SQLite
- **CORS** — `django-cors-headers` with configurable allowed origins
- **JWT** — SimpleJWT with token blacklisting enabled
- **Environment** — `python-dotenv` loads `backend/.env` automatically

## Deployment

A `Procfile` is included for Railway/Heroku: `web: gunicorn config.wsgi`

Set these env vars in production:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `DJANGO_SECRET_KEY` — a strong random key
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS` — your domain
- `CORS_ALLOWED_ORIGINS` — your frontend URL
