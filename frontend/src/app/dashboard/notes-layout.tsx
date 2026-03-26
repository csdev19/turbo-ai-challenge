'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import type { Category, Note } from '@/lib/definitions'
import { COLORS, FONT_BODY } from '@/lib/constants'
import { createNote } from '@/app/actions/notes'
import NoteCard from '@/ui/note-card'
import CategoriesSidebar from './categories-sidebar'

export default function NotesLayout({
  categories,
  notes,
  activeCategoryId,
}: {
  categories: Category[]
  notes: Note[]
  activeCategoryId?: number
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleNewNote() {
    startTransition(async () => {
      const id = await createNote(activeCategoryId)
      if (id) router.push(`/dashboard/note/${id}`)
    })
  }

  return (
    <div className={`min-h-screen ${FONT_BODY}`} style={{ backgroundColor: COLORS.cream }}>
      <div className="border-b border-[#957139]/20">
        <div className="mx-auto max-w-6xl px-6 py-3" />
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        <CategoriesSidebar
          categories={categories}
          activeCategoryId={activeCategoryId}
        />

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-end">
            <button
              onClick={handleNewNote}
              disabled={isPending}
              className="rounded-full border border-[#957139] px-5 py-2 text-sm font-medium text-[#957139] transition-colors hover:bg-[#957139]/10 disabled:opacity-50"
            >
              + New Note
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Image
                src="/note-home-image.png"
                alt="Waiting for notes"
                width={180}
                height={180}
                className="mb-6"
              />
              <p className="text-lg text-[#957139]/70">
                I&apos;m just here waiting for your charming notes...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <Link key={note.id} href={`/dashboard/note/${note.id}`}>
                  <NoteCard note={note} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
