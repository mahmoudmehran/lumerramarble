import { BookOpen, FileText } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSiteSettings } from '@/lib/settings'
import {
  PageHeader,
  ContentSection
} from '@/components/ui/page-sections'

export const revalidate = 3600 // Revalidate every hour

interface ExportGuidePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ExportGuidePageProps): Promise<Metadata> {
  const { locale } = await params
  const { prisma } = await import('@/lib/db')
  
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'export-guide' }
  })

  const titles = {
    ar: seoData?.titleAr || 'دليل التصدير',
    en: seoData?.titleEn || 'Export Guide',
    es: seoData?.titleEs || 'Guía de Exportación',
    fr: seoData?.titleFr || 'Guide d\'Exportation'
  }

  const descriptions = {
    ar: seoData?.descriptionAr || 'دليل شامل لعمليات التصدير والإجراءات والمتطلبات',
    en: seoData?.descriptionEn || 'Comprehensive guide to export processes, procedures and requirements',
    es: seoData?.descriptionEs || 'Guía completa de procesos, procedimientos y requisitos de exportación',
    fr: seoData?.descriptionFr || 'Guide complet des processus, procédures et exigences d\'exportation'
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

export default async function ExportGuidePage({ params }: ExportGuidePageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // Get SEO data to check if page is active
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'export-guide' }
  })

  // If page is not active, return 404
  if (!seoData?.isActive) {
    return notFound()
  }

  // Get export guide items from database
  const guides = await prisma.exportGuide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })

  const siteSettings = await getSiteSettings()

  const titles = {
    ar: 'دليل التصدير',
    en: 'Export Guide',
    es: 'Guía de Exportación',
    fr: 'Guide d\'Exportation'
  }

  const subtitles = {
    ar: 'دليل شامل لعمليات التصدير والإجراءات',
    en: 'Comprehensive Guide to Export Processes and Procedures',
    es: 'Guía Completa de Procesos y Procedimientos de Exportación',
    fr: 'Guide Complet des Processus et Procédures d\'Exportation'
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
          {guides.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {locale === 'ar' ? 'لا توجد معلومات متاحة حالياً' : 'No information available at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {guides.map((guide: any, index: number) => {
                const title = guide[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof guide] as string
                const content = guide[`content${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof guide] as string

                return (
                  <div
                    key={guide.id}
                    className="bg-white rounded-lg shadow-md p-8 border-l-4 border-[var(--color-primary)]"
                  >
                    <div className="flex items-start gap-4">
                      {guide.icon && (
                        <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary)] bg-opacity-10 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">
                          {index + 1}. {title}
                        </h2>
                        <div
                          className="prose max-w-none text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ContentSection>
    </div>
  )
}
