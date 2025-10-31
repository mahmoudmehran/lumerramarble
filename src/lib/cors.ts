/**
 * CORS Security Configuration
 * تأمين الـ API من الطلبات غير المصرح بها
 */

import { NextRequest, NextResponse } from 'next/server'

// Allowed origins - يمكن تعديلها حسب الحاجة
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://lumerramarble.com',
  'https://www.lumerramarble.com',
  // أضف domains الإنتاج هنا
]

// Allowed methods
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']

// Allowed headers
const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin'
]

/**
 * CORS headers helper
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  // التحقق من أن الـ origin مسموح به
  const isAllowedOrigin = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:')
  )

  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
    'Access-Control-Allow-Headers': ALLOWED_HEADERS.join(', '),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

/**
 * Handle OPTIONS requests (preflight)
 */
export function handleCorsOptions(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin')
  
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin)
  })
}

/**
 * Add CORS headers to response
 */
export function withCors(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

/**
 * Security headers helper
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // منع XSS attacks
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join('; '),
    
    // Strict Transport Security (HTTPS only)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
}
