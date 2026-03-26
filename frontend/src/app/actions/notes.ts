'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { djangoFetch } from '@/lib/api'
import type { Category, Note } from '@/lib/definitions'
import { getAccessToken } from '@/lib/session'

export async function getCategories(): Promise<Category[]> {
  const accessToken = await getAccessToken()
  if (!accessToken) return []
  const { data } = await djangoFetch<Category[]>('/api/categories/', { accessToken })
  return data || []
}

export async function createCategory(name: string, color: string): Promise<Category | null> {
  const accessToken = await getAccessToken()
  if (!accessToken) return null
  const { data } = await djangoFetch<Category>('/api/categories/', {
    method: 'POST',
    body: JSON.stringify({ name, color }),
    accessToken,
  })
  revalidatePath('/dashboard')
  return data
}

export async function deleteCategory(id: number) {
  const accessToken = await getAccessToken()
  if (!accessToken) return
  await djangoFetch(`/api/categories/${id}/`, { method: 'DELETE', accessToken })
  revalidatePath('/dashboard')
}

export async function getNotes(categoryId?: number): Promise<Note[]> {
  const accessToken = await getAccessToken()
  if (!accessToken) return []
  const query = categoryId ? `?category=${categoryId}` : ''
  const { data } = await djangoFetch<Note[]>(`/api/notes/${query}`, { accessToken })
  return data || []
}

export async function getNote(id: number): Promise<Note | null> {
  const accessToken = await getAccessToken()
  if (!accessToken) return null
  const { data } = await djangoFetch<Note>(`/api/notes/${id}/`, { accessToken })
  return data
}

export async function createNote(categoryId?: number): Promise<number | null> {
  const accessToken = await getAccessToken()
  if (!accessToken) return null
  const { data } = await djangoFetch<Note>('/api/notes/', {
    method: 'POST',
    body: JSON.stringify({
      title: '',
      content: '',
      category: categoryId || null,
    }),
    accessToken,
  })
  if (!data) return null
  revalidatePath('/dashboard')
  return data.id
}

export async function updateNote(id: number, updates: Partial<Pick<Note, 'title' | 'content' | 'category'>>) {
  const accessToken = await getAccessToken()
  if (!accessToken) return
  await djangoFetch(`/api/notes/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    accessToken,
  })
  revalidatePath('/dashboard')
}

export async function deleteNote(id: number) {
  const accessToken = await getAccessToken()
  if (!accessToken) return
  await djangoFetch(`/api/notes/${id}/`, { method: 'DELETE', accessToken })
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
