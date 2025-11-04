# دليل تنفيذ تحسينات الأداء - خطوة بخطوة
# Performance Implementation Guide - Step by Step

هذا الملف يحتوي على **الكود الجاهز** لتطبيق كل التحسينات المقترحة.

---

## 🚀 المرحلة 1: تحسينات فورية (أولوية قصوى)

### 1.1 إضافة Data Caching للمنتجات

**إنشاء ملف: `src/lib/cached-queries.ts`**

```typescript
import { unstable_cache } from 'next/cache'
import { prisma } from './db'

/**
 * Cache المنتجات - يعيد الاستخدام لمدة ساعة
 */
export const getCachedProducts = unstable_cache(
  async (category?: string, search?: string) => {
    const where: any = { active: true }
    
    if (category && category !== 'all') {
      where.category = category.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameEs: { contains: search, mode: 'insensitive' } },
        { nameFr: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    return await prisma.product.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    })
  },
  ['products'], // Cache key
  {
    revalidate: 3600, // ساعة واحدة
    tags: ['products'] // للـ revalidation
  }
)

/**
 * Cache منتج واحد بالـ ID
 */
export const getCachedProductById = unstable_cache(
  async (id: string) => {
    return await prisma.product.findUnique({
      where: { id }
    })
  },
  ['product-by-id'],
  {
    revalidate: 3600,
    tags: ['products']
  }
)

/**
 * Cache المنتجات المرتبطة
 */
export const getCachedRelatedProducts = unstable_cache(
  async (category: string, excludeId: string, limit: number = 4) => {
    return await prisma.product.findMany({
      where: {
        category,
        active: true,
        id: { not: excludeId }
      },
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    })
  },
  ['related-products'],
  {
    revalidate: 3600,
    tags: ['products']
  }
)

/**
 * Cache للـ Site Settings
 */
export const getCachedSiteSettings = unstable_cache(
  async () => {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    })
    return settings
  },
  ['site-settings'],
  {
    revalidate: 300, // 5 دقائق
    tags: ['settings']
  }
)

/**
 * Cache للـ Homepage Content
 */
export const getCachedContent = unstable_cache(
  async (page: string) => {
    return await prisma.content.findFirst({
      where: { page }
    })
  },
  ['content'],
  {
    revalidate: 600, // 10 دقائق
    tags: ['content']
  }
)

/**
 * Cache لمقالات المدونة
 */
export const getCachedBlogPosts = unstable_cache(
  async (limit?: number) => {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: limit
    })
  },
  ['blog-posts'],
  {
    revalidate: 1800, // 30 دقيقة
    tags: ['blog']
  }
)

/**
 * Cache مقالة واحدة
 */
export const getCachedBlogPost = unstable_cache(
  async (slug: string) => {
    return await prisma.blogPost.findUnique({
      where: { slug }
    })
  },
  ['blog-post'],
  {
    revalidate: 1800,
    tags: ['blog']
  }
)
```

---

### 1.2 تحديث Products Page لاستخدام Server Components

**تعديل: `src/app/[locale]/products/page.tsx`**

قسّم الملف إلى:

**1. Server Component: `src/app/[locale]/products/page.tsx`**

```typescript
import { getCachedProducts } from '@/lib/cached-queries'
import { ProductsClient } from './ProductsClient'
import { PageHeader } from '@/components/ui/page-sections'

// ✅ إضافة revalidation
export const revalidate = 3600 // ساعة واحدة

interface ProductsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; search?: string }>
}

export async function generateMetadata({ params }: ProductsPageProps) {
  const { locale } = await params
  
  const titles = {
    ar: 'منتجاتنا - رخام وجرانيت فاخر',
    en: 'Our Products - Premium Marble & Granite',
    es: 'Nuestros Productos - Mármol y Granito Premium',
    fr: 'Nos Produits - Marbre et Granit Premium'
  }
  
  return {
    title: titles[locale as keyof typeof titles] || titles.en
  }
}

export default async function ProductsPage({ 
  params, 
  searchParams 
}: ProductsPageProps) {
  const { locale } = await params
  const { category, search } = await searchParams
  
  // ✅ استدعاء من Cache
  const products = await getCachedProducts(category, search)
  
  const pageContent = {
    ar: {
      title: 'منتجاتنا',
      subtitle: 'اكتشف أفخم أنواع الرخام والجرانيت'
    },
    en: {
      title: 'Our Products',
      subtitle: 'Discover Premium Marble & Granite'
    },
    es: {
      title: 'Nuestros Productos',
      subtitle: 'Descubre Mármol y Granito Premium'
    },
    fr: {
      title: 'Nos Produits',
      subtitle: 'Découvrez le Marbre et Granit Premium'
    }
  }
  
  const content = pageContent[locale as keyof typeof pageContent] || pageContent.en
  
  return (
    <div className="min-h-screen">
      <PageHeader 
        title={content.title}
        subtitle={content.subtitle}
      />
      
      {/* ✅ Client Component للتفاعل */}
      <ProductsClient 
        initialProducts={products}
        locale={locale}
        initialCategory={category}
        initialSearch={search}
      />
    </div>
  )
}
```

