const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addValuesVisionMission() {
  try {
    console.log('🚀 إضافة حقول Vision و Mission إلى قسم Values...\n')

    const newFields = [
      // Background Image
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'backgroundImage',
        valueAr: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1600',
        valueEn: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1600',
        valueEs: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1600',
        valueFr: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1600'
      },
      // Vision Title
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'vision_title',
        valueAr: 'رؤيتنا',
        valueEn: 'Our Vision',
        valueEs: 'Nuestra Visión',
        valueFr: 'Notre Vision'
      },
      // Vision Description
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'vision_description',
        valueAr: 'أن نكون الشركة الرائدة عالميًا في تصدير الأحجار الطبيعية المصرية عالية الجودة، معروفين بتميزنا وموثوقيتنا في تقديم منتجات استثنائية تلبي أعلى المعايير الدولية',
        valueEn: 'To be the leading company globally in exporting high-quality Egyptian natural stones, known for our excellence and reliability in delivering exceptional products that meet the highest international standards',
        valueEs: 'Ser la empresa líder a nivel mundial en la exportación de piedras naturales egipcias de alta calidad',
        valueFr: 'Être l\'entreprise leader mondiale dans l\'exportation de pierres naturelles égyptiennes de haute qualité'
      },
      // Mission Title
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'mission_title',
        valueAr: 'رسالتنا',
        valueEn: 'Our Mission',
        valueEs: 'Nuestra Misión',
        valueFr: 'Notre Mission'
      },
      // Mission Description
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'mission_description',
        valueAr: 'نسعى لتقديم أفضل المنتجات والخدمات لعملائنا حول العالم مع الحفاظ على أعلى معايير الجودة والاستدامة، ونلتزم بتحقيق رضا العملاء من خلال الابتكار والتميز في كل ما نقدمه',
        valueEn: 'We strive to provide the best products and services to our customers around the world while maintaining the highest standards of quality and sustainability, and we are committed to achieving customer satisfaction through innovation and excellence in everything we offer',
        valueEs: 'Nos esforzamos por proporcionar los mejores productos y servicios a nuestros clientes en todo el mundo',
        valueFr: 'Nous nous efforçons de fournir les meilleurs produits et services à nos clients dans le monde entier'
      }
    ]

    let addedCount = 0
    let existingCount = 0

    for (const field of newFields) {
      const existing = await prisma.pageContent.findUnique({
        where: {
          pageKey_sectionKey_contentKey: {
            pageKey: field.pageKey,
            sectionKey: field.sectionKey,
            contentKey: field.contentKey
          }
        }
      })

      if (existing) {
        console.log(`⚠️  ${field.contentKey} موجود بالفعل`)
        existingCount++
      } else {
        await prisma.pageContent.create({ data: field })
        console.log(`✅ تمت إضافة ${field.contentKey}`)
        addedCount++
      }
    }

    console.log(`\n📊 الإحصائيات:`)
    console.log(`   - تمت الإضافة: ${addedCount}`)
    console.log(`   - موجود مسبقاً: ${existingCount}`)
    console.log(`   - الإجمالي: ${newFields.length}`)
    
    console.log('\n✅ اكتمل!')

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addValuesVisionMission()
