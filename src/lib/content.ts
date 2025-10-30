import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ContentData {
  [sectionKey: string]: {
    [contentKey: string]: {
      ar: string
      en: string
      es: string
      fr: string
    }
  }
}

interface ContentCache {
  [pageKey: string]: ContentData
}

let contentCache: ContentCache = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
let lastCacheUpdate = 0

export async function getContent(pageKey: string = 'homepage'): Promise<ContentData> {
  // التحقق من الكاش
  const now = Date.now()
  if (contentCache[pageKey] && (now - lastCacheUpdate) < CACHE_DURATION) {
    return contentCache[pageKey]
  }

  try {
    const content = await prisma.pageContent.findMany({
      where: { pageKey },
      orderBy: [
        { sectionKey: 'asc' },
        { sortOrder: 'asc' },
        { contentKey: 'asc' }
      ]
    })

    // تنظيم البيانات
    const organizedContent = content.reduce((acc: ContentData, item: any) => {
      if (!acc[item.sectionKey]) {
        acc[item.sectionKey] = {}
      }
      acc[item.sectionKey][item.contentKey] = {
        ar: item.valueAr,
        en: item.valueEn,
        es: item.valueEs,
        fr: item.valueFr
      }
      return acc
    }, {})

    // تحديث الكاش
    contentCache[pageKey] = organizedContent
    lastCacheUpdate = now

    return organizedContent
  } catch (error) {
    console.error('Error fetching content from database:', error)
    return getDefaultContent(pageKey)
  }
}

function getDefaultContent(pageKey: string): ContentData {
  const defaultContents: { [key: string]: ContentData } = {
    homepage: {
      hero: {
        title: {
          ar: "أفخم أنواع الرخام والجرانيت من مصر",
          en: "Premium Marble & Granite from Egypt", 
          es: "Mármol y Granito Premium de Egipto",
          fr: "Marbre et Granit Premium d'Égypte"
        },
        subtitle: {
          ar: "نحن شركة رائدة في تصدير الرخام الطبيعي والجرانيت والكوارتز عالي الجودة من مصر إلى الأسواق العالمية",
          en: "We are a leading company exporting high-quality natural marble, granite, and quartz from Egypt to global markets",
          es: "Somos una empresa líder exportando mármol natural, granito y cuarzo de alta calidad desde Egipto a los mercados globales",
          fr: "Nous sommes une entreprise leader exportant du marbre naturel, granit et quartz de haute qualité d'Égypte vers les marchés mondiaux"
        },
        primaryButton: {
          ar: "استكشف منتجاتنا",
          en: "Explore Our Products",
          es: "Explorar Productos", 
          fr: "Découvrir nos Produits"
        },
        secondaryButton: {
          ar: "طلب عرض سعر",
          en: "Request Quote",
          es: "Solicitar Cotización",
          fr: "Demander un Devis"
        }
      },
      stats: {
        title: {
          ar: "أرقام تتحدث عنا",
          en: "Numbers That Speak About Us",
          es: "Números que Hablan de Nosotros",
          fr: "Des Chiffres qui Parlent de Nous"
        }
      }
    }
  }

  return defaultContents[pageKey] || {}
}

// دالة للحصول على محتوى معين
export async function getContentValue(
  pageKey: string,
  sectionKey: string,
  contentKey: string,
  language: string = 'ar'
): Promise<string> {
  const content = await getContent(pageKey)
  return content[sectionKey]?.[contentKey]?.[language as keyof typeof content[string][string]] || ''
}

// دالة لمسح الكاش
export function clearContentCache() {
  contentCache = {}
  lastCacheUpdate = 0
}

// دالة لحفظ المحتوى (للإدارة)
export async function saveContentToAPI(
  pageKey: string,
  sectionKey: string,
  contentKey: string,
  values: {
    ar: string
    en: string
    es: string
    fr: string
  },
  contentType: string = 'TEXT',
  sortOrder: number = 0
) {
  try {
    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageKey,
        sectionKey,
        contentKey,
        values,
        contentType,
        sortOrder
      })
    })

    if (!response.ok) {
      throw new Error('فشل في حفظ المحتوى')
    }

    // مسح الكاش بعد التحديث
    clearContentCache()
    
    return await response.json()
  } catch (error) {
    console.error('خطأ في حفظ المحتوى:', error)
    throw error
  }
}

// دالة لجلب المحتوى من API (للكلاينت)
export async function fetchContentFromAPI(pageKey: string = 'homepage') {
  try {
    const response = await fetch(`/api/admin/content?page=${pageKey}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('فشل في جلب المحتوى')
    }

    return await response.json()
  } catch (error) {
    console.error('خطأ في جلب المحتوى:', error)
    return getDefaultContent(pageKey)
  }
}