'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
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
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Card } from '../../../../components/ui/card'

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>
}

// Mock product data - would be fetched from API
const getProductById = (id: string) => {
  const products = [
    {
      id: '1',
      nameAr: 'رخام كرارا أبيض',
      nameEn: 'Carrara White Marble',
      nameEs: 'Mármol Blanco Carrara',
      nameFr: 'Marbre Blanc de Carrare',
      category: 'MARBLE',
      descriptionAr: 'رخام كرارا الأبيض هو من أفخم أنواع الرخام الطبيعي المستخرج من محاجر كرارا الشهيرة. يتميز بلونه الأبيض الناصع مع العروق الرمادية الطبيعية التي تضفي عليه جمالاً فريداً. يُستخدم في المشاريع الفاخرة والتصاميم الكلاسيكية والعصرية على حد سواء.',
      descriptionEn: 'Carrara White Marble is one of the finest natural marbles extracted from the famous Carrara quarries. It features a pristine white color with natural gray veining that gives it unique beauty. Used in luxury projects and both classic and modern designs.',
      images: [
        '/images/marble-1.jpg',
        '/images/marble-2.jpg',
        '/images/marble-3.jpg',
        '/images/marble-4.jpg'
      ],
      originCountry: 'مصر',
      thickness: '18mm, 20mm, 30mm',
      finishes: 'مصقول، مطفي، مضغوط',
      dimensions: '120x60cm, 80x40cm, حسب الطلب',
      colors: ['أبيض ناصع', 'أبيض مع عروق رمادية'],
      applications: ['أرضيات', 'جدران', 'مطابخ', 'حمامات', 'واجهات'],
      specifications: {
        density: '2.7 g/cm³',
        waterAbsorption: '< 0.5%',
        compressiveStrength: '120 MPa',
        flexuralStrength: '15 MPa'
      }
    },
    {
      id: '2',
      nameAr: 'جرانيت أسود جالاكسي',
      nameEn: 'Black Galaxy Granite',
      nameEs: 'Granito Negro Galaxia',
      nameFr: 'Granit Noir Galaxie',
      category: 'GRANITE',
      descriptionAr: 'جرانيت أسود جالاكسي هو حجر طبيعي فاخر يتميز بلونه الأسود العميق مع نقاط ذهبية وفضية لامعة تشبه النجوم في السماء. هذا الجرانيت مقاوم للخدش والبقع ويُعتبر من أفضل الخيارات للمطابخ والحمامات الفاخرة.',
      descriptionEn: 'Black Galaxy Granite is a luxurious natural stone featuring deep black color with shimmering gold and silver flecks that resemble stars in the sky. This granite is scratch and stain resistant, making it one of the best choices for luxury kitchens and bathrooms.',
      images: [
        '/images/granite-1.jpg',
        '/images/granite-2.jpg',
        '/images/granite-3.jpg'
      ],
      originCountry: 'مصر',
      thickness: '20mm, 30mm',
      finishes: 'مصقول، مطفي',
      dimensions: '120x60cm, 100x50cm, حسب الطلب',
      colors: ['أسود مع نقاط ذهبية', 'أسود مع نقاط فضية'],
      applications: ['مطابخ', 'حمامات', 'أرضيات', 'طاولات'],
      specifications: {
        density: '2.9 g/cm³',
        waterAbsorption: '< 0.2%',
        compressiveStrength: '150 MPa',
        flexuralStrength: '18 MPa'
      }
    }
  ]
  
  return products.find(p => p.id === id) || null
}

export default function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const isRTL = locale === 'ar'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          // Fallback to mock data
          const mockProduct = getProductById(id)
          setProduct(mockProduct)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        // Fallback to mock data
        const mockProduct = getProductById(id)
        setProduct(mockProduct)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-2">المنتج غير موجود</h1>
          <p className="text-gray-500 mb-6">عذراً، لم نتمكن من العثور على هذا المنتج</p>
          <Link href={`/${locale}/products`}>
            <Button>العودة للمنتجات</Button>
          </Link>
        </div>
      </div>
    )
  }

  const content = {
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
      relatedProducts: 'منتجات ذات صلة'
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
      relatedProducts: 'Related Products'
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

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
            {currentContent.backToProducts}
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
                 onClick={() => setShowGallery(true)}>
              <Image
                src={product.images[currentImageIndex]}
                alt={locale === 'ar' ? product.nameAr : product.nameEn}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage() }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage() }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-primary-500' 
                        : 'hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${locale === 'ar' ? product.nameAr : product.nameEn} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

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
