# Authentication

## What It Does

Email-based signup and login. Users register with email + password (no username required). Passwords are validated for minimum length, at least one letter, and at least one number. Authentication uses JWT tokens stored in HTTP-only cookies.

## Flow

1. User submits email + password on `/signup` or `/login`
2. Next.js Server Action validates input with Zod, then calls Django API
3. Django returns JWT tokens (access + refresh)
4. Server Action stores tokens in HTTP-only cookies
5. Middleware (`proxy.ts`) protects `/dashboard` routes — redirects to `/login` if no token
6. `getMe()` fetches the current user, auto-refreshes expired access tokens

## Pages

| Route     | Title              | Description                           |
| --------- | ------------------ | ------------------------------------- |
| `/signup` | Yay, New Friend!   | Email + password, links to login      |
| `/login`  | Yay, You're Back!  | Email + password, links to signup     |

## Backend

- **Register** — `POST /api/auth/register/` — creates user with auto-generated username from email prefix
- **Login** — `POST /api/auth/login/` — looks up user by email, authenticates by username
- **Logout** — `POST /api/auth/logout/` — blacklists refresh token
- **Me** — `GET /api/auth/me/` — returns current user (requires valid access token)
- **Refresh** — `POST /api/auth/token/refresh/` — issues new access token

## Decisions

| Decision | Why |
|----------|-----|
| Email-based auth (no username field) | Figma design only shows email + password |
| Auto-generate username from email prefix | Django's User model requires a username; derived from email avoids extra form field |
| JWT in HTTP-only cookies | Secure against XSS; Server Actions can read them on the server side |
| BFF pattern (Server Actions proxy Django) | Avoids CORS/cookie issues; frontend never talks directly to Django |

## Gotchas

- `deleteSession()` wraps cookie deletion in try/catch — cookies can only be mutated in Server Actions, not during Server Component rendering
- When switching databases (e.g. SQLite to Neon), old JWT cookies become invalid — users must clear cookies or sign up again
- `getMe()` silently returns `null` on auth failure during rendering; the page then redirects to `/login`
