# Frontend Test Plan

## 1. Overview and Goals

Establish a reliable, maintainable test suite for the Notes app frontend that:

- Catches regressions in UI components and utility logic before they reach production.
- Validates critical user flows (auth, note CRUD, category filtering) end-to-end.
- Runs automatically on every push and pull request via GitHub Actions.

Coverage targets for the first iteration: 100% of exported utility functions, all four UI components (`Paper`, `NoteCard`, `CategorySelect`, `Fab`), and the five core E2E flows listed below.

## 2. Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Unit / Component | **Vitest** + **React Testing Library** | Vitest is ESM-native, shares Vite's transform pipeline, and is significantly faster than Jest for Next.js projects. RTL encourages testing behavior over implementation details. |
| E2E | **Playwright** | Multi-browser support (Chromium, Firefox, WebKit) out of the box, built-in auto-waiting, and native support for intercepting network requests -- all superior to Cypress for modern Next.js apps. |
| Assertions | Vitest built-in (`expect`) / Playwright built-in (`expect`) | Consistent API across both layers, no extra deps. |

### Dev dependencies to add

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
```

## 3. Unit Test Strategy

Directory: `frontend/src/__tests__/` mirroring `src/` structure.

### 3.1 Utility functions (`src/lib/constants.ts`)

| Test | What it verifies |
|------|-----------------|
| `getCategoryCardStyle` returns correct bg/border for each known color | Mapping for orange, yellow, green, teal |
| `getCategoryCardStyle(null)` falls back to orange | Null-safety default |
| `getCategoryCardStyle` with an unknown hex returns `${color}80` bg and raw color border | Fallback for arbitrary colors |
| `CATEGORY_COLOR_OPTIONS` length and shape | Structural contract: 4 options, each with `name` and `value` |

### 3.2 Zod schemas (`src/lib/definitions.ts`)

| Test | What it verifies |
|------|-----------------|
| `SignupFormSchema` accepts valid email + strong password | Happy path |
| `SignupFormSchema` rejects invalid email | Email validation |
| `SignupFormSchema` rejects password < 8 chars | Min-length rule |
| `SignupFormSchema` rejects password without a letter | Letter regex |
| `SignupFormSchema` rejects password without a number | Number regex |
| `LoginFormSchema` accepts any non-empty password | Minimal validation |
| `LoginFormSchema` rejects empty password | Required field |

### 3.3 UI Components

**Paper** (`src/ui/paper.tsx`)

- Renders children.
- Applies background and border from `getCategoryCardStyle` based on `color` prop.
- Falls back to orange styling when `color` is undefined/null.
- Merges additional `className`.

**NoteCard** (`src/ui/note-card.tsx`)

- Renders note title, content, category name, and formatted date.
- Shows "Untitled" when `note.title` is empty.
- Hides content paragraph when `note.content` is empty.
- Hides category badge when `note.category_name` is null.
- `formatDate`: returns "today" for today, "yesterday" for yesterday, "Month Day" otherwise.

**CategorySelect** (`src/ui/category-select.tsx`)

- Displays "No Category" when `value` is null.
- Opens dropdown on click; lists all categories.
- Calls `onChange` with the selected category id and closes dropdown.
- Closes dropdown on outside click.

**Fab** (`src/ui/fab.tsx`)

- Renders children inside a circular button.
- Calls `onClick` when clicked.
- Applies `disabled` state (opacity, pointer-events).
- Merges additional `className`.

## 4. E2E Test Strategy

Directory: `frontend/e2e/`.

All E2E tests run against a local dev server (`next dev`) backed by a seeded test database.

### 4.1 Flows

| # | Flow | Steps | Key assertions |
|---|------|-------|----------------|
| 1 | **Signup -> Dashboard** | Fill email + password on `/signup`, submit | Redirect to `/dashboard`, user greeting or empty state visible |
| 2 | **Login -> Dashboard** | Fill credentials on `/login`, submit | Redirect to `/dashboard`, notes grid rendered |
| 3 | **Create note** | Click FAB on dashboard, land on `/dashboard/note/[id]`, type title + content | New note appears in dashboard grid after navigating back |
| 4 | **Edit note** | Click existing note card, modify title, navigate back | Updated title reflected in grid |
| 5 | **Category filtering** | Click a category in sidebar | Only notes with matching category visible; "All" resets filter |

### 4.2 Test isolation

- Each test file uses `test.describe` with its own authentication state.
- Auth state is stored via Playwright `storageState` so login only runs once per suite.
- The test database is reset between suites via a backend management command.

## 5. Test Matrix

| Component / Flow | Unit | E2E | Priority |
|-----------------|:----:|:---:|:--------:|
| `getCategoryCardStyle` | X | | P0 |
| `COLORS` / `CATEGORY_COLOR_OPTIONS` | X | | P0 |
| `SignupFormSchema` | X | | P0 |
| `LoginFormSchema` | X | | P0 |
| `Paper` | X | | P0 |
| `NoteCard` | X | | P0 |
| `CategorySelect` | X | | P1 |
| `Fab` | X | | P1 |
| `formatDate` (NoteCard internal) | X | | P1 |
| Signup -> Dashboard | | X | P0 |
| Login -> Dashboard | | X | P0 |
| Create note | | X | P0 |
| Edit note | | X | P1 |
| Category filtering | | X | P1 |

## 6. CI/CD Integration

Extend the existing `.github/workflows/tests.yml` by adding two jobs alongside `backend-tests`:

```yaml
frontend-unit:
  runs-on: ubuntu-latest
  defaults:
    run:
      working-directory: frontend
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "22"
    - run: corepack enable && pnpm install --frozen-lockfile
    - run: pnpm vitest run

frontend-e2e:
  runs-on: ubuntu-latest
  needs: [frontend-unit]
  defaults:
    run:
      working-directory: frontend
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "22"
    - run: corepack enable && pnpm install --frozen-lockfile
    - run: npx playwright install --with-deps chromium
    - uses: actions/setup-python@v5
      with:
        python-version: "3.13"
    - name: Start backend
      working-directory: backend
      run: |
        pip install -r requirements.txt
        python manage.py migrate
        python manage.py runserver &
      env:
        DATABASE_URL: "sqlite:///test_db.sqlite3"
        DJANGO_SECRET_KEY: "test-secret-key-for-ci"
    - name: Run E2E tests
      run: npx playwright test
      env:
        BASE_URL: "http://localhost:3000"
```

`frontend-e2e` depends on `frontend-unit` so fast unit failures short-circuit the pipeline.

## 7. How to Run Locally

```bash
# Install test dependencies (one-time)
cd frontend
pnpm add -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @playwright/test
npx playwright install chromium

# Unit tests
pnpm vitest          # watch mode
pnpm vitest run      # single run

# E2E tests (requires backend + frontend running)
npx playwright test                    # headless
npx playwright test --ui               # interactive UI mode
npx playwright test --project=chromium # single browser
```

Add to `frontend/package.json` scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

## 8. Future Iterations

- **Visual regression**: Add Playwright screenshot comparison for `Paper` and `NoteCard` across color themes.
- **Accessibility**: Add `axe-core` checks (`@axe-core/playwright`) to every E2E page visit.
- **Performance**: Use Playwright's `page.metrics()` to assert dashboard load time stays under budget.
- **API mocking**: Introduce MSW (Mock Service Worker) for unit-testing components that call server actions, decoupling frontend tests from the backend entirely.
- **Coverage thresholds**: Configure Vitest coverage (`v8` provider) and enforce minimums in CI (e.g., 80% branch coverage on `src/lib/`, 70% on `src/ui/`).
