const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('✨ بدء إضافة بيانات مميزات التصدير...')

  try {
    const featuresContent = [
      // عنوان القسم
      {
        pageKey: 'export',
        sectionKey: 'features',
        contentKey: 'title',
        valueAr: 'مميزات التصدير معنا',
        valueEn: 'Export Features with Us',
        valueFr: 'Caractéristiques d\'exportation avec nous',
        valueEs: 'Características de exportación con nosotros',
      },
      // ميزة 1
      {
        pageKey: 'export',
        sectionKey: 'features',
        contentKey: 'feature1_text',
        valueAr: 'شحن آمن ومؤمن بالكامل',
        valueEn: 'Safe and Fully Insured Shipping',
        valueFr: 'Expédition sûre et entièrement assurée',
        valueEs: 'Envío seguro y totalmente asegurado',
      },
      // ميزة 2
      {
        pageKey: 'export',
        sectionKey: 'features',
        contentKey: 'feature2_text',
        valueAr: 'أسعار تنافسية وعروض خاصة للكميات الكبيرة',
        valueEn: 'Competitive Prices and Special Offers for Large Quantities',
        valueFr: 'Prix compétitifs et offres spéciales pour les grandes quantités',
        valueEs: 'Precios competitivos y ofertas especiales para grandes cantidades',
      },
      // ميزة 3
      {
        pageKey: 'export',
        sectionKey: 'features',
        contentKey: 'feature3_text',
        valueAr: 'دعم فني متخصص',
        valueEn: 'Specialized Technical Support',
        valueFr: 'Support technique spécialisé',
        valueEs: 'Soporte técnico especializado',
      },
      // ميزة 4
      {
        pageKey: 'export',
        sectionKey: 'features',
        contentKey: 'feature4_text',
        valueAr: 'مرونة في طرق الدفع',
        valueEn: 'Flexibility in Payment Methods',
        valueFr: 'Flexibilité dans les méthodes de paiement',
        valueEs: 'Flexibilidad en los métodos de pago',
      },
      // ميزة 5
      {
        pageKey: 'export',
        sectionKey: 'features',
        contentKey: 'feature5_text',
        valueAr: 'تتبع الشحنة أونلاين',
        valueEn: 'Online Shipment Tracking',
        valueFr: 'Suivi de l\'expédition en ligne',
        valueEs: 'Seguimiento de envío en línea',
      },
      // ميزة 6
      {
        pageKey: 'export',
        sectionKey: 'features',
        contentKey: 'feature6_text',
        valueAr: 'منتجات عالية الجودة',
        valueEn: 'High Quality Products',
        valueFr: 'Produits de haute qualité',
        valueEs: 'Productos de alta calidad',
      },
    ]

    let added = 0
    for (const item of featuresContent) {
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
