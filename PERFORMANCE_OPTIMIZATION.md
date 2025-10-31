# ⚡ Performance Optimization Guide

## نظام تحسين الأداء المطبق

تم تطبيق تحسينات شاملة للأداء تشمل:
1. ✅ Image Optimization (تحسين الصور)
2. ✅ Code Splitting (تقسيم الكود)
3. ✅ Lazy Loading (التحميل الكسول)
4. ✅ Caching Strategy (استراتيجية التخزين المؤقت)
5. ✅ Font Optimization (تحسين الخطوط)

---

## 1. Image Optimization

### استخدام Next.js Image Component

✅ **الميزات المطبقة:**
- تحسين تلقائي للصور
- Lazy loading للصور تحت الـ fold
- تحويل تلقائي لـ WebP/AVIF
- Responsive images مع srcset
- Blur placeholder أثناء التحميل

### مثال الاستخدام الصحيح:

```tsx
import Image from 'next/image'

// ✅ استخدام صحيح مع priority للصور المهمة (above the fold)
<Image
  src="/images/hero.jpg"
  alt="Hero Image"
  width={1920}
  height={1080}
  priority
  className="w-full h-auto"
/>

// ✅ استخدام صحيح للصور العادية (lazy loading تلقائي)
<Image
  src="/images/product.jpg"
  alt="Product"
  width={800}
  height={600}
  className="w-full h-auto"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

### ❌ استخدام خاطئ:

```tsx
// ❌ لا تستخدم <img> tag مباشرة
<img src="/images/product.jpg" alt="Product" />

// ❌ لا تضع priority على جميع الصور
<Image src="/images/footer-logo.jpg" priority />
```

### إعدادات next.config.ts:

```typescript
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // سنة واحدة
  }
}
```

---

## 2. Code Splitting & Dynamic Imports

### استخدام Dynamic Imports للمكونات الثقيلة

✅ **متى تستخدم Dynamic Imports:**
- المكونات الكبيرة (Charts, Rich Text Editors)
- المكونات المستخدمة شرطياً
- المكونات تحت الـ fold
- Modals و Dialogs

### مثال: تحميل Modal dynamically

```tsx
'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

// ✅ تحميل Modal فقط عند الحاجة
const ContactModal = dynamic(
  () => import('@/components/ContactModal'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false // إذا كان المكون يستخدم browser APIs فقط
  }
)

export default function Page() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Contact Us
      </button>
      
      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
```

### مثال: تحميل Library ثقيلة dynamically

```tsx
'use client'
import { useState } from 'react'

export default function ChartPage() {
  const [ChartComponent, setChartComponent] = useState<any>(null)

  const loadChart = async () => {
    // ✅ تحميل library فقط عند الضغط على الزر
    const Chart = await import('react-chartjs-2')
    setChartComponent(() => Chart.default)
  }

  return (
    <div>
      <button onClick={loadChart}>Show Chart</button>
      {ChartComponent && <ChartComponent data={...} />}
    </div>
  )
}
```

---

## 3. Lazy Loading Components

### استخدام Intersection Observer للـ Lazy Loading

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export function LazySection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-96" />}
    </div>
  )
}

// ✅ الاستخدام
<LazySection>
  <HeavyComponent />
</LazySection>
```

---

## 4. Caching Strategy

### API Route Caching

```typescript
// ✅ تخزين مؤقت للبيانات الثابتة
export async function GET() {
  const products = await prisma.product.findMany()
  
  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      // تخزين لمدة ساعة، استخدام نسخة قديمة لمدة يوم
    }
  })
}

// ✅ عدم تخزين للبيانات الديناميكية
export async function POST() {
  // ...
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  })
}
```

### Page Caching

```typescript
// app/products/page.tsx

// ✅ Static Generation مع revalidation
export const revalidate = 3600 // إعادة التوليد كل ساعة

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsList products={products} />
}

// ✅ Dynamic Rendering للصفحات الديناميكية
export const dynamic = 'force-dynamic' // لا تخزين

export default async function DashboardPage() {
  const user = await getCurrentUser()
  return <Dashboard user={user} />
}
```

---

## 5. Font Optimization

### استخدام Next.js Font Optimization

