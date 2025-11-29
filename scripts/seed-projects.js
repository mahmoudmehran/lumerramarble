const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedProjects() {
  console.log('🌱 Seeding Projects...')

  const projects = [
    {
      nameAr: 'فندق فاخر في دبي',
      nameEn: 'Luxury Hotel in Dubai',
      nameEs: 'Hotel de Lujo en Dubai',
      nameFr: 'Hôtel de Luxe à Dubaï',
      descriptionAr: 'توريد وتركيب رخام جلالة بيج وجرانيت أسود لردهة الفندق والغرف والحمامات. المشروع شمل أكثر من 5000 متر مربع من الرخام والجرانيت الفاخر.',
      descriptionEn: 'Supply and installation of Galala Beige marble and Black Granite for hotel lobby, rooms, and bathrooms. The project included over 5000 square meters of premium marble and granite.',
      descriptionEs: 'Suministro e instalación de mármol Galala Beige y Granito Negro para el vestíbulo, habitaciones y baños del hotel. El proyecto incluyó más de 5000 metros cuadrados de mármol y granito premium.',
      descriptionFr: 'Fourniture et installation de marbre Galala Beige et Granit Noir pour le hall de l\'hôtel, les chambres et les salles de bains. Le projet comprenait plus de 5000 mètres carrés de marbre et granit premium.',
      clientName: 'Dubai Hospitality Group',
      locationAr: 'دبي، الإمارات العربية المتحدة',
      locationEn: 'Dubai, UAE',
      locationEs: 'Dubai, EAU',
      locationFr: 'Dubaï, EAU',
      area: '5000 m²',
      duration: '6 months',
      completionDate: new Date('2023-06-15'),
      category: 'hospitality',
      slug: 'luxury-hotel-dubai',
      featured: true,
      sortOrder: 1,
      isActive: true
    },
    {
      nameAr: 'مسجد في السعودية',
      nameEn: 'Mosque in Saudi Arabia',
      nameEs: 'Mezquita en Arabia Saudita',
      nameFr: 'Mosquée en Arabie Saoudite',
      descriptionAr: 'توريد رخام أبيض فاخر لأرضيات وجدران المسجد مع تشطيبات خاصة. تم استخدام رخام سلفيا الأبيض النقي في جميع أجزاء المشروع.',
      descriptionEn: 'Supply of premium white marble for mosque floors and walls with special finishes. Pure white Silvia marble was used throughout the project.',
      descriptionEs: 'Suministro de mármol blanco premium para pisos y paredes de mezquita con acabados especiales. Se utilizó mármol Silvia blanco puro en todo el proyecto.',
      descriptionFr: 'Fourniture de marbre blanc premium pour les sols et murs de la mosquée avec des finitions spéciales. Du marbre Silvia blanc pur a été utilisé tout au long du projet.',
      clientName: 'Saudi Religious Affairs',
      locationAr: 'الرياض، المملكة العربية السعودية',
      locationEn: 'Riyadh, Saudi Arabia',
      locationEs: 'Riad, Arabia Saudita',
      locationFr: 'Riyad, Arabie Saoudite',
      area: '3500 m²',
      duration: '4 months',
      completionDate: new Date('2023-09-20'),
      category: 'religious',
      slug: 'mosque-saudi-arabia',
      featured: true,
      sortOrder: 2,
      isActive: true
    },
    {
      nameAr: 'فيلا سكنية في قطر',
      nameEn: 'Residential Villa in Qatar',
      nameEs: 'Villa Residencial en Qatar',
      nameFr: 'Villa Résidentielle au Qatar',
      descriptionAr: 'مشروع متكامل لتوريد وتركيب الرخام والجرانيت لفيلا فاخرة تشمل الأرضيات، الدرج، المطابخ والحمامات. استخدام مزيج من رخام كرارا وجرانيت أسود زمبابوي.',
      descriptionEn: 'Complete project for supply and installation of marble and granite for a luxury villa including flooring, stairs, kitchens and bathrooms. Use of a mix of Carrara marble and Zimbabwe Black granite.',
      descriptionEs: 'Proyecto completo de suministro e instalación de mármol y granito para una villa de lujo que incluye pisos, escaleras, cocinas y baños. Uso de una mezcla de mármol Carrara y granito Negro Zimbabwe.',
      descriptionFr: 'Projet complet de fourniture et installation de marbre et granit pour une villa de luxe comprenant les sols, escaliers, cuisines et salles de bains. Utilisation d\'un mélange de marbre Carrara et granit Noir Zimbabwe.',
      clientName: 'Private Client',
      locationAr: 'الدوحة، قطر',
      locationEn: 'Doha, Qatar',
      locationEs: 'Doha, Qatar',
      locationFr: 'Doha, Qatar',
      area: '1200 m²',
      duration: '3 months',
      completionDate: new Date('2023-11-10'),
      category: 'residential',
      slug: 'residential-villa-qatar',
      featured: false,
      sortOrder: 3,
      isActive: true
    },
    {
      nameAr: 'مركز تجاري في الكويت',
      nameEn: 'Commercial Center in Kuwait',
      nameEs: 'Centro Comercial en Kuwait',
      nameFr: 'Centre Commercial au Koweït',
      descriptionAr: 'توريد جرانيت للواجهات الخارجية وأرضيات المركز التجاري. استخدام جرانيت رمادي مصري مقاوم للعوامل الجوية.',
      descriptionEn: 'Supply of granite for external facades and commercial center flooring. Use of weather-resistant Egyptian gray granite.',
      descriptionEs: 'Suministro de granito para fachadas externas y pisos de centro comercial. Uso de granito gris egipcio resistente a la intemperie.',
      descriptionFr: 'Fourniture de granit pour les façades extérieures et les sols du centre commercial. Utilisation de granit gris égyptien résistant aux intempéries.',
      clientName: 'Kuwait Development Company',
      locationAr: 'مدينة الكويت، الكويت',
      locationEn: 'Kuwait City, Kuwait',
      locationEs: 'Ciudad de Kuwait, Kuwait',
      locationFr: 'Ville de Koweït, Koweït',
      area: '8000 m²',
      duration: '8 months',
      completionDate: new Date('2024-01-25'),
      category: 'commercial',
      slug: 'commercial-center-kuwait',
      featured: false,
      sortOrder: 4,
      isActive: true
    }
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project
    })
  }

  console.log('✅ Projects seeded successfully')
}

seedProjects()
  .catch((e) => {
    console.error('❌ Error seeding projects:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
