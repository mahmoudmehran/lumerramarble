const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedExportGuides() {
  console.log('🌱 Seeding Export Guides...')

  const guides = [
    {
      titleAr: 'مواصفات المنتج والعينات',
      titleEn: 'Product Specifications and Samples',
      titleEs: 'Especificaciones y Muestras del Producto',
      titleFr: 'Spécifications et Échantillons du Produit',
      contentAr: '<p>نبدأ بفهم احتياجاتك بشكل دقيق:</p><ul><li>نوع الحجر المطلوب (رخام، جرانيت، كوارتز)</li><li>المقاسات والسماكة المطلوبة</li><li>نوع التشطيب (لامع، مطفي، مصقول، إلخ)</li><li>الكمية المطلوبة</li><li>الوجهة النهائية للشحن</li></ul><p>نوفر عينات مجانية (10x10 سم) لتتأكد من جودة المنتج قبل الطلب الكامل.</p>',
      contentEn: '<p>We start by understanding your needs precisely:</p><ul><li>Type of stone required (marble, granite, quartz)</li><li>Required dimensions and thickness</li><li>Finish type (polished, honed, brushed, etc.)</li><li>Required quantity</li><li>Final shipping destination</li></ul><p>We provide free samples (10x10 cm) to ensure product quality before full order.</p>',
      contentEs: '<p>Comenzamos entendiendo sus necesidades con precisión:</p><ul><li>Tipo de piedra requerida (mármol, granito, cuarzo)</li><li>Dimensiones y espesor requeridos</li><li>Tipo de acabado (pulido, mate, cepillado, etc.)</li><li>Cantidad requerida</li><li>Destino final de envío</li></ul><p>Proporcionamos muestras gratuitas (10x10 cm) para garantizar la calidad del producto antes del pedido completo.</p>',
      contentFr: '<p>Nous commençons par comprendre vos besoins avec précision:</p><ul><li>Type de pierre requise (marbre, granit, quartz)</li><li>Dimensions et épaisseur requises</li><li>Type de finition (poli, adouci, brossé, etc.)</li><li>Quantité requise</li><li>Destination finale d\'expédition</li></ul><p>Nous fournissons des échantillons gratuits (10x10 cm) pour garantir la qualité du produit avant la commande complète.</p>',
      category: 'preparation',
      sortOrder: 1,
      isActive: true
    },
    {
      titleAr: 'عرض السعر والتفاوض',
      titleEn: 'Price Quotation and Negotiation',
      titleEs: 'Cotización de Precio y Negociación',
      titleFr: 'Devis et Négociation',
      contentAr: '<p>بعد استلام مواصفاتك، نقدم:</p><ul><li>عرض سعر مفصل يشمل جميع التكاليف</li><li>تكاليف الإنتاج والتصنيع</li><li>تكاليف التعبئة والتغليف</li><li>تكاليف الشحن حتى ميناء الوجهة</li><li>شروط الدفع المرنة</li></ul><p>نحن منفتحون على التفاوض لتحقيق أفضل قيمة لك مع الحفاظ على أعلى معايير الجودة.</p>',
      contentEn: '<p>After receiving your specifications, we provide:</p><ul><li>Detailed price quotation including all costs</li><li>Production and manufacturing costs</li><li>Packing and packaging costs</li><li>Shipping costs to destination port</li><li>Flexible payment terms</li></ul><p>We are open to negotiation to achieve the best value for you while maintaining the highest quality standards.</p>',
      contentEs: '<p>Después de recibir sus especificaciones, proporcionamos:</p><ul><li>Cotización de precio detallada que incluye todos los costos</li><li>Costos de producción y fabricación</li><li>Costos de embalaje y empaque</li><li>Costos de envío al puerto de destino</li><li>Condiciones de pago flexibles</li></ul><p>Estamos abiertos a la negociación para lograr el mejor valor para usted manteniendo los más altos estándares de calidad.</p>',
      contentFr: '<p>Après avoir reçu vos spécifications, nous fournissons:</p><ul><li>Devis détaillé incluant tous les coûts</li><li>Coûts de production et de fabrication</li><li>Coûts d\'emballage et de conditionnement</li><li>Coûts d\'expédition jusqu\'au port de destination</li><li>Conditions de paiement flexibles</li></ul><p>Nous sommes ouverts à la négociation pour obtenir la meilleure valeur pour vous tout en maintenant les normes de qualité les plus élevées.</p>',
      category: 'pricing',
      sortOrder: 2,
      isActive: true
    },
    {
      titleAr: 'الإنتاج والمراقبة',
      titleEn: 'Production and Quality Control',
      titleEs: 'Producción y Control de Calidad',
      titleFr: 'Production et Contrôle Qualité',
      contentAr: '<p>عملية الإنتاج تتم تحت إشراف دقيق:</p><ul><li>اختيار الكتل من المحاجر المعتمدة</li><li>القص والتشطيب وفقاً للمواصفات المتفق عليها</li><li>فحص جودة شامل في كل مرحلة</li><li>التصوير والتوثيق لكل شحنة</li><li>إمكانية الفحص في الموقع قبل الشحن</li></ul><p>مدة الإنتاج عادة 2-3 أسابيع حسب حجم الطلب.</p>',
      contentEn: '<p>Production process is carried out under strict supervision:</p><ul><li>Selection of blocks from certified quarries</li><li>Cutting and finishing according to agreed specifications</li><li>Comprehensive quality inspection at each stage</li><li>Photography and documentation for each shipment</li><li>Possibility of on-site inspection before shipping</li></ul><p>Production time usually 2-3 weeks depending on order size.</p>',
      contentEs: '<p>El proceso de producción se lleva a cabo bajo estricta supervisión:</p><ul><li>Selección de bloques de canteras certificadas</li><li>Corte y acabado según las especificaciones acordadas</li><li>Inspección de calidad integral en cada etapa</li><li>Fotografía y documentación para cada envío</li><li>Posibilidad de inspección in situ antes del envío</li></ul><p>Tiempo de producción generalmente 2-3 semanas dependiendo del tamaño del pedido.</p>',
      contentFr: '<p>Le processus de production est effectué sous stricte supervision:</p><ul><li>Sélection de blocs de carrières certifiées</li><li>Découpe et finition selon les spécifications convenues</li><li>Inspection qualité complète à chaque étape</li><li>Photographie et documentation pour chaque expédition</li><li>Possibilité d\'inspection sur site avant l\'expédition</li></ul><p>Temps de production généralement 2-3 semaines selon la taille de la commande.</p>',
      category: 'production',
      sortOrder: 3,
      isActive: true
    },
    {
      titleAr: 'التعبئة والتغليف',
      titleEn: 'Packing and Packaging',
      titleEs: 'Embalaje y Empaquetado',
      titleFr: 'Emballage et Conditionnement',
      contentAr: '<p>نستخدم أحدث تقنيات التعبئة لضمان وصول آمن:</p><ul><li>تغليف كل قطعة بشكل منفصل بمواد واقية</li><li>استخدام صناديق خشبية قوية (crates)</li><li>وضع رغوة حماية بين القطع</li><li>ربط الصناديق بأحزمة فولاذية</li><li>وضع علامات واضحة للتعامل والشحن</li></ul><p>التعبئة تتم وفقاً للمعايير الدولية لشحن المواد الحجرية.</p>',
      contentEn: '<p>We use the latest packing techniques to ensure safe arrival:</p><ul><li>Wrapping each piece separately with protective materials</li><li>Using strong wooden crates</li><li>Placing protective foam between pieces</li><li>Securing crates with steel straps</li><li>Clear labeling for handling and shipping</li></ul><p>Packing is done according to international standards for stone materials shipping.</p>',
      contentEs: '<p>Utilizamos las últimas técnicas de embalaje para garantizar una llegada segura:</p><ul><li>Envolver cada pieza por separado con materiales protectores</li><li>Usar cajas de madera resistentes</li><li>Colocar espuma protectora entre las piezas</li><li>Asegurar las cajas con correas de acero</li><li>Etiquetado claro para manipulación y envío</li></ul><p>El embalaje se realiza según los estándares internacionales para el envío de materiales pétreos.</p>',
      contentFr: '<p>Nous utilisons les dernières techniques d\'emballage pour garantir une arrivée en toute sécurité:</p><ul><li>Emballage de chaque pièce séparément avec des matériaux de protection</li><li>Utilisation de caisses en bois solides</li><li>Placement de mousse de protection entre les pièces</li><li>Sécurisation des caisses avec des sangles en acier</li><li>Étiquetage clair pour la manutention et l\'expédition</li></ul><p>L\'emballage est effectué selon les normes internationales pour l\'expédition de matériaux en pierre.</p>',
      category: 'packaging',
      sortOrder: 4,
      isActive: true
    },
    {
      titleAr: 'الشحن والتخليص الجمركي',
      titleEn: 'Shipping and Customs Clearance',
      titleEs: 'Envío y Despacho de Aduanas',
      titleFr: 'Expédition et Dédouanement',
      contentAr: '<p>نتولى جميع إجراءات الشحن والتصدير:</p><ul><li>حجز الحاويات وترتيب الشحن البحري</li><li>إعداد جميع المستندات الجمركية</li><li>شهادة المنشأ</li><li>بوليصة الشحن (Bill of Lading)</li><li>قائمة التعبئة (Packing List)</li><li>الفاتورة التجارية</li><li>التنسيق مع وكلاء الشحن في بلدك</li></ul><p>نوفر خدمة تتبع الشحنة أول بأول حتى وصولها.</p>',
      contentEn: '<p>We handle all shipping and export procedures:</p><ul><li>Container booking and sea freight arrangement</li><li>Preparation of all customs documents</li><li>Certificate of Origin</li><li>Bill of Lading</li><li>Packing List</li><li>Commercial Invoice</li><li>Coordination with shipping agents in your country</li></ul><p>We provide shipment tracking service until arrival.</p>',
      contentEs: '<p>Manejamos todos los procedimientos de envío y exportación:</p><ul><li>Reserva de contenedores y arreglo de flete marítimo</li><li>Preparación de todos los documentos aduaneros</li><li>Certificado de Origen</li><li>Conocimiento de Embarque</li><li>Lista de Empaque</li><li>Factura Comercial</li><li>Coordinación con agentes de envío en su país</li></ul><p>Proporcionamos servicio de seguimiento de envíos hasta la llegada.</p>',
      contentFr: '<p>Nous gérons toutes les procédures d\'expédition et d\'exportation:</p><ul><li>Réservation de conteneurs et arrangement du fret maritime</li><li>Préparation de tous les documents douaniers</li><li>Certificat d\'Origine</li><li>Connaissement</li><li>Liste de Colisage</li><li>Facture Commerciale</li><li>Coordination avec les agents de transport dans votre pays</li></ul><p>Nous fournissons un service de suivi d\'expédition jusqu\'à l\'arrivée.</p>',
      category: 'shipping',
      sortOrder: 5,
      isActive: true
    },
    {
      titleAr: 'الدعم بعد البيع',
      titleEn: 'After-Sales Support',
      titleEs: 'Soporte Postventa',
      titleFr: 'Support Après-Vente',
      contentAr: '<p>علاقتنا لا تنتهي بوصول الشحنة:</p><ul><li>دعم فني لعملية التركيب</li><li>إرشادات العناية والصيانة</li><li>ضمان على جودة المنتج</li><li>حل سريع لأي مشاكل قد تحدث</li><li>خصومات خاصة للطلبات المتكررة</li><li>أولوية في الطلبات المستقبلية</li></ul><p>نسعد دائماً بخدمة عملائنا وبناء شراكات طويلة الأمد.</p>',
      contentEn: '<p>Our relationship doesn\'t end with shipment arrival:</p><ul><li>Technical support for installation process</li><li>Care and maintenance guidelines</li><li>Product quality warranty</li><li>Quick resolution of any issues that may occur</li><li>Special discounts for repeat orders</li><li>Priority in future orders</li></ul><p>We are always happy to serve our customers and build long-term partnerships.</p>',
      contentEs: '<p>Nuestra relación no termina con la llegada del envío:</p><ul><li>Soporte técnico para el proceso de instalación</li><li>Pautas de cuidado y mantenimiento</li><li>Garantía de calidad del producto</li><li>Resolución rápida de cualquier problema que pueda ocurrir</li><li>Descuentos especiales para pedidos repetidos</li><li>Prioridad en pedidos futuros</li></ul><p>Siempre estamos felices de servir a nuestros clientes y construir asociaciones a largo plazo.</p>',
      contentFr: '<p>Notre relation ne se termine pas avec l\'arrivée de l\'expédition:</p><ul><li>Support technique pour le processus d\'installation</li><li>Directives d\'entretien et de maintenance</li><li>Garantie de qualité du produit</li><li>Résolution rapide de tout problème pouvant survenir</li><li>Remises spéciales pour les commandes répétées</li><li>Priorité dans les commandes futures</li></ul><p>Nous sommes toujours heureux de servir nos clients et de construire des partenariats à long terme.</p>',
      category: 'support',
      sortOrder: 6,
      isActive: true
    }
  ]

  for (const guide of guides) {
    await prisma.exportGuide.create({
      data: guide
    })
  }

  console.log('✅ Export Guides seeded successfully')
}

seedExportGuides()
  .catch((e) => {
    console.error('❌ Error seeding export guides:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
