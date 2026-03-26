// Official colors from Figma
export const COLORS = {
  black: '#000000',
  accent: '#957139',     // golden brown — borders, button text
  cream: '#FAF1E3',      // page & dropdown background
  orange: '#EF9C66',
  yellow: '#FCDC94',
  green: '#C8CFA0',
  teal: '#78ABA8',
} as const

// Category color options (for creation picker)
export const CATEGORY_COLOR_OPTIONS = [
  { name: 'Orange', value: COLORS.orange },
  { name: 'Yellow', value: COLORS.yellow },
  { name: 'Green', value: COLORS.green },
  { name: 'Teal', value: COLORS.teal },
] as const

// Card background (50% opacity) and border per category color
export function getCategoryCardStyle(color: string | null): { bg: string; border: string } {
  const map: Record<string, { bg: string; border: string }> = {
    [COLORS.orange]: { bg: '#EF9C6680', border: COLORS.orange },
    [COLORS.yellow]: { bg: '#FCDC9480', border: COLORS.yellow },
    [COLORS.green]:  { bg: '#C8CFA080', border: COLORS.green },
    [COLORS.teal]:   { bg: '#78ABA880', border: COLORS.teal },
  }
  if (!color) return map[COLORS.orange]
  // Exact match or fallback: use the raw color at 50% opacity
  return map[color] ?? { bg: `${color}80`, border: color }
}

// Font family CSS class references
export const FONT_TITLE = 'font-[family-name:var(--font-inria-serif)]'
export const FONT_BODY = 'font-[family-name:var(--font-inter)]'
