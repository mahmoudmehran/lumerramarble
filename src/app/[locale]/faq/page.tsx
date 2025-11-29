import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSiteSettings } from '@/lib/settings'
import {
  PageHeader,
  ContentSection,
  Grid
} from '@/components/ui/page-sections'

export const revalidate = 3600 // Revalidate every hour

interface FAQPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { locale } = await params
  const { prisma } = await import('@/lib/db')
  
  // Try to get custom SEO data
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'faq' }
  })

  const titles = {
    ar: seoData?.titleAr || 'الأسئلة الشائعة',
    en: seoData?.titleEn || 'Frequently Asked Questions',
    es: seoData?.titleEs || 'Preguntas Frecuentes',
    fr: seoData?.titleFr || 'Questions Fréquentes'
  }

  const descriptions = {
    ar: seoData?.descriptionAr || 'إجابات على الأسئلة الأكثر شيوعاً حول منتجاتنا وخدماتنا',
    en: seoData?.descriptionEn || 'Answers to the most common questions about our products and services',
    es: seoData?.descriptionEs || 'Respuestas a las preguntas más comunes sobre nuestros productos y servicios',
    fr: seoData?.descriptionFr || 'Réponses aux questions les plus courantes sur nos produits et services'
  }

  return {
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    ...(seoData?.ogImage && {
      openGraph: {
        images: [seoData.ogImage]
      }
    })
  }
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // Get SEO data to check if page is active
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'faq' }
  })

  // If page is not active, return 404
  if (!seoData?.isActive) {
    return notFound()
  }

  // Get FAQs from database
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })

  const siteSettings = await getSiteSettings()

  const titles = {
    ar: 'الأسئلة الشائعة',
    en: 'Frequently Asked Questions',
    es: 'Preguntas Frecuentes',
    fr: 'Questions Fréquentes'
  }

  const subtitles = {
    ar: 'إجابات على الأسئلة الأكثر شيوعاً',
    en: 'Answers to the Most Common Questions',
    es: 'Respuestas a las Preguntas Más Comunes',
    fr: 'Réponses aux Questions les Plus Courantes'
  }

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={titles[locale as keyof typeof titles]}
        subtitle={subtitles[locale as keyof typeof subtitles]}
        image={seoData?.ogImage || undefined}
      />

      <ContentSection>
        <div className="max-w-4xl mx-auto">
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {locale === 'ar' ? 'لا توجد أسئلة شائعة حالياً' : 'No FAQs available at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq: any) => (
                <FAQItem
                  key={faq.id}
                  question={faq[`question${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof faq] as string}
                  answer={faq[`answer${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof faq] as string}
                  isRTL={isRTL}
                />
              ))}
            </div>
          )}
        </div>
      </ContentSection>
    </div>
  )
}

function FAQItem({ question, answer, isRTL }: { question: string; answer: string; isRTL: boolean }) {
  return (
    <details className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors">
        <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex-1">
          {question}
        </h3>
        <ChevronDown className="w-5 h-5 text-[var(--color-primary)] group-open:hidden" />
        <ChevronUp className="w-5 h-5 text-[var(--color-primary)] hidden group-open:block" />
      </summary>
      <div className="px-6 pb-6 pt-2">
        <div 
          className="text-gray-700 leading-relaxed prose max-w-none"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </details>
  )
}