**2. Client Component: `src/app/[locale]/products/ProductsClient.tsx`**

```typescript
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Filter, Grid as GridIcon, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface Product {
  id: string
  nameAr: string
  nameEn: string
  nameEs: string
  nameFr: string
  category: string
  images: string | string[]
  slug: string
}

interface ProductsClientProps {
  initialProducts: Product[]
  locale: string
  initialCategory?: string
  initialSearch?: string
}

export function ProductsClient({ 
  initialProducts, 
  locale,
  initialCategory,
  initialSearch
}: ProductsClientProps) {
  const [products, setProducts] = useState(initialProducts)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [category, setCategory] = useState(initialCategory || 'all')
  const [search, setSearch] = useState(initialSearch || '')
  const [isLoading, setIsLoading] = useState(false)
  
  // Filter products client-side للـ instant feedback
  const filteredProducts = products.filter(product => {
    const categoryMatch = category === 'all' || product.category === category.toUpperCase()
    const searchMatch = !search || 
      product.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(search.toLowerCase())
    
    return categoryMatch && searchMatch
  })
  
  // Translation helpers
  const getText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      search: {
        ar: 'البحث في المنتجات',
        en: 'Search products',
        es: 'Buscar productos',
        fr: 'Rechercher des produits'
      },
      category: {
        ar: 'الفئة',
        en: 'Category',
        es: 'Categoría',
        fr: 'Catégorie'
      },
      all: {
        ar: 'الكل',
        en: 'All',
        es: 'Todos',
        fr: 'Tous'
      },
      marble: {
        ar: 'رخام',
        en: 'Marble',
        es: 'Mármol',
        fr: 'Marbre'
      },
      granite: {
        ar: 'جرانيت',
        en: 'Granite',
        es: 'Granito',
        fr: 'Granit'
      },
      quartz: {
        ar: 'كوارتز',
        en: 'Quartz',
        es: 'Cuarzo',
        fr: 'Quartz'
      }
    }
    
    return translations[key]?.[locale] || translations[key]?.en || key
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder={getText('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
        
        <div className="flex gap-3">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">{getText('all')}</option>
            <option value="marble">{getText('marble')}</option>
            <option value="granite">{getText('granite')}</option>
            <option value="quartz">{getText('quartz')}</option>
          </Select>
          
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            <GridIcon className="w-5 h-5" />
          </Button>
          
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'flex flex-col gap-4'
      }>
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            locale={locale}
            viewMode={viewMode}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {locale === 'ar' ? 'لا توجد منتجات' : 'No products found'}
          </p>
        </div>
      )}
    </div>
  )
}

// باقي الـ ProductCard component كما هو...
```

---

### 1.3 تحديث صفحة المنتج الواحد

**تعديل: `src/app/[locale]/products/[id]/page.tsx`**

```typescript
import { getCachedProductById, getCachedRelatedProducts } from '@/lib/cached-queries'

// ✅ إضافة revalidation
export const revalidate = 3600

// ✅ Static Generation
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { id: true }
  })
  
  return products.map((product) => ({
    id: product.id
  }))
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ locale: string; id: string }> 
}) {
  const { locale, id } = await params
  
  // ✅ استخدام cached queries
  const product = await getCachedProductById(id)
  
  if (!product) {
    notFound()
  }
  
  const relatedProducts = await getCachedRelatedProducts(
    product.category,
    product.id,
    4
  )
  
  // ... باقي الكود
}
```

