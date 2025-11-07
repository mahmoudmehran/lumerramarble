import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  ArrowLeft, 
  ArrowRight, 
  Package, 
  Ruler,
  Palette,
  MapPin, 
  Star
} from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Card } from '../../../../components/ui/card'
import { getContent } from '../../../../lib/content'
import { prisma } from '../../../../lib/db'
import { notFound } from 'next/navigation'
import { getCachedProductById, getCachedProducts } from '../../../../lib/cache'

// ✅ Dynamic import for ProductGallery (code splitting)
const ProductGallery = dynamic(() => import('./ProductGallery'), {
  loading: () => (
    <div className="w-full h-[500px] bg-[var(--color-quaternary-100)] animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-[var(--color-quaternary-400)]">Loading gallery...</p>
    </div>
  )
})

// ✅ Enable Static Site Generation with Revalidation (ISR)
export const revalidate = 3600 // Revalidate every hour

// ✅ Generate static params for all products
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { id: true }
  })
  
  // Generate params for all locales
  const locales = ['ar', 'en', 'es', 'fr']
  const params: { locale: string; id: string }[] = []
  
  locales.forEach(locale => {
    products.forEach(product => {
      params.push({
        locale,
        id: product.id
      })
    })
  })
  
  return params
}

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>
}

