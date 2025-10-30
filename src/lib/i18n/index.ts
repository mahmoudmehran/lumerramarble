// Main i18n exports for easy importing

// Types
export type { 
  Locale, 
  LocaleInfo, 
  TranslationKeys, 
  TranslationsPartial, 
  TranslationNamespace 
} from './types'

// Configuration
export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  detectLocale,
  getLocaleInfo,
  isRTL,
  getDirectionArrow,
  formatNumber,
  formatDate,
  getCurrencySymbol
} from './config'

// Translation functions
export {
  getTranslation,
  getTranslations,
  getTranslationWithParams,
  hasTranslation,
  translations
} from './translations'

// Utility functions
export {
  getLocalizedPath,
  getLocaleFromPath,
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  getRelativeTime,
  pluralize,
  normalizeText,
  sortByLocalizedProperty
} from '../i18n-utils'