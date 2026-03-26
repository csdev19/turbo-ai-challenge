'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { X } from 'lucide-react'
import type { Category, Note } from '@/lib/definitions'
import { COLORS, FONT_TITLE, FONT_BODY } from '@/lib/constants'
import { updateNote } from '@/app/actions/notes'
import CategorySelect from '@/ui/category-select'
import Paper from '@/ui/paper'

function formatLastEdited(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase()
}

export default function NoteEditor({
  note,
  categories,
}: {
  note: Note
  categories: Category[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [categoryId, setCategoryId] = useState(note.category)
  const [isPending, startTransition] = useTransition()
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const activeCategory = categories.find((c) => c.id === categoryId)

  const save = useCallback(
    (updates: Partial<Pick<Note, 'title' | 'content' | 'category'>>) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        startTransition(async () => {
          await updateNote(note.id, updates)
        })
      }, 500)
    },
    [note.id]
  )

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  function handleTitleChange(value: string) {
    setTitle(value)
    save({ title: value })
  }

  function handleContentChange(value: string) {
    setContent(value)
    save({ content: value })
  }

  function handleCategoryChange(id: number | null) {
    setCategoryId(id)
    startTransition(async () => {
      await updateNote(note.id, { category: id })
    })
  }


  return (
    <div
      className={`flex h-screen flex-col ${FONT_BODY}`}
      style={{ backgroundColor: COLORS.cream }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <CategorySelect
          categories={categories}
          value={categoryId}
          onChange={handleCategoryChange}
        />

        <button
          onClick={() => router.push('/dashboard')}
          style={{ color: COLORS.accent }}
          className="transition-colors hover:opacity-70"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Note card — fills remaining space */}
      <div className="flex-1 px-6 pb-6">
        <Paper
          color={activeCategory?.color ?? note.category_color}
          className="relative flex h-full flex-col p-8"
        >
          <div className="mb-6 flex justify-end">
            <span className="text-xs text-black/60">
              Last Edited: {formatLastEdited(note.updated_at)}
            </span>
          </div>

          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note Title"
            className={`mb-4 w-full bg-transparent ${FONT_TITLE} text-2xl font-bold leading-none text-black placeholder-black/40 outline-none`}
          />

          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Pour your heart out..."
            className={`flex-1 w-full resize-none bg-transparent ${FONT_BODY} text-xs font-normal leading-relaxed text-black placeholder-black/40 outline-none`}
          />

        </Paper>
      </div>
    </div>
  )
}
