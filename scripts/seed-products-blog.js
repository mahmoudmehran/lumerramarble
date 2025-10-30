const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedProductsAndBlog() {
  try {
    console.log('إنشاء المنتجات وبيانات المدونة...')

    // إنشاء فئات المنتجات
    const marbleCategory = await prisma.category.upsert({
      where: { slug: 'marble' },
      update: {},
      create: {
        nameAr: 'رخام',
        nameEn: 'Marble',
        nameEs: 'Mármol',
        nameFr: 'Marbre',
        slug: 'marble',
        type: 'PRODUCT',
        descriptionAr: 'منتجات الرخام الطبيعي',
        descriptionEn: 'Natural marble products',
        descriptionEs: 'Productos de mármol natural',
        descriptionFr: 'Produits en marbre naturel',
        isActive: true
      }
    })

    const graniteCategory = await prisma.category.upsert({
      where: { slug: 'granite' },
      update: {},
      create: {
        nameAr: 'جرانيت',
        nameEn: 'Granite',
        nameEs: 'Granito',
        nameFr: 'Granit',
        slug: 'granite',
        type: 'PRODUCT',
        descriptionAr: 'منتجات الجرانيت الطبيعي',
        descriptionEn: 'Natural granite products',
        descriptionEs: 'Productos de granito natural',
        descriptionFr: 'Produits en granit naturel',
        isActive: true
      }
    })

    // إنشاء المنتجات
    const carraraMarble = await prisma.product.upsert({
      where: { slug: 'carrara-white-marble' },
      update: {},
      create: {
        nameAr: 'رخام كرارا أبيض',
        nameEn: 'Carrara White Marble',
        nameEs: 'Mármol Carrara Blanco',
        nameFr: 'Marbre Carrara Blanc',
        slug: 'carrara-white-marble',
        descriptionAr: 'رخام كرارا الأبيض عالي الجودة مع عروق رمادية أنيقة. يُعتبر من أفخم أنواع الرخام الطبيعي في العالم، يتميز بلونه الأبيض النقي مع العروق الرمادية الطبيعية التي تضفي عليه جمالاً استثنائياً.',
        descriptionEn: 'Premium quality Carrara white marble with elegant gray veining. Considered one of the finest natural marbles in the world, featuring pure white color with natural gray veins that give it exceptional beauty.',
        descriptionEs: 'Mármol Carrara blanco de primera calidad con elegante veteado gris. Considerado uno de los mármoles naturales más finos del mundo.',
        descriptionFr: 'Marbre Carrara blanc de qualité supérieure avec un élégant veinage gris. Considéré comme l\'un des marbres naturels les plus fins au monde.',
        category: 'MARBLE',
        thickness: '18mm, 20mm, 30mm',
        finishes: 'مصقول، مطفي، مضغوط',
        originCountry: 'إيطاليا',
        images: JSON.stringify(['/images/carrara-1.jpg', '/images/carrara-2.jpg']),
        featured: true,
        active: true
      }
    })

    const blackGalaxyGranite = await prisma.product.upsert({
      where: { slug: 'black-galaxy-granite' },
      update: {},
      create: {
        nameAr: 'جرانيت أسود جالاكسي',
        nameEn: 'Black Galaxy Granite',
        nameEs: 'Granito Negro Galaxia',
        nameFr: 'Granit Noir Galaxie',
        slug: 'black-galaxy-granite',
        descriptionAr: 'جرانيت أسود جالاكسي رائع مع نقاط ذهبية وفضية. حجر طبيعي فاخر يتميز بلونه الأسود العميق مع نقاط لامعة تشبه النجوم في السماء. مقاوم للخدش والبقع.',
        descriptionEn: 'Stunning black granite with golden and silver flecks. A luxurious natural stone featuring deep black color with shimmering flecks that resemble stars in the sky. Scratch and stain resistant.',
        descriptionEs: 'Granito negro impresionante con motas doradas y plateadas. Una piedra natural lujosa con color negro profundo.',
        descriptionFr: 'Granit noir magnifique avec des paillettes dorées et argentées. Une pierre naturelle luxueuse avec une couleur noire profonde.',
        category: 'GRANITE',
        thickness: '20mm, 30mm',
        finishes: 'مصقول، مطفي',
        originCountry: 'الهند',
        images: JSON.stringify(['/images/galaxy-1.jpg', '/images/galaxy-2.jpg']),
        featured: true,
        active: true
      }
    })

    // إنشاء فئة المدونة
    const blogCategory = await prisma.category.upsert({
      where: { slug: 'stone-care' },
      update: {},
      create: {
        nameAr: 'العناية بالأحجار',
        nameEn: 'Stone Care',
        nameEs: 'Cuidado de Piedras',
        nameFr: 'Entretien des Pierres',
        slug: 'stone-care',
        type: 'BLOG',
        descriptionAr: 'نصائح وإرشادات للعناية بالأحجار وصيانتها',
        descriptionEn: 'Tips and guides for stone care and maintenance',
        descriptionEs: 'Consejos y guías para el cuidado y mantenimiento de piedras',
        descriptionFr: 'Conseils et guides pour l\'entretien des pierres',
        isActive: true
      }
    })

    // إنشاء مقالات المدونة
    const blogPost1 = await prisma.blogPost.upsert({
      where: { slug: 'marble-maintenance-guide' },
      update: {},
      create: {
        titleAr: 'دليل شامل لصيانة الرخام',
        titleEn: 'Complete Guide to Marble Maintenance',
        titleEs: 'Guía Completa para el Mantenimiento del Mármol',
        titleFr: 'Guide Complet pour l\'Entretien du Marbre',
        slug: 'marble-maintenance-guide',
        contentAr: '<p>الرخام حجر طبيعي جميل وأنيق يتطلب عناية مناسبة للحفاظ على جماله. في هذا الدليل، سنتعلم كيفية العناية بالرخام بشكل صحيح.</p><h2>التنظيف اليومي</h2><p>استخدم منظف خفيف وماء دافئ لتنظيف الرخام يومياً. تجنب استخدام المنظفات الحمضية.</p>',
        contentEn: '<p>Marble is a beautiful and elegant natural stone that requires proper care to maintain its beauty. In this guide, we will learn how to properly care for marble.</p><h2>Daily Cleaning</h2><p>Use a mild cleaner and warm water to clean marble daily. Avoid using acidic cleaners.</p>',
        contentEs: '<p>El mármol es una piedra natural hermosa y elegante que requiere cuidado adecuado para mantener su belleza.</p>',
        contentFr: '<p>Le marbre est une pierre naturelle belle et élégante qui nécessite des soins appropriés pour maintenir sa beauté.</p>',
        published: true,
        featured: true
      }
    })

    const blogPost2 = await prisma.blogPost.upsert({
      where: { slug: 'granite-vs-marble-comparison' },
      update: {},
      create: {
        titleAr: 'الجرانيت مقابل الرخام: أيهما أفضل؟',
        titleEn: 'Granite vs Marble: Which is Better?',
        titleEs: 'Granito vs Mármol: ¿Cuál es Mejor?',
        titleFr: 'Granit vs Marbre: Lequel est le Meilleur?',
        slug: 'granite-vs-marble-comparison',
        contentAr: '<p>اختيار بين الجرانيت والرخام قد يكون صعباً. إليك مقارنة مفصلة بين هذين الحجرين الطبيعيين الرائعين.</p><h2>المتانة</h2><p>الجرانيت أكثر صلابة ومقاومة للخدوش من الرخام، بينما الرخام أكثر عرضة للتآكل من الأحماض.</p>',
        contentEn: '<p>Choosing between granite and marble can be challenging. Here is a detailed comparison between these two amazing natural stones.</p><h2>Durability</h2><p>Granite is harder and more scratch-resistant than marble, while marble is more susceptible to acid etching.</p>',
        contentEs: '<p>Elegir entre granito y mármol puede ser desafiante. Aquí hay una comparación detallada.</p>',
        contentFr: '<p>Choisir entre le granit et le marbre peut être difficile. Voici une comparaison détaillée.</p>',
        published: true,
        featured: false
      }
    })

    console.log('✅ تم إنشاء البيانات بنجاح!')
    console.log(`- تم إنشاء ${2} فئة منتجات`)
    console.log(`- تم إنشاء ${2} منتج`)
    console.log(`- تم إنشاء ${1} فئة مدونة`)
    console.log(`- تم إنشاء ${2} مقال`)

  } catch (error) {
    console.error('خطأ في إنشاء البيانات:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedProductsAndBlog()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = seedProductsAndBlog