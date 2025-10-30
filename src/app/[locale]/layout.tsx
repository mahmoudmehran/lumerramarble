import { notFound } from 'next/navigation'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { LanguageProvider } from '../../contexts/LanguageContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { OrganizationSchema } from '../../components/seo/StructuredData'
import { SUPPORTED_LOCALES } from '../../lib/i18n/config'
import type { Locale } from '../../lib/i18n/types'

const locales = SUPPORTED_LOCALES.map(l => l.code)

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params
  
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const isRTL = typedLocale === 'ar'

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <OrganizationSchema locale={typedLocale} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider initialLocale={typedLocale}>
            <div 
              className="min-h-screen flex flex-col" 
              dir={isRTL ? 'rtl' : 'ltr'}
              data-locale={isRTL ? 'arabic' : 'latin'}
            >
              <Navbar locale={typedLocale} />
              <main className="flex-grow">
                {children}
              </main>
              <Footer locale={typedLocale} />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
