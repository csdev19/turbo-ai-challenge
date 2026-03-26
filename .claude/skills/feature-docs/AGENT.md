# Feature Docs — Agent Memory

Last Updated: 2026-03-25 (global seeded categories, CLAUDE.md files, error handling)

---

## Project Map

| Doc Path                             | Topic                                                                  | Last Updated |
| ------------------------------------ | ---------------------------------------------------------------------- | ------------ |
| `docs/features/auth.md`             | Auth — email-based signup/login, JWT in HTTP-only cookies, BFF pattern  | 2026-03-25   |
| `docs/features/notes.md`            | Notes & Categories — CRUD, auto-save, global seeded categories         | 2026-03-25   |
| `docs/plans/frontend-tests.md`     | Frontend test plan — Vitest unit + Playwright e2e                      | 2026-03-25   |
| `docs/features/ui-design-system.md` | Design system — Figma colors, fonts, UI components (Paper, Select, etc)| 2026-03-25   |
| `docs/architecture/backend.md`      | Django apps (accounts, todos), models, auth flow, deployment           | 2026-03-25   |
| `docs/architecture/frontend.md`     | Next.js 16 structure, Server Actions, BFF, route protection            | 2026-03-25   |
| `docs/architecture/database.md`     | Neon PostgreSQL setup, schema, migrations, SQLite fallback             | 2026-03-25   |
| `docs/plans/api-tests.md`           | Test plan — pytest-django, SQLite in-memory, CI pipeline               | 2026-03-25   |
| `docs/WORKFLOW.md`                  | Dev workflow — thinking → plan → execute → document → commit           | 2026-03-25   |

---

## Recent Decisions

| Decision                                    | Why                                                        | Date       |
| ------------------------------------------- | ---------------------------------------------------------- | ---------- |
| Global seeded categories (not per-user)    | Figma shows 3 fixed categories; simplifies the model       | 2026-03-25 |
| djangoFetch try/catch for connection errors | Server crashes if Django is down; now returns graceful error| 2026-03-25 |
| Email-based auth (no username field)        | Figma only shows email + password                          | 2026-03-25 |
| BFF pattern (Server Actions proxy Django)   | Avoids CORS/cookie issues; JWT stays server-side           | 2026-03-25 |
| Neon PostgreSQL via dj-database-url         | Cloud-hosted, serverless, falls back to SQLite locally     | 2026-03-25 |
| Figma colors centralized in constants.ts    | Single source of truth for #EF9C66, #FCDC94, #C8CFA0, #78ABA8 | 2026-03-25 |
| pytest-django over Django TestCase          | Modern fixtures, parametrize, better output                | 2026-03-25 |
| SQLite in-memory for tests                  | Fast, no Neon dependency in CI, Django auto-manages it     | 2026-03-25 |
| Reusable UI components in src/ui/           | Paper, CategorySelect, NoteCard, Fab — used across pages   | 2026-03-25 |

---

## Domain Vocabulary

| Term           | Meaning                                                     |
| -------------- | ----------------------------------------------------------- |
| Note           | A user's text entry with title, content, optional category  |
| Category       | A label with name + hex color to organize notes             |
| Paper          | UI component — colored card background matching category    |
| BFF            | Backend-For-Frontend — Server Actions proxy Django API      |
| CategorySelect | Dropdown UI for picking a note's category                   |

---

## Known Gotchas

- `deleteSession()` must be wrapped in try/catch — cookies can only be mutated in Server Actions, not during Server Component rendering
- Switching databases (SQLite → Neon) invalidates existing JWT cookies — users must re-authenticate
- The Django app is named `todos` but handles Notes and Categories (renamed from original todo concept)
- `getCategoryCardStyle()` falls back to `${color}80` for unrecognized hex values — handles legacy category colors
- Logout endpoint returns 205 (Reset Content), not 200
- After `manage.py flush`, must run `migrate` again to re-seed default categories
- Category name has a unique constraint — tests must use `get_or_create` or `get`, not `create` for seeded categories

---

## Open Questions

None currently.
