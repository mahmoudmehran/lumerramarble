import { notFound } from 'next/navigation'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const locales = ['ar', 'en', 'es', 'fr']

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params
  
  if (!locales.includes(locale)) {
    notFound()
  }

  const isRTL = locale === 'ar'

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div 
          className="min-h-screen flex flex-col" 
          dir={isRTL ? 'rtl' : 'ltr'}
          data-locale={isRTL ? 'arabic' : 'latin'}
        >
          <Navbar locale={locale} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
