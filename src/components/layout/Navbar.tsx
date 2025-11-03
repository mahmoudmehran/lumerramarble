'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from '../ui/button'
import { DarkModeToggle } from '../ui/dark-mode-toggle'
import { useTranslation, useNavTranslation } from '../../hooks/useTranslation'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSiteSettings } from '../../contexts/ThemeContext'
import type { Locale } from '../../lib/i18n/types'

interface NavbarProps {
  locale: Locale
}

export default function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()
  const nav = useNavTranslation()
  const { supportedLocales, setLocale } = useLanguage()
  const siteSettings = useSiteSettings()
  
  // Debug: Log settings to see what's loaded
  useEffect(() => {
    console.log('🔍 Navbar - Site Settings:', siteSettings)
    console.log('🖼️ Logo URL:', siteSettings?.logoUrl)
  }, [siteSettings])
  
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangOpen(false)
      }
    }

    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [langOpen])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        // Don't close if clicking the mobile menu button
        if (!target.closest('[aria-label="Open menu"]') && !target.closest('[aria-label="Close menu"]')) {
          setIsOpen(false)
        }
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const navigation = [
    { name: nav.home, href: `/${locale}` },
    { name: nav.products, href: `/${locale}/products` },
    { name: nav.about, href: `/${locale}/about` },
    { name: nav.export, href: `/${locale}/export` },
    { name: nav.blog, href: `/${locale}/blog` },
    { name: nav.contact, href: `/${locale}/contact` },
  ]

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-[var(--color-quinary)] shadow-lg sticky top-0 z-50 border-b border-[var(--color-quaternary-100)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always on the left/right side based on RTL */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {/* Show Logo if available, otherwise show fallback */}
                {siteSettings?.logoUrl ? (
                  <img
                    src={siteSettings.darkModeEnabled && siteSettings.darkModeLogoUrl 
                      ? siteSettings.darkModeLogoUrl 
                      : siteSettings.logoUrl
                    }
                    alt={locale === 'ar' ? siteSettings.logoAltAr || 'شعار الشركة' :
                         locale === 'es' ? siteSettings.logoAltEs || 'Logo de la Empresa' :
                         locale === 'fr' ? siteSettings.logoAltFr || 'Logo de l\'Entreprise' :
                         siteSettings.logoAlt || 'Company Logo'
                    }
                    className="max-h-24 max-w-[220px] h-auto w-auto object-contain"
                    loading="eager"
                    onError={(e) => {
                      console.error('❌ Logo failed to load:', siteSettings.logoUrl)
                      console.log('Current target:', e.currentTarget.src)
                    }}
                    onLoad={() => {
                      console.log('✅ Logo loaded successfully:', siteSettings.logoUrl)
                    }}
                  />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-700)] rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-[var(--color-quinary)] font-bold text-xl">L</span>
                    </div>
                    {/* Debug: Show when logoUrl is missing */}
                    {typeof window !== 'undefined' && window.location.search.includes('debug') && (
                      <span className="text-xs text-red-500">No Logo</span>
                    )}
                  </>
                )}
                <span className="font-bold text-lg sm:text-xl text-[var(--color-tertiary)] whitespace-nowrap">
                  {locale === 'ar' ? (siteSettings?.companyNameAr || 'لوميرا ماربل') : 
                   locale === 'es' ? (siteSettings?.companyNameEs || 'Lumerra Marble') :
                   locale === 'fr' ? (siteSettings?.companyNameFr || 'Lumerra Marble') :
                   (siteSettings?.companyName || 'Lumerra Marble')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered with equal spacing */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary-50)] border-b-2 border-[var(--color-primary)]'
                      : 'text-[var(--color-quaternary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-quinary-100)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {/* Dark Mode Toggle */}
            <DarkModeToggle enabled={siteSettings?.darkModeEnabled ?? false} />
            
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-[var(--color-quaternary)] hover:text-[var(--color-primary)] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-[var(--color-quaternary-200)] hover:border-[var(--color-primary)] hover:shadow-md bg-[var(--color-quinary)] h-10 min-w-[120px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="text-lg flex-shrink-0">{supportedLocales.find(lang => lang.code === locale)?.flag}</span>
                </div>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 min-w-[220px] bg-[var(--color-quinary)] rounded-lg shadow-2xl py-2 z-50 border-2 border-[var(--color-primary-100)]">
                  <div className="px-3 py-2 border-b border-[var(--color-quaternary-100)]">
                    <p className="text-xs font-semibold text-[var(--color-quaternary-600)] uppercase tracking-wide">
                      {t('common.language')}
                    </p>
                  </div>
                  {supportedLocales.map((lang) => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}`}
                      className={`flex items-center px-4 py-3 text-sm transition-all duration-200 ${
                        lang.code === locale 
                          ? 'bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-primary-100)] text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] rtl:border-l-0 rtl:border-r-4' 
                          : 'text-[var(--color-quaternary)] hover:bg-[var(--color-quinary-100)] hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1'
                      }`}
                      onClick={() => {
                        setLangOpen(false)
                        setLocale(lang.code)
                      }}
                    >
                      <span className="text-2xl mr-3 rtl:mr-0 rtl:ml-3 flex-shrink-0">{lang.flag}</span>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-base whitespace-nowrap overflow-hidden text-ellipsis">
                          {lang.nativeName}
                        </span>
                        {lang.code === locale && (
                          <span className="text-xs text-[var(--color-primary-600)] mt-0.5">
                            ✓ {t('common.active') || 'نشط'}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/quote`} className="flex-shrink-0">
              <Button size="default" className="shadow-md hover:shadow-lg whitespace-nowrap h-10 px-6 transition-all duration-200">
                {t('common.quote')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button - Always on the opposite side of logo */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[var(--color-quaternary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)] p-2 rounded-md"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden animate-slideDown" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--color-quinary-50)] border-t border-[var(--color-quaternary-200)]">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 ${
                  isActive(item.href)
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-50)] border-r-4 border-[var(--color-primary)] rtl:border-r-0 rtl:border-l-4'
                    : 'text-[var(--color-quaternary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-quinary-100)]'
                }`}
                style={{
                  animationDelay: `${index * 30}ms`,
                  animation: 'fadeInUp 0.3s ease-out forwards'
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Language Selector Mobile */}
            <div className="px-3 py-2 pt-4">
              <div className="text-xs font-semibold text-[var(--color-quaternary-600)] mb-3 uppercase tracking-wide">
                {t('common.language')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {supportedLocales.map((lang, index) => (
                  <Link
                    key={lang.code}
                    href={`/${lang.code}`}
                    className={`flex items-center justify-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      lang.code === locale
                        ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-700)] text-[var(--color-quinary)] shadow-lg shadow-[var(--color-primary)]/30 scale-105'
                        : 'bg-[var(--color-quinary)] text-[var(--color-quaternary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] hover:shadow-md border border-[var(--color-quaternary-200)] hover:border-[var(--color-primary-200)]'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.3s ease-out forwards'
                    }}
                    onClick={() => {
                      setIsOpen(false)
                      setLocale(lang.code)
                    }}
                  >
                    <span className={`mr-2 rtl:mr-0 rtl:ml-2 text-xl transition-transform duration-300 ${
                      lang.code === locale ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      {lang.flag}
                    </span>
                    <span className="whitespace-nowrap font-semibold">{lang.nativeName}</span>
                    {lang.code === locale && (
                      <span className="ml-1.5 rtl:ml-0 rtl:mr-1.5 text-xs animate-pulse">✓</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="px-3 py-2 pt-4">
              <Link 
                href={`/${locale}/quote`} 
                onClick={() => setIsOpen(false)}
                style={{
                  animation: 'fadeInUp 0.4s ease-out forwards',
                  animationDelay: '200ms'
                }}
              >
                <Button className="w-full group transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-700)] text-[var(--color-quinary)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-800)] h-11 shadow-md">
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {t('common.quote')}
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
