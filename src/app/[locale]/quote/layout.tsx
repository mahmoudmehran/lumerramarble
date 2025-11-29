import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '../../../lib/db'

interface QuoteLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: QuoteLayoutProps): Promise<Metadata> {
  const { locale } = await params
  
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'quote' }
  })

  const titles = {
    ar: seoData?.titleAr || 'طلب عرض سعر',
    en: seoData?.titleEn || 'Request a Quote',
    es: seoData?.titleEs || 'Solicitar Cotización',
    fr: seoData?.titleFr || 'Demander un Devis'
  }

  const descriptions = {
    ar: seoData?.descriptionAr || 'احصل على عرض سعر مخصص لمشروعك',
    en: seoData?.descriptionEn || 'Get a customized quote for your project',
    es: seoData?.descriptionEs || 'Obtenga una cotización personalizada para su proyecto',
    fr: seoData?.descriptionFr || 'Obtenez un devis personnalisé pour votre projet'
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

export default async function QuoteLayout({ children, params }: QuoteLayoutProps) {
  const { locale } = await params
  
  // Check if page is active
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'quote' }
  })

  if (!seoData?.isActive) {
    return notFound()
  }

  return <>{children}</>
}
