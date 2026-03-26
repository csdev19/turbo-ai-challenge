# Turbo AI Challenge — Notes App

Full-stack notes app: Django REST backend + Next.js 16 frontend, connected to Neon PostgreSQL.

## Workflow

thinking → plan → execute → document → commit

## Project Structure

- `backend/` — Django 6 REST API (accounts + notes/categories)
- `frontend/` — Next.js 16 App Router with Server Actions
- `docs/` — feature docs, architecture docs, plans

## Design System (from Figma)

### Colors

| Name   | Hex       | Usage                    |
|--------|-----------|--------------------------|
| accent | `#957139` | Borders, button text     |
| cream  | `#FAF1E3` | Page backgrounds         |
| heading| `#88642A` | Auth page headings       |
| orange | `#EF9C66` | Category color           |
| yellow | `#FCDC94` | Category color           |
| green  | `#C8CFA0` | Category color           |
| teal   | `#78ABA8` | Category color           |

### Fonts

- **Inria Serif** (Bold 700) — note titles, auth headings
- **Inter** (Regular 400) — body text, UI labels

## Auth

Email-based (no username). JWT stored in HTTP-only cookies. Server Actions proxy all Django API calls (BFF pattern).

## Key Conventions

- All category colors and font constants live in `frontend/src/lib/constants.ts`
- Reusable UI components in `frontend/src/ui/` (Paper, CategorySelect, NoteCard, Fab)
- Backend `.env` loaded via `python-dotenv`, parsed by `dj-database-url`
- Frontend `.env.local` has `DJANGO_API_URL`

## Running

```bash
# Backend
cd backend && source venv/bin/activate && python3 manage.py runserver

# Frontend
cd frontend && pnpm dev
```

## Testing

```bash
# Backend (27 pytest tests, uses SQLite)
cd backend && pytest -v

# Frontend unit (31 Vitest tests)
cd frontend && pnpm test

# Frontend e2e (Playwright, needs both servers running)
cd frontend && pnpm test:e2e
```

## Gotchas

- Django app is named `todos` but handles Notes + Categories (renamed from original concept)
- `deleteSession()` is wrapped in try/catch — cookies can't be mutated during Server Component rendering
- Switching databases invalidates existing JWT cookies — users must re-authenticate
- Logout endpoint returns 205 (Reset Content), not 200
- `getCategoryCardStyle()` falls back to `${color}80` for unrecognized hex values
