const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedFAQs() {
  console.log('🌱 Seeding FAQs...')

  const faqs = [
    {
      questionAr: 'ما هي أنواع الرخام المتوفرة لديكم؟',
      questionEn: 'What types of marble do you have available?',
      questionEs: '¿Qué tipos de mármol tienen disponibles?',
      questionFr: 'Quels types de marbre avez-vous disponibles?',
      answerAr: 'نوفر مجموعة واسعة من الرخام الطبيعي المصري بما في ذلك رخام سلفيا، جلالة، صني، فيلكا، وغيرها من الأنواع الفاخرة. جميع منتجاتنا مستخرجة من محاجر مصرية معتمدة وتخضع لمعايير جودة صارمة.',
      answerEn: 'We offer a wide range of Egyptian natural marble including Silvia, Galala, Sunny, Filka, and other premium varieties. All our products are extracted from certified Egyptian quarries and undergo strict quality standards.',
      answerEs: 'Ofrecemos una amplia gama de mármol natural egipcio que incluye Silvia, Galala, Sunny, Filka y otras variedades premium. Todos nuestros productos se extraen de canteras egipcias certificadas y se someten a estrictos estándares de calidad.',
      answerFr: 'Nous offrons une large gamme de marbre naturel égyptien, y compris Silvia, Galala, Sunny, Filka et d\'autres variétés premium. Tous nos produits sont extraits de carrières égyptiennes certifiées et soumis à des normes de qualité strictes.',
      category: 'products',
      sortOrder: 1,
      isActive: true
    },
    {
      questionAr: 'ما هي المهلة الزمنية للتوريد؟',
      questionEn: 'What is the delivery timeframe?',
      questionEs: '¿Cuál es el plazo de entrega?',
      questionFr: 'Quel est le délai de livraison?',
      answerAr: 'عادة ما تتراوح مدة التوريد من 2 إلى 4 أسابيع حسب حجم الطلب والوجهة. نقوم بتنسيق جميع عمليات الشحن والتخليص الجمركي لضمان وصول المنتجات في الوقت المحدد وبحالة ممتازة.',
      answerEn: 'Delivery timeframe typically ranges from 2 to 4 weeks depending on order size and destination. We coordinate all shipping and customs clearance to ensure products arrive on time and in excellent condition.',
      answerEs: 'El plazo de entrega generalmente varía de 2 a 4 semanas dependiendo del tamaño del pedido y el destino. Coordinamos todo el envío y el despacho de aduanas para garantizar que los productos lleguen a tiempo y en excelente estado.',
      answerFr: 'Le délai de livraison varie généralement de 2 à 4 semaines selon la taille de la commande et la destination. Nous coordonnons tout l\'expédition et le dédouanement pour garantir que les produits arrivent à temps et en excellent état.',
      category: 'shipping',
      sortOrder: 2,
      isActive: true
    },
    {
      questionAr: 'هل تقدمون شهادات جودة للمنتجات؟',
      questionEn: 'Do you provide quality certificates for products?',
      questionEs: '¿Proporcionan certificados de calidad para los productos?',
      questionFr: 'Fournissez-vous des certificats de qualité pour les produits?',
      answerAr: 'نعم، نوفر شهادات جودة دولية معتمدة لجميع منتجاتنا تشمل شهادات الأيزو، شهادات المنشأ، وتقارير الفحص الفني. كما نقدم عينات مجانية قبل الشحن للتأكد من مطابقة المواصفات.',
      answerEn: 'Yes, we provide internationally recognized quality certificates for all our products including ISO certificates, certificates of origin, and technical inspection reports. We also offer free samples before shipping to ensure specifications match.',
      answerEs: 'Sí, proporcionamos certificados de calidad reconocidos internacionalmente para todos nuestros productos, incluidos certificados ISO, certificados de origen e informes de inspección técnica. También ofrecemos muestras gratuitas antes del envío para garantizar que las especificaciones coincidan.',
      answerFr: 'Oui, nous fournissons des certificats de qualité reconnus internationalement pour tous nos produits, y compris les certificats ISO, les certificats d\'origine et les rapports d\'inspection technique. Nous offrons également des échantillons gratuits avant l\'expédition pour garantir que les spécifications correspondent.',
      category: 'quality',
      sortOrder: 3,
      isActive: true
    },
    {
      questionAr: 'ما هي طرق الدفع المتاحة؟',
      questionEn: 'What payment methods are available?',
      questionEs: '¿Qué métodos de pago están disponibles?',
      questionFr: 'Quels modes de paiement sont disponibles?',
      answerAr: 'نقبل التحويلات البنكية الدولية، الاعتمادات المستندية (L/C)، والدفع عند الاستلام للعملاء المعتمدين. نوفر أيضاً خطط دفع مرنة للمشاريع الكبيرة.',
      answerEn: 'We accept international bank transfers, Letters of Credit (L/C), and cash on delivery for approved customers. We also offer flexible payment plans for large projects.',
      answerEs: 'Aceptamos transferencias bancarias internacionales, Cartas de Crédito (L/C) y pago contra entrega para clientes aprobados. También ofrecemos planes de pago flexibles para proyectos grandes.',
      answerFr: 'Nous acceptons les virements bancaires internationaux, les Lettres de Crédit (L/C) et le paiement à la livraison pour les clients approuvés. Nous offrons également des plans de paiement flexibles pour les grands projets.',
      category: 'payment',
      sortOrder: 4,
      isActive: true
    },
    {
      questionAr: 'هل يمكنكم توفير أحجام وتشطيبات مخصصة؟',
      questionEn: 'Can you provide custom sizes and finishes?',
      questionEs: '¿Pueden proporcionar tamaños y acabados personalizados?',
      questionFr: 'Pouvez-vous fournir des tailles et des finitions personnalisées?',
      answerAr: 'بالتأكيد! نقدم خدمات التصنيع حسب الطلب بأي مقاسات وتشطيبات مطلوبة. فريقنا الفني يعمل معك لتحقيق المواصفات الدقيقة لمشروعك سواء كان تشطيب لامع، مطفي، أو أي تشطيب خاص آخر.',
      answerEn: 'Absolutely! We offer custom manufacturing services for any required sizes and finishes. Our technical team works with you to achieve the exact specifications for your project, whether polished, honed, or any other special finish.',
      answerEs: '¡Absolutamente! Ofrecemos servicios de fabricación personalizados para cualquier tamaño y acabado requerido. Nuestro equipo técnico trabaja con usted para lograr las especificaciones exactas de su proyecto, ya sea pulido, mate o cualquier otro acabado especial.',
      answerFr: 'Absolument! Nous offrons des services de fabrication sur mesure pour toutes les tailles et finitions requises. Notre équipe technique travaille avec vous pour réaliser les spécifications exactes de votre projet, qu\'il soit poli, adouci ou tout autre finition spéciale.',
      category: 'customization',
      sortOrder: 5,
      isActive: true
    }
  ]

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq
    })
  }

  console.log('✅ FAQs seeded successfully')
}

seedFAQs()
  .catch((e) => {
    console.error('❌ Error seeding FAQs:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
