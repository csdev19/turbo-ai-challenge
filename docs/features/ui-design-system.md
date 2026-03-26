# UI Design System

## What It Does

A warm, cozy design system extracted from Figma. Centralized color constants, font family references, and reusable UI components ensure visual consistency across all pages.

## Colors

All colors are defined in `src/lib/constants.ts` under `COLORS`:

| Name   | Hex       | Usage                                  |
| ------ | --------- | -------------------------------------- |
| black  | `#000000` | Text color                             |
| accent | `#957139` | Borders, button text, dropdown borders |
| cream  | `#FAF1E3` | Page backgrounds, dropdown backgrounds |
| orange | `#EF9C66` | Category color — "Random Thoughts"     |
| yellow | `#FCDC94` | Category color — "School"              |
| green  | `#C8CFA0` | Category color — "Drama"               |
| teal   | `#78ABA8` | Category color — "Personal"            |

Additional color: `#88642A` — used for auth page headings.

## Fonts

| Font         | Usage                | Weight    | CSS Variable          |
| ------------ | -------------------- | --------- | --------------------- |
| Inria Serif  | Note titles, headings | 300, 400, 700 | `--font-inria-serif` |
| Inter        | Body text, UI labels  | 400       | `--font-inter`       |

Font class constants in `constants.ts`:
- `FONT_TITLE` = `font-[family-name:var(--font-inria-serif)]`
- `FONT_BODY` = `font-[family-name:var(--font-inter)]`

## UI Components (`src/ui/`)

### Paper

Colored card background matching category color. Takes a `color` prop (hex string) and renders with 50% opacity background and solid border, rounded corners (11px).

**Props:** `color`, `className`, `children`

### CategorySelect

Dropdown for picking a category. Trigger button shows colored dot + name + chevron. Dropdown panel lists all categories with colored dots. Closes on outside click.

**Props:** `categories`, `value`, `onChange`

### NoteCard

Preview card for the notes grid. Fixed height (246px), overflow hidden. Shows date, category name, title (Inria Serif 24px bold), content preview (Inter 12px), all with line clamping.

**Props:** `note`

### Fab

Floating action button — dark circle with icon. Currently unused but available.

**Props:** `onClick`, `disabled`, `children`, `className`

## Note Card Specs (from Figma)

| Property   | Value    |
| ---------- | -------- |
| Width      | Fluid (grid column) |
| Height     | 246px    |
| Radius     | 11px     |
| Border     | 3px solid (category color) |
| Padding    | 16px     |
| Gap        | 12px     |
| Background | Category color at 50% opacity |

## Auth Page Specs

| Property     | Value                    |
| ------------ | ------------------------ |
| Form width   | max 384px                |
| Background   | `#FAF1E3` (cream)        |
| Heading font | Inria Serif, Bold, 48px  |
| Heading color| `#88642A`                |
| Input style  | rounded-full, border `#957139` |
| Button style | rounded-full, border `#957139` |
