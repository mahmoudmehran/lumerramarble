export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR' | 'CUSTOMER'
  country?: string
  whatsapp?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  nameAr: string
  nameEn: string
  nameEs: string
  nameFr: string
  category: 'MARBLE' | 'GRANITE' | 'QUARTZ' | 'SPECIAL'
  descriptionAr: string
  descriptionEn: string
  descriptionEs: string
  descriptionFr: string
  thickness: string
  finishes: string
  originCountry: string
  images: string[]
  slug: string
  featured: boolean
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  titleAr: string
  titleEn: string
  titleEs: string
  titleFr: string
  contentAr: string
  contentEn: string
  contentEs: string
  contentFr: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  slug: string
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface QuoteRequest {
  id: string
  userId: string
  products: QuoteProduct[]
  country: string
  whatsapp: string
  email: string
  notes?: string
  status: 'PENDING' | 'PROCESSING' | 'QUOTED' | 'COMPLETED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
}

export interface QuoteProduct {
  productId: string
  quantity: number
  specifications?: string
}

export type Locale = 'ar' | 'en' | 'es' | 'fr'

export interface LocalizedContent {
  ar: string
  en: string
  es: string
  fr: string
}

// Re-export i18n types for convenience
export type { 
  LocaleInfo, 
  TranslationKeys, 
  TranslationsPartial, 
  TranslationNamespace 
} from '../lib/i18n/types'

export interface ContentStats {
  number: string
  text: string
}

export interface ContentStats {
  number: string
  text: string
}

export interface ContentCategory {
  name?: string
  nameEn?: string
  href?: string
  image?: string
  id?: string
}

export interface ProductCategory {
  id: string
  name: string
}

export interface ContentFeature {
  title: string
  description: string
  icon?: string
}

export interface ContentHero {
  title: string
  subtitle: string
  primaryButton: string
  secondaryButton: string
  backgroundImage: string
}

export interface ContentHomepage {
  hero: ContentHero
  stats: {
    title: string
    items: ContentStats[]
  }
  categories: {
    title: string
    subtitle: string
    items: ContentCategory[]
  }
  features: {
    title: string
    items: ContentFeature[]
  }
  cta: {
    title: string
    subtitle: string
    button: string
  }
}

export interface ContentSiteInfo {
  title: string
  description: string
  phone: string
  email: string
  address: string
}

export interface ContentLanguage {
  siteInfo: ContentSiteInfo
  homepage: ContentHomepage
  products: {
    categories: ProductCategory[]
  }
  about: {
    hero: {
      title: string
      description?: string
      subtitle?: string
      backgroundImage?: string
    }
    mission?: {
      title?: string
      vision?: string
      mission?: string
      image?: string
    }
    location?: {
      title?: string
      address?: string
      description?: string
      image?: string
    }
    stats?: {
      title?: string
      items?: any[]
    }
  }
  export: {
    hero: {
      title: string
      subtitle: string
      cta?: string
      backgroundImage?: string
    }
    services?: {
      title?: string
      subtitle?: string
      image?: string
    }
    countries?: {
      title?: string
      subtitle?: string
      image?: string
    }
    cta?: {
      title?: string
      subtitle?: string
      button?: string
      backgroundImage?: string
    }
  }
}

export interface ContentData {
  ar: ContentLanguage
  en: ContentLanguage
  es: ContentLanguage
  fr: ContentLanguage
}
