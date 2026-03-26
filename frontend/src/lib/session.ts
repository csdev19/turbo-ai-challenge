import 'server-only'
import { cookies } from 'next/headers'

const ACCESS_MAX_AGE = 60 * 30 // 30 minutes
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()

  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_MAX_AGE,
  })

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_MAX_AGE,
  })
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value ?? null
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('refresh_token')?.value ?? null
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
  } catch {
    // cookies can only be modified in a Server Action or Route Handler.
    // If called during rendering (e.g. from getMe in a Server Component),
    // silently ignore — the caller should redirect to /login instead.
  }
}
