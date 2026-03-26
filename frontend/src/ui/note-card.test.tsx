import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import NoteCard from './note-card'
import type { Note } from '@/lib/definitions'

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: 1,
    title: 'Test Note',
    content: 'Some test content here',
    category: 1,
    category_name: 'Random Thoughts',
    category_color: '#EF9C66',
    created_at: '2026-03-25T10:00:00Z',
    updated_at: '2026-03-25T10:00:00Z',
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-03-25T12:00:00Z'))
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('NoteCard', () => {
  it('renders note title', () => {
    render(<NoteCard note={makeNote()} />)
    expect(screen.getByText('Test Note')).toBeInTheDocument()
  })

  it('renders note content', () => {
    render(<NoteCard note={makeNote()} />)
    expect(screen.getByText('Some test content here')).toBeInTheDocument()
  })

  it('renders category name', () => {
    render(<NoteCard note={makeNote()} />)
    expect(screen.getByText('Random Thoughts')).toBeInTheDocument()
  })

  it('shows "Untitled" when title is empty', () => {
    render(<NoteCard note={makeNote({ title: '' })} />)
    expect(screen.getByText('Untitled')).toBeInTheDocument()
  })

  it('does not render content when empty', () => {
    const { container } = render(<NoteCard note={makeNote({ content: '' })} />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(0)
  })

  it('does not render category name when null', () => {
    render(<NoteCard note={makeNote({ category_name: null })} />)
    expect(screen.queryByText('Random Thoughts')).not.toBeInTheDocument()
  })

  it('shows "today" for notes updated today', () => {
    render(<NoteCard note={makeNote({ updated_at: '2026-03-25T08:00:00Z' })} />)
    expect(screen.getByText('today')).toBeInTheDocument()
  })

  it('shows "yesterday" for notes updated yesterday', () => {
    render(<NoteCard note={makeNote({ updated_at: '2026-03-24T08:00:00Z' })} />)
    expect(screen.getByText('yesterday')).toBeInTheDocument()
  })

  it('shows formatted date for older notes', () => {
    render(<NoteCard note={makeNote({ updated_at: '2026-01-15T08:00:00Z' })} />)
    expect(screen.getByText('January 15')).toBeInTheDocument()
  })
})
