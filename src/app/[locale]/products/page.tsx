'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Button } from 'bklumerra/components/ui/button'
import { Input } from 'bklumerra/components/ui/input'

interface ProductsPageProps {
  params: { locale: string }
  searchParams: { category?: string; search?: string }
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
    images: ['/images/marble-1.jpg'],
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
    images: ['/images/granite-1.jpg'],
    originCountry: 'مصر',
    thickness: '20mm, 30mm',
    finishes: 'مصقول، مطفي'
  },
  // Add more mock products...
]

export default function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = params
  const isRTL = locale === 'ar'
  const [products, setProducts] = useState(mockProducts)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || 'all')

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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              {currentContent.title}
            </h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {currentContent.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                <div
                  key={product.id}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-square'}`}>
                    <Image
                      src={product.images[0]}
                      alt={locale === 'ar' ? product.nameAr : product.nameEn}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                  
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">
                      {locale === 'ar' ? product.nameAr : product.nameEn}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-secondary-600 mb-4">
                      <p><span className="font-medium">{currentContent.origin}:</span> {product.originCountry}</p>
                      <p><span className="font-medium">{currentContent.thickness}:</span> {product.thickness}</p>
                      <p><span className="font-medium">{currentContent.finishes}:</span> {product.finishes}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/${locale}/products/${product.id}`} className="flex-1">
                        <Button className="w-full group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                          {currentContent.viewDetails}
                        </Button>
                      </Link>
                      <Link href={`/${locale}/contact`} className="flex-1">
                        <Button variant="outline" className="w-full border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                          {currentContent.requestQuote}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
