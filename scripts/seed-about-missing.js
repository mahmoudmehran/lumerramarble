const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedAboutMissingFields() {
  try {
    console.log('🔄 إضافة الحقول الناقصة لصفحة "عن الشركة"...\n')

    const missingData = [
      // Values Section
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'title',
        valueAr: 'قيمنا',
        valueEn: 'Our Values',
        valueEs: 'Nuestros Valores',
        valueFr: 'Nos Valeurs'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'quality_title',
        valueAr: 'الجودة العالية',
        valueEn: 'High Quality',
        valueEs: 'Alta Calidad',
        valueFr: 'Haute Qualité'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'quality_description',
        valueAr: 'نلتزم بأعلى معايير الجودة العالمية في جميع منتجاتنا',
        valueEn: 'We commit to the highest international quality standards',
        valueEs: 'Nos comprometemos con los más altos estándares de calidad',
        valueFr: 'Nous nous engageons aux plus hauts standards de qualité'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'trust_title',
        valueAr: 'الثقة والمصداقية',
        valueEn: 'Trust & Credibility',
        valueEs: 'Confianza y Credibilidad',
        valueFr: 'Confiance et Crédibilité'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'trust_description',
        valueAr: 'نبني علاقات طويلة الأمد مع عملائنا على أساس الثقة',
        valueEn: 'Building long-term relationships based on trust',
        valueEs: 'Construyendo relaciones a largo plazo basadas en la confianza',
        valueFr: 'Construire des relations durables basées sur la confiance'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'global_title',
        valueAr: 'الانتشار العالمي',
        valueEn: 'Global Reach',
        valueEs: 'Alcance Global',
        valueFr: 'Portée Mondiale'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'global_description',
        valueAr: 'نخدم عملاء في أكثر من 50 دولة حول العالم',
        valueEn: 'Serving customers in over 50 countries worldwide',
        valueEs: 'Sirviendo a clientes en más de 50 países',
        valueFr: 'Servir des clients dans plus de 50 pays'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'service_title',
        valueAr: 'خدمة العملاء',
        valueEn: 'Customer Service',
        valueEs: 'Servicio al Cliente',
        valueFr: 'Service Client'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'service_description',
        valueAr: 'فريق محترف متاح دائماً لخدمتكم',
        valueEn: 'Professional team always available to serve you',
        valueEs: 'Equipo profesional siempre disponible',
        valueFr: 'Équipe professionnelle toujours disponible'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'precision_title',
        valueAr: 'الدقة والالتزام',
        valueEn: 'Precision & Commitment',
        valueEs: 'Precisión y Compromiso',
        valueFr: 'Précision et Engagement'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'precision_description',
        valueAr: 'التزام تام بالمواعيد والمواصفات المتفق عليها',
        valueEn: 'Full commitment to deadlines and agreed specifications',
        valueEs: 'Compromiso total con plazos y especificaciones',
        valueFr: 'Engagement total envers les délais et spécifications'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'passion_title',
        valueAr: 'الشغف بالتميز',
        valueEn: 'Passion for Excellence',
        valueEs: 'Pasión por la Excelencia',
        valueFr: 'Passion pour l\'Excellence'
      },
      {
        pageKey: 'about',
        sectionKey: 'values',
        contentKey: 'passion_description',
        valueAr: 'شغف حقيقي بتقديم أفضل الأحجار الطبيعية',
        valueEn: 'Genuine passion for delivering the finest natural stones',
        valueEs: 'Pasión genuina por entregar las mejores piedras naturales',
        valueFr: 'Passion sincère pour livrer les meilleures pierres naturelles'
      },
      
      // Location Section
      {
        pageKey: 'about',
        sectionKey: 'location',
        contentKey: 'title',
        valueAr: 'موقعنا',
        valueEn: 'Our Location',
        valueEs: 'Nuestra Ubicación',
        valueFr: 'Notre Emplacement'
      },
      {
        pageKey: 'about',
        sectionKey: 'location',
        contentKey: 'address',
        valueAr: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
        valueEn: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
        valueEs: 'Egipto - El Cairo - Zona Industrial Shaq Al-Thuban',
        valueFr: 'Égypte - Le Caire - Zone Industrielle Shaq Al-Thuban'
      },
      {
        pageKey: 'about',
        sectionKey: 'location',
        contentKey: 'description',
        valueAr: 'يقع مقرنا الرئيسي ومصانعنا في المنطقة الصناعية شق الثعبان بالقاهرة، في موقع استراتيجي يسهل عمليات التصدير والشحن',
        valueEn: 'Our headquarters and factories are located in Shaq Al-Thuban Industrial Zone in Cairo, in a strategic location that facilitates export and shipping operations',
        valueEs: 'Nuestra sede y fábricas están ubicadas en la Zona Industrial Shaq Al-Thuban en El Cairo, en una ubicación estratégica que facilita las operaciones de exportación',
        valueFr: 'Notre siège social et nos usines sont situés dans la zone industrielle Shaq Al-Thuban au Caire, dans un emplacement stratégique qui facilite les opérations d\'exportation'
      },
      {
        pageKey: 'about',
        sectionKey: 'location',
        contentKey: 'image',
        valueAr: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800',
        valueEn: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800',
        valueEs: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800',
        valueFr: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800'
      },
      
      // Stats Section
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'title',
        valueAr: 'إنجازاتنا بالأرقام',
        valueEn: 'Our Achievements in Numbers',
        valueEs: 'Nuestros Logros en Números',
        valueFr: 'Nos Réalisations en Chiffres'
      },
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'experience_number',
        valueAr: '15+',
        valueEn: '15+',
        valueEs: '15+',
        valueFr: '15+'
      },
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'experience_text',
        valueAr: 'سنوات من الخبرة',
        valueEn: 'Years of Experience',
        valueEs: 'Años de Experiencia',
        valueFr: 'Années d\'Expérience'
      },
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'countries_number',
        valueAr: '50+',
        valueEn: '50+',
        valueEs: '50+',
        valueFr: '50+'
      },
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'countries_text',
        valueAr: 'دولة نصدر إليها',
        valueEn: 'Countries Exported To',
        valueEs: 'Países Exportados',
        valueFr: 'Pays Exportés'
      },
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'projects_number',
        valueAr: '1000+',
        valueEn: '1000+',
        valueEs: '1000+',
        valueFr: '1000+'
      },
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'projects_text',
        valueAr: 'مشروع منجز',
        valueEn: 'Completed Projects',
        valueEs: 'Proyectos Completados',
        valueFr: 'Projets Complétés'
      },
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'satisfaction_number',
        valueAr: '100%',
        valueEn: '100%',
        valueEs: '100%',
        valueFr: '100%'
      },
      {
        pageKey: 'about',
        sectionKey: 'stats',
        contentKey: 'satisfaction_text',
        valueAr: 'رضا العملاء',
        valueEn: 'Customer Satisfaction',
        valueEs: 'Satisfacción del Cliente',
        valueFr: 'Satisfaction Client'
      }
    ]

    let added = 0
    for (const item of missingData) {
      await prisma.pageContent.upsert({
        where: {
          pageKey_sectionKey_contentKey: {
            pageKey: item.pageKey,
            sectionKey: item.sectionKey,
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
          pageKey: item.pageKey,
          sectionKey: item.sectionKey,
          contentKey: item.contentKey,
          valueAr: item.valueAr,
          valueEn: item.valueEn,
          valueEs: item.valueEs,
          valueFr: item.valueFr,
          contentType: 'TEXT',
          isActive: true
        }
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

seedAboutMissingFields()
