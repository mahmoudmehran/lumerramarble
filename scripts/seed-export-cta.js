const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 جاري إضافة بيانات دعوة للعمل (CTA) لصفحة التصدير...\n')

  const ctaFields = [
    // العنوان
    {
      pageKey: 'export',
      sectionKey: 'cta',
      contentKey: 'title',
      valueAr: 'ابدأ مشروع التصدير الخاص بك',
      valueEn: 'Start Your Export Project',
      valueFr: 'Commencez votre projet d\'exportation',
      valueEs: 'Comience su proyecto de exportación',
      contentType: 'TEXT',
      isActive: true
    },
    // النص التوضيحي
    {
      pageKey: 'export',
      sectionKey: 'cta',
      contentKey: 'subtitle',
      valueAr: 'احصل على عرض سعر مخصص وابدأ رحلة التصدير معنا اليوم',
      valueEn: 'Get a custom quote and start your export journey with us today',
      valueFr: 'Obtenez un devis personnalisé et commencez votre voyage d\'exportation avec nous aujourd\'hui',
      valueEs: 'Obtenga una cotización personalizada y comience su viaje de exportación con nosotros hoy',
      contentType: 'TEXT',
      isActive: true
    },
    // نص الزر
    {
      pageKey: 'export',
      sectionKey: 'cta',
      contentKey: 'buttonText',
      valueAr: 'اطلب عرض سعر الآن',
      valueEn: 'Request Quote Now',
      valueFr: 'Demander un devis maintenant',
      valueEs: 'Solicitar cotización ahora',
      contentType: 'TEXT',
      isActive: true
    }
  ]

  let addedCount = 0

  for (const field of ctaFields) {
    try {
      await prisma.pageContent.upsert({
        where: {
          pageKey_sectionKey_contentKey: {
            pageKey: field.pageKey,
            sectionKey: field.sectionKey,
            contentKey: field.contentKey
          }
        },
        update: field,
        create: field
      })
      
      console.log(`✅ تمت إضافة: ${field.sectionKey}.${field.contentKey}`)
      addedCount++
    } catch (error) {
      console.error(`❌ خطأ في إضافة ${field.contentKey}:`, error.message)
    }
  }

  console.log(`\n✨ تم إضافة ${addedCount} حقل بنجاح!`)
}

main()
  .catch((e) => {
    console.error('❌ حدث خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
