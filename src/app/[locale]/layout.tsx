import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { LanguageProvider } from '../../contexts/LanguageContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { RecaptchaProvider } from '../../contexts/RecaptchaContext'
import { ThemeWrapper } from '../../components/ThemeWrapper'
import { AnalyticsScripts } from '../../components/AnalyticsScripts'
import WhatsAppButton from '../../components/WhatsAppButton'
import { OrganizationSchema } from '../../components/seo/StructuredData'
import { SUPPORTED_LOCALES } from '../../lib/i18n/config'
import { getSiteSettings } from '../../lib/settings'
import type { Locale } from '../../lib/i18n/types'

const locales = SUPPORTED_LOCALES.map(l => l.code)

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

/**
 * Generate metadata dynamically from settings
 */
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  
  // Get locale-specific meta data
  const metaTitle = 
    locale === 'ar' ? (settings.metaTitleAr || settings.metaTitle) :
    locale === 'es' ? (settings.metaTitleEs || settings.metaTitle) :
    locale === 'fr' ? (settings.metaTitleFr || settings.metaTitle) :
    settings.metaTitle
  
  const metaDescription = 
    locale === 'ar' ? (settings.metaDescriptionAr || settings.metaDescription) :
    locale === 'es' ? (settings.metaDescriptionEs || settings.metaDescription) :
    locale === 'fr' ? (settings.metaDescriptionFr || settings.metaDescription) :
    settings.metaDescription
  
  const keywords = 
    locale === 'ar' ? (settings.keywordsAr || settings.keywords) :
    locale === 'es' ? (settings.keywordsEs || settings.keywords) :
    locale === 'fr' ? (settings.keywordsFr || settings.keywords) :
    settings.keywords
  
  // Build canonical URL
  const canonicalBase = settings.canonicalUrl || 'https://lumerramarble.com'
  const canonicalUrl = `${canonicalBase}/${locale}`
  
  // Determine robots meta based on settings
  const robotsContent = []
  if (settings.seoIndexing) robotsContent.push('index')
  else robotsContent.push('noindex')
  
  if (settings.seoFollowLinks) robotsContent.push('follow')
  else robotsContent.push('nofollow')

  return {
    title: metaTitle || `${settings.companyName} - Premium Marble & Granite Export`,
    description: metaDescription || settings.description,
    keywords: keywords,
    authors: [{ name: settings.companyName }],
    creator: settings.companyName,
    publisher: settings.companyName,
    robots: robotsContent.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ar': `${canonicalBase}/ar`,
        'en': `${canonicalBase}/en`,
        'es': `${canonicalBase}/es`,
        'fr': `${canonicalBase}/fr`,
      }
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : locale === 'es' ? 'es_ES' : locale === 'fr' ? 'fr_FR' : 'en_US',
      url: canonicalUrl,
      siteName: settings.companyName,
      title: metaTitle || settings.companyName,
      description: metaDescription || settings.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle || settings.companyName,
      description: metaDescription || settings.description,
    },
  }
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
  
  // Load site settings for theme
  const settings = await getSiteSettings()

  return (
    <>
      <OrganizationSchema locale={typedLocale} />
      <AnalyticsScripts
        googleAnalyticsId={settings.googleAnalyticsId}
        googleTagManagerId={settings.googleTagManagerId}
        facebookPixelId={settings.facebookPixelId}
        linkedinPartnerId={settings.linkedinPartnerId}
        tiktokPixelId={settings.tiktokPixelId}
        bingAdsId={settings.bingAdsId}
      />
      <ThemeWrapper settings={settings}>
        <ThemeProvider>
            <RecaptchaProvider 
              siteKey={settings.recaptchaSiteKey || ''}
              enabled={settings.enableRecaptcha ?? false}
            >
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
                  <Footer locale={typedLocale} copyrightText={settings.copyrightText} />
                  
                  {/* WhatsApp Floating Button */}
                  <WhatsAppButton 
                    phoneNumber={settings.phone || settings.whatsapp || ''}
                    greeting={settings.whatsappGreeting || undefined}
                    buttonText={settings.whatsappButtonText || undefined}
                    position={settings.whatsappPosition || undefined}
                    showOnMobile={settings.whatsappShowOnMobile ?? true}
                    showOnDesktop={settings.whatsappShowOnDesktop ?? true}
                  />
                </div>
              </LanguageProvider>
            </RecaptchaProvider>
          </ThemeProvider>
        </ThemeWrapper>
    </>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
