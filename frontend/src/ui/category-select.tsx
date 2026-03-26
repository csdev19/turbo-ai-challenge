'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Category } from '@/lib/definitions'
import { COLORS, FONT_BODY } from '@/lib/constants'

interface CategorySelectProps {
  categories: Category[]
  value: number | null
  onChange: (id: number | null) => void
}

export default function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const active = categories.find((c) => c.id === value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className={`relative ${FONT_BODY}`} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm"
        style={{
          border: `1px solid ${COLORS.accent}`,
          backgroundColor: COLORS.cream,
          color: COLORS.black,
        }}
      >
        {active && (
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: active.color }}
          />
        )}
        <span className="font-normal">{active?.name || 'No Category'}</span>
        <ChevronDown className="ml-2 h-4 w-4" style={{ color: COLORS.accent }} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-10 mt-1 w-52 overflow-hidden rounded-lg shadow-lg"
          style={{
            backgroundColor: COLORS.cream,
            border: `1px solid ${COLORS.accent}`,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onChange(cat.id); setOpen(false) }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-black transition-colors hover:bg-black/5"
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
