import { Locale } from './i18n/types'

// Utility functions for internationalization

/**
 * Generate localized URL path
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash if exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Return localized path
  return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`
}

/**
 * Extract locale from URL path
 */
export function getLocaleFromPath(path: string): { locale: Locale | null; cleanPath: string } {
  const segments = path.split('/').filter(Boolean)
  
  if (segments.length > 0) {
    const firstSegment = segments[0] as Locale
    const supportedLocales: Locale[] = ['ar', 'en', 'es', 'fr']
    
    if (supportedLocales.includes(firstSegment)) {
      return {
        locale: firstSegment,
        cleanPath: '/' + segments.slice(1).join('/')
      }
    }
  }
  
  return {
    locale: null,
    cleanPath: path
  }
}

/**
 * Format currency based on locale
 */
export function formatCurrency(amount: number, locale: Locale, currency?: string): string {
  const currencyCode = currency || getCurrencyCode(locale)
  
  const formatLocale = getFormatLocale(locale)
  
  return new Intl.NumberFormat(formatLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage based on locale
 */
export function formatPercentage(value: number, locale: Locale): string {
  const formatLocale = getFormatLocale(locale)
  
  return new Intl.NumberFormat(formatLocale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

/**
 * Format large numbers with appropriate suffixes
 */
export function formatLargeNumber(num: number, locale: Locale): string {
  const suffixes = {
    ar: ['', 'ألف', 'مليون', 'مليار'],
    en: ['', 'K', 'M', 'B'],
    es: ['', 'K', 'M', 'B'],
    fr: ['', 'K', 'M', 'B']
  }
  
  const localeSuffixes = suffixes[locale] || suffixes.en
  const tier = Math.log10(Math.abs(num)) / 3 | 0
  
  if (tier === 0) return num.toString()
  
  const suffix = localeSuffixes[tier] || localeSuffixes[localeSuffixes.length - 1]
  const scale = Math.pow(10, tier * 3)
  const scaled = num / scale
  
  return scaled.toFixed(1).replace(/\.0$/, '') + suffix
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date, locale: Locale): string {
  const formatLocale = getFormatLocale(locale)
  const rtf = new Intl.RelativeTimeFormat(formatLocale, { numeric: 'auto' })
  
  const now = new Date()
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, interval.label as Intl.RelativeTimeFormatUnit)
    }
  }
  
  return rtf.format(0, 'second')
}

/**
 * Pluralize text based on count and locale
 */
export function pluralize(count: number, singular: string, plural: string, locale: Locale): string {
  // Arabic has complex plural rules
  if (locale === 'ar') {
    if (count === 0) return `لا ${plural}`
    if (count === 1) return singular
    if (count === 2) return `${singular}ان` // dual form
    if (count >= 3 && count <= 10) return `${count} ${plural}`
    return `${count} ${singular}`
  }
  
  // For other languages, use simple English rules
  return count === 1 ? singular : plural
}

/**
 * Get currency code for locale
 */
function getCurrencyCode(locale: Locale): string {
  switch (locale) {
    case 'ar':
      return 'EGP' // Egyptian Pound
    case 'en':
      return 'USD'
    case 'es':
    case 'fr':
      return 'EUR'
    default:
      return 'USD'
  }
}

/**
 * Get Intl formatting locale string
 */
function getFormatLocale(locale: Locale): string {
  switch (locale) {
    case 'ar':
      return 'ar-EG'
    case 'en':
      return 'en-US'
    case 'es':
      return 'es-ES'
    case 'fr':
      return 'fr-FR'
    default:
      return 'en-US'
  }
}

/**
 * Clean and normalize text for search/comparison
 */
export function normalizeText(text: string, locale: Locale): string {
  // Remove diacritics and normalize for Arabic
  if (locale === 'ar') {
    return text
      .replace(/[ًٌٍَُِْ]/g, '') // Remove diacritics
      .replace(/[آأإ]/g, 'ا') // Normalize alif variations
      .replace(/ة/g, 'ه') // Normalize taa marbouta
      .trim()
      .toLowerCase()
  }
  
  // For other locales, basic normalization
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim()
    .toLowerCase()
}

/**
 * Sort array of objects by localized string property
 */
export function sortByLocalizedProperty<T>(
  array: T[],
  propertyGetter: (item: T) => string,
  locale: Locale,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const formatLocale = getFormatLocale(locale)
  const collator = new Intl.Collator(formatLocale, { 
    numeric: true, 
    sensitivity: 'base' 
  })
  
  return [...array].sort((a, b) => {
    const valueA = propertyGetter(a)
    const valueB = propertyGetter(b)
    const result = collator.compare(valueA, valueB)
    return order === 'desc' ? -result : result
  })
}