'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Locale, LocaleInfo } from '../lib/i18n/types'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, detectLocale, getLocaleInfo } from '../lib/i18n/config'

interface LanguageContextType {
  locale: Locale
  localeInfo: LocaleInfo
  setLocale: (locale: Locale) => void
  supportedLocales: LocaleInfo[]
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || DEFAULT_LOCALE)
  const [isClient, setIsClient] = useState(false)

  // Detect client-side and set locale
  useEffect(() => {
    setIsClient(true)
    
    if (!initialLocale) {
      // Try to get from localStorage first
      const stored = localStorage.getItem('preferred-locale') as Locale
      if (stored && SUPPORTED_LOCALES.find(l => l.code === stored)) {
        setLocaleState(stored)
      } else {
        // Fallback to browser detection
        setLocaleState(detectLocale())
      }
    }
  }, [initialLocale])

  // Update locale and save to localStorage
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (isClient) {
      localStorage.setItem('preferred-locale', newLocale)
      
      // Update document direction and lang attribute
      document.documentElement.dir = getLocaleInfo(newLocale).dir
      document.documentElement.lang = newLocale
    }
  }

  // Update document attributes when locale changes
  useEffect(() => {
    if (isClient) {
      const localeInfo = getLocaleInfo(locale)
      document.documentElement.dir = localeInfo.dir
      document.documentElement.lang = locale
    }
  }, [locale, isClient])

  const localeInfo = getLocaleInfo(locale)
  const isRTL = localeInfo.dir === 'rtl'

  const value: LanguageContextType = {
    locale,
    localeInfo,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
    isRTL,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook for easy access to current locale
export function useLocale(): Locale {
  const { locale } = useLanguage()
  return locale
}

// Hook for easy access to RTL status
export function useIsRTL(): boolean {
  const { isRTL } = useLanguage()
  return isRTL
}