// JSON-LD Structured Data Component
// استخدم هذا الكومبوننت لإضافة structured data لـ Google

interface OrganizationSchemaProps {
  locale?: string
}

export function OrganizationSchema({ locale = 'ar' }: OrganizationSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lumerramarble.com'
  
  const companyInfo = {
    ar: {
      name: 'شركة لوميرا للرخام',
      description: 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
      address: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
    },
    en: {
      name: 'Lumerra Marble',
      description: 'Leading marble and granite export company from Egypt',
      address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
    },
  }

  const info = locale === 'ar' ? companyInfo.ar : companyInfo.en

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: info.name,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: info.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
      addressLocality: 'Cairo',
      streetAddress: info.address,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+20 111 312 1444',
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: ['Arabic', 'English', 'Spanish', 'French'],
      },
    ],
    sameAs: [
      'https://facebook.com/lumerramarble',
      'https://instagram.com/lumerramarble',
      'https://linkedin.com/company/lumerramarble',
      'https://youtube.com/@lumerramarble',
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
