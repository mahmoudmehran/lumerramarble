const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedExportPage() {
  try {
    console.log('🚀 إضافة محتوى صفحة خدمات التصدير...\n')

    const fields = [
      // Services Section - 6 خدمات
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'consultation_title',
        valueAr: 'استشارة مجانية',
        valueEn: 'Free Consultation',
        valueEs: 'Consulta Gratuita',
        valueFr: 'Consultation Gratuite'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'consultation_description',
        valueAr: 'نقدم استشارة مجانية لاختيار أفضل المنتجات المناسبة لمشروعك',
        valueEn: 'We provide free consultation to choose the best products suitable for your project',
        valueEs: 'Ofrecemos consulta gratuita para elegir los mejores productos para su proyecto',
        valueFr: 'Nous offrons une consultation gratuite pour choisir les meilleurs produits pour votre projet'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'consultation_image',
        valueAr: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        valueEn: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        valueEs: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        valueFr: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'packaging_title',
        valueAr: 'تغليف احترافي',
        valueEn: 'Professional Packaging',
        valueEs: 'Embalaje Profesional',
        valueFr: 'Emballage Professionnel'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'packaging_description',
        valueAr: 'تغليف آمن ومحترف يضمن وصول المنتجات بحالة ممتازة',
        valueEn: 'Safe and professional packaging ensures products arrive in excellent condition',
        valueEs: 'Embalaje seguro y profesional garantiza que los productos lleguen en excelentes condiciones',
        valueFr: 'Un emballage sûr et professionnel garantit que les produits arrivent en excellent état'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'packaging_image',
        valueAr: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        valueEn: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        valueEs: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        valueFr: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'shipping_title',
        valueAr: 'شحن عالمي',
        valueEn: 'Global Shipping',
        valueEs: 'Envío Global',
        valueFr: 'Expédition Mondiale'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'shipping_description',
        valueAr: 'خدمات شحن موثوقة إلى جميع أنحاء العالم',
        valueEn: 'Reliable shipping services to all parts of the world',
        valueEs: 'Servicios de envío confiables a todas partes del mundo',
        valueFr: 'Services d\'expédition fiables dans le monde entier'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'shipping_image',
        valueAr: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
        valueEn: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
        valueEs: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
        valueFr: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'quality_title',
        valueAr: 'ضمان الجودة',
        valueEn: 'Quality Assurance',
        valueEs: 'Garantía de Calidad',
        valueFr: 'Assurance Qualité'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'quality_description',
        valueAr: 'جميع منتجاتنا معتمدة بشهادات الجودة الدولية',
        valueEn: 'All our products are certified with international quality certificates',
        valueEs: 'Todos nuestros productos están certificados con certificados de calidad internacional',
        valueFr: 'Tous nos produits sont certifiés avec des certificats de qualité internationaux'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'quality_image',
        valueAr: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800',
        valueEn: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800',
        valueEs: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800',
        valueFr: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'delivery_title',
        valueAr: 'التسليم في الموعد',
        valueEn: 'On-Time Delivery',
        valueEs: 'Entrega a Tiempo',
        valueFr: 'Livraison à Temps'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'delivery_description',
        valueAr: 'نلتزم بمواعيد التسليم المحددة دون تأخير',
        valueEn: 'We commit to specified delivery dates without delay',
        valueEs: 'Nos comprometemos a cumplir con las fechas de entrega especificadas sin demora',
        valueFr: 'Nous nous engageons à respecter les dates de livraison spécifiées sans retard'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'delivery_image',
        valueAr: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800',
        valueEn: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800',
        valueEs: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800',
        valueFr: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'aftersales_title',
        valueAr: 'خدمة ما بعد البيع',
        valueEn: 'After-Sales Service',
        valueEs: 'Servicio Postventa',
        valueFr: 'Service Après-Vente'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'aftersales_description',
        valueAr: 'دعم مستمر وخدمة عملاء متميزة حتى بعد التسليم',
        valueEn: 'Continuous support and excellent customer service even after delivery',
        valueEs: 'Soporte continuo y excelente servicio al cliente incluso después de la entrega',
        valueFr: 'Support continu et excellent service client même après la livraison'
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'aftersales_image',
        valueAr: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
        valueEn: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
        valueEs: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
        valueFr: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800'
      },

      // Process Section
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'title',
        valueAr: 'عملية التصدير',
        valueEn: 'Export Process',
        valueEs: 'Proceso de Exportación',
        valueFr: 'Processus d\'Exportation'
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'subtitle',
        valueAr: 'خطوات بسيطة للحصول على منتجاتنا',
        valueEn: 'Simple steps to get our products',
        valueEs: 'Pasos simples para obtener nuestros productos',
        valueFr: 'Étapes simples pour obtenir nos produits'
      }
    ]

    // سأكمل في رسالة تالية بسبب طول البيانات
    console.log('⏳ جاري إضافة الحقول...')
    
    let addedCount = 0
    let existingCount = 0

    for (const field of fields) {
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
        existingCount++
      } else {
        await prisma.pageContent.create({ data: field })
        addedCount++
      }
    }

    console.log(`\n✅ تمت إضافة ${addedCount} حقل`)
    console.log(`⚠️  ${existingCount} حقل موجود مسبقاً`)
    console.log(`\n📝 ملاحظة: تم إضافة جزء من الحقول. سأكمل في سكريبت آخر.`)

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedExportPage()
