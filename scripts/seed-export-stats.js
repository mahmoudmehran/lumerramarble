const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('📊 بدء إضافة بيانات إحصائيات التصدير...')

  try {
    const statsContent = [
      // إحصائية الدول
      {
        pageKey: 'export',
        sectionKey: 'stats',
        contentKey: 'countries_number',
        valueAr: '50+',
        valueEn: '50+',
        valueFr: '50+',
        valueEs: '50+',
      },
      {
        pageKey: 'export',
        sectionKey: 'stats',
        contentKey: 'countries_text',
        valueAr: 'دولة نصدر إليها',
        valueEn: 'Countries Exported To',
        valueFr: 'Pays exportés vers',
        valueEs: 'Países exportados a',
      },
      // إحصائية الشحنات
      {
        pageKey: 'export',
        sectionKey: 'stats',
        contentKey: 'shipments_number',
        valueAr: '1000+',
        valueEn: '1000+',
        valueFr: '1000+',
        valueEs: '1000+',
      },
      {
        pageKey: 'export',
        sectionKey: 'stats',
        contentKey: 'shipments_text',
        valueAr: 'شحنة ناجحة',
        valueEn: 'Successful Shipments',
        valueFr: 'Envois réussis',
        valueEs: 'Envíos exitosos',
      },
      // إحصائية الخبرة
      {
        pageKey: 'export',
        sectionKey: 'stats',
        contentKey: 'experience_number',
        valueAr: '15+',
        valueEn: '15+',
        valueFr: '15+',
        valueEs: '15+',
      },
      {
        pageKey: 'export',
        sectionKey: 'stats',
        contentKey: 'experience_text',
        valueAr: 'سنوات خبرة',
        valueEn: 'Years Experience',
        valueFr: 'Années d\'expérience',
        valueEs: 'Años de experiencia',
      },
      // إحصائية الرضا
      {
        pageKey: 'export',
        sectionKey: 'stats',
        contentKey: 'satisfaction_number',
        valueAr: '100%',
        valueEn: '100%',
        valueFr: '100%',
        valueEs: '100%',
      },
      {
        pageKey: 'export',
        sectionKey: 'stats',
        contentKey: 'satisfaction_text',
        valueAr: 'رضا العملاء',
        valueEn: 'Customer Satisfaction',
        valueFr: 'Satisfaction client',
        valueEs: 'Satisfacción del cliente',
      },
    ]

    let added = 0
    for (const item of statsContent) {
      await prisma.pageContent.upsert({
        where: {
          pageKey_sectionKey_contentKey: {
            pageKey: item.pageKey,
            sectionKey: item.sectionKey,
            contentKey: item.contentKey,
          },
        },
        update: {
          valueAr: item.valueAr,
          valueEn: item.valueEn,
          valueFr: item.valueFr,
          valueEs: item.valueEs,
        },
        create: {
          pageKey: item.pageKey,
          sectionKey: item.sectionKey,
          contentKey: item.contentKey,
          valueAr: item.valueAr,
          valueEn: item.valueEn,
          valueFr: item.valueFr,
          valueEs: item.valueEs,
          contentType: 'TEXT',
          isActive: true,
        },
      })
      added++
      console.log(`✅ ${item.sectionKey}.${item.contentKey}`)
    }

    console.log(`\n✨ تم إضافة ${added} حقل بنجاح!`)
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
