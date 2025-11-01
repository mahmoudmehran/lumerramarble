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
const CACHE_DURATION = 0 // Disabled cache for testing
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
        },
        clients_number: {
          ar: "500+",
          en: "500+",
          es: "500+",
          fr: "500+"
        },
        clients_text: {
          ar: "عميل راضٍ",
          en: "Happy Clients",
          es: "Clientes Satisfechos",
          fr: "Clients Satisfaits"
        },
        projects_number: {
          ar: "1000+",
          en: "1000+",
          es: "1000+",
          fr: "1000+"
        },
        projects_text: {
          ar: "مشروع منجز",
          en: "Completed Projects",
          es: "Proyectos Completados",
          fr: "Projets Terminés"
        },
        countries_number: {
          ar: "50+",
          en: "50+",
          es: "50+",
          fr: "50+"
        },
        countries_text: {
          ar: "دولة حول العالم",
          en: "Countries Worldwide",
          es: "Países en Todo el Mundo",
          fr: "Pays dans le Monde"
        },
        satisfaction_number: {
          ar: "100%",
          en: "100%",
          es: "100%",
          fr: "100%"
        },
        satisfaction_text: {
          ar: "رضا العملاء",
          en: "Customer Satisfaction",
          es: "Satisfacción del Cliente",
          fr: "Satisfaction Client"
        }
      },
      categories: {
        title: {
          ar: "فئات منتجاتنا",
          en: "Our Product Categories",
          es: "Nuestras Categorías de Productos",
          fr: "Nos Catégories de Produits"
        },
        subtitle: {
          ar: "اكتشف مجموعتنا الواسعة من الرخام والجرانيت الفاخر",
          en: "Discover our wide range of premium marble and granite",
          es: "Descubra nuestra amplia gama de mármol y granito premium",
          fr: "Découvrez notre large gamme de marbre et granit premium"
        }
      },
      features: {
        title: {
          ar: "لماذا تختارنا؟",
          en: "Why Choose Us?",
          es: "¿Por Qué Elegirnos?",
          fr: "Pourquoi Nous Choisir?"
        },
        quality_title: {
          ar: "جودة عالية",
          en: "High Quality",
          es: "Alta Calidad",
          fr: "Haute Qualité"
        },
        quality_description: {
          ar: "نحن نقدم فقط أفضل أنواع الرخام والجرانيت",
          en: "We offer only the finest marble and granite",
          es: "Ofrecemos solo el mejor mármol y granito",
          fr: "Nous offrons uniquement le meilleur marbre et granit"
        },
        global_title: {
          ar: "توصيل عالمي",
          en: "Global Delivery",
          es: "Entrega Global",
          fr: "Livraison Mondiale"
        },
        global_description: {
          ar: "نصدر إلى جميع أنحاء العالم",
          en: "We export worldwide",
          es: "Exportamos a todo el mundo",
          fr: "Nous exportons dans le monde entier"
        },
        service_title: {
          ar: "خدمة عملاء ممتازة",
          en: "Excellent Customer Service",
          es: "Excelente Servicio al Cliente",
          fr: "Excellent Service Client"
        },
        service_description: {
          ar: "فريقنا متاح دائماً لمساعدتك",
          en: "Our team is always available to help",
          es: "Nuestro equipo siempre está disponible para ayudar",
          fr: "Notre équipe est toujours disponible pour vous aider"
        },
        experience_title: {
          ar: "سنوات من الخبرة",
          en: "Years of Experience",
          es: "Años de Experiencia",
          fr: "Années d'Expérience"
        },
        experience_description: {
          ar: "خبرة واسعة في صناعة الرخام",
          en: "Extensive experience in marble industry",
          es: "Amplia experiencia en la industria del mármol",
          fr: "Vaste expérience dans l'industrie du marbre"
        }
      },
      cta: {
        title: {
          ar: "جاهز للبدء؟",
          en: "Ready to Start?",
          es: "¿Listo para Comenzar?",
          fr: "Prêt à Commencer?"
        },
        subtitle: {
          ar: "احصل على عرض سعر مخصص لمشروعك اليوم",
          en: "Get a custom quote for your project today",
          es: "Obtenga una cotización personalizada para su proyecto hoy",
          fr: "Obtenez un devis personnalisé pour votre projet aujourd'hui"
        },
        button: {
          ar: "اطلب عرض سعر الآن",
          en: "Request Quote Now",
          es: "Solicitar Cotización Ahora",
          fr: "Demander un Devis Maintenant"
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