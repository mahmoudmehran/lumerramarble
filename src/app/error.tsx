'use client'

/**
 * Error Page for App Router
 * يظهر عند حدوث أخطاء في الصفحات
 */

import { useEffect } from 'react'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log للـ error tracking service
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            عذراً، حدث خطأ!
          </h1>
          <p className="text-gray-600 mb-2">
            نعتذر عن الإزعاج. حدث خطأ أثناء تحميل هذه الصفحة.
          </p>
          
          {error.digest && (
            <p className="text-sm text-gray-400 font-mono mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Development error details */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              Development Error:
            </h3>
            <pre className="text-xs text-red-700 overflow-auto whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-[var(--color-primary-600)] text-white rounded-lg hover:bg-[var(--color-primary-700)] transition-all active:scale-95"
          >
            إعادة المحاولة
          </button>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all active:scale-95"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          إذا استمرت المشكلة، يرجى{' '}
          <Link href="/ar/contact" className="text-[var(--color-primary-600)] hover:underline">
            الاتصال بنا
          </Link>
        </p>
      </div>
    </div>
  )
}