---

### 1.4 تحديث Settings

**تعديل: `src/lib/settings.ts`**

```typescript
import { getCachedSiteSettings } from './cached-queries'

export async function getSiteSettings(): Promise<SiteSettings> {
  // ✅ استخدام cached version
  const settings = await getCachedSiteSettings()
  
  if (!settings) {
    return getDefaultSettings()
  }
  
  // Map to SiteSettings interface
  return mapSettings(settings)
}
```

---

### 1.5 إضافة Route Handler للـ Revalidation

**إنشاء: `src/app/api/revalidate/route.ts`**

```typescript
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { tag, secret } = await request.json()
    
    // ✅ تأكد من Secret للأمان
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }
    
    // ✅ Revalidate الـ tag المطلوب
    revalidateTag(tag)
    
    return NextResponse.json({
      success: true,
      message: `Revalidated tag: ${tag}`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}
```

**استخدام:**
```typescript
// عند تحديث منتج في Admin Panel
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({
    tag: 'products',
    secret: process.env.REVALIDATE_SECRET
  })
})
```

---

## 🔧 المرحلة 2: Database Optimization

### 2.1 إضافة Indexes

**تعديل: `prisma/schema.prisma`**

```prisma
model Product {
  id             String   @id @default(cuid())
  nameAr         String
  nameEn         String
  nameEs         String
  nameFr         String
  slug           String   @unique
  category       String
  featured       Boolean  @default(false)
  active         Boolean  @default(true)
  images         Json?
  descriptionAr  String?  @db.Text
  descriptionEn  String?  @db.Text
  descriptionEs  String?  @db.Text
  descriptionFr  String?  @db.Text
  thickness      String?
  finishes       String?
  originCountry  String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // ✅ Indexes للأداء
  @@index([category])
  @@index([featured])
  @@index([active])
  @@index([category, featured])
  @@index([category, active])
  @@index([slug])
  @@index([createdAt])
  
  // ✅ Full-text search indexes
  @@index([nameAr])
  @@index([nameEn])
}

model BlogPost {
  id            String   @id @default(cuid())
  slug          String   @unique
  published     Boolean  @default(false)
  publishedAt   DateTime?
  createdAt     DateTime @default(now())
  
  // ✅ Indexes
  @@index([published])
  @@index([publishedAt])
  @@index([slug])
}

model SiteSettings {
  id        String   @id @default(cuid())
  updatedAt DateTime @updatedAt
  
  // ✅ Index
  @@index([updatedAt])
}
```

**تطبيق Migration:**
```bash
npx prisma migrate dev --name add_performance_indexes
```

---

## 🎨 المرحلة 3: Image Optimization

### 3.1 إضافة Blur Placeholders

**إنشاء: `src/lib/image-utils.ts`**

```typescript
/**
 * Generate blur data URL for images
 */
export function getBlurDataURL(width = 10, height = 10): string {
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e5e5;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `
  
  const base64 = Buffer.from(canvas).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Get optimized image props
 */
export function getOptimizedImageProps(src: string, isPriority = false) {
  return {
    src,
    placeholder: 'blur' as const,
    blurDataURL: getBlurDataURL(),
    priority: isPriority,
    quality: 85
  }
}
```

**استخدام:**
```tsx
import Image from 'next/image'
import { getOptimizedImageProps } from '@/lib/image-utils'

// للصور Above-the-fold
<Image 
  {...getOptimizedImageProps(heroImage, true)}
  alt="Hero"
  fill
/>

// للصور العادية
<Image 
  {...getOptimizedImageProps(productImage)}
  alt="Product"
  width={400}
  height={400}
/>
```

---

### 3.2 تحديث Hero Images

**تعديل: `src/components/ui/page-sections.tsx`**

```typescript
import { getOptimizedImageProps } from '@/lib/image-utils'

