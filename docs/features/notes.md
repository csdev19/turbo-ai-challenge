# Notes & Categories

## What It Does

Users create notes organized by categories. Categories are **global and pre-seeded** — 3 fixed categories matching the Figma design. Notes have a title, content, and an optional category. The dashboard shows all notes in a grid, filterable by category. Clicking a note opens a full-page editor with auto-save.

## Default Categories

Seeded via data migration (`0004_seed_default_categories`). Shared across all users.

| Name            | Color     |
| --------------- | --------- |
| Random Thoughts | `#EF9C66` |
| School          | `#FCDC94` |
| Personal        | `#78ABA8` |

Category creation/deletion is disabled. This can be a future feature.

## Pages

| Route                    | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `/dashboard`             | Notes grid + categories sidebar + empty state            |
| `/dashboard?category=id` | Filtered view — shows notes for one category             |
| `/dashboard/note/[id]`   | Full-page note editor with category selector and auto-save |

## Models

### Category

| Field  | Type       | Description                    |
| ------ | ---------- | ------------------------------ |
| id     | int (PK)   | Auto-generated                 |
| name   | string     | Unique category name           |
| color  | string     | Hex color (e.g. #EF9C66)      |

No user FK — categories are global.

### Note

| Field      | Type          | Description                  |
| ---------- | ------------- | ---------------------------- |
| id         | int (PK)      | Auto-generated               |
| user       | FK → User     | Owner                        |
| category   | FK → Category | Optional, SET_NULL on delete  |
| title      | string        | Note title (can be blank)     |
| content    | text          | Note body (can be blank)      |
| created_at | datetime      | Auto-set on creation          |
| updated_at | datetime      | Auto-set on save              |

## API Endpoints

| Method | Endpoint            | Description                                          |
| ------ | ------------------- | ---------------------------------------------------- |
| GET    | `/api/categories/`  | List all (with per-user `note_count`)                |
| GET    | `/api/notes/`       | List user's notes; filter with `?category=id`        |
| POST   | `/api/notes/`       | Create note (title, content, category optional)      |
| GET    | `/api/notes/:id/`   | Get single note                                      |
| PATCH  | `/api/notes/:id/`   | Partial update                                       |
| DELETE | `/api/notes/:id/`   | Delete note                                          |

## Key Behaviors

- **New Note** — creates a blank note (empty title + content) and redirects to editor. If a category filter is active, the new note is assigned that category.
- **Auto-save** — title and content changes debounce at 500ms, then call `updateNote` Server Action
- **Category change** — saved immediately (no debounce)
- **Card colors** — category color at 50% opacity for background, full color for border
- **note_count** — annotated per-user via `Count('notes', filter=Q(notes__user=request.user))`

## Decisions

| Decision | Why |
|----------|-----|
| Global seeded categories (not per-user) | Figma shows 3 fixed categories; simplifies the model |
| Category create/delete disabled | Deferred as a future feature |
| `note_count` filtered per user | Categories are global but counts should reflect the current user's notes |
| Notes ordered by `updated_at` desc | Most recently edited note appears first |
| `SET_NULL` on category delete | Notes survive category deletion |
| Debounced auto-save (500ms) | Prevents excessive API calls while typing |
