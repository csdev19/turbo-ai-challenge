import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Fab from './fab'

afterEach(cleanup)

describe('Fab', () => {
  it('renders children', () => {
    render(<Fab onClick={() => {}}>Click me</Fab>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Fab onClick={onClick}>Action</Fab>)
    await user.click(screen.getByText('Action'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Fab onClick={() => {}} disabled>Disabled</Fab>)
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Fab onClick={() => {}} className="absolute bottom-4">Styled</Fab>)
    const btn = screen.getByText('Styled').closest('button')
    expect(btn?.className).toContain('absolute')
    expect(btn?.className).toContain('bottom-4')
  })
})
