const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔄 إضافة حقول صفحة المدونة...')

  const fields = [
    // Hero Section (3 حقول)
    { pageKey: 'blog', sectionKey: 'hero', contentKey: 'title', valueAr: 'المدونة', valueEn: 'Blog', valueEs: 'Blog', valueFr: 'Blog' },
    { pageKey: 'blog', sectionKey: 'hero', contentKey: 'subtitle', valueAr: 'آخر الأخبار والمقالات حول صناعة الرخام والجرانيت', valueEn: 'Latest news and articles about marble and granite industry', valueEs: 'Últimas noticias y artículos sobre la industria del mármol y granito', valueFr: 'Dernières nouvelles et articles sur l\'industrie du marbre et du granit' },
    { pageKey: 'blog', sectionKey: 'hero', contentKey: 'backgroundImage', valueAr: '/images/blog/hero-bg.jpg', valueEn: '/images/blog/hero-bg.jpg', valueEs: '/images/blog/hero-bg.jpg', valueFr: '/images/blog/hero-bg.jpg' },
    
    // Featured Section (2 حقول)
    { pageKey: 'blog', sectionKey: 'featured', contentKey: 'title', valueAr: 'مقال مميز', valueEn: 'Featured Article', valueEs: 'Artículo Destacado', valueFr: 'Article en Vedette' },
    { pageKey: 'blog', sectionKey: 'featured', contentKey: 'subtitle', valueAr: 'أهم مقال في المدونة', valueEn: 'Top article in the blog', valueEs: 'Artículo principal del blog', valueFr: 'Article principal du blog' },
    
    // Recent Section (2 حقول)
    { pageKey: 'blog', sectionKey: 'recent', contentKey: 'title', valueAr: 'المقالات الحديثة', valueEn: 'Recent Articles', valueEs: 'Artículos Recientes', valueFr: 'Articles Récents' },
    { pageKey: 'blog', sectionKey: 'recent', contentKey: 'subtitle', valueAr: 'آخر المقالات والأخبار من عالم الأحجار الطبيعية', valueEn: 'Latest articles and news from the world of natural stones', valueEs: 'Últimos artículos y noticias del mundo de las piedras naturales', valueFr: 'Derniers articles et actualités du monde des pierres naturelles' },
    
    // UI Text (7 حقول)
    { pageKey: 'blog', sectionKey: 'ui', contentKey: 'readMore', valueAr: 'اقرأ المزيد', valueEn: 'Read More', valueEs: 'Leer Más', valueFr: 'Lire Plus' },
    { pageKey: 'blog', sectionKey: 'ui', contentKey: 'author', valueAr: 'كتب بواسطة', valueEn: 'Written by', valueEs: 'Escrito por', valueFr: 'Écrit par' },
    { pageKey: 'blog', sectionKey: 'ui', contentKey: 'date', valueAr: 'التاريخ', valueEn: 'Date', valueEs: 'Fecha', valueFr: 'Date' },
    { pageKey: 'blog', sectionKey: 'ui', contentKey: 'loading', valueAr: 'جاري التحميل...', valueEn: 'Loading...', valueEs: 'Cargando...', valueFr: 'Chargement...' },
    { pageKey: 'blog', sectionKey: 'ui', contentKey: 'noPosts', valueAr: 'لا توجد مقالات متاحة حالياً', valueEn: 'No articles available at the moment', valueEs: 'No hay artículos disponibles en este momento', valueFr: 'Aucun article disponible pour le moment' },
    { pageKey: 'blog', sectionKey: 'ui', contentKey: 'loadMore', valueAr: 'تحميل المزيد من المقالات', valueEn: 'Load More Articles', valueEs: 'Cargar Más Artículos', valueFr: 'Charger Plus d\'Articles' },
    { pageKey: 'blog', sectionKey: 'ui', contentKey: 'minutesRead', valueAr: 'دقائق', valueEn: 'min', valueEs: 'min', valueFr: 'min' },
  ]

  let addedCount = 0
  let skippedCount = 0

  for (const field of fields) {
    try {
      const existing = await prisma.pageContent.findFirst({
        where: {
          pageKey: field.pageKey,
          sectionKey: field.sectionKey,
          contentKey: field.contentKey,
        },
      })

      if (!existing) {
        await prisma.pageContent.create({
          data: field,
        })
        addedCount++
        console.log(`✅ تمت إضافة: ${field.sectionKey}.${field.contentKey}`)
      } else {
        skippedCount++
        console.log(`⏭️  موجود بالفعل: ${field.sectionKey}.${field.contentKey}`)
      }
    } catch (error) {
      console.error(`❌ خطأ في إضافة ${field.sectionKey}.${field.contentKey}:`, error.message)
    }
  }

  console.log(`\n✅ تم الانتهاء!`)
  console.log(`   - تمت الإضافة: ${addedCount} حقل`)
  console.log(`   - تم تخطيه: ${skippedCount} حقل`)
  console.log(`   - المجموع: ${fields.length} حقل`)
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