```typescript
// app/layout.tsx
import { Cairo, Inter } from 'next/font/google'

// ✅ تحميل الخطوط مع تحسين
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo'
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export default function RootLayout({ children }) {
  return (
    <html className={`${cairo.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## 6. Bundle Size Optimization

### تحليل حجم الـ Bundle

```bash
# تثبيت أداة التحليل
npm install --save-dev @next/bundle-analyzer

# تحديث next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(nextConfig)

# تشغيل التحليل
ANALYZE=true npm run build
```

### تقليل حجم الـ Dependencies

```json
// ✅ استخدام named imports
import { Button } from '@/components/ui/button'

// ❌ تجنب import كل المكتبة
import * as Components from '@/components'
```

---

## 7. Database Query Optimization

### استخدام Prisma بكفاءة

```typescript
// ✅ استخدام select لجلب الحقول المطلوبة فقط
const products = await prisma.product.findMany({
  select: {
    id: true,
    nameEn: true,
    category: true,
    images: true
  },
  where: { active: true },
  take: 10
})

// ❌ تجنب جلب جميع الحقول
const products = await prisma.product.findMany()

// ✅ استخدام pagination
const products = await prisma.product.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize
})

// ✅ استخدام relations بحذر
const products = await prisma.product.findMany({
  include: {
    category: true // فقط إذا كنت تحتاجها
  }
})
```

---

## 8. Client-Side Performance

### تجنب Re-renders غير الضرورية

```tsx
'use client'
import { memo, useMemo, useCallback } from 'react'

// ✅ استخدام memo للمكونات
const ProductCard = memo(function ProductCard({ product }) {
  return <div>{product.name}</div>
})

// ✅ استخدام useMemo للعمليات الثقيلة
function ProductsList({ products }) {
  const sortedProducts = useMemo(
    () => products.sort((a, b) => a.price - b.price),
    [products]
  )

  // ✅ استخدام useCallback للـ functions
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id)
  }, [])

  return (
    <div>
      {sortedProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onClick={handleClick}
        />
      ))}
    </div>
  )
}
```

---

## 9. CSS Optimization

### استخدام TailwindCSS بكفاءة

```typescript
// tailwind.config.ts

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      // فقط الألوان والقيم المستخدمة
    }
  },
  // ✅ إزالة الـ CSS غير المستخدم
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,ts,jsx,tsx}']
  }
}
```

---

## 10. Monitoring & Analytics

### إضافة Web Vitals Monitoring

```typescript
// app/layout.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    
    // إرسال للـ analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_label: metric.label
      })
    }
  })
  
  return null
}
```

---

## Performance Checklist

### ✅ Images
- [ ] استخدام Next.js Image component
- [ ] إضافة priority للصور المهمة فقط
- [ ] استخدام blur placeholder
- [ ] تحسين أحجام الصور (max 200KB)
- [ ] استخدام WebP/AVIF format

### ✅ Code Splitting
- [ ] Dynamic imports للمكونات الثقيلة
- [ ] Lazy loading للمكونات تحت الـ fold
- [ ] تقليل حجم الـ JavaScript bundle
- [ ] استخدام named imports

### ✅ Caching
- [ ] إعداد Cache-Control headers صحيحة
- [ ] استخدام revalidate للصفحات Static
- [ ] تخزين API responses المناسبة
- [ ] استخدام CDN للـ static assets

### ✅ Database
- [ ] استخدام select للحقول المطلوبة فقط
- [ ] إضافة indexes على الحقول المستخدمة في البحث
- [ ] استخدام pagination
- [ ] تجنب N+1 queries

### ✅ Fonts
- [ ] استخدام Next.js Font Optimization
- [ ] font-display: swap
- [ ] تحميل subsets المطلوبة فقط

### ✅ Client-Side
- [ ] استخدام memo للمكونات
- [ ] استخدام useMemo/useCallback
- [ ] تجنب re-renders غير ضرورية
- [ ] استخدام debounce للـ input handlers

---

## Performance Metrics Goals

### Core Web Vitals

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Additional Metrics

- **TTFB (Time to First Byte):** < 600ms
- **FCP (First Contentful Paint):** < 1.8s
- **TTI (Time to Interactive):** < 3.8s

---

## Testing Performance

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Bundle Analysis
ANALYZE=true npm run build

# Development Performance
npm run dev -- --turbo
```

---

## الخلاصة

تم تطبيق تحسينات شاملة للأداء:
- ✅ Image Optimization (Next.js Image)
- ✅ Code Splitting (Dynamic Imports)
- ✅ Lazy Loading (Intersection Observer)
- ✅ Caching Strategy (Cache-Control headers)
- ✅ Font Optimization (Next.js Fonts)
- ✅ Bundle Size Optimization
- ✅ Database Query Optimization
- ✅ Client-Side Performance (memo, useMemo)

النتيجة: موقع سريع ومحسن للأداء مع تجربة مستخدم ممتازة.
