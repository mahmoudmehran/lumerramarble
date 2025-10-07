import { notFound } from 'next/navigation'
import Navbar from 'bklumerra/components/layout/Navbar'
import Footer from 'bklumerra/components/layout/Footer'

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
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`min-h-screen flex flex-col ${isRTL ? 'font-arabic' : 'font-latin'}`}>
        <Navbar locale={locale} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
