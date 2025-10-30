import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supported locales
const locales = ['ar', 'en', 'es', 'fr']
const defaultLocale = 'ar'

// Get locale from pathname
function getLocale(pathname: string): string | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  return locales.includes(potentialLocale) ? potentialLocale : null
}

// Check if path is for admin area
function isAdminPath(pathname: string): boolean {
  return pathname.includes('/admin')
}

// Check if path is for API routes
function isApiPath(pathname: string): boolean {
  return pathname.startsWith('/api')
}

// Check if path is for static files
function isStaticFile(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (isStaticFile(pathname) || isApiPath(pathname)) {
    return NextResponse.next()
  }

  // Get current locale from pathname
  const currentLocale = getLocale(pathname)

  // If no locale in path, redirect to default locale
  if (!currentLocale) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  // Admin area protection (basic check - enhance with actual auth)
  if (isAdminPath(pathname)) {
    // Check for auth token in cookies
    const token = request.cookies.get('auth-token')
    
    // If no token and not on login page, redirect to login
    if (!token && !pathname.includes('/admin/login')) {
      const loginUrl = new URL(`/${currentLocale}/admin/login`, request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Set locale cookie for client-side access
  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', currentLocale, {
    path: '/',
    sameSite: 'lax'
  })

  // Add locale to response headers for server components
  response.headers.set('x-locale', currentLocale)

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
