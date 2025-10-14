'use client'

import { useEffect } from 'react'

interface ClientLayoutProps {
  locale: string
  children: React.ReactNode
}

export default function ClientLayout({ locale, children }: ClientLayoutProps) {
  const isRTL = locale === 'ar'

  useEffect(() => {
    // Update document attributes after mount
    document.documentElement.lang = locale
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.className = isRTL ? 'arabic' : 'latin'
  }, [locale, isRTL])

  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  )
}
