const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌍 بدء إضافة بيانات الدول المستوردة...')

  try {
    const countriesContent = [
      // عنوان ووصف القسم
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'title',
        valueAr: 'البلدان التي نصدر إليها',
        valueEn: 'Countries We Export To',
        valueFr: 'Pays vers lesquels nous exportons',
        valueEs: 'Países a los que exportamos',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'subtitle',
        valueAr: 'نصل إلى أكثر من 50 دولة في 6 قارات',
        valueEn: 'We reach over 50 countries across 6 continents',
        valueFr: 'Nous atteignons plus de 50 pays sur 6 continents',
        valueEs: 'Llegamos a más de 50 países en 6 continentes',
      },
      // أوروبا
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'europe_name',
        valueAr: 'أوروبا',
        valueEn: 'Europe',
        valueFr: 'Europe',
        valueEs: 'Europa',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'europe_count',
        valueAr: '15 دولة',
        valueEn: '15 Countries',
        valueFr: '15 Pays',
        valueEs: '15 Países',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'europe_flag',
        valueAr: '🇪🇺',
        valueEn: '🇪🇺',
        valueFr: '🇪🇺',
        valueEs: '🇪🇺',
      },
      // آسيا
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'asia_name',
        valueAr: 'آسيا',
        valueEn: 'Asia',
        valueFr: 'Asie',
        valueEs: 'Asia',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'asia_count',
        valueAr: '12 دولة',
        valueEn: '12 Countries',
        valueFr: '12 Pays',
        valueEs: '12 Países',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'asia_flag',
        valueAr: '🌏',
        valueEn: '🌏',
        valueFr: '🌏',
        valueEs: '🌏',
      },
      // أمريكا الشمالية
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'americas_name',
        valueAr: 'أمريكا الشمالية',
        valueEn: 'North America',
        valueFr: 'Amérique du Nord',
        valueEs: 'América del Norte',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'americas_count',
        valueAr: '8 دول',
        valueEn: '8 Countries',
        valueFr: '8 Pays',
        valueEs: '8 Países',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'americas_flag',
        valueAr: '🇺🇸',
        valueEn: '🇺🇸',
        valueFr: '🇺🇸',
        valueEs: '🇺🇸',
      },
      // أمريكا الجنوبية
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'southamerica_name',
        valueAr: 'أمريكا الجنوبية',
        valueEn: 'South America',
        valueFr: 'Amérique du Sud',
        valueEs: 'América del Sur',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'southamerica_count',
        valueAr: '6 دول',
        valueEn: '6 Countries',
        valueFr: '6 Pays',
        valueEs: '6 Países',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'southamerica_flag',
        valueAr: '🇧🇷',
        valueEn: '🇧🇷',
        valueFr: '🇧🇷',
        valueEs: '🇧🇷',
      },
      // أفريقيا
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'africa_name',
        valueAr: 'أفريقيا',
        valueEn: 'Africa',
        valueFr: 'Afrique',
        valueEs: 'África',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'africa_count',
        valueAr: '10 دول',
        valueEn: '10 Countries',
        valueFr: '10 Pays',
        valueEs: '10 Países',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'africa_flag',
        valueAr: '🌍',
        valueEn: '🌍',
        valueFr: '🌍',
        valueEs: '🌍',
      },
      // أوقيانوسيا
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'oceania_name',
        valueAr: 'أوقيانوسيا',
        valueEn: 'Oceania',
        valueFr: 'Océanie',
        valueEs: 'Oceanía',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'oceania_count',
        valueAr: '3 دول',
        valueEn: '3 Countries',
        valueFr: '3 Pays',
        valueEs: '3 Países',
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'oceania_flag',
        valueAr: '🇦🇺',
        valueEn: '🇦🇺',
        valueFr: '🇦🇺',
        valueEs: '🇦🇺',
      },
    ]

    let added = 0
    for (const item of countriesContent) {
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
