# Design System & Technical Specification: CatNotes To-Do List

## 1. Overview
CatNotes is a minimalist, warm, and friendly note-taking and to-do application. The design focuses on a cozy aesthetic using pastel colors, soft shadows, and rounded corners to provide a stress-free user experience.

## 2. Visual Identity

### Color Palette
- **Primary (Peach):** `#EF9C66` (Used for active states, primary buttons, and 'Random Thoughts' category)
- **Secondary (Beige):** `#F3E9D2` (Main background color)
- **Accent (Yellow):** `#FCDC94` (Used for 'School' category and highlight cards)
- **Accent (Sage):** `#C8CFA0` (Used for 'Personal' category)
- **Accent (Teal):** `#78ABA8` (Used for 'Drama' category and specialized notes)
- **Text (Dark Brown):** `#4A3F35` (Primary text color for high legibility and warmth)

### Typography
- **Headings:** Serif font (e.g., Playfair Display or Lora) for a classic, editorial feel.
- **Body:** Sans-serif font (e.g., Inter or Roboto) for clarity and modern functional use.
- **Styles:**
  - H1: Bold, Large (Login Screen title)
  - H2: Semi-bold, Medium (Note titles)
  - Body: Regular, Small/Medium (Note content and UI labels)

## 3. Component Breakdown

### Buttons
- **Primary Action:** Pill-shaped, outlined with thin border, centered text. Hover state adds subtle fill or shadow.
- **Icon Buttons:** Circular, dark background with white icons (e.g., the cat/music icon in note view).
- **'New Note' Button:** Floating or header-aligned, includes a '+' icon and text.

### Inputs
- **Text Fields:** Rounded corners, subtle border, placeholder text in muted brown.
- **Dropdowns:** Custom styled with category-colored dots (e.g., Category selector).

### Cards (Notes)
- **Layout:** Masonry or fixed-grid layout.
- **Header:** Contains date and category tag.
- **Body:** Note title (Serif) and snippet of content (Sans-serif).
- **Styling:** Fully rounded corners (approx 16-24px), background color matching the category.

## 4. Screens & User Flows

### Login / Sign Up
- Minimalist center-aligned layout.
- Hero illustration (Cat mascot).
- Friendly welcome message ('Yay, New Friend!').
- Simple Email/Password fields and primary 'Sign Up' action.

### Dashboard (Main View)
- Sidebar/Top navigation for categories.
- 'All Categories' summary with note counts.
- Grid of notes showing previews.
- 'New Note' primary action clearly visible.

### Note Editor
- Focus mode with large text area.
- Category selector at the top with color-coded options.
- 'Last Edited' timestamp for context.
- Minimal controls to keep the user focused on writing.

## 5. Technical Recommendations
- **Frontend:** React or Vue.js for component-based architecture.
- **Styling:** Tailwind CSS for rapid styling using the defined color tokens.
- **State Management:** Context API or Redux for managing notes and categories.
- **Icons:** Lucide-React or Heroicons for a clean, stroke-based look.