import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '../../../lib/db'

interface ProductsLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProductsLayoutProps): Promise<Metadata> {
  const { locale } = await params
  
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'products' }
  })

  const titles = {
    ar: seoData?.titleAr || 'منتجاتنا',
    en: seoData?.titleEn || 'Our Products',
    es: seoData?.titleEs || 'Nuestros Productos',
    fr: seoData?.titleFr || 'Nos Produits'
  }

  const descriptions = {
    ar: seoData?.descriptionAr || 'اكتشف مجموعتنا الواسعة من الرخام والجرانيت',
    en: seoData?.descriptionEn || 'Discover our wide range of marble and granite',
    es: seoData?.descriptionEs || 'Descubra nuestra amplia gama de mármol y granito',
    fr: seoData?.descriptionFr || 'Découvrez notre large gamme de marbre et granit'
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

export default async function ProductsLayout({ children, params }: ProductsLayoutProps) {
  const { locale } = await params
  
  // Check if page is active
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'products' }
  })

  if (!seoData?.isActive) {
    return notFound()
  }

  return <>{children}</>
}
