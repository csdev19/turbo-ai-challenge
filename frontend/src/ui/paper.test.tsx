import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import Paper from './paper'

afterEach(cleanup)

describe('Paper', () => {
  it('renders children', () => {
    render(<Paper>Hello World</Paper>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies orange border by default when no color', () => {
    const { container } = render(<Paper>Content</Paper>)
    const el = container.firstChild as HTMLElement
    // jsdom converts hex to rgb
    expect(el.style.border).toContain('rgb(239, 156, 102)')
  })

  it('applies teal border for teal color', () => {
    const { container } = render(<Paper color="#78ABA8">Teal</Paper>)
    const el = container.firstChild as HTMLElement
    expect(el.style.border).toContain('rgb(120, 171, 168)')
  })

  it('applies custom className', () => {
    const { container } = render(<Paper className="p-8 h-full">Styled</Paper>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('p-8')
    expect(el.className).toContain('h-full')
  })

  it('always has rounded-[11px] class', () => {
    const { container } = render(<Paper>Rounded</Paper>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('rounded-[11px]')
  })
})
