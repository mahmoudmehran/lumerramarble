'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from '../ui/button'

interface NavbarProps {
  locale: string
}

export default function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'الرئيسية', nameEn: 'Home', href: `/${locale}` },
    { name: 'المنتجات', nameEn: 'Products', href: `/${locale}/products` },
    { name: 'عن الشركة', nameEn: 'About', href: `/${locale}/about` },
    { name: 'خدمات التصدير', nameEn: 'Export', href: `/${locale}/export` },
    { name: 'المدونة', nameEn: 'Blog', href: `/${locale}/blog` },
    { name: 'تواصل معنا', nameEn: 'Contact', href: `/${locale}/contact` },
  ]

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇪🇬' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ]

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex-shrink-0">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-secondary-900">
                  Lumerra Marble
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-600'
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {locale === 'ar' ? item.name : item.nameEn}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 rtl:space-x-reverse text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Globe className="w-4 h-4" />
                <span>{languages.find(lang => lang.code === locale)?.flag}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {langOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}`}
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-gray-100"
                      onClick={() => setLangOpen(false)}
                    >
                      <span className="mr-2 rtl:mr-0 rtl:ml-2">{lang.flag}</span>
                      {lang.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/quote`}>
              <Button variant="default" size="sm" className="group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                {locale === 'ar' ? 'طلب عرض سعر' : 'Request Quote'}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600 rtl:border-r-0 rtl:border-l-4'
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {locale === 'ar' ? item.name : item.nameEn}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Link href={`/${locale}/quote`}>
                <Button variant="default" size="sm" className="w-full group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  {locale === 'ar' ? 'طلب عرض سعر' : 'Request Quote'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
