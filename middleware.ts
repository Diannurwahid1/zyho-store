import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Enable maintenance mode via environment variable
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true'

export async function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname
  
  // Allow access to maintenance page itself
  if (pathname === '/maintenance' || pathname.startsWith('/maintenance/')) {
    return NextResponse.next()
  }
  
  // Allow access to admin panel (mlebu)
  if (pathname.startsWith('/mlebu') || pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  
  // Allow access to all API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Allow static assets
  if (pathname.startsWith('/_next/static') || 
      pathname.startsWith('/_next/image') ||
      pathname === '/favicon.ico' ||
      pathname === '/media/maintenance.png') {
    return NextResponse.next()
  }

  // Redirect all other traffic to maintenance page
  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|media/maintenance.png|maintenance).*)'],
}
