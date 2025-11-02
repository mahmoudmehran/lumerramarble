'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Filter, Grid as GridIcon, List } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'
import { PageHeader, ContentSection } from '../../../components/ui/page-sections'

interface ProductsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; search?: string }>
}

interface Product {
  id: string
  nameAr: string
  nameEn: string
  nameEs: string
  nameFr: string
  category: string
  images: string | string[]
  originCountry: string
  thickness: string
  finishes: string
  slug: string
}

// Product Card Component with hover gallery
function ProductCard({ product, locale, viewMode, currentContent }: {
  product: Product
  locale: string
  viewMode: 'grid' | 'list'
  currentContent: any
}) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Parse images if it's a JSON string
  const images = typeof product.images === 'string' 
    ? (product.images.startsWith('[') ? JSON.parse(product.images) : [product.images])
    : product.images

  // Auto-cycle through images on hover
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === images.length - 1 ? 0 : prev + 1
        )
      }, 1500) // Change image every 1.5 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isHovered, images.length])

  const handleCardClick = () => {
    console.log('Card clicked, navigating to:', `/${locale}/products/${product.id}`)
    router.push(`/${locale}/products/${product.id}`)
  }

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Quote button clicked')
    router.push(`/${locale}/quote?productId=${product.id}&product=${encodeURIComponent(locale === 'ar' ? product.nameAr : product.nameEn)}`)
  }

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('View details clicked, navigating to:', `/${locale}/products/${product.id}`)
    router.push(`/${locale}/products/${product.id}`)
  }

  // Default placeholder image
  const placeholderImage = `https://via.placeholder.com/400x400/e5e7eb/6b7280?text=${encodeURIComponent(locale === 'ar' ? product.nameAr : product.nameEn)}`
  const currentImage = images[currentImageIndex] || placeholderImage

  return (
    <div
      className={`bg-[var(--color-quinary)] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-1 ${
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
          src={currentImage}
          alt={locale === 'ar' ? product.nameAr : product.nameEn}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {images.map((_: any, index: number) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentImageIndex ? 'bg-[var(--color-quinary)]' : 'bg-[var(--color-quinary)]/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Click to view hint */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="bg-black/70 text-[var(--color-quinary)] text-xs px-2 py-1 rounded">
            {locale === 'ar' ? 'اضغط للتفاصيل' : 'Click for details'}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-secondary-900)] mb-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
            {locale === 'ar' ? product.nameAr : product.nameEn}
          </h3>
          
          <div className="space-y-2 text-sm text-[var(--color-quaternary)] mb-4">
            <p><span className="font-medium">{currentContent.origin}:</span> {product.originCountry}</p>
            <p><span className="font-medium">{currentContent.thickness}:</span> {product.thickness}</p>
            <p><span className="font-medium">{currentContent.finishes}:</span> {product.finishes}</p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 group/btn transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={handleViewDetailsClick}
          >
            {currentContent.viewDetails}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] group/btn transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState(search || '')
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Update state when URL params change
  useEffect(() => {
    if (search !== undefined && search !== searchTerm) {
      setSearchTerm(search)
    }
    if (category !== undefined && category !== selectedCategory) {
      setSelectedCategory(category)
    }
  }, [search, category])

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

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    
    const queryString = params.toString()
    router.push(`/${locale}/products${queryString ? '?' + queryString : ''}`, { scroll: false })
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (value !== 'all') params.set('category', value)
    
    const queryString = params.toString()
    router.push(`/${locale}/products${queryString ? '?' + queryString : ''}`, { scroll: false })
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase()
    
    const matchesSearch = !searchTerm || 
      (locale === 'ar' ? product.nameAr : product.nameEn)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-quinary-50)]">
        <PageHeader
          title={currentContent.title}
          subtitle={currentContent.subtitle}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-xl text-[var(--color-quaternary)]">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      {/* Header Section */}
      <PageHeader
        title={currentContent.title}
        subtitle={currentContent.subtitle}
      />

      {/* Filters Section */}
      <section className="bg-[var(--color-quinary)] border-b border-[var(--color-quaternary-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Search - Large and prominent */}
            <div className="w-full lg:max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-quaternary-400)] w-4 h-4 z-10" />
                <Input
                  type="text"
                  placeholder={currentContent.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10 w-full"
                />
              </div>
            </div>

            {/* Spacer - pushes everything to the sides */}
            <div className="flex-1"></div>

            {/* Category Filter and View Mode - All together */}
            <div className="flex items-center gap-0 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial lg:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="h-10 px-3 py-2 pr-8 border border-r-0 border-[var(--color-quaternary-300)] rounded-l-md rtl:rounded-l-none rtl:rounded-r-md rtl:border-r rtl:border-l-0 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-quinary)] text-[var(--color-quaternary)] text-sm font-normal w-full appearance-none cursor-pointer"
                >
                  {Object.entries(currentContent.categories).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-2 rtl:pr-0 rtl:pl-2 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[var(--color-quaternary-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* View Mode Toggle - Attached to filter */}
              <button
                onClick={() => setViewMode('grid')}
                className={`w-10 h-10 border border-r-0 border-[var(--color-quaternary-300)] transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                  viewMode === 'grid' 
                    ? 'bg-[var(--color-primary)] text-[var(--color-quinary)] border-[var(--color-primary)]' 
                    : 'text-[var(--color-quaternary-500)] hover:bg-[var(--color-quaternary-100)] bg-[var(--color-quinary)]'
                }`}
                title="Grid View"
                style={{ width: '40px', height: '40px' }}
              >
                <GridIcon className="w-5 h-5" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 border border-[var(--color-quaternary-300)] rounded-r-md transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                  viewMode === 'list' 
                    ? 'bg-[var(--color-primary)] text-[var(--color-quinary)] border-[var(--color-primary)]' 
                    : 'text-[var(--color-quaternary-500)] hover:bg-[var(--color-quaternary-100)] bg-[var(--color-quinary)]'
                }`}
                title="List View"
                style={{ width: '40px', height: '40px' }}
              >
                <List className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-[var(--color-quaternary)]">{currentContent.noProducts}</p>
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
