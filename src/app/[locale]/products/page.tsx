'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'

interface ProductsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; search?: string }>
}

// Mock products data - would be fetched from database
const mockProducts = [
  {
    id: '1',
    nameAr: 'رخام كرارا أبيض',
    nameEn: 'Carrara White Marble',
    nameEs: 'Mármol Blanco Carrara',
    nameFr: 'Marbre Blanc de Carrare',
    category: 'MARBLE',
    images: [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3'
    ],
    originCountry: 'مصر',
    thickness: '18mm, 20mm, 30mm',
    finishes: 'مصقول، مطفي، مضغوط'
  },
  {
    id: '2',
    nameAr: 'جرانيت أسود جالاكسي',
    nameEn: 'Black Galaxy Granite',
    nameEs: 'Granito Negro Galaxia',
    nameFr: 'Granit Noir Galaxie',
    category: 'GRANITE',
    images: [
      'https://picsum.photos/400/400?random=5',
      'https://picsum.photos/400/400?random=6',
      'https://picsum.photos/400/400?random=7'
    ],
    originCountry: 'مصر',
    thickness: '20mm, 30mm',
    finishes: 'مصقول، مطفي'
  },
  {
    id: '3',
    nameAr: 'رخام كالاكاتا ذهبي',
    nameEn: 'Calacatta Gold Marble',
    nameEs: 'Mármol Calacatta Oro',
    nameFr: 'Marbre Calacatta Or',
    category: 'MARBLE',
    images: [
      'https://picsum.photos/400/400?random=9',
      'https://picsum.photos/400/400?random=10',
      'https://picsum.photos/400/400?random=11'
    ],
    originCountry: 'إيطاليا',
    thickness: '20mm, 30mm',
    finishes: 'مصقول، مطفي'
  },
  {
    id: '4',
    nameAr: 'جرانيت أحمر إمبريال',
    nameEn: 'Imperial Red Granite',
    nameEs: 'Granito Rojo Imperial',
    nameFr: 'Granit Rouge Impérial',
    category: 'GRANITE',
    images: [
      'https://picsum.photos/400/400?random=13',
      'https://picsum.photos/400/400?random=14',
      'https://picsum.photos/400/400?random=15'
    ],
    originCountry: 'الهند',
    thickness: '18mm, 20mm, 30mm',
    finishes: 'مصقول، مطفي، محكك'
  }
]

// Product Card Component with hover gallery
function ProductCard({ product, locale, viewMode, currentContent }: {
  product: any
  locale: string
  viewMode: 'grid' | 'list'
  currentContent: any
}) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-cycle through images on hover
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isHovered && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === product.images.length - 1 ? 0 : prev + 1
        )
      }, 1500) // Change image every 1.5 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isHovered, product.images.length])

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a[href*="quote"]')) {
      return
    }
    router.push(`/${locale}/products/${product.id}`)
  }

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/${locale}/contact?product=${encodeURIComponent(locale === 'ar' ? product.nameAr : product.nameEn)}`)
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-1 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setCurrentImageIndex(0)
      }}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-square'} overflow-hidden`}>
        <Image
          src={product.images[currentImageIndex] || `https://via.placeholder.com/400x400/e5e7eb/6b7280?text=${encodeURIComponent(locale === 'ar' ? product.nameAr : product.nameEn)}`}
          alt={locale === 'ar' ? product.nameAr : product.nameEn}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Image indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_: any, index: number) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Click to view hint */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
            {locale === 'ar' ? 'اضغط للتفاصيل' : 'Click for details'}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
            {locale === 'ar' ? product.nameAr : product.nameEn}
          </h3>
          
          <div className="space-y-2 text-sm text-secondary-600 mb-4">
            <p><span className="font-medium">{currentContent.origin}:</span> {product.originCountry}</p>
            <p><span className="font-medium">{currentContent.thickness}:</span> {product.thickness}</p>
            <p><span className="font-medium">{currentContent.finishes}:</span> {product.finishes}</p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 group/btn transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/${locale}/products/${product.id}`)
            }}
          >
            {currentContent.viewDetails}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white group/btn transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={handleQuoteClick}
          >
            {currentContent.requestQuote}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = use(params)
  const { category, search } = use(searchParams)
  const router = useRouter()
  const isRTL = locale === 'ar'
  const [products, setProducts] = useState(mockProducts)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState(search || '')
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')

  const content = {
    ar: {
      title: 'منتجاتنا',
      subtitle: 'اكتشف مجموعتنا الواسعة من الأحجار الطبيعية عالية الجودة',
      searchPlaceholder: 'البحث في المنتجات...',
      filter: 'تصفية',
      categories: {
        all: 'جميع المنتجات',
        marble: 'رخام',
        granite: 'جرانيت',
        quartz: 'كوارتز',
        special: 'منتجات خاصة'
      },
      thickness: 'السماكة',
      finishes: 'التشطيبات',
      origin: 'بلد المنشأ',
      requestQuote: 'طلب عرض سعر',
      viewDetails: 'عرض التفاصيل',
      noProducts: 'لا توجد منتجات تطابق البحث'
    },
    en: {
      title: 'Our Products',
      subtitle: 'Discover our extensive collection of premium natural stones',
      searchPlaceholder: 'Search products...',
      filter: 'Filter',
      categories: {
        all: 'All Products',
        marble: 'Marble',
        granite: 'Granite',
        quartz: 'Quartz',
        special: 'Special Products'
      },
      thickness: 'Thickness',
      finishes: 'Finishes',
      origin: 'Origin Country',
      requestQuote: 'Request Quote',
      viewDetails: 'View Details',
      noProducts: 'No products match your search'
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase()
    
    const matchesSearch = !searchTerm || 
      (locale === 'ar' ? product.nameAr : product.nameEn)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-quinary-50">
      {/* Header Section */}
      <section className="bg-quinary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-4">
              {currentContent.title}
            </h1>
            <p className="text-xl text-quaternary max-w-2xl mx-auto">
              {currentContent.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-quinary border-b border-quaternary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-quaternary-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={currentContent.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.entries(currentContent.categories).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-secondary-600">{currentContent.noProducts}</p>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  viewMode={viewMode}
                  currentContent={currentContent}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
