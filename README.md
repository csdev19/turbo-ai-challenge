# Turbo AI Challenge — Notes App

A full-stack notes application with a warm, cozy design. Built with Django REST Framework (backend) and Next.js 16 (frontend), connected to a Neon PostgreSQL database.

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Backend  | Django 6, Django REST Framework, SimpleJWT       |
| Frontend | Next.js 16, Tailwind CSS, Lucide React           |
| Database | Neon PostgreSQL (via `dj-database-url`)           |
| Auth     | JWT (access + refresh tokens in HTTP-only cookies)|
| Fonts    | Inria Serif (titles), Inter (body)                |

## Project Structure

```
turbo-ai-challenge/
├── backend/                # Django REST API
│   ├── accounts/           # Auth: register, login, logout, me
│   ├── todos/              # Notes & Categories models + API
│   ├── config/             # Django settings, urls, wsgi
│   ├── .env                # Environment variables (git-ignored)
│   └── requirements.txt
├── frontend/               # Next.js 16 app
│   ├── src/
│   │   ├── app/            # Pages and server actions
│   │   ├── lib/            # Constants, definitions, API helpers
│   │   └── ui/             # Reusable UI components
│   ├── public/             # Images (signup, login, home)
│   └── .env.local          # Environment variables (git-ignored)
└── docs/                   # Documentation
    ├── features/           # Feature documentation
    └── architecture/       # Architecture documentation
```

## Setup

### Prerequisites

- Python 3.12+
- Node.js 20+
- pnpm

### Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and other settings

# Run migrations
python3 manage.py migrate

# Start dev server
python3 manage.py runserver
```

The API runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local — set DJANGO_API_URL=http://localhost:8000

# Start dev server
pnpm dev
```

The app runs at `http://localhost:3000`.

### Environment Variables

#### Backend (`backend/.env`)

| Variable               | Description                          | Default                    |
| ---------------------- | ------------------------------------ | -------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string         | Falls back to SQLite       |
| `DJANGO_SECRET_KEY`    | Django secret key                    | Insecure default for dev   |
| `DJANGO_DEBUG`         | Debug mode                           | `True`                     |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated allowed hosts        | `localhost,127.0.0.1`      |
| `CORS_ALLOWED_ORIGINS` | Comma-separated CORS origins         | `http://localhost:3000`    |

#### Frontend (`frontend/.env.local`)

| Variable         | Description                  | Default                  |
| ---------------- | ---------------------------- | ------------------------ |
| `DJANGO_API_URL` | URL of the Django API server | `http://localhost:8000`  |

## API Endpoints

### Auth (`/api/auth/`)

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| POST   | `/register/`      | Create account       |
| POST   | `/login/`         | Log in (returns JWT) |
| POST   | `/logout/`        | Blacklist refresh token |
| GET    | `/me/`            | Get current user     |
| POST   | `/token/refresh/` | Refresh access token |

### Notes (`/api/`)

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/categories/`      | List categories            |
| POST   | `/categories/`      | Create category            |
| DELETE | `/categories/:id/`  | Delete category            |
| GET    | `/notes/`           | List notes (filter by `?category=id`) |
| POST   | `/notes/`           | Create note                |
| GET    | `/notes/:id/`       | Get note detail            |
| PATCH  | `/notes/:id/`       | Update note                |
| DELETE | `/notes/:id/`       | Delete note                |
