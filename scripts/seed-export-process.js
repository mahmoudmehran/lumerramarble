const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إضافة بيانات خطوات التصدير...')

  try {
    // البيانات الافتراضية
    const processContent = [
      // عنوان ووصف القسم
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'title',
        valueAr: 'عملية التصدير',
        valueEn: 'Export Process',
        valueFr: 'Processus d\'exportation',
        valueEs: 'Proceso de exportación',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'subtitle',
        valueAr: 'خطوات بسيطة للحصول على منتجاتنا',
        valueEn: 'Simple steps to get our products',
        valueFr: 'Étapes simples pour obtenir nos produits',
        valueEs: 'Pasos simples para obtener nuestros productos',
      },
      // خطوة 1: طلب عرض السعر
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'quote_number',
        valueAr: '01',
        valueEn: '01',
        valueFr: '01',
        valueEs: '01',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'quote_title',
        valueAr: 'طلب عرض السعر',
        valueEn: 'Request Quote',
        valueFr: 'Demander un devis',
        valueEs: 'Solicitar cotización',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'quote_description',
        valueAr: 'تواصل معنا وأرسل تفاصيل مشروعك للحصول على عرض سعر مخصص',
        valueEn: 'Contact us and send your project details to get a custom quote',
        valueFr: 'Contactez-nous et envoyez les détails de votre projet pour obtenir un devis personnalisé',
        valueEs: 'Contáctenos y envíe los detalles de su proyecto para obtener una cotización personalizada',
      },
      // خطوة 2: اختيار المنتجات
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'selection_number',
        valueAr: '02',
        valueEn: '02',
        valueFr: '02',
        valueEs: '02',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'selection_title',
        valueAr: 'اختيار المنتجات',
        valueEn: 'Product Selection',
        valueFr: 'Sélection des produits',
        valueEs: 'Selección de productos',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'selection_description',
        valueAr: 'اختر من مجموعتنا الواسعة من الرخام والجرانيت والكوارتز',
        valueEn: 'Choose from our wide range of marble, granite, and quartz',
        valueFr: 'Choisissez parmi notre large gamme de marbre, granit et quartz',
        valueEs: 'Elija de nuestra amplia gama de mármol, granito y cuarzo',
      },
      // خطوة 3: التأكيد والدفع
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'confirmation_number',
        valueAr: '03',
        valueEn: '03',
        valueFr: '03',
        valueEs: '03',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'confirmation_title',
        valueAr: 'التأكيد والدفع',
        valueEn: 'Confirmation & Payment',
        valueFr: 'Confirmation et paiement',
        valueEs: 'Confirmación y pago',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'confirmation_description',
        valueAr: 'تأكيد الطلب وإجراءات الدفع الآمنة',
        valueEn: 'Order confirmation and secure payment procedures',
        valueFr: 'Confirmation de commande et procédures de paiement sécurisées',
        valueEs: 'Confirmación de pedido y procedimientos de pago seguros',
      },
      // خطوة 4: الإنتاج والتجهيز
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'production_number',
        valueAr: '04',
        valueEn: '04',
        valueFr: '04',
        valueEs: '04',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'production_title',
        valueAr: 'الإنتاج والتجهيز',
        valueEn: 'Production & Preparation',
        valueFr: 'Production et préparation',
        valueEs: 'Producción y preparación',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'production_description',
        valueAr: 'إنتاج وتجهيز المنتجات وفقاً للمواصفات المطلوبة',
        valueEn: 'Production and preparation of products according to required specifications',
        valueFr: 'Production et préparation des produits selon les spécifications requises',
        valueEs: 'Producción y preparación de productos según las especificaciones requeridas',
      },
      // خطوة 5: التغليف والشحن
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'packaging_number',
        valueAr: '05',
        valueEn: '05',
        valueFr: '05',
        valueEs: '05',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'packaging_title',
        valueAr: 'التغليف والشحن',
        valueEn: 'Packaging & Shipping',
        valueFr: 'Emballage et expédition',
        valueEs: 'Embalaje y envío',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'packaging_description',
        valueAr: 'تغليف احترافي وترتيب الشحن إلى وجهتك',
        valueEn: 'Professional packaging and shipping arrangement to your destination',
        valueFr: 'Emballage professionnel et organisation de l\'expédition vers votre destination',
        valueEs: 'Embalaje profesional y organización del envío a su destino',
      },
      // خطوة 6: التسليم
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'delivery_number',
        valueAr: '06',
        valueEn: '06',
        valueFr: '06',
        valueEs: '06',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'delivery_title',
        valueAr: 'التسليم',
        valueEn: 'Delivery',
        valueFr: 'Livraison',
        valueEs: 'Entrega',
      },
      {
        pageKey: 'export',
        sectionKey: 'process',
        contentKey: 'delivery_description',
        valueAr: 'التسليم في الموعد المحدد مع جميع الوثائق المطلوبة',
        valueEn: 'On-time delivery with all required documents',
        valueFr: 'Livraison à temps avec tous les documents requis',
        valueEs: 'Entrega a tiempo con todos los documentos requeridos',
      },
    ]

    let added = 0
    for (const item of processContent) {
      await prisma.pageContent.upsert({
        where: {
          pageKey_sectionKey_contentKey: {
            pageKey: item.pageKey,
            sectionKey: item.sectionKey,
            contentKey: item.contentKey,
          },
        },
        update: {
          valueAr: item.valueAr,
          valueEn: item.valueEn,
          valueFr: item.valueFr,
          valueEs: item.valueEs,
        },
        create: {
          pageKey: item.pageKey,
          sectionKey: item.sectionKey,
          contentKey: item.contentKey,
          valueAr: item.valueAr,
          valueEn: item.valueEn,
          valueFr: item.valueFr,
          valueEs: item.valueEs,
          contentType: 'TEXT',
          isActive: true,
        },
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

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
