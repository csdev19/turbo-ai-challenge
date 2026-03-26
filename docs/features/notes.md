# Notes & Categories

## What It Does

Users create notes organized by categories. Each category has a name and a color. Notes have a title, content, and an optional category. The dashboard shows all notes in a grid, filterable by category. Clicking a note opens a full-page editor with auto-save.

## Pages

| Route                    | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `/dashboard`             | Notes grid + categories sidebar + empty state            |
| `/dashboard?category=id` | Filtered view — shows notes for one category             |
| `/dashboard/note/[id]`   | Full-page note editor with category selector and auto-save |

## Models

### Category

| Field  | Type       | Description              |
| ------ | ---------- | ------------------------ |
| id     | int (PK)   | Auto-generated           |
| user   | FK → User  | Owner                    |
| name   | string     | Category name            |
| color  | string     | Hex color (e.g. #EF9C66) |

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

| Method | Endpoint            | Description                                |
| ------ | ------------------- | ------------------------------------------ |
| GET    | `/api/categories/`  | List with `note_count` annotation          |
| POST   | `/api/categories/`  | Create (name + color)                      |
| DELETE | `/api/categories/:id/` | Delete category                         |
| GET    | `/api/notes/`       | List all; filter with `?category=id`       |
| POST   | `/api/notes/`       | Create (title, content, category optional) |
| GET    | `/api/notes/:id/`   | Get single note                            |
| PATCH  | `/api/notes/:id/`   | Partial update                             |
| DELETE | `/api/notes/:id/`   | Delete note                                |

## Key Behaviors

- **New Note** — creates a blank note (empty title + content) and redirects to editor. If a category filter is active, the new note is assigned that category.
- **Auto-save** — title and content changes debounce at 500ms, then call `updateNote` Server Action
- **Category change** — saved immediately (no debounce)
- **Category colors** — 4 official colors from Figma: orange `#EF9C66`, yellow `#FCDC94`, green `#C8CFA0`, teal `#78ABA8`
- **Card colors** — category color at 50% opacity for background, full color for border

## Decisions

| Decision | Why |
|----------|-----|
| Notes ordered by `updated_at` desc | Most recently edited note appears first |
| `SET_NULL` on category delete | Notes survive category deletion |
| Debounced auto-save (500ms) | Prevents excessive API calls while typing |
| Category colors are fixed presets | Matches Figma design; ensures visual consistency |
