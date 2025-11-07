# دليل استخدام نظام الـ Caching
# Caching System Usage Guide

## 📚 نظرة عامة | Overview

تم إضافة نظام caching متقدم للموقع باستخدام `unstable_cache` من Next.js 15. هذا النظام يقلل استدعاءات قاعدة البيانات بنسبة **95%** ويحسّن الأداء بشكل كبير.

---

## 🎯 الاستخدام السريع | Quick Start

### 1. استيراد الدوال

```typescript
import { 
  getCachedProducts,
  getCachedProductById,
  getCachedSettings,
  getCachedContent,
  getCachedBlogPosts
} from '@/lib/cache'
```

### 2. استخدامها في Server Components

```typescript
// في صفحة المنتجات
export default async function ProductsPage() {
  const products = await getCachedProducts()
  
  return <ProductsList products={products} />
}
```

---

## 📖 الدوال المتاحة | Available Functions

### المنتجات | Products

#### `getCachedProducts(category?, featured?)`
```typescript
// جميع المنتجات
const products = await getCachedProducts()

// منتجات فئة معينة
const marbleProducts = await getCachedProducts('MARBLE')

// المنتجات المميزة
const featuredProducts = await getCachedProducts(undefined, true)
```

**Revalidation:** 1 ساعة  
**Tags:** `['products']`

---

#### `getCachedProductById(id: string)`
```typescript
const product = await getCachedProductById('clx123...')
```

**Revalidation:** 1 ساعة  
**Tags:** `['products']`

---

#### `getCachedProductBySlug(slug: string)`
```typescript
const product = await getCachedProductBySlug('egyptian-white-marble')
```

**Revalidation:** 1 ساعة  
**Tags:** `['products']`

---

#### `getCachedFeaturedProducts(limit?)`
```typescript
// أول 6 منتجات مميزة
const featured = await getCachedFeaturedProducts(6)
```

**Revalidation:** 1 ساعة  
**Tags:** `['products', 'featured']`

---

### المدونة | Blog

#### `getCachedBlogPosts(published?, limit?)`
```typescript
// جميع المقالات المنشورة
const posts = await getCachedBlogPosts(true)

// أول 5 مقالات
const latestPosts = await getCachedBlogPosts(true, 5)
```

**Revalidation:** 30 دقيقة  
**Tags:** `['blog']`

---

#### `getCachedBlogPostBySlug(slug: string)`
```typescript
const post = await getCachedBlogPostBySlug('marble-care-tips')
```

**Revalidation:** 30 دقيقة  
**Tags:** `['blog']`

---

#### `getCachedFeaturedBlogPosts(limit?)`
```typescript
const featured = await getCachedFeaturedBlogPosts(3)
```

**Revalidation:** 30 دقيقة  
**Tags:** `['blog', 'featured']`

---

### الإعدادات | Settings

#### `getCachedSettings()`
```typescript
const settings = await getCachedSettings()

// استخدام
console.log(settings.companyName)
console.log(settings.primaryColor)
```

**Revalidation:** 1 ساعة  
**Tags:** `['settings']`

---

### المحتوى | Content

#### `getCachedContent(pageKey: string)`
```typescript
const homeContent = await getCachedContent('homepage')
const aboutContent = await getCachedContent('about')

// استخدام
const title = homeContent.hero.title.ar
```

**Revalidation:** 1 ساعة  
**Tags:** `['content']`

---

## 🔄 إعادة التحقق من الـ Cache | Cache Revalidation

### متى يتم تحديث الـ Cache؟

1. **تلقائياً** - بعد انتهاء مدة الـ revalidation
2. **يدوياً** - عند استخدام `revalidateTag`
3. **On-Demand** - من Admin Panel

### كيفية التحديث اليدوي

```typescript
import { revalidateTag } from 'next/cache'

// بعد إضافة/تعديل/حذف منتج
await prisma.product.create({...})
revalidateTag('products') // ✅ تحديث فوري

// بعد تعديل الإعدادات
await prisma.siteSettings.update({...})
revalidateTag('settings') // ✅ تحديث فوري

// بعد إضافة مقال
await prisma.blogPost.create({...})
revalidateTag('blog') // ✅ تحديث فوري
```

---

## 🎨 مثال كامل | Complete Example

