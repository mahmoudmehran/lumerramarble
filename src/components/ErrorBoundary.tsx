'use client'

/**
 * Global Error Boundary Component
 * يمسك الأخطاء في React components ويعرض UI بديل
 */

import { Component, ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log only in development or send to error tracking service
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    // Add error tracking service here (e.g., Sentry)
    // Example: Sentry.captureException(error, { contexts: { errorInfo } })
  }

  render() {
    if (this.state.hasError) {
      // إذا في custom fallback، استخدمه
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                عذراً، حدث خطأ ما
              </h1>
              <p className="text-gray-600 mb-6">
                نعتذر عن الإزعاج. حدث خطأ غير متوقع في التطبيق.
              </p>
            </div>

            {/* Error details (فقط في development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-lg text-left">
                <h3 className="text-sm font-semibold text-[var(--color-error-800)] mb-2">
                  Error Details (Development Only):
                </h3>
                <pre className="text-xs text-[var(--color-error-700)] overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                className="w-full px-6 py-3 bg-[var(--color-primary-600)] text-white rounded-lg hover:bg-[var(--color-primary-700)] transition-colors"
              >
                إعادة تحميل الصفحة
              </button>
              
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Page Error Boundary - للصفحات الفردية
 */
export function PageErrorBoundary({ 
  children, 
  pageName 
}: { 
  children: ReactNode
  pageName?: string 
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="text-5xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              حدث خطأ في {pageName || 'هذه الصفحة'}
            </h2>
            <p className="text-gray-600 mb-6">
              نعتذر عن هذا الإزعاج. يرجى المحاولة مرة أخرى.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[var(--color-primary-600)] text-white rounded-lg hover:bg-[var(--color-primary-700)] transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * API Error Boundary - للـ API calls
 */
export function APIErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">❌</div>
            <div>
              <h3 className="font-semibold text-[var(--color-error-800)] mb-1">
                خطأ في الاتصال بالخادم
              </h3>
              <p className="text-sm text-[var(--color-error-700)]">
                تعذر تحميل البيانات. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.
              </p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
