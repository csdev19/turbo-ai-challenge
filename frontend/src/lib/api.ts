const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000'

interface FetchOptions extends RequestInit {
  accessToken?: string
}

export async function djangoFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const { accessToken, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  const res = await fetch(`${DJANGO_API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message =
      body?.detail ||
      body?.message ||
      (body && typeof body === 'object'
        ? Object.values(body).flat().join(' ')
        : 'Something went wrong.')
    return { data: null, error: message, status: res.status }
  }

  if (res.status === 204 || res.status === 205) {
    return { data: null, error: null, status: res.status }
  }

  const data = await res.json()
  return { data, error: null, status: res.status }
}
