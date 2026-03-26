# API Test Plan

## 1. Overview

This document defines the testing strategy for the Django REST API backend. The goal of this first iteration is to establish the testing infrastructure and cover the **happy path** for every endpoint. Error cases, edge cases, and permission boundaries will be added in future iterations.

Goals:

- Validate that every endpoint returns the correct status code and response shape on valid input.
- Confirm JWT authentication flow works end-to-end (register, login, access protected routes, refresh, logout).
- Confirm per-user data isolation for notes and categories.
- Keep the test suite fast enough to run on every push in CI.

## 2. Tech Stack

| Tool | Purpose |
|---|---|
| **pytest** | Test runner. Provides cleaner assertions, parametrize, and fixtures over unittest. |
| **pytest-django** | Django integration for pytest: `@pytest.mark.django_db`, `client` fixture, settings override. |
| **Django REST Framework's `APIClient`** | Makes authenticated requests with JWT tokens. |
| **factory-boy** *(optional, later)* | Model factories for generating test data. Not needed in iteration 1 since fixtures are simple. |

### Why pytest-django over Django's built-in TestCase

- **Fixtures over setUp/tearDown** -- pytest fixtures are composable, reusable across files via `conftest.py`, and support scoping (function, session).
- **`parametrize`** -- allows testing multiple input/output combinations without duplicating test functions.
- **Better output** -- clearer failure diffs and shorter boilerplate.
- **Plugin ecosystem** -- coverage, parallel execution (`pytest-xdist`), and more.

## 3. Test Database Strategy

**Approach: SQLite in-memory, not Postgres.**

When pytest-django runs, Django automatically creates a throwaway test database. By overriding `DATABASES` in the test settings to use SQLite (`:memory:`), we get:

- **Speed** -- no disk I/O, no container startup. The full suite runs in seconds.
- **Zero infrastructure** -- no Postgres service needed locally or in CI. No Docker dependency for tests.
- **Isolation** -- each test run starts clean; the database only exists in RAM for the duration of the process.

Configuration in `conftest.py` or a `pytest.ini` / `pyproject.toml`:

```python
# backend/conftest.py
import django
from django.conf import settings

@pytest.fixture(scope="session", autouse=True)
def _use_sqlite(tmp_path_factory):
    settings.DATABASES["default"] = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
```

Or, more simply, via `@pytest.fixture` with `settings` override:

```ini
# backend/pytest.ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings

# Django will auto-create a test_ prefixed DB.
# With SQLite default, this is already in-memory.
```

Since the project's `settings.py` already falls back to SQLite when no `DATABASE_URL` is set (`default='sqlite:///' + str(BASE_DIR / 'db.sqlite3')`), tests will use SQLite automatically as long as the `DATABASE_URL` env var is absent in the test environment. In CI, we simply do not set `DATABASE_URL`.

### Why not Postgres for tests

- Adds a service dependency to CI (Postgres container).
- Slower setup/teardown per run.
- We are not using Postgres-specific features (no `JSONField` lookups, no full-text search, no array fields). The ORM queries are fully portable to SQLite.
- If Postgres-specific features are added later, we can introduce a Postgres test target as a separate CI job.

## 4. Fixture Strategy

All reusable fixtures live in `backend/conftest.py`. Tests import them implicitly through pytest's fixture discovery.

| Fixture | Scope | Returns | Description |
|---|---|---|---|
| `user_data` | function | `dict` | Raw email/password dict for registration payloads. |
| `user` | function | `User` | A saved `User` instance created via the ORM. |
| `api_client` | function | `APIClient` | An unauthenticated DRF `APIClient`. |
| `auth_client` | function | `APIClient` | An `APIClient` with a valid JWT `Authorization` header set, using `user`. |
| `tokens` | function | `dict` | `{"access": "...", "refresh": "..."}` obtained by calling the login endpoint for `user`. |
| `category` | function | `Category` | A saved `Category` belonging to `user`. |
| `note` | function | `Note` | A saved `Note` belonging to `user`, optionally linked to `category`. |

Example `conftest.py` sketch:

```python
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from todos.models import Category, Note


@pytest.fixture
def user_data():
    return {"email": "test@example.com", "password": "securepass123"}


@pytest.fixture
def user(user_data):
    return User.objects.create_user(
        username="testuser",
        email=user_data["email"],
        password=user_data["password"],
    )


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.fixture
def tokens(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


@pytest.fixture
def category(user):
    return Category.objects.create(user=user, name="Work", color="#3B82F6")


@pytest.fixture
def note(user, category):
    return Note.objects.create(
        user=user, category=category, title="My Note", content="Some content"
    )
```

## 5. Test Matrix

The table below lists every endpoint and what is tested in **iteration 1** (happy path only). The "Status" column marks what ships now vs. what is deferred.

### Auth Endpoints (`/api/auth/`)

