'use client'

/**
 * Global Error Page
 * يظهر عند حدوث أخطاء في Server Components أو API Routes
 */

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">💥</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Something went wrong!
              </h1>
              <p className="text-gray-600 mb-2">
                حدث خطأ غير متوقع في النظام
              </p>
              
              {/* Error digest (للـ debugging) */}
              {error.digest && (
                <p className="text-sm text-gray-500 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            {/* Error details في development فقط */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Development Error Details:
                </h3>
                <pre className="text-xs text-red-700 overflow-auto whitespace-pre-wrap">
                  {error.message}
                </pre>
                {error.stack && (
                  <pre className="text-xs text-red-600 overflow-auto mt-2 max-h-40">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Try Again / إعادة المحاولة
              </button>
              
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Home / العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
