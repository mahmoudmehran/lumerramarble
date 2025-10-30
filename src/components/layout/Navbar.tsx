'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from '../ui/button'
import { useTranslation, useNavTranslation } from '../../hooks/useTranslation'
import { useLanguage } from '../../contexts/LanguageContext'
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
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex-shrink-0">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-700)] rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-[var(--color-quinary)] font-bold text-xl">L</span>
                </div>
                <span className="font-bold text-xl text-[var(--color-tertiary)]">
                  {locale === 'ar' ? 'لوميرا ماربل' : 'Lumerra Marble'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-50)] border-b-2 border-[var(--color-primary)]'
                    : 'text-[var(--color-quaternary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-quinary-100)]'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 rtl:space-x-reverse text-[var(--color-quaternary)] hover:text-[var(--color-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors border border-[var(--color-quaternary-200)] hover:border-[var(--color-primary)]"
              >
                <Globe className="w-4 h-4" />
                <span className="text-lg">{supportedLocales.find(lang => lang.code === locale)?.flag}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {langOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-[var(--color-quinary)] rounded-md shadow-lg py-1 z-50 border border-[var(--color-quaternary-100)]">
                  {supportedLocales.map((lang) => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}`}
                      className="flex items-center px-4 py-2 text-sm text-[var(--color-quaternary)] hover:bg-[var(--color-quinary-100)] hover:text-[var(--color-primary)] transition-colors"
                      onClick={() => {
                        setLangOpen(false)
                        setLocale(lang.code)
                      }}
                    >
                      <span className="mr-2 rtl:mr-0 rtl:ml-2 text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.nativeName}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/quote`}>
              <Button size="default" className="shadow-md">
                {t('common.quote')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[var(--color-quaternary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)] p-2"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--color-quinary-50)] border-t border-[var(--color-quaternary-200)]">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-50)] border-r-4 border-[var(--color-primary)] rtl:border-r-0 rtl:border-l-4'
                    : 'text-[var(--color-quaternary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-quinary-100)]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Language Selector Mobile */}
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-[var(--color-quaternary-600)] mb-2">
                {t('common.language')}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {supportedLocales.map((lang) => (
                  <Link
                    key={lang.code}
                    href={`/${lang.code}`}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm transition-colors ${
                      lang.code === locale
                        ? 'bg-[var(--color-primary)] text-[var(--color-quinary)]'
                        : 'bg-[var(--color-quinary)] text-[var(--color-quaternary)] hover:bg-[var(--color-quinary-100)]'
                    }`}
                    onClick={() => {
                      setIsOpen(false)
                      setLocale(lang.code)
                    }}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.nativeName}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="px-3 py-2 pt-4">
              <Link href={`/${locale}/quote`}>
                <Button className="w-full group transition-all duration-300 hover:scale-105 hover:shadow-lg bg-[var(--color-primary)] text-[var(--color-quinary)] hover:bg-[var(--color-primary-700)]">
                  {t('common.quote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
