# Frontend — Next.js 16

@AGENTS.md

Next.js 16 App Router with Tailwind CSS, Server Actions, and Server Components.

## Stack

- **Fonts**: Inter (body) + Inria Serif (titles) — loaded via `next/font/google`
- **Icons**: lucide-react
- **Validation**: Zod v4
- **Testing**: Vitest (unit) + Playwright (e2e)

## Architecture

BFF pattern — Server Actions in `src/app/actions/` proxy all Django API calls. The browser never talks to Django directly. JWT tokens stored in HTTP-only cookies.

### Route Protection

`src/proxy.ts` (middleware) checks `access_token` cookie:
- `/dashboard*` — redirects to `/login` if no token
- `/login`, `/signup` — redirects to `/dashboard` if token exists

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/constants.ts` | COLORS, FONT_TITLE, FONT_BODY, getCategoryCardStyle() |
| `src/lib/definitions.ts` | TypeScript types + Zod schemas |
| `src/lib/api.ts` | djangoFetch() helper |
| `src/lib/session.ts` | Cookie-based JWT session management |
| `src/proxy.ts` | Middleware for route protection |

## UI Components (`src/ui/`)

| Component | Props | Usage |
|-----------|-------|-------|
| Paper | `color`, `className`, `children` | Colored card background (11px radius, 3px border) |
| CategorySelect | `categories`, `value`, `onChange` | Dropdown with colored dots |
| NoteCard | `note` | 246px fixed-height preview card |
| Fab | `onClick`, `disabled`, `children` | Floating action button |

## Design Specs (from Figma)

- Page background: `#FAF1E3`
- Accent/borders: `#957139`
- Auth headings: Inria Serif, Bold, 48px, `#88642A`
- Auth form width: 384px max
- Note card: 246px height, 11px radius, 3px border, 16px padding
- Note title: Inria Serif, Bold, 24px, `#000`
- Note content: Inter, Regular, 12px, `#000`

## Running

```bash
pnpm dev          # dev server at localhost:3000
pnpm build        # production build
pnpm test         # unit tests (Vitest)
pnpm test:watch   # unit tests in watch mode
pnpm test:e2e     # e2e tests (Playwright, needs backend running)
```

## Environment

```bash
# .env.local
DJANGO_API_URL=http://localhost:8000
```
