const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedAboutAndExportContent() {
  try {
    console.log('🌱 بدء إضافة محتوى صفحات About وExport...')
    
    // About Page Content
    const aboutContent = [
      // Hero Section
      {
        pageKey: 'about',
        sectionKey: 'hero',
        contentKey: 'title',
        valueAr: 'عن شركة لوميرا ماربل',
        valueEn: 'About Lumerra Marble',
        valueEs: 'Sobre Lumerra Marble',
        valueFr: 'À propos de Lumerra Marble',
        sortOrder: 1
      },
      {
        pageKey: 'about',
        sectionKey: 'hero',
        contentKey: 'subtitle',
        valueAr: 'رحلة من التميز في تصدير الأحجار الطبيعية',
        valueEn: 'A Journey of Excellence in Natural Stone Export',
        valueEs: 'Un Viaje de Excelencia en Exportación de Piedra Natural',
        valueFr: 'Un Parcours d\'Excellence dans l\'Export de Pierre Naturelle',
        sortOrder: 2
      },
      {
        pageKey: 'about',
        sectionKey: 'hero',
        contentKey: 'backgroundImage',
        valueAr: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200',
        valueEn: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200',
        valueEs: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200',
        valueFr: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200',
        sortOrder: 3
      },
      // Story Section
      {
        pageKey: 'about',
        sectionKey: 'story',
        contentKey: 'title',
        valueAr: 'قصتنا',
        valueEn: 'Our Story',
        valueEs: 'Nuestra Historia',
        valueFr: 'Notre Histoire',
        sortOrder: 1
      },
      {
        pageKey: 'about',
        sectionKey: 'story',
        contentKey: 'content',
        valueAr: 'تأسست شركة لوميرا ماربل في مصر بهدف أن تكون الجسر الذي يربط بين جمال الأحجار الطبيعية المصرية والأسواق العالمية. منذ تأسيسها قبل أكثر من 15 عامًا، نجحت الشركة في بناء سمعة متميزة في مجال تصدير الرخام والجرانيت والكوارتز عالي الجودة.',
        valueEn: 'Lumerra Marble was founded in Egypt with the vision of becoming the bridge that connects the beauty of Egyptian natural stones with global markets. Since its establishment over 15 years ago, the company has successfully built an outstanding reputation in exporting high-quality marble, granite, and quartz.',
        valueEs: 'Lumerra Marble fue fundada en Egipto con la visión de convertirse en el puente que conecta la belleza de las piedras naturales egipcias con los mercados globales.',
        valueFr: 'Lumerra Marble a été fondée en Égypte avec la vision de devenir le pont qui relie la beauté des pierres naturelles égyptiennes aux marchés mondiaux.',
        sortOrder: 2
      },
      // Mission Section
      {
        pageKey: 'about',
        sectionKey: 'mission',
        contentKey: 'title',
        valueAr: 'رؤيتنا ورسالتنا',
        valueEn: 'Our Vision & Mission',
        valueEs: 'Nuestra Visión y Misión',
        valueFr: 'Notre Vision et Mission',
        sortOrder: 1
      },
      {
        pageKey: 'about',
        sectionKey: 'mission',
        contentKey: 'vision',
        valueAr: 'أن نكون الشركة الرائدة عالميًا في تصدير الأحجار الطبيعية المصرية عالية الجودة',
        valueEn: 'To be the world-leading company in exporting high-quality Egyptian natural stones',
        valueEs: 'Ser la empresa líder mundial en exportación de piedras naturales egipcias de alta calidad',
        valueFr: 'Être l\'entreprise leader mondial dans l\'exportation de pierres naturelles égyptiennes de haute qualité',
        sortOrder: 2
      },
      {
        pageKey: 'about',
        sectionKey: 'mission',
        contentKey: 'mission',
        valueAr: 'نسعى لتقديم أفضل المنتجات والخدمات لعملائنا في جميع أنحاء العالم مع الحفاظ على أعلى معايير الجودة والاستدامة',
        valueEn: 'We strive to provide the best products and services to our customers worldwide while maintaining the highest standards of quality and sustainability',
        valueEs: 'Nos esforzamos por proporcionar los mejores productos y servicios a nuestros clientes en todo el mundo',
        valueFr: 'Nous nous efforçons de fournir les meilleurs produits et services à nos clients dans le monde entier',
        sortOrder: 3
      },
      {
        pageKey: 'about',
        sectionKey: 'mission',
        contentKey: 'image',
        valueAr: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
        valueEn: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
        valueEs: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
        valueFr: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
        sortOrder: 4
      }
    ]
    
    // Export Page Content
    const exportContent = [
      // Hero Section
      {
        pageKey: 'export',
        sectionKey: 'hero',
        contentKey: 'title',
        valueAr: 'خدمات التصدير الاحترافية',
        valueEn: 'Professional Export Services',
        valueEs: 'Servicios de Exportación Profesional',
        valueFr: 'Services d\'Export Professionnels',
        sortOrder: 1
      },
      {
        pageKey: 'export',
        sectionKey: 'hero',
        contentKey: 'subtitle',
        valueAr: 'نحن نقدم خدمات تصدير شاملة للرخام والجرانيت والكوارتز من مصر إلى جميع أنحاء العالم مع ضمان الجودة والتسليم في الوقت المحدد',
        valueEn: 'We provide comprehensive export services for marble, granite, and quartz from Egypt to all over the world with quality assurance and on-time delivery',
        valueEs: 'Proporcionamos servicios de exportación integrales para mármol, granito y cuarzo desde Egipto a todo el mundo',
        valueFr: 'Nous fournissons des services d\'exportation complets pour le marbre, le granit et le quartz d\'Égypte vers le monde entier',
        sortOrder: 2
      },
      {
        pageKey: 'export',
        sectionKey: 'hero',
        contentKey: 'backgroundImage',
        valueAr: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
        valueEn: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
        valueEs: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
        valueFr: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
        sortOrder: 3
      },
      {
        pageKey: 'export',
        sectionKey: 'hero',
        contentKey: 'cta',
        valueAr: 'طلب عرض سعر للتصدير',
        valueEn: 'Request Export Quote',
        valueEs: 'Solicitar Cotización de Exportación',
        valueFr: 'Demander un Devis d\'Export',
        sortOrder: 4
      },
      // Services Section
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'title',
        valueAr: 'خدماتنا',
        valueEn: 'Our Services',
        valueEs: 'Nuestros Servicios',
        valueFr: 'Nos Services',
        sortOrder: 1
      },
      {
        pageKey: 'export',
        sectionKey: 'services',
        contentKey: 'subtitle',
        valueAr: 'نقدم خدمات تصدير متكاملة من الاستشارة إلى التسليم',
        valueEn: 'We provide integrated export services from consultation to delivery',
        valueEs: 'Proporcionamos servicios de exportación integrados desde consulta hasta entrega',
        valueFr: 'Nous fournissons des services d\'exportation intégrés de la consultation à la livraison',
        sortOrder: 2
      },
      // Countries Section
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'title',
        valueAr: 'البلدان التي نصدر إليها',
        valueEn: 'Countries We Export To',
        valueEs: 'Países a los que Exportamos',
        valueFr: 'Pays vers lesquels nous Exportons',
        sortOrder: 1
      },
      {
        pageKey: 'export',
        sectionKey: 'countries',
        contentKey: 'subtitle',
        valueAr: 'نصل إلى أكثر من 50 دولة في 6 قارات',
        valueEn: 'We reach over 50 countries across 6 continents',
        valueEs: 'Llegamos a más de 50 países en 6 continentes',
        valueFr: 'Nous atteignons plus de 50 pays sur 6 continents',
        sortOrder: 2
      }
    ]
    
    // Delete existing content
    await prisma.pageContent.deleteMany({
      where: {
        pageKey: {
          in: ['about', 'export']
        }
      }
    })
    console.log('✅ تم حذف المحتوى القديم')
    
    // Insert about content
    for (const item of aboutContent) {
      await prisma.pageContent.create({ data: item })
    }
    console.log(`✅ تم إضافة ${aboutContent.length} سجل لصفحة About`)
    
    // Insert export content
    for (const item of exportContent) {
      await prisma.pageContent.create({ data: item })
    }
    console.log(`✅ تم إضافة ${exportContent.length} سجل لصفحة Export`)
    
    console.log('\n🎉 تم إضافة المحتوى بنجاح!')
    
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAboutAndExportContent()
