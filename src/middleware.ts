import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCorsHeaders, getSecurityHeaders, handleCorsOptions } from './lib/cors'

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
  return pathname.startsWith('/admin')
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

  // ✅ Handle CORS for API routes
  if (isApiPath(pathname)) {
    // Handle OPTIONS request (preflight)
    if (request.method === 'OPTIONS') {
      return handleCorsOptions(request)
    }

    // Add CORS and security headers to API responses
    const response = NextResponse.next()
    
    // CORS headers
    const origin = request.headers.get('origin')
    const corsHeaders = getCorsHeaders(origin)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // Security headers
    const securityHeaders = getSecurityHeaders()
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  // Skip middleware for static files
  if (isStaticFile(pathname)) {
    return NextResponse.next()
  }

  // Skip locale handling for admin routes
  if (isAdminPath(pathname)) {
    return NextResponse.next()
  }

  // Get current locale from pathname
  const currentLocale = getLocale(pathname)

  // If no locale in path, redirect to default locale
  if (!currentLocale) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
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
