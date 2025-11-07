const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedCategories() {
  try {
    console.log('🔄 إضافة بيانات الفئات للصفحة الرئيسية...\n')

    const categories = [
      {
        pageKey: 'homepage',
        sectionKey: 'categories',
        data: [
          // Marble Category
          {
            contentKey: 'marble_name',
            valueAr: 'رخام',
            valueEn: 'Marble',
            valueEs: 'Mármol',
            valueFr: 'Marbre'
          },
          {
            contentKey: 'marble_image',
            valueAr: '/images/marble-category.jpg',
            valueEn: '/images/marble-category.jpg',
            valueEs: '/images/marble-category.jpg',
            valueFr: '/images/marble-category.jpg'
          },
          // Granite Category
          {
            contentKey: 'granite_name',
            valueAr: 'جرانيت',
            valueEn: 'Granite',
            valueEs: 'Granito',
            valueFr: 'Granit'
          },
          {
            contentKey: 'granite_image',
            valueAr: '/images/granite-category.jpg',
            valueEn: '/images/granite-category.jpg',
            valueEs: '/images/granite-category.jpg',
            valueFr: '/images/granite-category.jpg'
          },
          // Quartz Category
          {
            contentKey: 'quartz_name',
            valueAr: 'كوارتز',
            valueEn: 'Quartz',
            valueEs: 'Cuarzo',
            valueFr: 'Quartz'
          },
          {
            contentKey: 'quartz_image',
            valueAr: '/images/quartz-category.jpg',
            valueEn: '/images/quartz-category.jpg',
            valueEs: '/images/quartz-category.jpg',
            valueFr: '/images/quartz-category.jpg'
          },
          // Special Category
          {
            contentKey: 'special_name',
            valueAr: 'أحجار خاصة',
            valueEn: 'Special Stones',
            valueEs: 'Piedras Especiales',
            valueFr: 'Pierres Spéciales'
          },
          {
            contentKey: 'special_image',
            valueAr: '/images/special-category.jpg',
            valueEn: '/images/special-category.jpg',
            valueEs: '/images/special-category.jpg',
            valueFr: '/images/special-category.jpg'
          }
        ]
      }
    ]

    let totalAdded = 0

    for (const category of categories) {
      for (const item of category.data) {
        await prisma.pageContent.upsert({
          where: {
            pageKey_sectionKey_contentKey: {
              pageKey: category.pageKey,
              sectionKey: category.sectionKey,
              contentKey: item.contentKey
            }
          },
          update: {
            valueAr: item.valueAr,
            valueEn: item.valueEn,
            valueEs: item.valueEs,
            valueFr: item.valueFr
          },
          create: {
            pageKey: category.pageKey,
            sectionKey: category.sectionKey,
            contentKey: item.contentKey,
            valueAr: item.valueAr,
            valueEn: item.valueEn,
            valueEs: item.valueEs,
            valueFr: item.valueFr,
            contentType: 'TEXT',
            isActive: true
          }
        })
        totalAdded++
        console.log(`✅ ${category.sectionKey}.${item.contentKey}`)
      }
    }

    console.log(`\n✨ تم إضافة ${totalAdded} حقل بنجاح!`)
    
    // التحقق من النتيجة
    const result = await prisma.pageContent.findMany({
      where: {
        pageKey: 'homepage',
        sectionKey: 'categories'
      },
      orderBy: {
        contentKey: 'asc'
      }
    })

    console.log('\n📊 الحقول المضافة:')
    result.forEach(r => {
      console.log(`  - ${r.contentKey}: ${r.valueAr}`)
    })

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCategories()
