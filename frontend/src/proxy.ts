import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard']
const publicAuthRoutes = ['/login', '/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = request.cookies.has('access_token')

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isPublicAuth = publicAuthRoutes.some((r) => pathname.startsWith(r))

  if (isProtected && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicAuth && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
