const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Adding PageSEO records for Contact and Quote pages...')

  // Create Contact page SEO
  const contact = await prisma.pageSEO.upsert({
    where: { pageKey: 'contact' },
    update: {},
    create: {
      pageKey: 'contact',
      titleAr: 'تواصل معنا',
      titleEn: 'Contact Us',
      titleEs: 'Contáctenos',
      titleFr: 'Contactez-nous',
      descriptionAr: 'تواصل معنا للحصول على استشارة مجانية حول منتجات الرخام والجرانيت',
      descriptionEn: 'Contact us for a free consultation about marble and granite products',
      descriptionEs: 'Contáctenos para una consulta gratuita sobre productos de mármol y granito',
      descriptionFr: 'Contactez-nous pour une consultation gratuite sur les produits en marbre et granit',
      keywordsAr: 'تواصل معنا, استشارة مجانية, رخام, جرانيت',
      keywordsEn: 'contact us, free consultation, marble, granite',
      keywordsEs: 'contáctenos, consulta gratuita, mármol, granito',
      keywordsFr: 'contactez-nous, consultation gratuite, marbre, granit',
      isActive: true
    }
  })

  console.log('Created/Updated Contact page SEO:', contact.id)

  // Create Quote page SEO
  const quote = await prisma.pageSEO.upsert({
    where: { pageKey: 'quote' },
    update: {},
    create: {
      pageKey: 'quote',
      titleAr: 'طلب عرض سعر',
      titleEn: 'Request a Quote',
      titleEs: 'Solicitar Cotización',
      titleFr: 'Demander un Devis',
      descriptionAr: 'احصل على عرض سعر مخصص لمشروعك خلال 24 ساعة',
      descriptionEn: 'Get a customized quote for your project within 24 hours',
      descriptionEs: 'Obtenga una cotización personalizada para su proyecto en 24 horas',
      descriptionFr: 'Obtenez un devis personnalisé pour votre projet dans les 24 heures',
      keywordsAr: 'طلب عرض سعر, تسعيرة, رخام, جرانيت',
      keywordsEn: 'request quote, pricing, marble, granite',
      keywordsEs: 'solicitar cotización, precios, mármol, granito',
      keywordsFr: 'demander devis, tarifs, marbre, granit',
      isActive: true
    }
  })

  console.log('Created/Updated Quote page SEO:', quote.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
