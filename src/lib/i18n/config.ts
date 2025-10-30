import { Locale, LocaleInfo } from './types'

// Supported locales configuration
export const SUPPORTED_LOCALES: LocaleInfo[] = [
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇪🇬',
    dir: 'rtl'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr'
  }
]

// Default locale
export const DEFAULT_LOCALE: Locale = 'ar'

// Locale detection from browser
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  
  const browserLang = navigator.language.split('-')[0] as Locale
  return SUPPORTED_LOCALES.find(locale => locale.code === browserLang)?.code || DEFAULT_LOCALE
}

// Get locale info by code
export function getLocaleInfo(code: Locale): LocaleInfo {
  return SUPPORTED_LOCALES.find(locale => locale.code === code) || SUPPORTED_LOCALES[0]
}

// Check if locale is RTL
export function isRTL(locale: Locale): boolean {
  return getLocaleInfo(locale).dir === 'rtl'
}

// Get opposite direction arrow icon based on locale
export function getDirectionArrow(locale: Locale, forward: boolean = true): 'ArrowRight' | 'ArrowLeft' {
  const isRTLLocale = isRTL(locale)
  
  if (forward) {
    return isRTLLocale ? 'ArrowLeft' : 'ArrowRight'
  } else {
    return isRTLLocale ? 'ArrowRight' : 'ArrowLeft'
  }
}

// Format numbers based on locale
export function formatNumber(num: number, locale: Locale): string {
  const localeInfo = getLocaleInfo(locale)
  
  // Use appropriate locale for number formatting
  const formatLocale = locale === 'ar' ? 'ar-EG' : 
                      locale === 'es' ? 'es-ES' : 
                      locale === 'fr' ? 'fr-FR' : 'en-US'
  
  return new Intl.NumberFormat(formatLocale).format(num)
}

// Format dates based on locale
export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const formatLocale = locale === 'ar' ? 'ar-EG' : 
                      locale === 'es' ? 'es-ES' : 
                      locale === 'fr' ? 'fr-FR' : 'en-US'
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return new Intl.DateTimeFormat(formatLocale, options || defaultOptions).format(date)
}

// Get currency symbol for locale
export function getCurrencySymbol(locale: Locale): string {
  switch (locale) {
    case 'ar':
      return 'ج.م' // Egyptian Pound
    case 'en':
      return '$' // USD
    case 'es':
      return '€' // Euro
    case 'fr':
      return '€' // Euro
    default:
      return '$'
  }
}