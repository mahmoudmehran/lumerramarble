const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔄 إضافة الحقول الناقصة لصفحة التصدير...')

  const fields = [
    // Services - 6 خدمات × 3 حقول = 18 حقل
    { pageKey: 'export', sectionKey: 'services', contentKey: 'consultation_title', valueAr: 'استشارات التصدير', valueEn: 'Export Consultation', valueEs: 'Consultoría de Exportación', valueFr: 'Consultation d\'Exportation' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'consultation_description', valueAr: 'نقدم استشارات متخصصة لفهم احتياجاتك وتحديد أفضل استراتيجيات التصدير', valueEn: 'We provide specialized consultation to understand your needs and determine the best export strategies', valueEs: 'Ofrecemos consultoría especializada para comprender sus necesidades y determinar las mejores estrategias de exportación', valueFr: 'Nous fournissons des consultations spécialisées pour comprendre vos besoins et déterminer les meilleures stratégies d\'exportation' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'consultation_image', valueAr: '/images/services/consultation.jpg', valueEn: '/images/services/consultation.jpg', valueEs: '/images/services/consultation.jpg', valueFr: '/images/services/consultation.jpg' },
    
    { pageKey: 'export', sectionKey: 'services', contentKey: 'packaging_title', valueAr: 'التغليف والتعبئة', valueEn: 'Packaging & Packing', valueEs: 'Embalaje y Empaque', valueFr: 'Emballage' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'packaging_description', valueAr: 'خدمات تغليف احترافية تضمن وصول منتجاتك بأمان تام', valueEn: 'Professional packaging services ensuring your products arrive safely', valueEs: 'Servicios de embalaje profesionales que garantizan que sus productos lleguen de forma segura', valueFr: 'Services d\'emballage professionnels garantissant l\'arrivée sûre de vos produits' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'packaging_image', valueAr: '/images/services/packaging.jpg', valueEn: '/images/services/packaging.jpg', valueEs: '/images/services/packaging.jpg', valueFr: '/images/services/packaging.jpg' },
    
    { pageKey: 'export', sectionKey: 'services', contentKey: 'shipping_title', valueAr: 'الشحن الدولي', valueEn: 'International Shipping', valueEs: 'Envío Internacional', valueFr: 'Expédition Internationale' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'shipping_description', valueAr: 'شبكة شحن عالمية موثوقة تصل إلى جميع أنحاء العالم', valueEn: 'Reliable global shipping network reaching all parts of the world', valueEs: 'Red de envío global confiable que llega a todas partes del mundo', valueFr: 'Réseau d\'expédition mondial fiable atteignant toutes les parties du monde' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'shipping_image', valueAr: '/images/services/shipping.jpg', valueEn: '/images/services/shipping.jpg', valueEs: '/images/services/shipping.jpg', valueFr: '/images/services/shipping.jpg' },
    
    { pageKey: 'export', sectionKey: 'services', contentKey: 'quality_title', valueAr: 'مراقبة الجودة', valueEn: 'Quality Control', valueEs: 'Control de Calidad', valueFr: 'Contrôle Qualité' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'quality_description', valueAr: 'فحص دقيق لكل منتج لضمان أعلى معايير الجودة', valueEn: 'Precise inspection of every product to ensure the highest quality standards', valueEs: 'Inspección precisa de cada producto para garantizar los más altos estándares de calidad', valueFr: 'Inspection précise de chaque produit pour garantir les normes de qualité les plus élevées' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'quality_image', valueAr: '/images/services/quality.jpg', valueEn: '/images/services/quality.jpg', valueEs: '/images/services/quality.jpg', valueFr: '/images/services/quality.jpg' },
    
    { pageKey: 'export', sectionKey: 'services', contentKey: 'delivery_title', valueAr: 'التسليم في الموعد', valueEn: 'On-Time Delivery', valueEs: 'Entrega a Tiempo', valueFr: 'Livraison à Temps' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'delivery_description', valueAr: 'التزام كامل بمواعيد التسليم المحددة مع متابعة مستمرة', valueEn: 'Full commitment to specified delivery dates with continuous tracking', valueEs: 'Compromiso total con las fechas de entrega especificadas con seguimiento continuo', valueFr: 'Engagement total envers les dates de livraison spécifiées avec suivi continu' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'delivery_image', valueAr: '/images/services/delivery.jpg', valueEn: '/images/services/delivery.jpg', valueEs: '/images/services/delivery.jpg', valueFr: '/images/services/delivery.jpg' },
    
    { pageKey: 'export', sectionKey: 'services', contentKey: 'aftersales_title', valueAr: 'خدمات ما بعد البيع', valueEn: 'After-Sales Service', valueEs: 'Servicio Postventa', valueFr: 'Service Après-Vente' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'aftersales_description', valueAr: 'دعم مستمر وخدمة عملاء متميزة حتى بعد إتمام الصفقة', valueEn: 'Continuous support and excellent customer service even after completing the deal', valueEs: 'Soporte continuo y excelente servicio al cliente incluso después de completar el trato', valueFr: 'Support continu et excellent service client même après la conclusion de l\'affaire' },
    { pageKey: 'export', sectionKey: 'services', contentKey: 'aftersales_image', valueAr: '/images/services/aftersales.jpg', valueEn: '/images/services/aftersales.jpg', valueEs: '/images/services/aftersales.jpg', valueFr: '/images/services/aftersales.jpg' },

    // Countries - 6 مناطق × 3 حقول = 18 حقل
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'europe_name', valueAr: 'أوروبا', valueEn: 'Europe', valueEs: 'Europa', valueFr: 'Europe' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'europe_count', valueAr: '15+ دولة', valueEn: '15+ Countries', valueEs: '15+ Países', valueFr: '15+ Pays' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'europe_image', valueAr: '/images/regions/europe.jpg', valueEn: '/images/regions/europe.jpg', valueEs: '/images/regions/europe.jpg', valueFr: '/images/regions/europe.jpg' },
    
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'asia_name', valueAr: 'آسيا', valueEn: 'Asia', valueEs: 'Asia', valueFr: 'Asie' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'asia_count', valueAr: '20+ دولة', valueEn: '20+ Countries', valueEs: '20+ Países', valueFr: '20+ Pays' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'asia_image', valueAr: '/images/regions/asia.jpg', valueEn: '/images/regions/asia.jpg', valueEs: '/images/regions/asia.jpg', valueFr: '/images/regions/asia.jpg' },
    
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'africa_name', valueAr: 'أفريقيا', valueEn: 'Africa', valueEs: 'África', valueFr: 'Afrique' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'africa_count', valueAr: '10+ دولة', valueEn: '10+ Countries', valueEs: '10+ Países', valueFr: '10+ Pays' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'africa_image', valueAr: '/images/regions/africa.jpg', valueEn: '/images/regions/africa.jpg', valueEs: '/images/regions/africa.jpg', valueFr: '/images/regions/africa.jpg' },
    
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'americas_name', valueAr: 'الأمريكتين', valueEn: 'Americas', valueEs: 'Américas', valueFr: 'Amériques' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'americas_count', valueAr: '8+ دولة', valueEn: '8+ Countries', valueEs: '8+ Países', valueFr: '8+ Pays' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'americas_image', valueAr: '/images/regions/americas.jpg', valueEn: '/images/regions/americas.jpg', valueEs: '/images/regions/americas.jpg', valueFr: '/images/regions/americas.jpg' },
    
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'oceania_name', valueAr: 'أوقيانوسيا', valueEn: 'Oceania', valueEs: 'Oceanía', valueFr: 'Océanie' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'oceania_count', valueAr: '5+ دولة', valueEn: '5+ Countries', valueEs: '5+ Países', valueFr: '5+ Pays' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'oceania_image', valueAr: '/images/regions/oceania.jpg', valueEn: '/images/regions/oceania.jpg', valueEs: '/images/regions/oceania.jpg', valueFr: '/images/regions/oceania.jpg' },
    
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'middleeast_name', valueAr: 'الشرق الأوسط', valueEn: 'Middle East', valueEs: 'Medio Oriente', valueFr: 'Moyen-Orient' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'middleeast_count', valueAr: '12+ دولة', valueEn: '12+ Countries', valueEs: '12+ Países', valueFr: '12+ Pays' },
    { pageKey: 'export', sectionKey: 'countries', contentKey: 'middleeast_image', valueAr: '/images/regions/middleeast.jpg', valueEn: '/images/regions/middleeast.jpg', valueEs: '/images/regions/middleeast.jpg', valueFr: '/images/regions/middleeast.jpg' },

    // Stats - 4 إحصائيات × 2 حقول = 8 حقول
    { pageKey: 'export', sectionKey: 'stats', contentKey: 'countries_number', valueAr: '50+', valueEn: '50+', valueEs: '50+', valueFr: '50+' },
    { pageKey: 'export', sectionKey: 'stats', contentKey: 'countries_text', valueAr: 'دولة نصدر إليها', valueEn: 'Countries We Export To', valueEs: 'Países a los que Exportamos', valueFr: 'Pays vers Lesquels Nous Exportons' },
    
    { pageKey: 'export', sectionKey: 'stats', contentKey: 'shipments_number', valueAr: '1000+', valueEn: '1000+', valueEs: '1000+', valueFr: '1000+' },
    { pageKey: 'export', sectionKey: 'stats', contentKey: 'shipments_text', valueAr: 'شحنة ناجحة', valueEn: 'Successful Shipments', valueEs: 'Envíos Exitosos', valueFr: 'Expéditions Réussies' },
    
    { pageKey: 'export', sectionKey: 'stats', contentKey: 'experience_number', valueAr: '15+', valueEn: '15+', valueEs: '15+', valueFr: '15+' },
    { pageKey: 'export', sectionKey: 'stats', contentKey: 'experience_text', valueAr: 'سنة خبرة', valueEn: 'Years of Experience', valueEs: 'Años de Experiencia', valueFr: 'Années d\'Expérience' },
    
    { pageKey: 'export', sectionKey: 'stats', contentKey: 'satisfaction_number', valueAr: '98%', valueEn: '98%', valueEs: '98%', valueFr: '98%' },
    { pageKey: 'export', sectionKey: 'stats', contentKey: 'satisfaction_text', valueAr: 'رضا العملاء', valueEn: 'Customer Satisfaction', valueEs: 'Satisfacción del Cliente', valueFr: 'Satisfaction Client' },
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
