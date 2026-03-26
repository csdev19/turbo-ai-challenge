'use server'

import { redirect } from 'next/navigation'
import { djangoFetch } from '@/lib/api'
import { LoginFormSchema, SignupFormSchema } from '@/lib/definitions'
import type { FormState, User } from '@/lib/definitions'
import {
  createSession,
  deleteSession,
  getAccessToken,
  getRefreshToken,
} from '@/lib/session'

interface AuthResponse {
  user: User
  tokens: { access: string; refresh: string }
}

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const { data, error } = await djangoFetch<AuthResponse>('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  })

  if (error || !data) {
    return { message: error || 'Registration failed.' }
  }

  await createSession(data.tokens.access, data.tokens.refresh)
  redirect('/dashboard')
}

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const { data, error } = await djangoFetch<AuthResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  })

  if (error || !data) {
    return { message: error || 'Invalid email or password.' }
  }

  await createSession(data.tokens.access, data.tokens.refresh)
  redirect('/dashboard')
}

export async function logout() {
  const accessToken = await getAccessToken()
  const refreshToken = await getRefreshToken()

  if (refreshToken) {
    await djangoFetch('/api/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
      accessToken: accessToken || undefined,
    })
  }

  await deleteSession()
  redirect('/login')
}

export async function getMe(): Promise<User | null> {
  let accessToken = await getAccessToken()

  if (!accessToken) {
    return null
  }

  let { data, status } = await djangoFetch<User>('/api/auth/me/', {
    accessToken,
  })

  if (status === 401) {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
      await deleteSession()
      return null
    }

    const refreshResult = await djangoFetch<{ access: string }>(
      '/api/auth/token/refresh/',
      {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      }
    )

    if (!refreshResult.data) {
      await deleteSession()
      return null
    }

    await createSession(refreshResult.data.access, refreshToken)
    accessToken = refreshResult.data.access

    const retry = await djangoFetch<User>('/api/auth/me/', { accessToken })
    data = retry.data
  }

  return data
}
