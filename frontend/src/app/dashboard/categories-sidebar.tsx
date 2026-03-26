'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type { Category } from '@/lib/definitions'
import { CATEGORY_COLOR_OPTIONS } from '@/lib/constants'
import { createCategory } from '@/app/actions/notes'

export default function CategoriesSidebar({
  categories,
  activeCategoryId,
}: {
  categories: Category[]
  activeCategoryId?: number
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLOR_OPTIONS[0].value)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    startTransition(async () => {
      await createCategory(newName.trim(), newColor)
      setNewName('')
      setShowForm(false)
      router.refresh()
    })
  }

  return (
    <aside className="w-48 shrink-0">
      <Link
        href="/dashboard"
        className={`mb-3 block text-sm font-semibold ${
          !activeCategoryId ? 'text-[#5C4033]' : 'text-[#957139]'
        } hover:text-[#5C4033]`}
      >
        All Categories
      </Link>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/dashboard?category=${cat.id}`}
              className={`flex items-center gap-2 text-sm ${
                activeCategoryId === cat.id
                  ? 'font-medium text-[#5C4033]'
                  : 'text-[#957139] hover:text-[#5C4033]'
              }`}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs text-[#957139]">{cat.note_count}</span>
            </Link>
          </li>
        ))}
      </ul>

      {showForm ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="w-full border-b border-[#957139] bg-transparent px-1 py-1.5 text-xs text-[#5C4033] placeholder-[#957139] outline-none"
            autoFocus
          />
          <div className="flex gap-1.5">
            {CATEGORY_COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setNewColor(c.value)}
                className={`h-5 w-5 rounded-full transition-transform ${
                  newColor === c.value ? 'scale-125 ring-2 ring-[#957139]' : ''
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full border border-[#957139] px-3 py-1 text-xs text-[#957139] hover:bg-[#957139]/10 disabled:opacity-50"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-[#957139] hover:text-[#957139]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 text-xs text-[#957139] hover:text-[#957139]"
        >
          + Add category
        </button>
      )}
    </aside>
  )
}