// Function to get product from database
async function getProductById(id: string) {
  try {
    // ✅ Use cached version
    const product = await getCachedProductById(id)
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Function to get related products
async function getRelatedProducts(category: string, currentProductId: string, limit = 3) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: category as any,
        id: { not: currentProductId },
        active: true
      },
      take: limit
    })
    return products
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params
  const isRTL = locale === 'ar'
  
  // Get product from database
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  // Debug: Log product data
  console.log('Product data:', {
    id: product.id,
    nameAr: product.nameAr,
    nameEn: product.nameEn,
    category: product.category,
    thickness: product.thickness,
    finishes: product.finishes,
    originCountry: product.originCountry,
    images: product.images
  })

  // Get related products
  const relatedProducts = await getRelatedProducts(product.category, product.id)

  // Debug: Log related products
  console.log('Related products count:', relatedProducts.length)
  if (relatedProducts.length > 0) {
    console.log('First related product:', {
      id: relatedProducts[0].id,
      name: relatedProducts[0].nameAr,
      images: relatedProducts[0].images,
      imagesType: typeof relatedProducts[0].images
    })
  }

  // Helper function to get localized product name
  const getProductName = (product: any) => {
    switch(locale) {
      case 'ar': return product.nameAr
      case 'en': return product.nameEn
      case 'es': return product.nameEs
      case 'fr': return product.nameFr
      default: return product.nameAr
    }
  }

  // Helper function to get localized product description
  const getProductDescription = (product: any) => {
    switch(locale) {
      case 'ar': return product.descriptionAr
      case 'en': return product.descriptionEn
      case 'es': return product.descriptionEs
      case 'fr': return product.descriptionFr
      default: return product.descriptionAr
    }
  }

  // Helper function to get localized category name
  const getCategoryName = (category: string) => {
    const categories = {
      MARBLE: {
        ar: 'رخام',
        en: 'Marble',
        es: 'Mármol',
        fr: 'Marbre'
      },
      GRANITE: {
        ar: 'جرانيت',
        en: 'Granite',
        es: 'Granito',
        fr: 'Granit'
      },
      QUARTZ: {
        ar: 'كوارتز',
        en: 'Quartz',
        es: 'Cuarzo',
        fr: 'Quartz'
      },
      SPECIAL: {
        ar: 'منتجات خاصة',
        en: 'Special Products',
        es: 'Productos Especiales',
        fr: 'Produits Spéciaux'
      }
    }
    return categories[category as keyof typeof categories]?.[locale as keyof typeof categories.MARBLE] || category
  }

  // Helper function to get localized finish names
  const getFinishName = (finish: string) => {
    const finishes: Record<string, Record<string, string>> = {
      'Polished': { ar: 'لامع', en: 'Polished', es: 'Pulido', fr: 'Poli' },
      'Honed': { ar: 'مطفي', en: 'Honed', es: 'Abrillantado', fr: 'Adouci' },
      'Brushed': { ar: 'فرشاة', en: 'Brushed', es: 'Cepillado', fr: 'Brossé' },
      'Flamed': { ar: 'نار', en: 'Flamed', es: 'Flameado', fr: 'Flammé' },
      'Sandblasted': { ar: 'رمل', en: 'Sandblasted', es: 'Arenado', fr: 'Sablé' },
      'Bush Hammered': { ar: 'مطرقي', en: 'Bush Hammered', es: 'Abujardado', fr: 'Bouchardé' },
      'Antique': { ar: 'عتيق', en: 'Antique', es: 'Antiguo', fr: 'Antique' }
    }
    return finishes[finish]?.[locale] || finish
  }

  // Function to translate finishes string
  const getLocalizedFinishes = (finishesStr: string) => {
    if (!finishesStr || finishesStr.trim() === '') return 'N/A'
    const finishesArray = finishesStr.split(',').map(f => f.trim()).filter(f => f)
    if (finishesArray.length === 0) return 'N/A'
    const translatedFinishes = finishesArray.map(finish => getFinishName(finish))
    return translatedFinishes.join(', ')
  }

  // Static content for product page
  const labels = {
    ar: {
      backToProducts: 'العودة للمنتجات',
      requestQuote: 'طلب عرض سعر',
      specifications: 'المواصفات',
      thickness: 'السماكة',
      finishes: 'التشطيبات',
      origin: 'بلد المنشأ',
      category: 'الفئة',
      relatedProducts: 'منتجات ذات صلة',
      home: 'الرئيسية',
      products: 'المنتجات',
      viewDetails: 'عرض التفاصيل'
    },
    en: {
      backToProducts: 'Back to Products',
      requestQuote: 'Request Quote',
      specifications: 'Specifications',
      thickness: 'Thickness',
      finishes: 'Finishes',
      origin: 'Origin Country',
      category: 'Category',
      relatedProducts: 'Related Products',
      home: 'Home',
      products: 'Products',
      viewDetails: 'View Details'
    },
    es: {
      backToProducts: 'Volver a Productos',
      requestQuote: 'Solicitar Cotización',
      specifications: 'Especificaciones',
      thickness: 'Espesor',
      finishes: 'Acabados',
      origin: 'País de Origen',
      category: 'Categoría',
      relatedProducts: 'Productos Relacionados',
      home: 'Inicio',
      products: 'Productos',
      viewDetails: 'Ver Detalles'
    },
    fr: {
      backToProducts: 'Retour aux Produits',
      requestQuote: 'Demander un Devis',
      specifications: 'Spécifications',
      thickness: 'Épaisseur',
      finishes: 'Finitions',
      origin: 'Pays d\'Origine',
      category: 'Catégorie',
      relatedProducts: 'Produits Connexes',
      home: 'Accueil',
      products: 'Produits',
      viewDetails: 'Voir les Détails'
    }
  }

  const currentLabels = labels[locale as keyof typeof labels] || labels.en

  // Parse images safely
  const images = Array.isArray(product.images) ? product.images as string[] : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-primary">
              {currentLabels.home}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/products`} className="hover:text-primary">
              {currentLabels.products}
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">
              {getProductName(product)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href={`/${locale}/products`}>
          <Button variant="outline" className="mb-6 group">
            {isRTL ? (
              <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            ) : (
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            )}
            {currentLabels.backToProducts}
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <ProductGallery 
            images={images}
            productName={getProductName(product)}
            locale={locale}
          />

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {getProductName(product)}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {getCategoryName(product.category)}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-2">(4.9)</span>
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {getProductDescription(product)}
            </p>

            {/* Product Details */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">{currentLabels.specifications}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-medium">{currentLabels.category}:</span>
                  <span>{getCategoryName(product.category)}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">{currentLabels.origin}:</span>
                  <span>{product.originCountry || 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-primary" />
                  <span className="font-medium">{currentLabels.thickness}:</span>
                  <span>{product.thickness || 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-primary" />
                  <span className="font-medium">{currentLabels.finishes}:</span>
                  <span>{getLocalizedFinishes(product.finishes || '')}</span>
                </div>
              </div>
            </Card>

            {/* CTA Button */}
            <Link href={`/${locale}/quote?productId=${product.id}&product=${encodeURIComponent(locale === 'ar' ? product.nameAr : product.nameEn)}`} className="block">
              <Button size="lg" className="w-full group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                {currentLabels.requestQuote}
                {isRTL ? (
                  <ArrowLeft className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {currentLabels.relatedProducts}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct: any) => {
                // Images are already an array from database
                const relatedImages = Array.isArray(relatedProduct.images) 
                  ? relatedProduct.images 
                  : []
                
                return (
                <Link key={relatedProduct.id} href={`/${locale}/products/${relatedProduct.id}`} className="block">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col">
                    {/* Image Container - Fixed Height */}
                    <div className="relative w-full h-64 bg-gray-100 overflow-hidden flex-shrink-0">
                      {relatedImages.length > 0 && relatedImages[0] ? (
                        <img
                          src={relatedImages[0]}
                          alt={getProductName(relatedProduct)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {/* Category Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-primary-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                          {getCategoryName(relatedProduct.category)}
                        </span>
                      </div>
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Content Container */}
                    <div className="p-4 bg-white flex-grow flex flex-col">
                      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {getProductName(relatedProduct)}
                      </h3>
                      
                      {/* Product details */}
                      <div className="space-y-1.5 text-xs text-gray-600 mb-3 flex-grow">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">{relatedProduct.originCountry || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ruler className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="truncate line-clamp-1">{relatedProduct.thickness || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="line-clamp-1">{getLocalizedFinishes(relatedProduct.finishes || '')}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all mt-auto">
                        {currentLabels.viewDetails}
                      </Button>
                    </div>
                  </Card>
                </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