| Method | Endpoint | Test Name | What It Validates | Status |
|---|---|---|---|---|
| POST | `/register/` | `test_register_success` | 201, returns `user` + `tokens`, user exists in DB. | Now |
| POST | `/register/` | `test_register_duplicate_email` | 400 when email already taken. | Later |
| POST | `/register/` | `test_register_short_password` | 400 when password < 8 chars. | Later |
| POST | `/login/` | `test_login_success` | 200, returns `user` + `tokens`, tokens are valid JWTs. | Now |
| POST | `/login/` | `test_login_wrong_password` | 400 with invalid credentials. | Later |
| POST | `/login/` | `test_login_nonexistent_email` | 400 with invalid credentials. | Later |
| POST | `/logout/` | `test_logout_success` | 205, refresh token is blacklisted (cannot be reused). | Now |
| POST | `/logout/` | `test_logout_missing_token` | 400 when no refresh token provided. | Later |
| GET | `/me/` | `test_me_authenticated` | 200, returns current user's `id`, `email`, `username`. | Now |
| GET | `/me/` | `test_me_unauthenticated` | 401 when no token provided. | Later |
| POST | `/token/refresh/` | `test_token_refresh_success` | 200, returns new access (and rotated refresh) token. | Now |
| POST | `/token/refresh/` | `test_token_refresh_blacklisted` | 401 when refresh token has been blacklisted. | Later |

### Category Endpoints (`/api/categories/`)

| Method | Endpoint | Test Name | What It Validates | Status |
|---|---|---|---|---|
| GET | `/categories/` | `test_list_categories` | 200, returns list scoped to authenticated user, includes `note_count`. | Now |
| POST | `/categories/` | `test_create_category` | 201, category saved with correct `name`, `color`, belongs to user. | Now |
| POST | `/categories/` | `test_create_category_default_color` | 201, `color` defaults to `#D4903C` when omitted. | Later |
| DELETE | `/categories/:id/` | `test_delete_category` | 204, category removed from DB. | Now |
| DELETE | `/categories/:id/` | `test_delete_category_not_found` | 404 when ID does not exist or belongs to another user. | Later |
| GET | `/categories/` | `test_categories_isolation` | User A cannot see User B's categories. | Later |

### Note Endpoints (`/api/notes/`)

| Method | Endpoint | Test Name | What It Validates | Status |
|---|---|---|---|---|
| GET | `/notes/` | `test_list_notes` | 200, returns notes for authenticated user, ordered by `-updated_at`. | Now |
| GET | `/notes/?category=id` | `test_list_notes_filter_category` | 200, returns only notes matching the category filter. | Now |
| POST | `/notes/` | `test_create_note` | 201, note saved with `title`, `content`, `category`, belongs to user. | Now |
| POST | `/notes/` | `test_create_note_no_category` | 201, note saved with `category` as null. | Later |
| GET | `/notes/:id/` | `test_get_note` | 200, returns full note with `category_name` and `category_color`. | Now |
| PATCH | `/notes/:id/` | `test_update_note` | 200, partial update changes only the provided fields. | Now |
| DELETE | `/notes/:id/` | `test_delete_note` | 204, note removed from DB. | Now |
| GET | `/notes/:id/` | `test_get_note_not_found` | 404 when ID does not exist or belongs to another user. | Later |
| GET | `/notes/` | `test_notes_isolation` | User A cannot see User B's notes. | Later |
| DELETE | `/categories/:id/` | `test_delete_category_nullifies_notes` | Notes linked to deleted category have `category` set to null. | Later |

## 6. CI/CD Pipeline

Tests run on every push and pull request via **GitHub Actions**.

### Workflow Description

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [main]
    paths: [backend/**]
  pull_request:
    branches: [main]
    paths: [backend/**]

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.13"

      - name: Install dependencies
        run: |
          pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-django

      - name: Run tests
        run: pytest --tb=short -q
```

Key points:

- **No Postgres service block** -- SQLite in-memory means zero infrastructure.
- **`paths` filter** -- the workflow only triggers when backend code changes, saving CI minutes.
- **`working-directory: backend`** -- all commands run relative to the backend folder.
- **`--tb=short -q`** -- concise output in CI logs; switch to `--tb=long -v` for debugging failures.

## 7. Running Tests Locally

From the project root:

```bash
cd backend

# One-time setup (if not already installed)
pip install pytest pytest-django

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run a specific test file
pytest accounts/tests.py

# Run a single test by name
pytest -k "test_login_success"

# Run with coverage (requires pytest-cov)
pip install pytest-cov
pytest --cov=accounts --cov=todos --cov-report=term-missing
```

Required config file (one of these):

```ini
# backend/pytest.ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings
pythonpath = .
```

Make sure `DATABASE_URL` is **not** set in your shell environment so Django falls back to SQLite.

## 8. Future Iterations

### Iteration 2 -- Error Cases and Permissions

- All "Later" rows from the test matrix above.
- 401 on every protected endpoint when no token is sent.
- 403 / 404 when accessing another user's resources (data isolation).
- Validation errors: missing fields, invalid types, too-long strings.

### Iteration 3 -- Edge Cases

- Token expiration handling (mock time to expire access tokens).
- Concurrent requests / race conditions (duplicate category names).
- Pagination if added to list endpoints.
- Ordering and search filters.

### Iteration 4 -- Infrastructure and Quality

- **factory-boy** factories to replace manual `objects.create()` calls.
- **pytest-cov** with minimum coverage threshold enforced in CI.
- **pytest-xdist** for parallel test execution if suite grows.
- **Postgres CI job** as a separate workflow job to catch DB-specific issues if Postgres features are used.

### Iteration 5 -- Frontend Tests

- Vitest / React Testing Library for component tests.
- Cypress or Playwright for E2E tests against the running API.
- Separate CI workflow for frontend.
