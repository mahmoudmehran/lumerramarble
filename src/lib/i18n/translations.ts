import { Locale, TranslationKeys } from './types'
import { arTranslations } from './locales/ar'
import { enTranslations } from './locales/en'
import { esTranslations } from './locales/es'
import { frTranslations } from './locales/fr'

// Translation store
const translations: Record<Locale, TranslationKeys> = {
  ar: arTranslations,
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations
}

// Get translation function
export function getTranslation(locale: Locale, key: string, fallbackLocale: Locale = 'en'): string {
  const keys = key.split('.')
  let value: any = translations[locale]
  
  // Navigate through nested keys
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // If key not found, try fallback locale
      value = translations[fallbackLocale]
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          // If still not found, return the key itself
          return key
        }
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}

// Get all translations for a locale
export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] || translations.en
}

// Check if translation key exists
export function hasTranslation(locale: Locale, key: string): boolean {
  const keys = key.split('.')
  let value: any = translations[locale]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return false
    }
  }
  
  return typeof value === 'string'
}

// Get translation with interpolation
export function getTranslationWithParams(
  locale: Locale, 
  key: string, 
  params: Record<string, string | number> = {},
  fallbackLocale: Locale = 'en'
): string {
  let translation = getTranslation(locale, key, fallbackLocale)
  
  // Replace parameters in the format {{param}}
  Object.entries(params).forEach(([param, value]) => {
    const regex = new RegExp(`{{${param}}}`, 'g')
    translation = translation.replace(regex, String(value))
  })
  
  return translation
}

// Export translations for external use
export { translations }
export default translations