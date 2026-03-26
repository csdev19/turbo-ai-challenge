import { describe, it, expect } from 'vitest'
import { COLORS, CATEGORY_COLOR_OPTIONS, getCategoryCardStyle } from './constants'

describe('COLORS', () => {
  it('has all official Figma hex values', () => {
    expect(COLORS.orange).toBe('#EF9C66')
    expect(COLORS.yellow).toBe('#FCDC94')
    expect(COLORS.green).toBe('#C8CFA0')
    expect(COLORS.teal).toBe('#78ABA8')
    expect(COLORS.accent).toBe('#957139')
    expect(COLORS.cream).toBe('#FAF1E3')
  })
})

describe('CATEGORY_COLOR_OPTIONS', () => {
  it('has 4 color options matching COLORS', () => {
    expect(CATEGORY_COLOR_OPTIONS).toHaveLength(4)
    expect(CATEGORY_COLOR_OPTIONS.map((c) => c.value)).toEqual([
      COLORS.orange,
      COLORS.yellow,
      COLORS.green,
      COLORS.teal,
    ])
  })
})

describe('getCategoryCardStyle', () => {
  it('returns orange style for null color', () => {
    const style = getCategoryCardStyle(null)
    expect(style.bg).toBe('#EF9C6680')
    expect(style.border).toBe('#EF9C66')
  })

  it('returns correct style for each known color', () => {
    const orange = getCategoryCardStyle('#EF9C66')
    expect(orange.bg).toBe('#EF9C6680')
    expect(orange.border).toBe('#EF9C66')

    const yellow = getCategoryCardStyle('#FCDC94')
    expect(yellow.bg).toBe('#FCDC9480')
    expect(yellow.border).toBe('#FCDC94')

    const green = getCategoryCardStyle('#C8CFA0')
    expect(green.bg).toBe('#C8CFA080')
    expect(green.border).toBe('#C8CFA0')

    const teal = getCategoryCardStyle('#78ABA8')
    expect(teal.bg).toBe('#78ABA880')
    expect(teal.border).toBe('#78ABA8')
  })

  it('falls back to raw color at 50% opacity for unknown hex', () => {
    const style = getCategoryCardStyle('#FF0000')
    expect(style.bg).toBe('#FF000080')
    expect(style.border).toBe('#FF0000')
  })
})
