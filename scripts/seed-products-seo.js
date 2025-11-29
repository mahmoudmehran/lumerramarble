const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Adding PageSEO record for Products page...')

  // Create Products page SEO
  const products = await prisma.pageSEO.upsert({
    where: { pageKey: 'products' },
    update: {},
    create: {
      pageKey: 'products',
      titleAr: 'منتجاتنا',
      titleEn: 'Our Products',
      titleEs: 'Nuestros Productos',
      titleFr: 'Nos Produits',
      descriptionAr: 'اكتشف مجموعتنا الواسعة من الرخام والجرانيت الطبيعي بأعلى جودة',
      descriptionEn: 'Discover our wide range of natural marble and granite with the highest quality',
      descriptionEs: 'Descubra nuestra amplia gama de mármol y granito natural de la más alta calidad',
      descriptionFr: 'Découvrez notre large gamme de marbre et granit naturel de la plus haute qualité',
      keywordsAr: 'منتجات, رخام, جرانيت, أحجار طبيعية',
      keywordsEn: 'products, marble, granite, natural stones',
      keywordsEs: 'productos, mármol, granito, piedras naturales',
      keywordsFr: 'produits, marbre, granit, pierres naturelles',
      isActive: true
    }
  })

  console.log('Created/Updated Products page SEO:', products.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
