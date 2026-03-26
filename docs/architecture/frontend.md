# Frontend Architecture

## Overview

Next.js 16 app using the App Router with Server Components, Server Actions, and middleware-based route protection. Follows the BFF (Backend-For-Frontend) pattern — the frontend never calls Django directly from the browser.

## Directory Structure

```
src/
├── app/
│   ├── (auth)/              # Auth route group (shared layout)
│   │   ├── layout.tsx       # Centered cream background, 384px max-width
│   │   ├── login/           # Login page + form
│   │   └── signup/          # Signup page + form
│   ├── dashboard/
│   │   ├── page.tsx         # Notes list (server component, fetches data)
│   │   ├── notes-layout.tsx # Client: grid + sidebar + empty state
│   │   ├── categories-sidebar.tsx # Client: category list + create form
│   │   └── note/[id]/
│   │       ├── page.tsx     # Note detail (server component)
│   │       └── note-editor.tsx # Client: full-page editor with auto-save
│   ├── actions/
│   │   ├── auth.ts          # Server Actions: signup, login, logout, getMe
│   │   └── notes.ts         # Server Actions: CRUD for notes + categories
│   ├── layout.tsx           # Root layout: Inter + Inria Serif fonts
│   └── page.tsx             # Redirects to /signup
├── lib/
│   ├── api.ts               # djangoFetch helper (proxies to Django)
│   ├── constants.ts         # Colors, fonts, category card styles
│   ├── definitions.ts       # TypeScript types + Zod schemas
│   └── session.ts           # Cookie-based JWT session management
├── ui/
│   ├── paper.tsx            # Colored card wrapper
│   ├── category-select.tsx  # Category dropdown
│   ├── note-card.tsx        # Note preview card
│   └── fab.tsx              # Floating action button
└── proxy.ts                 # Middleware: route protection
```

## Data Flow

1. **Server Components** (`page.tsx`) call Server Actions to fetch data
2. **Server Actions** (`actions/*.ts`) use `djangoFetch` to call Django API with the JWT from cookies
3. **`djangoFetch`** (`lib/api.ts`) handles JSON serialization, auth headers, and error extraction
4. **Client Components** use `useTransition` + `useOptimistic` for responsive UI with Server Action calls

## Route Protection

`proxy.ts` (Next.js middleware) checks for `access_token` cookie:
- Protected routes (`/dashboard*`) — redirect to `/login` if no token
- Public auth routes (`/login`, `/signup`) — redirect to `/dashboard` if token exists

## Session Management

- Tokens stored as HTTP-only cookies (`access_token`, `refresh_token`)
- `getMe()` auto-refreshes expired access tokens using the refresh token
- `deleteSession()` is wrapped in try/catch for safety in Server Component contexts

## Key Patterns

| Pattern | Usage |
|---------|-------|
| BFF (Server Actions) | All API calls go through Next.js server, never from browser |
| Debounced auto-save | Note editor saves title/content changes after 500ms idle |
| Optimistic updates | Category changes apply immediately in UI |
| `revalidatePath` | Server Actions revalidate `/dashboard` after mutations |
