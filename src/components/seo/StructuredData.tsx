// JSON-LD Structured Data Component
// استخدم هذا الكومبوننت لإضافة structured data لـ Google

'use client'

import { useSiteSettings } from '../../hooks/useTheme'

interface OrganizationSchemaProps {
  locale?: string
}

export function OrganizationSchema({ locale = 'ar' }: OrganizationSchemaProps) {
  const settings = useSiteSettings()

  if (!settings) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'ar' ? settings.companyNameAr : settings.companyName,
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://lumerramarble.com',
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
    description: locale === 'ar' ? settings.descriptionAr : settings.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
      addressLocality: 'Cairo',
      streetAddress: locale === 'ar' ? settings.addressAr : settings.address,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: settings.phone,
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: ['Arabic', 'English', 'Spanish', 'French'],
      },
    ],
    sameAs: [
      settings.facebook,
      settings.instagram,
      settings.linkedin,
      settings.youtube,
    ].filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProductSchemaProps {
  product: {
    nameAr: string
    nameEn: string
    descriptionAr: string
    descriptionEn: string
    images: string[]
    slug: string
    category: string
  }
  locale?: string
}

export function ProductSchema({ product, locale = 'ar' }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lumerramarble.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: locale === 'ar' ? product.nameAr : product.nameEn,
    description: locale === 'ar' ? product.descriptionAr : product.descriptionEn,
    image: product.images.map(img => `${baseUrl}${img}`),
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Lumerra Marble',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Lumerra Marble',
      url: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      url: `${baseUrl}/${locale}/products/${product.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BlogPostSchemaProps {
  post: {
    titleAr: string
    titleEn: string
    excerptAr?: string
    excerptEn?: string
    featuredImage?: string
    createdAt: Date
    updatedAt: Date
    slug: string
  }
  locale?: string
}

export function BlogPostSchema({ post, locale = 'ar' }: BlogPostSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lumerramarble.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: locale === 'ar' ? post.titleAr : post.titleEn,
    description: locale === 'ar' ? post.excerptAr : post.excerptEn,
    image: post.featuredImage ? `${baseUrl}${post.featuredImage}` : undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Lumerra Marble',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lumerra Marble',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${locale}/blog/${post.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
