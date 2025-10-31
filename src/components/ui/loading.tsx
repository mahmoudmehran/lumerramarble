/**
 * Loading Components
 * مكونات تحميل متنوعة للاستخدام في جميع أنحاء التطبيق
 */

import React from 'react'

/**
 * Spinner - Loading دائري
 */
export function Spinner({ size = 'md', className = '' }: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        border-[var(--color-primary-200)] 
        border-t-[var(--color-primary-600)] 
        rounded-full 
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  )
}

/**
 * LoadingDots - ثلاث نقط متحركة
 */
export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <div className="w-2 h-2 bg-[var(--color-primary-600)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-[var(--color-primary-600)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-[var(--color-primary-600)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

/**
 * LoadingBar - شريط تحميل
 */
export function LoadingBar({ progress, className = '' }: { 
  progress?: number
  className?: string 
}) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] transition-all duration-300"
        style={{ 
          width: progress ? `${progress}%` : '0%',
          animation: !progress ? 'loading-bar 2s ease-in-out infinite' : 'none'
        }}
      />
    </div>
  )
}

/**
 * LoadingOverlay - طبقة تحميل كاملة
 */
export function LoadingOverlay({ 
  message = 'جاري التحميل...',
  className = '' 
}: { 
  message?: string
  className?: string 
}) {
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
}

/**
 * LoadingPage - صفحة تحميل كاملة
 */
export function LoadingPage({ message = 'جاري التحميل...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="xl" className="mx-auto mb-4" />
        <p className="text-xl text-gray-700 font-medium">{message}</p>
        <LoadingDots className="mt-4" />
      </div>
    </div>
  )
}

/**
 * LoadingCard - بطاقة تحميل
 */
export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-3" />
          <p className="text-gray-500 text-sm">جاري تحميل البيانات...</p>
        </div>
      </div>
    </div>
  )
}

/**
 * InlineLoader - تحميل في سطر واحد
 */
export function InlineLoader({ 
  text = 'جاري التحميل',
  className = '' 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Spinner size="sm" />
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  )
}

/**
 * ButtonLoader - تحميل داخل زر
 */
export function ButtonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Spinner size="sm" className="border-white border-t-white/30" />
      <span>جاري المعالجة...</span>
    </div>
  )
}
