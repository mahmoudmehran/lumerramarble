'use client'

import { useCallback } from 'react'
import { Locale } from '../lib/i18n/types'
import { getTranslation, getTranslations, getTranslationWithParams, hasTranslation } from '../lib/i18n/translations'
import { useLanguage } from '../contexts/LanguageContext'

interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number>) => string
  locale: Locale
  hasKey: (key: string) => boolean
  translations: ReturnType<typeof getTranslations>
  changeLanguage: (newLocale: Locale) => void
}

export function useTranslation(): UseTranslationReturn {
  const { locale, setLocale } = useLanguage()

  // Main translation function
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      if (params) {
        return getTranslationWithParams(locale, key, params)
      }
      return getTranslation(locale, key)
    },
    [locale]
  )

  // Check if translation key exists
  const hasKey = useCallback(
    (key: string) => hasTranslation(locale, key),
    [locale]
  )

  // Get all translations for current locale
  const translations = getTranslations(locale)

  // Change language function
  const changeLanguage = useCallback(
    (newLocale: Locale) => {
      setLocale(newLocale)
    },
    [setLocale]
  )

  return {
    t,
    locale,
    hasKey,
    translations,
    changeLanguage,
  }
}

// Specialized hooks for common use cases

// Hook for navigation translations
export function useNavTranslation() {
  const { t } = useTranslation()
  
  return {
    home: t('navigation.home'),
    products: t('navigation.products'),
    about: t('navigation.about'),
    export: t('navigation.export'),
    blog: t('navigation.blog'),
    contact: t('navigation.contact'),
    admin: t('navigation.admin'),
    login: t('navigation.login'),
    logout: t('navigation.logout'),
  }
}

// Hook for common UI translations
export function useCommonTranslation() {
  const { t } = useTranslation()
  
  return {
    loading: t('common.loading'),
    save: t('common.save'),
    cancel: t('common.cancel'),
    edit: t('common.edit'),
    delete: t('common.delete'),
    submit: t('common.submit'),
    back: t('common.back'),
    next: t('common.next'),
    previous: t('common.previous'),
    close: t('common.close'),
    search: t('common.search'),
    filter: t('common.filter'),
    clear: t('common.clear'),
    viewAll: t('common.viewAll'),
    learnMore: t('common.learnMore'),
    readMore: t('common.readMore'),
    getStarted: t('common.getStarted'),
  }
}

// Hook for form validation messages
export function useValidationTranslation() {
  const { t } = useTranslation()
  
  return {
    required: t('errors.required'),
    invalid: t('errors.invalid'),
    networkError: t('errors.networkError'),
    serverError: t('errors.serverError'),
    notFound: t('errors.notFound'),
    unauthorized: t('errors.unauthorized'),
    forbidden: t('errors.forbidden'),
  }
}

// Hook for success messages
export function useSuccessTranslation() {
  const { t } = useTranslation()
  
  return {
    saved: t('success.saved'),
    updated: t('success.updated'),
    deleted: t('success.deleted'),
    sent: t('success.sent'),
    published: t('success.published'),
  }
}