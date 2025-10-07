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
