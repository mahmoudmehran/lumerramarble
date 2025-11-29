const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedPageSEO() {
  console.log('🌱 Seeding Page SEO data...')

  const pages = [
    {
      pageKey: 'faq',
      titleAr: 'الأسئلة الشائعة - لوميرا للرخام',
      titleEn: 'FAQ - Lumerra Marble',
      titleEs: 'Preguntas Frecuentes - Lumerra Marble',
      titleFr: 'FAQ - Lumerra Marble',
      descriptionAr: 'إجابات شاملة على الأسئلة الأكثر شيوعاً حول منتجاتنا من الرخام والجرانيت المصري الطبيعي، خدمات التصدير، والشحن الدولي',
      descriptionEn: 'Comprehensive answers to the most frequently asked questions about our Egyptian natural marble and granite products, export services, and international shipping',
      descriptionEs: 'Respuestas completas a las preguntas más frecuentes sobre nuestros productos de mármol y granito natural egipcio, servicios de exportación y envío internacional',
      descriptionFr: 'Réponses complètes aux questions les plus fréquemment posées sur nos produits de marbre et granit naturel égyptien, services d\'exportation et expédition internationale',
      keywordsAr: 'أسئلة شائعة، رخام مصري، جرانيت، تصدير، شحن دولي',
      keywordsEn: 'FAQ, Egyptian marble, granite, export, international shipping',
      keywordsEs: 'preguntas frecuentes, mármol egipcio, granito, exportación, envío internacional',
      keywordsFr: 'FAQ, marbre égyptien, granit, exportation, expédition internationale',
      isActive: true
    },
    {
      pageKey: 'certificates',
      titleAr: 'شهادات الجودة والاعتماد - لوميرا للرخام',
      titleEn: 'Quality Certificates - Lumerra Marble',
      titleEs: 'Certificados de Calidad - Lumerra Marble',
      titleFr: 'Certificats de Qualité - Lumerra Marble',
      descriptionAr: 'شهاداتنا الدولية من ISO 9001، CE، وشهادات المنشأ المصرية تؤكد التزامنا بأعلى معايير الجودة في تصدير الرخام والجرانيت',
      descriptionEn: 'Our international certifications including ISO 9001, CE, and Egyptian origin certificates confirm our commitment to the highest quality standards in marble and granite export',
      descriptionEs: 'Nuestras certificaciones internacionales incluyendo ISO 9001, CE y certificados de origen egipcio confirman nuestro compromiso con los más altos estándares de calidad en exportación de mármol y granito',
      descriptionFr: 'Nos certifications internationales dont ISO 9001, CE et certificats d\'origine égyptienne confirment notre engagement envers les normes de qualité les plus élevées dans l\'exportation de marbre et granit',
      keywordsAr: 'شهادات جودة، ISO 9001، CE، رخام مصري، اعتماد دولي',
      keywordsEn: 'quality certificates, ISO 9001, CE, Egyptian marble, international accreditation',
      keywordsEs: 'certificados de calidad, ISO 9001, CE, mármol egipcio, acreditación internacional',
      keywordsFr: 'certificats de qualité, ISO 9001, CE, marbre égyptien, accréditation internationale',
      isActive: true
    },
    {
      pageKey: 'projects',
      titleAr: 'معرض مشاريعنا العالمية - لوميرا للرخام',
      titleEn: 'Our Global Projects Gallery - Lumerra Marble',
      titleEs: 'Galería de Nuestros Proyectos Globales - Lumerra Marble',
      titleFr: 'Galerie de Nos Projets Mondiaux - Lumerra Marble',
      descriptionAr: 'استكشف مشاريعنا المنفذة من الرخام والجرانيت في دبي، السعودية، قطر، والكويت - فنادق فاخرة، مساجد، فلل سكنية ومراكز تجارية',
      descriptionEn: 'Explore our completed marble and granite projects in Dubai, Saudi Arabia, Qatar, and Kuwait - luxury hotels, mosques, residential villas and commercial centers',
      descriptionEs: 'Explore nuestros proyectos completados de mármol y granito en Dubái, Arabia Saudita, Qatar y Kuwait - hoteles de lujo, mezquitas, villas residenciales y centros comerciales',
      descriptionFr: 'Explorez nos projets réalisés en marbre et granit à Dubaï, Arabie Saoudite, Qatar et Koweït - hôtels de luxe, mosquées, villas résidentielles et centres commerciaux',
      keywordsAr: 'مشاريع رخام، مشاريع جرانيت، فنادق، مساجد، دبي، السعودية',
      keywordsEn: 'marble projects, granite projects, hotels, mosques, Dubai, Saudi Arabia',
      keywordsEs: 'proyectos de mármol, proyectos de granito, hoteles, mezquitas, Dubái, Arabia Saudita',
      keywordsFr: 'projets de marbre, projets de granit, hôtels, mosquées, Dubaï, Arabie Saoudite',
      isActive: true
    },
    {
      pageKey: 'export-guide',
      titleAr: 'دليل التصدير الشامل - لوميرا للرخام',
      titleEn: 'Comprehensive Export Guide - Lumerra Marble',
      titleEs: 'Guía de Exportación Completa - Lumerra Marble',
      titleFr: 'Guide d\'Exportation Complet - Lumerra Marble',
      descriptionAr: 'دليلك الشامل لعمليات تصدير الرخام والجرانيت من مصر - من المواصفات والأسعار إلى الشحن والتخليص الجمركي والدعم بعد البيع',
      descriptionEn: 'Your comprehensive guide to exporting marble and granite from Egypt - from specifications and pricing to shipping, customs clearance and after-sales support',
      descriptionEs: 'Su guía completa para exportar mármol y granito desde Egipto - desde especificaciones y precios hasta envío, despacho de aduanas y soporte posventa',
      descriptionFr: 'Votre guide complet pour l\'exportation de marbre et granit depuis l\'Égypte - des spécifications et tarifs à l\'expédition, dédouanement et support après-vente',
      keywordsAr: 'دليل التصدير، تصدير رخام، تصدير جرانيت، شحن دولي، تخليص جمركي',
      keywordsEn: 'export guide, marble export, granite export, international shipping, customs clearance',
      keywordsEs: 'guía de exportación, exportación de mármol, exportación de granito, envío internacional, despacho de aduanas',
      keywordsFr: 'guide d\'exportation, exportation de marbre, exportation de granit, expédition internationale, dédouanement',
      isActive: true
    }
  ]

  for (const page of pages) {
    await prisma.pageSEO.upsert({
      where: { pageKey: page.pageKey },
      update: page,
      create: page
    })
  }

  console.log('✅ Page SEO data seeded successfully')
  console.log(`   - ${pages.length} pages configured`)
}

seedPageSEO()
  .catch((e) => {
    console.error('❌ Error seeding page SEO:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
