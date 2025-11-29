import { Award, Calendar, Building2, ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getSiteSettings } from '@/lib/settings'
import {
  PageHeader,
  ContentSection,
  Grid
} from '@/components/ui/page-sections'
import { Button } from '@/components/ui/button'

export const revalidate = 3600 // Revalidate every hour

interface CertificatesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CertificatesPageProps): Promise<Metadata> {
  const { locale } = await params
  const { prisma } = await import('@/lib/db')
  
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'certificates' }
  })

  const titles = {
    ar: seoData?.titleAr || 'شهادات الجودة',
    en: seoData?.titleEn || 'Quality Certificates',
    es: seoData?.titleEs || 'Certificados de Calidad',
    fr: seoData?.titleFr || 'Certificats de Qualité'
  }

  const descriptions = {
    ar: seoData?.descriptionAr || 'شهادات الجودة والاعتماد الدولية للشركة',
    en: seoData?.descriptionEn || 'International quality and accreditation certificates',
    es: seoData?.descriptionEs || 'Certificados internacionales de calidad y acreditación',
    fr: seoData?.descriptionFr || 'Certificats internationaux de qualité et d\'accréditation'
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

export default async function CertificatesPage({ params }: CertificatesPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // Get SEO data to check if page is active
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'certificates' }
  })

  // If page is not active, return 404
  if (!seoData?.isActive) {
    return notFound()
  }

  // Get certificates from database
  const certificates = await prisma.certificate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })

  const siteSettings = await getSiteSettings()

  const titles = {
    ar: 'شهادات الجودة',
    en: 'Quality Certificates',
    es: 'Certificados de Calidad',
    fr: 'Certificats de Qualité'
  }

  const subtitles = {
    ar: 'شهادات الجودة والاعتماد الدولية',
    en: 'International Quality and Accreditation Certificates',
    es: 'Certificados Internacionales de Calidad y Acreditación',
    fr: 'Certificats Internationaux de Qualité et d\'Accréditation'
  }

  const labels = {
    issuer: {
      ar: 'الجهة المانحة',
      en: 'Issuer',
      es: 'Emisor',
      fr: 'Émetteur'
    },
    issueDate: {
      ar: 'تاريخ الإصدار',
      en: 'Issue Date',
      es: 'Fecha de Emisión',
      fr: 'Date d\'Émission'
    },
    expiryDate: {
      ar: 'تاريخ الانتهاء',
      en: 'Expiry Date',
      es: 'Fecha de Expiración',
      fr: 'Date d\'Expiration'
    },
    viewCertificate: {
      ar: 'عرض الشهادة',
      en: 'View Certificate',
      es: 'Ver Certificado',
      fr: 'Voir le Certificat'
    }
  }

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={titles[locale as keyof typeof titles]}
        subtitle={subtitles[locale as keyof typeof subtitles]}
        image={seoData?.ogImage || undefined}
      />

      <ContentSection>
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {locale === 'ar' ? 'لا توجد شهادات متاحة حالياً' : 'No certificates available at the moment'}
            </p>
          </div>
        ) : (
          <Grid cols={3}>
            {certificates.map((cert: any) => {
              const name = cert[`name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof cert] as string
              const description = cert[`description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof cert] as string
              const issuer = cert[`issuer${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof cert] as string || cert.issuer

              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {cert.imageUrl && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={cert.imageUrl}
                        alt={name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-3">
                      {name}
                    </h3>
                    {description && (
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {description}
                      </p>
                    )}
                    {issuer && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{labels.issuer[locale as keyof typeof labels.issuer]}:</span>
                        <span>{issuer}</span>
                      </div>
                    )}
                    {cert.issueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{labels.issueDate[locale as keyof typeof labels.issueDate]}:</span>
                        <span>{new Date(cert.issueDate).toLocaleDateString(locale)}</span>
                      </div>
                    )}
                    {cert.expiryDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{labels.expiryDate[locale as keyof typeof labels.expiryDate]}:</span>
                        <span>{new Date(cert.expiryDate).toLocaleDateString(locale)}</span>
                      </div>
                    )}
                    {cert.certificateUrl && (
                      <Link href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          className="w-full"
                          variant="outline"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {labels.viewCertificate[locale as keyof typeof labels.viewCertificate]}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </Grid>
        )}
      </ContentSection>
    </div>
  )
}