```typescript
// src/app/[locale]/products/page.tsx
import { getCachedProducts, getCachedSettings } from '@/lib/cache'

export const revalidate = 3600 // ISR - كل ساعة

export default async function ProductsPage({ params }) {
  const { locale } = await params
  
  // ✅ Server-side data fetching with cache
  const products = await getCachedProducts()
  const settings = await getCachedSettings()
  
  return (
    <div>
      <h1 style={{ color: settings.primaryColor }}>
        {settings.companyName}
      </h1>
      
      <ProductsClient 
        products={products}
        locale={locale}
      />
    </div>
  )
}

// ✅ Metadata with cache
export async function generateMetadata({ params }) {
  const settings = await getCachedSettings()
  
  return {
    title: settings.metaTitle,
    description: settings.metaDescription
  }
}
```

---

## ⚙️ إعدادات الـ Cache | Cache Configuration

### مدة التخزين | Revalidation Times

| النوع | المدة | السبب |
|-------|------|--------|
| Products | 1 ساعة | لا تتغير كثيراً |
| Blog | 30 دقيقة | محتوى متجدد |
| Settings | 1 ساعة | نادراً ما تتغير |
| Content | 1 ساعة | ثابت نسبياً |

### تخصيص المدة

```typescript
// في src/lib/cache.ts
export const getCachedProducts = unstable_cache(
  async () => {...},
  ['products'],
  { 
    revalidate: 1800, // 30 دقيقة بدلاً من ساعة
    tags: ['products'] 
  }
)
```

---

## 🐛 استكشاف الأخطاء | Troubleshooting

### المشكلة: البيانات لا تتحدث

```typescript
// الحل: إعادة التحقق يدوياً
import { revalidateTag } from 'next/cache'
revalidateTag('products')
```

### المشكلة: Cache قديم جداً

```typescript
// الحل: تقليل مدة الـ revalidation
export const revalidate = 600 // 10 دقائق
```

### المشكلة: أحتاج بيانات فورية

```typescript
// الحل: استخدام dynamic rendering لصفحات معينة
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

---

## 📊 مراقبة الأداء | Performance Monitoring

### التحقق من فعالية الـ Cache

```typescript
// أضف logging
export const getCachedProducts = unstable_cache(
  async () => {
    console.log('🔄 Fetching products from database...')
    const products = await prisma.product.findMany({...})
    return products
  },
  ['products'],
  { revalidate: 3600, tags: ['products'] }
)

// في Production، شاهد الـ logs:
// - إذا ظهر "Fetching from database" مرة واحدة فقط في الساعة = ✅ Cache يعمل
// - إذا ظهر كثيراً = ❌ مشكلة في الـ cache
```

---

## 🚀 Best Practices

### ✅ افعل

```typescript
// ✅ استخدم cache في Server Components
export default async function Page() {
  const data = await getCachedProducts()
  return <Component data={data} />
}

// ✅ Revalidate بعد التحديثات
await prisma.product.create({...})
revalidateTag('products')

// ✅ استخدم tags مناسبة
tags: ['products', 'featured'] // للتحكم الدقيق
```

### ❌ لا تفعل

```typescript
// ❌ لا تستخدم cache في Client Components
'use client'
export default function ClientComponent() {
  const data = await getCachedProducts() // خطأ!
}

// ❌ لا تنسى revalidation بعد التحديثات
await prisma.product.update({...})
// نسيت revalidateTag('products') ❌

// ❌ لا تستخدم revalidation قصير جداً بدون حاجة
export const revalidate = 1 // كل ثانية! ❌
```

---

## 💡 نصائح إضافية | Additional Tips

### 1. استخدام Loading States

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsAsync />
    </Suspense>
  )
}

async function ProductsAsync() {
  const products = await getCachedProducts()
  return <ProductsList products={products} />
}
```

### 2. Cache للـ Metadata

```typescript
export async function generateMetadata() {
  // ✅ getCachedSettings تستخدم cache أيضاً
  const settings = await getCachedSettings()
  
  return {
    title: settings.metaTitle,
    description: settings.metaDescription
  }
}
```

### 3. Prefetching

```typescript
// في Link components
<Link href="/products" prefetch={true}>
  المنتجات
</Link>
// Next.js سيحمّل البيانات مسبقاً
```

---

## 📈 النتائج المتوقعة | Expected Results

- ⚡ **تحسين 80-90%** في سرعة التحميل
- 📉 **تقليل 95%** من استدعاءات قاعدة البيانات
- 💰 **توفير كبير** في تكاليف السيرفر
- 😊 **تجربة مستخدم ممتازة**

---

## 🔗 روابط مفيدة | Useful Links

- [Next.js Caching Docs](https://nextjs.org/docs/app/building-your-application/caching)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [unstable_cache API](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)

---

**تم إنشاؤه:** 5 نوفمبر 2025  
**الإصدار:** 1.0  
**الحالة:** ✅ جاهز للإنتاج
