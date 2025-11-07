import { getCachedProducts } from '../../../lib/cache'
import { PageHeader } from '../../../components/ui/page-sections'
import ProductsClient from './ProductsClient'

// ✅ Enable Static Site Generation with Revalidation (ISR)
export const revalidate = 3600 // Revalidate every hour

interface ProductsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; search?: string }>
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  // Await the params and searchParams promises
  const { locale } = await params
  const { category, search } = await searchParams

  // ✅ Server-side data fetching with caching
  const productsData = await getCachedProducts()
  
  // Transform products to match the client component interface
  const products = productsData.map(p => ({
    ...p,
    images: p.images as string | string[]
  }))

  const content = {
    ar: {
      title: 'منتجاتنا',
      subtitle: 'اكتشف مجموعتنا الواسعة من الأحجار الطبيعية الفاخرة'
    },
    en: {
      title: 'Our Products',
      subtitle: 'Discover our extensive collection of premium natural stones'
    },
    es: {
      title: 'Nuestros Productos',
      subtitle: 'Descubra nuestra extensa colección de piedras naturales premium'
    },
    fr: {
      title: 'Nos Produits',
      subtitle: 'Découvrez notre vaste collection de pierres naturelles premium'
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      {/* Header Section - Server Rendered */}
      <PageHeader
        title={currentContent.title}
        subtitle={currentContent.subtitle}
      />

      {/* Client Component for Interactive Features */}
      <ProductsClient 
        products={products}
        locale={locale}
        initialCategory={category}
        initialSearch={search}
      />
    </div>
  )
}

// ✅ Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  const titles = {
    ar: 'منتجاتنا - Lumerra Marble',
    en: 'Our Products - Lumerra Marble',
    es: 'Nuestros Productos - Lumerra Marble',
    fr: 'Nos Produits - Lumerra Marble'
  }

  const descriptions = {
    ar: 'استكشف مجموعتنا الواسعة من الرخام والجرانيت والكوارتز عالي الجودة من مصر',
    en: 'Explore our extensive collection of high-quality marble, granite, and quartz from Egypt',
    es: 'Explore nuestra extensa colección de mármol, granito y cuarzo de alta calidad de Egipto',
    fr: 'Découvrez notre vaste collection de marbre, granit et quartz de haute qualité d\'Égypte'
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en
  }
}
