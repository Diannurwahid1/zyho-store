import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { isMaintenanceModeEnabled } from '@/lib/maintenance'

export async function middleware(request: NextRequest) {
  if (!isMaintenanceModeEnabled()) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname
  const isAllowedPath =
    pathname === '/maintenance' ||
    pathname.startsWith('/maintenance/') ||
    pathname.startsWith('/mlebu') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico' ||
    pathname === '/media/maintenance.png'

  if (isAllowedPath) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|media/maintenance.png|maintenance).*)'],
}
