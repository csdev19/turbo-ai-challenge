import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMe } from '@/app/actions/auth'
import { getCategories, getNotes } from '@/app/actions/notes'
import NotesLayout from './notes-layout'

export const metadata: Metadata = { title: 'My Notes' }

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const user = await getMe()
  if (!user) redirect('/login')

  const params = await searchParams
  const categoryId = params.category ? Number(params.category) : undefined

  const [categories, notes] = await Promise.all([
    getCategories(),
    getNotes(categoryId),
  ])

  return (
    <NotesLayout
      categories={categories}
      notes={notes}
      activeCategoryId={categoryId}
    />
  )
}
