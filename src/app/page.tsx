'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // Detect user language or default to Arabic
    const userLang = navigator.language.split('-')[0]
    const supportedLocales = ['ar', 'en', 'es', 'fr']
    const locale = supportedLocales.includes(userLang) ? userLang : 'ar'
    
    router.replace(`/${locale}`)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
