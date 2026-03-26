import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMe } from '@/app/actions/auth'
import { getNote, getCategories } from '@/app/actions/notes'
import NoteEditor from './note-editor'

export const metadata: Metadata = { title: 'Edit Note' }

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getMe()
  if (!user) redirect('/login')

  const { id } = await params
  const [note, categories] = await Promise.all([
    getNote(Number(id)),
    getCategories(),
  ])

  if (!note) redirect('/dashboard')

  return <NoteEditor note={note} categories={categories} />
}