export function HeroSection({ image, title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative h-[600px]">
      {image && (
        <div className="absolute inset-0">
          <Image
            {...getOptimizedImageProps(image, true)} // ✅ priority=true
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      {/* ... */}
    </section>
  )
}
```

---

## ⚙️ المرحلة 4: Advanced Optimizations

### 4.1 Enable Partial Prerendering (PPR)

**تعديل: `next.config.ts`**

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
    ppr: true, // ✅ Partial Prerendering
    reactCompiler: true, // ✅ React Compiler (if available)
  },
}
```

---

### 4.2 Dynamic Imports للكومبوننتات الثقيلة

**مثال: `src/app/[locale]/quote/page.tsx`**

```typescript
import dynamic from 'next/dynamic'
import { QuoteFormSkeleton } from './loading'

// ✅ Lazy load QuoteForm
const QuoteForm = dynamic(() => import('./QuoteForm'), {
  loading: () => <QuoteFormSkeleton />,
  ssr: false // إذا كان client-only
})

export default function QuotePage() {
  return (
    <div>
      <QuoteForm />
    </div>
  )
}
```

---

### 4.3 Prefetch للروابط المهمة

**تعديل: `src/components/layout/Navbar.tsx`**

```tsx
<Link 
  href={`/${locale}/products`} 
  prefetch={true} // ✅ Prefetch
>
  {getText('products')}
</Link>
```

---

### 4.4 Resource Hints

**تعديل: `src/app/layout.tsx`**

```tsx
<head>
  <ThemeCache />
  <InitialTheme settings={settings} />
  
  {/* ✅ Resource Hints */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link rel="dns-prefetch" href="https://www.google-analytics.com" />
  
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#f59000" />
</head>
```

---

## 📊 المرحلة 5: Monitoring

### 5.1 Web Vitals Tracking

**إنشاء: `src/app/web-vitals.tsx`**

```typescript
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // ✅ Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      })
    }
    
    // ✅ Console log في dev
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating
      })
    }
  })

  return null
}
```

**إضافة في: `src/app/layout.tsx`**

```tsx
import { WebVitals } from './web-vitals'

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

---

## ✅ Checklist للتطبيق

### المرحلة 1 (يوم واحد):
- [ ] إنشاء `src/lib/cached-queries.ts`
- [ ] تحديث Products Page لـ Server Component
- [ ] إنشاء ProductsClient component
- [ ] تحديث Product Detail Page
- [ ] إضافة revalidation API route
- [ ] اختبار الأداء

### المرحلة 2 (2-3 أيام):
- [ ] إضافة Database Indexes
- [ ] تطبيق Migration
- [ ] إضافة generateStaticParams
- [ ] اختبار Build وقت البناء

### المرحلة 3 (أسبوع):
- [ ] إنشاء image-utils
- [ ] تحديث كل الصور لاستخدام blur placeholders
- [ ] إضافة priority للصور الأولى
- [ ] Dynamic Imports للكومبوننتات الثقيلة
- [ ] Enable PPR في next.config
- [ ] إضافة Resource Hints
- [ ] Web Vitals tracking

### الاختبار النهائي:
- [ ] Lighthouse Score > 90
- [ ] Core Web Vitals all GREEN
- [ ] Page load < 2s
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

---

## 🎯 النتائج المتوقعة

| المقياس | قبل | بعد المرحلة 1 | بعد المرحلة 3 |
|---------|-----|----------------|----------------|
| **Performance Score** | 60-70 | 80-85 ⚡ | 90-100 ⚡⚡ |
| **First Load JS** | ~400KB | ~350KB | ~250KB |
| **Page Load Time** | 3-4s | 1.5-2s | <1s |
| **Database Queries** | 5-8/request | 1-2/request | 0-1/request |
| **Cache Hit Rate** | 0% | 80% | 95% |

---

**ملاحظات مهمة:**

1. **لا تنسى** إضافة `REVALIDATE_SECRET` في `.env`:
   ```env
   REVALIDATE_SECRET=your-secret-key-here
   ```

2. **اختبر التحسينات** في production build:
   ```bash
   npm run build
   npm run start
   ```

3. **قيّم الأداء** باستخدام:
   - Lighthouse
   - PageSpeed Insights
   - Vercel Analytics

4. **راقب النتائج** باستخدام Web Vitals tracking

---

تم إعداد الدليل بواسطة: GitHub Copilot  
التاريخ: 4 نوفمبر 2025
