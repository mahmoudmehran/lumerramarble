'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Grid as GridIcon, List } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { getShimmerPlaceholder } from '../../../lib/image-utils'

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

interface ProductsClientProps {
  products: Product[]
  locale: string
  initialCategory?: string
  initialSearch?: string
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
    if (!finishesStr) return ''
    const finishesArray = finishesStr.split(',').map(f => f.trim())
    const translatedFinishes = finishesArray.map(finish => getFinishName(finish))
    return translatedFinishes.join(', ')
  }

  // Get product name based on locale
  const getProductName = () => {
    switch(locale) {
      case 'ar': return product.nameAr
      case 'en': return product.nameEn
      case 'es': return product.nameEs
      case 'fr': return product.nameFr
      default: return product.nameAr
    }
  }

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
    router.push(`/${locale}/products/${product.id}`)
  }

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/${locale}/quote?productId=${product.id}&product=${encodeURIComponent(getProductName())}`)
  }

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/${locale}/products/${product.id}`)
  }

  // Default placeholder image
  const placeholderImage = `https://via.placeholder.com/400x400/e5e7eb/6b7280?text=${encodeURIComponent(getProductName())}`
  const currentImage = images[currentImageIndex] || placeholderImage

  return (
    <div
      className={`bg-[var(--color-quinary)] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-1 ${
        viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setCurrentImageIndex(0)
      }}
    >
      {/* Image Container */}
      <div className={`relative ${
        viewMode === 'list' 
          ? 'w-64 h-64 flex-shrink-0' 
          : 'w-full h-64'
      }`}>
        <Image
          src={currentImage}
          alt={getProductName()}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={getShimmerPlaceholder(400, 300)}
        />
        
        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_: any, index: number) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-[var(--color-primary)] w-3'
                    : 'bg-[var(--color-quinary)] opacity-60'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-[var(--color-primary)] text-[var(--color-quinary)] px-3 py-1 rounded-full text-xs font-semibold">
          {getCategoryName(product.category)}
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <h3 className="text-xl font-bold text-[var(--color-quaternary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {getProductName()}
        </h3>
        
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-sm text-[var(--color-quaternary-600)]">
            <span className="font-semibold min-w-[100px]">{currentContent.thickness}:</span>
            <span>{product.thickness}</span>
          </div>
          <div className="flex items-center text-sm text-[var(--color-quaternary-600)]">
            <span className="font-semibold min-w-[100px]">{currentContent.finishes}:</span>
            <span>{getLocalizedFinishes(product.finishes)}</span>
          </div>
          <div className="flex items-center text-sm text-[var(--color-quaternary-600)]">
            <span className="font-semibold min-w-[100px]">{currentContent.origin}:</span>
            <span>{product.originCountry}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col' : 'flex-row'}`}>
          <button
            onClick={handleViewDetailsClick}
            className="flex-1 px-4 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-colors font-semibold text-sm"
          >
            {currentContent.viewDetails}
          </button>
          <button
            onClick={handleQuoteClick}
            className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-quinary)] rounded-md hover:bg-[var(--color-primary-dark)] transition-colors font-semibold text-sm shadow-md"
          >
            {currentContent.requestQuote}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductsClient({ products, locale, initialCategory, initialSearch }: ProductsClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(initialSearch || '')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const content = {
    ar: {
      title: 'منتجاتنا',
      subtitle: 'اكتشف مجموعتنا الواسعة من الأحجار الطبيعية الفاخرة',
      searchPlaceholder: 'البحث عن المنتجات...',
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
      noProducts: 'لا توجد منتجات تطابق بحثك'
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
    },
    es: {
      title: 'Nuestros Productos',
      subtitle: 'Descubra nuestra extensa colección de piedras naturales premium',
      searchPlaceholder: 'Buscar productos...',
      filter: 'Filtrar',
      categories: {
        all: 'Todos los Productos',
        marble: 'Mármol',
        granite: 'Granito',
        quartz: 'Cuarzo',
        special: 'Productos Especiales'
      },
      thickness: 'Espesor',
      finishes: 'Acabados',
      origin: 'País de Origen',
      requestQuote: 'Solicitar Cotización',
      viewDetails: 'Ver Detalles',
      noProducts: 'No hay productos que coincidan con su búsqueda'
    },
    fr: {
      title: 'Nos Produits',
      subtitle: 'Découvrez notre vaste collection de pierres naturelles premium',
      searchPlaceholder: 'Rechercher des produits...',
      filter: 'Filtrer',
      categories: {
        all: 'Tous les Produits',
        marble: 'Marbre',
        granite: 'Granit',
        quartz: 'Quartz',
        special: 'Produits Spéciaux'
      },
      thickness: 'Épaisseur',
      finishes: 'Finitions',
      origin: 'Pays d\'Origine',
      requestQuote: 'Demander un Devis',
      viewDetails: 'Voir les Détails',
      noProducts: 'Aucun produit ne correspond à votre recherche'
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
    
    const productName = (() => {
      switch(locale) {
        case 'ar': return product.nameAr
        case 'en': return product.nameEn
        case 'es': return product.nameEs
        case 'fr': return product.nameFr
        default: return product.nameAr
      }
    })()
    
    const matchesSearch = !searchTerm || 
      productName.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Filters Section */}
      <section className="bg-[var(--color-quinary)] border-b border-[var(--color-quaternary-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Search */}
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

            <div className="flex-1"></div>

            {/* Category Filter and View Mode */}
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

              {/* View Mode Toggle */}
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
    </>
  )
}
