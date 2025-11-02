import Link from 'next/link'
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
import ProductGallery from './ProductGallery'

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>
}

// Function to get product from database
async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })
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

  // Get related products
  const relatedProducts = await getRelatedProducts(product.category, product.id)

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

  // Static content for product page
  const labels = {
    ar: {
      backToProducts: 'العودة للمنتجات',
      requestQuote: 'طلب عرض سعر',
      specifications: 'المواصفات',
      thickness: 'السماكة',
      finishes: 'التشطيبات',
      origin: 'بلد المنشأ',
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
      relatedProducts: 'Related Products',
      home: 'Home',
      products: 'Products',
      viewDetails: 'View Details'
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
                {product.category}
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
                {product.originCountry && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium">{currentLabels.origin}:</span>
                    <span>{product.originCountry}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-primary" />
                  <span className="font-medium">{currentLabels.thickness}:</span>
                  <span>{product.thickness}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-primary" />
                  <span className="font-medium">{currentLabels.finishes}:</span>
                  <span>{product.finishes}</span>
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
              {relatedProducts.map((relatedProduct: any) => (
                <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative bg-gray-200 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {locale === 'ar' ? relatedProduct.nameAr : relatedProduct.nameEn}
                    </h3>
                    <Link href={`/${locale}/products/${relatedProduct.id}`}>
                      <Button variant="outline" className="w-full mt-2">
                        {currentLabels.viewDetails}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
