# Backend — Django REST API

Django 6 + DRF + SimpleJWT, connected to Neon PostgreSQL.

## Apps

### accounts (`/api/auth/`)

Email-based auth. Username is auto-generated from email prefix on registration.

| Endpoint          | Method | Description              |
|-------------------|--------|--------------------------|
| `/register/`      | POST   | Create account           |
| `/login/`         | POST   | Login (returns JWT)      |
| `/logout/`        | POST   | Blacklist refresh token (returns 205) |
| `/me/`            | GET    | Current user             |
| `/token/refresh/` | POST   | Refresh access token     |

### todos (`/api/`)

Despite the name, this handles **Notes and Categories**.

| Endpoint            | Method       | Description                    |
|---------------------|--------------|--------------------------------|
| `/categories/`      | GET, POST    | List/create categories         |
| `/categories/:id/`  | DELETE       | Delete category                |
| `/notes/`           | GET, POST    | List/create notes (`?category=id`) |
| `/notes/:id/`       | GET, PATCH, DELETE | Get/update/delete note   |

## Models

- **Category**: name, color (hex), user (FK)
- **Note**: title, content, category (FK, nullable SET_NULL), user (FK), created_at, updated_at

## Database

`DATABASE_URL` env var parsed by `dj-database-url`. Falls back to SQLite if not set.

```bash
# .env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

## Running

```bash
source venv/bin/activate
python3 manage.py runserver
```

## Testing

```bash
source venv/bin/activate
pytest -v
```

Tests use SQLite in-memory automatically (set in `conftest.py`). No Neon connection needed.

## Key Files

| File | Purpose |
|------|---------|
| `config/settings.py` | Django settings, loads `.env` via python-dotenv |
| `conftest.py` | Shared pytest fixtures (user, auth_client, category, note) |
| `accounts/serializers.py` | Email-based register/login serializers |
| `todos/models.py` | Category + Note models |
| `todos/views.py` | CRUD API views |
