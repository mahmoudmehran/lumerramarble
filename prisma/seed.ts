import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lumerramarble.com' },
    update: {},
    create: {
      email: 'admin@lumerramarble.com',
      password: hashedPassword,
      name: 'المدير العام',
      role: 'ADMIN',
      country: 'مصر',
      whatsapp: '+201113121444',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample products
  const products = [
    {
      nameAr: 'رخام كرارا أبيض',
      nameEn: 'Carrara White Marble',
      nameEs: 'Mármol Blanco Carrara',
      nameFr: 'Marbre Blanc de Carrare',
      category: 'MARBLE' as const,
      descriptionAr: 'رخام كرارا الأبيض الفاخر من أجود أنواع الرخام الطبيعي، يتميز بلونه الأبيض الناصع مع العروق الرمادية الرقيقة',
      descriptionEn: 'Premium Carrara White marble, one of the finest natural marble types, characterized by its pure white color with delicate gray veins',
      descriptionEs: 'Mármol Carrara Blanco premium, uno de los tipos de mármol natural más finos, caracterizado por su color blanco puro con delicadas vetas grises',
      descriptionFr: 'Marbre Carrara Blanc premium, l\'un des types de marbre naturel les plus fins, caractérisé par sa couleur blanche pure avec de délicates veines grises',
      thickness: '18mm, 20mm, 30mm',
      finishes: 'مصقول، مطفي، مضغوط',
      originCountry: 'مصر',
      images: ['/images/carrara-white.jpg', '/images/carrara-white-2.jpg'],
      slug: 'carrara-white-marble',
      featured: true,
    },
    {
      nameAr: 'جرانيت أسود جالاكسي',
      nameEn: 'Black Galaxy Granite',
      nameEs: 'Granito Negro Galaxia',
      nameFr: 'Granit Noir Galaxie',
      category: 'GRANITE' as const,
      descriptionAr: 'جرانيت أسود جالاكسي الفاخر يتميز بلونه الأسود العميق مع النقاط الذهبية اللامعة التي تشبه النجوم',
      descriptionEn: 'Premium Black Galaxy granite characterized by its deep black color with shiny golden spots resembling stars',
      descriptionEs: 'Granito Black Galaxy premium caracterizado por su color negro profundo con puntos dorados brillantes que se asemejan a estrellas',
      descriptionFr: 'Granit Black Galaxy premium caractérisé par sa couleur noire profonde avec des points dorés brillants ressemblant à des étoiles',
      thickness: '20mm, 30mm',
      finishes: 'مصقول، مطفي',
      originCountry: 'مصر',
      images: ['/images/black-galaxy.jpg'],
      slug: 'black-galaxy-granite',
      featured: true,
    },
    {
      nameAr: 'كوارتز أبيض نقي',
      nameEn: 'Pure White Quartz',
      nameEs: 'Cuarzo Blanco Puro',
      nameFr: 'Quartz Blanc Pur',
      category: 'QUARTZ' as const,
      descriptionAr: 'كوارتز أبيض نقي عالي الجودة، مقاوم للبقع والخدوش، مثالي لأسطح المطابخ والحمامات',
      descriptionEn: 'High-quality pure white quartz, stain and scratch resistant, perfect for kitchen and bathroom surfaces',
      descriptionEs: 'Cuarzo blanco puro de alta calidad, resistente a manchas y rayones, perfecto para superficies de cocinas y baños',
      descriptionFr: 'Quartz blanc pur de haute qualité, résistant aux taches et aux rayures, parfait pour les surfaces de cuisine et de salle de bain',
      thickness: '20mm, 30mm',
      finishes: 'مصقول، مطفي، محفر',
      originCountry: 'مصر',
      images: ['/images/pure-white-quartz.jpg'],
      slug: 'pure-white-quartz',
      featured: false,
    },
  ]

  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        images: JSON.stringify(product.images),
      },
    })
    console.log('✅ Product created:', createdProduct.nameEn)
  }

  // Create sample blog posts
  const blogPosts = [
    {
      titleAr: 'دليل اختيار الرخام المناسب لمنزلك',
      titleEn: 'Guide to Choosing the Right Marble for Your Home',
      titleEs: 'Guía para Elegir el Mármol Adecuado para tu Hogar',
      titleFr: 'Guide pour Choisir le Bon Marbre pour Votre Maison',
      contentAr: 'يعتبر اختيار الرخام المناسب للمنزل من القرارات المهمة التي تؤثر على جمال ووظائف المساحة...',
      contentEn: 'Choosing the right marble for your home is an important decision that affects the beauty and functionality of the space...',
      contentEs: 'Elegir el mármol adecuado para tu hogar es una decisión importante que afecta la belleza y funcionalidad del espacio...',
      contentFr: 'Choisir le bon marbre pour votre maison est une décision importante qui affecte la beauté et la fonctionnalité de l\'espace...',
      excerpt: 'دليل شامل لاختيار أفضل أنواع الرخام لمنزلك',
      metaTitle: 'دليل اختيار الرخام المناسب - Lumerra Marble',
      metaDescription: 'تعرف على كيفية اختيار الرخام المناسب لمنزلك من خلال دليلنا الشامل',
      slug: 'guide-choosing-right-marble',
      featured: true,
      published: true,
    },
  ]

  for (const post of blogPosts) {
    const createdPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
    console.log('✅ Blog post created:', createdPost.titleEn)
  }

  // Create site settings
  const siteSettings = [
    {
      key: 'company_info',
      value: {
        nameAr: 'شركة لوميرا للرخام',
        nameEn: 'Lumerra Marble Company',
        address: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
        phone: '+20 111 312 1444',
        email: 'info@lumerramarble.com',
        whatsapp: '+20 111 312 1444',
      },
    },
    {
      key: 'social_media',
      value: {
        facebook: 'https://facebook.com/lumerramarble',
        instagram: 'https://instagram.com/lumerramarble',
        twitter: 'https://twitter.com/lumerramarble',
        youtube: 'https://youtube.com/@lumerramarble',
        linkedin: 'https://linkedin.com/company/lumerramarble',
      },
    },
    {
      key: 'seo_settings',
      value: {
        metaTitleAr: 'Lumerra Marble - تصدير الرخام والجرانيت من مصر',
        metaTitleEn: 'Lumerra Marble - Premium Marble & Granite Export from Egypt',
        metaDescriptionAr: 'شركة رائدة في تصدير الرخام والجرانيت عالي الجودة من مصر إلى العالم',
        metaDescriptionEn: 'Leading company in exporting premium marble and granite from Egypt to worldwide markets',
        keywords: 'marble, granite, quartz, export, Egypt, natural stone',
      },
    },
  ]

  for (const setting of siteSettings) {
    const createdSetting = await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
      },
    })
    console.log('✅ Site setting created:', createdSetting.key)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
