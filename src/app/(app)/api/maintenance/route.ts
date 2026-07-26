import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Enable maintenance mode via environment variable
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true'

// List of paths that should be accessible even during maintenance
const ALLOWED_PATHS = [
  '/api/maintenance',
  '/api/auth',
  '/api/graphql',
  '/api/graphql-playground',
  '/admin',
  '/mlebu',
]

export async function GET(request: NextRequest) {
  if (!MAINTENANCE_MODE) {
    return NextResponse.json({ maintenance: false })
  }
  
  return NextResponse.json({ 
    maintenance: true,
    message: 'Maintenance mode is active'
  })
}

// Middleware-like functionality for maintenance mode
export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname
  
  // Allow access to admin panel and API endpoints
  const isAllowed = ALLOWED_PATHS.some(path => 
    pathname.startsWith(path) || pathname.includes('/api/')
  )
  
  if (isAllowed) {
    return NextResponse.next()
  }

  // Redirect all other traffic to maintenance page
  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|media/maintenance.png).*)'],
}
