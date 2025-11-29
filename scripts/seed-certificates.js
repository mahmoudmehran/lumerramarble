const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedCertificates() {
  console.log('🌱 Seeding Certificates...')

  const certificates = [
    {
      nameAr: 'شهادة الأيزو 9001',
      nameEn: 'ISO 9001 Certificate',
      nameEs: 'Certificado ISO 9001',
      nameFr: 'Certificat ISO 9001',
      descriptionAr: 'شهادة نظام إدارة الجودة ISO 9001:2015 معترف بها دولياً تؤكد التزامنا بأعلى معايير الجودة في جميع عملياتنا',
      descriptionEn: 'Internationally recognized ISO 9001:2015 Quality Management System certificate confirming our commitment to the highest quality standards in all our operations',
      descriptionEs: 'Certificado de Sistema de Gestión de Calidad ISO 9001:2015 reconocido internacionalmente que confirma nuestro compromiso con los más altos estándares de calidad en todas nuestras operaciones',
      descriptionFr: 'Certificat de Système de Gestion de la Qualité ISO 9001:2015 reconnu internationalement confirmant notre engagement envers les normes de qualité les plus élevées dans toutes nos opérations',
      issuerAr: 'المنظمة الدولية للمعايير',
      issuerEn: 'International Organization for Standardization',
      issuerEs: 'Organización Internacional de Normalización',
      issuerFr: 'Organisation Internationale de Normalisation',
      issueDate: new Date('2023-01-15'),
      expiryDate: new Date('2026-01-15'),
      category: 'quality',
      sortOrder: 1,
      isActive: true
    },
    {
      nameAr: 'شهادة CE',
      nameEn: 'CE Certificate',
      nameEs: 'Certificado CE',
      nameFr: 'Certificat CE',
      descriptionAr: 'شهادة المطابقة الأوروبية (CE) التي تؤكد أن منتجاتنا تلبي معايير الصحة والسلامة والحماية البيئية للسوق الأوروبي',
      descriptionEn: 'European Conformity (CE) certificate confirming that our products meet health, safety, and environmental protection standards for the European market',
      descriptionEs: 'Certificado de Conformidad Europea (CE) que confirma que nuestros productos cumplen con los estándares de salud, seguridad y protección ambiental para el mercado europeo',
      descriptionFr: 'Certificat de Conformité Européenne (CE) confirmant que nos produits répondent aux normes de santé, de sécurité et de protection de l\'environnement pour le marché européen',
      issuerAr: 'الاتحاد الأوروبي',
      issuerEn: 'European Union',
      issuerEs: 'Unión Europea',
      issuerFr: 'Union Européenne',
      issueDate: new Date('2023-03-20'),
      category: 'compliance',
      sortOrder: 2,
      isActive: true
    },
    {
      nameAr: 'شهادة منشأ مصرية',
      nameEn: 'Egyptian Certificate of Origin',
      nameEs: 'Certificado de Origen Egipcio',
      nameFr: 'Certificat d\'Origine Égyptien',
      descriptionAr: 'شهادة رسمية صادرة من غرفة التجارة المصرية تثبت أن الرخام والجرانيت من أصل مصري 100%',
      descriptionEn: 'Official certificate issued by the Egyptian Chamber of Commerce proving that marble and granite are 100% Egyptian origin',
      descriptionEs: 'Certificado oficial emitido por la Cámara de Comercio Egipcia que demuestra que el mármol y el granito son de origen egipcio 100%',
      descriptionFr: 'Certificat officiel émis par la Chambre de Commerce Égyptienne prouvant que le marbre et le granit sont d\'origine égyptienne à 100%',
      issuerAr: 'الغرفة التجارية المصرية',
      issuerEn: 'Egyptian Chamber of Commerce',
      issuerEs: 'Cámara de Comercio Egipcia',
      issuerFr: 'Chambre de Commerce Égyptienne',
      category: 'origin',
      sortOrder: 3,
      isActive: true
    },
    {
      nameAr: 'شهادة الأيزو 14001',
      nameEn: 'ISO 14001 Certificate',
      nameEs: 'Certificado ISO 14001',
      nameFr: 'Certificat ISO 14001',
      descriptionAr: 'شهادة نظام الإدارة البيئية ISO 14001 تؤكد التزامنا بالممارسات المستدامة وحماية البيئة في عمليات الاستخراج والإنتاج',
      descriptionEn: 'ISO 14001 Environmental Management System certificate confirming our commitment to sustainable practices and environmental protection in extraction and production operations',
      descriptionEs: 'Certificado de Sistema de Gestión Ambiental ISO 14001 que confirma nuestro compromiso con prácticas sostenibles y protección ambiental en operaciones de extracción y producción',
      descriptionFr: 'Certificat de Système de Management Environnemental ISO 14001 confirmant notre engagement envers les pratiques durables et la protection de l\'environnement dans les opérations d\'extraction et de production',
      issuerAr: 'المنظمة الدولية للمعايير',
      issuerEn: 'International Organization for Standardization',
      issuerEs: 'Organización Internacional de Normalización',
      issuerFr: 'Organisation Internationale de Normalisation',
      issueDate: new Date('2023-02-10'),
      expiryDate: new Date('2026-02-10'),
      category: 'environmental',
      sortOrder: 4,
      isActive: true
    }
  ]

  for (const cert of certificates) {
    await prisma.certificate.create({
      data: cert
    })
  }

  console.log('✅ Certificates seeded successfully')
}

seedCertificates()
  .catch((e) => {
    console.error('❌ Error seeding certificates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
