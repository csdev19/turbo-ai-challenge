'use client'

import Link from 'next/link'
import type { Category } from '@/lib/definitions'

export default function CategoriesSidebar({
  categories,
  activeCategoryId,
}: {
  categories: Category[]
  activeCategoryId?: number
}) {
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
    </aside>
  )
}
