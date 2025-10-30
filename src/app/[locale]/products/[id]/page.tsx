import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight, 
  Package, 
  Ruler,
  Palette,
  MapPin, 
  Star,
  Heart,
  Truck,
  Shield,
  Check
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
  
  // Get product and content from database
  const [product, content] = await Promise.all([
    getProductById(id),
    getContent('products')
  ])

  if (!product) {
    notFound()
  }

  // Get related products
  const relatedProducts = await getRelatedProducts(product.category, product.id)

  const getText = (sectionKey: string, contentKey: string) => {
    return content[sectionKey]?.[contentKey]?.[locale as keyof typeof content[string][string]] || ''
  }

  // Helper function to get localized product name
  const getProductName = (product: any) => {
    switch(locale) {
      case 'ar': return product.nameAr || product.name
      case 'en': return product.nameEn || product.name
      case 'es': return product.nameEs || product.name
      case 'fr': return product.nameFr || product.name
      default: return product.nameAr || product.name
    }
  }

  // Helper function to get localized product description
  const getProductDescription = (product: any) => {
    switch(locale) {
      case 'ar': return product.descriptionAr || product.description
      case 'en': return product.descriptionEn || product.description
      case 'es': return product.descriptionEs || product.description
      case 'fr': return product.descriptionFr || product.description
      default: return product.descriptionAr || product.description
    }
  }

  // Static content for product page
  const labels = {
    ar: {
      backToProducts: 'العودة للمنتجات',
      requestQuote: 'طلب عرض سعر',
      specifications: 'المواصفات',
      applications: 'الاستخدامات',
      gallery: 'معرض الصور',
      thickness: 'السماكة',
      finishes: 'التشطيبات',
      dimensions: 'الأبعاد',
      colors: 'الألوان المتاحة',
      origin: 'بلد المنشأ',
      density: 'الكثافة',
      waterAbsorption: 'امتصاص الماء',
      compressiveStrength: 'قوة الضغط',
      flexuralStrength: 'قوة الانحناء',
      relatedProducts: 'منتجات ذات صلة',
      availability: 'التوفر',
      inStock: 'متوفر',
      outOfStock: 'غير متوفر',
      fastShipping: 'شحن سريع',
      qualityGuarantee: 'ضمان الجودة',
      safePackaging: 'تعبئة آمنة',
      home: 'الرئيسية',
      products: 'المنتجات'
    },
    en: {
      backToProducts: 'Back to Products',
      requestQuote: 'Request Quote',
      specifications: 'Specifications',
      applications: 'Applications',
      gallery: 'Photo Gallery',
      thickness: 'Thickness',
      finishes: 'Finishes',
      dimensions: 'Dimensions',
      colors: 'Available Colors',
      origin: 'Origin Country',
      density: 'Density',
      waterAbsorption: 'Water Absorption',
      compressiveStrength: 'Compressive Strength',
      flexuralStrength: 'Flexural Strength',
      relatedProducts: 'Related Products',
      availability: 'Availability',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      fastShipping: 'Fast Shipping',
      qualityGuarantee: 'Quality Guarantee',
      safePackaging: 'Safe Packaging',
      home: 'Home',
      products: 'Products'
    }
  }

  const currentLabels = labels[locale as keyof typeof labels] || labels.en

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/products`} className="hover:text-primary-600">
              {locale === 'ar' ? 'المنتجات' : 'Products'}
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">
              {locale === 'ar' ? product.nameAr : product.nameEn}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href={`/${locale}/products`}>
          <Button variant="outline" className="mb-6 group">
            {isRTL ? <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />}
            {currentLabels.backToProducts}
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <ProductGallery 
            images={product.images as string[] || []}
            productName={getProductName(product)}
            locale={locale}
          />

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {locale === 'ar' ? product.nameAr : product.nameEn}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category === 'MARBLE' ? 'رخام' : 
                 product.category === 'GRANITE' ? 'جرانيت' : 
                 product.category === 'QUARTZ' ? 'كوارتز' : 'منتجات خاصة'}
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

            <p className="text-lg text-secondary-700 leading-relaxed mb-8">
              {locale === 'ar' ? product.descriptionAr : product.descriptionEn}
            </p>

            {/* Product Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{currentContent.origin}:</span>
                <span>{product.originCountry}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{currentContent.thickness}:</span>
                <span>{product.thickness}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{currentContent.finishes}:</span>
                <span>{product.finishes}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{currentContent.dimensions}:</span>
                <span>{product.dimensions}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${locale}/quote`} className="flex-1">
                <Button size="lg" className="w-full group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  {currentContent.requestQuote}
                  {isRTL ? <ArrowLeft className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowGallery(true)}
                className="flex-1"
              >
                {currentContent.gallery}
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info Sections */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Applications */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">{currentContent.applications}</h3>
            <div className="flex flex-wrap gap-2">
              {product.applications.map((app: string, index: number) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {app}
                </span>
              ))}
            </div>
          </Card>

          {/* Specifications */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">{currentContent.specifications}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">{currentContent.density}:</span>
                <span>{product.specifications?.density || product.density || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{currentContent.waterAbsorption}:</span>
                <span>{product.specifications?.waterAbsorption || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{currentContent.compressiveStrength}:</span>
                <span>{product.specifications?.compressiveStrength || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{currentContent.flexuralStrength}:</span>
                <span>{product.specifications?.flexuralStrength || 'غير محدد'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-4xl max-h-screen p-4">
            <Image
              src={product.images[currentImageIndex]}
              alt={locale === 'ar' ? product.nameAr : product.nameEn}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
            
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
