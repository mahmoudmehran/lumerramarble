const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function analyzeExportPage() {
  try {
    console.log('📊 تحليل صفحة خدمات التصدير...\n')

    // الحقول المطلوبة في الصفحة
    const requiredFields = [
      // Hero Section (3 حقول)
      { section: 'hero', key: 'title' },
      { section: 'hero', key: 'subtitle' },
      { section: 'hero', key: 'backgroundImage' },
      
      // Services Section (2 + 36 حقل = 38)
      { section: 'services', key: 'title' },
      { section: 'services', key: 'subtitle' },
      // 6 خدمات × 6 حقول (title, description, image)
      { section: 'services', key: 'consultation_title' },
      { section: 'services', key: 'consultation_description' },
      { section: 'services', key: 'consultation_image' },
      { section: 'services', key: 'packaging_title' },
      { section: 'services', key: 'packaging_description' },
      { section: 'services', key: 'packaging_image' },
      { section: 'services', key: 'shipping_title' },
      { section: 'services', key: 'shipping_description' },
      { section: 'services', key: 'shipping_image' },
      { section: 'services', key: 'quality_title' },
      { section: 'services', key: 'quality_description' },
      { section: 'services', key: 'quality_image' },
      { section: 'services', key: 'delivery_title' },
      { section: 'services', key: 'delivery_description' },
      { section: 'services', key: 'delivery_image' },
      { section: 'services', key: 'aftersales_title' },
      { section: 'services', key: 'aftersales_description' },
      { section: 'services', key: 'aftersales_image' },
      
      // Process Section (2 + 36 حقل = 38)
      { section: 'process', key: 'title' },
      { section: 'process', key: 'subtitle' },
      // 6 خطوات × 6 حقول (number, title, description, image)
      { section: 'process', key: 'step1_number' },
      { section: 'process', key: 'step1_title' },
      { section: 'process', key: 'step1_description' },
      { section: 'process', key: 'step1_image' },
      { section: 'process', key: 'step2_number' },
      { section: 'process', key: 'step2_title' },
      { section: 'process', key: 'step2_description' },
      { section: 'process', key: 'step2_image' },
      { section: 'process', key: 'step3_number' },
      { section: 'process', key: 'step3_title' },
      { section: 'process', key: 'step3_description' },
      { section: 'process', key: 'step3_image' },
      { section: 'process', key: 'step4_number' },
      { section: 'process', key: 'step4_title' },
      { section: 'process', key: 'step4_description' },
      { section: 'process', key: 'step4_image' },
      { section: 'process', key: 'step5_number' },
      { section: 'process', key: 'step5_title' },
      { section: 'process', key: 'step5_description' },
      { section: 'process', key: 'step5_image' },
      { section: 'process', key: 'step6_number' },
      { section: 'process', key: 'step6_title' },
      { section: 'process', key: 'step6_description' },
      { section: 'process', key: 'step6_image' },
      
      // Countries Section (2 + 18 حقل = 20)
      { section: 'countries', key: 'title' },
      { section: 'countries', key: 'subtitle' },
      // 6 مناطق × 3 حقول (name, count, image)
      { section: 'countries', key: 'europe_name' },
      { section: 'countries', key: 'europe_count' },
      { section: 'countries', key: 'europe_image' },
      { section: 'countries', key: 'asia_name' },
      { section: 'countries', key: 'asia_count' },
      { section: 'countries', key: 'asia_image' },
      { section: 'countries', key: 'northamerica_name' },
      { section: 'countries', key: 'northamerica_count' },
      { section: 'countries', key: 'northamerica_image' },
      { section: 'countries', key: 'southamerica_name' },
      { section: 'countries', key: 'southamerica_count' },
      { section: 'countries', key: 'southamerica_image' },
      { section: 'countries', key: 'africa_name' },
      { section: 'countries', key: 'africa_count' },
      { section: 'countries', key: 'africa_image' },
      { section: 'countries', key: 'oceania_name' },
      { section: 'countries', key: 'oceania_count' },
      { section: 'countries', key: 'oceania_image' },
      
      // Features Section (1 + 12 حقل = 13)
      { section: 'features', key: 'title' },
      // 6 مميزات × 2 حقول (text, image)
      { section: 'features', key: 'feature1_text' },
      { section: 'features', key: 'feature1_image' },
      { section: 'features', key: 'feature2_text' },
      { section: 'features', key: 'feature2_image' },
      { section: 'features', key: 'feature3_text' },
      { section: 'features', key: 'feature3_image' },
      { section: 'features', key: 'feature4_text' },
      { section: 'features', key: 'feature4_image' },
      { section: 'features', key: 'feature5_text' },
      { section: 'features', key: 'feature5_image' },
      { section: 'features', key: 'feature6_text' },
      { section: 'features', key: 'feature6_image' },
      
      // Stats Section (4 × 2 = 8 حقول)
      { section: 'stats', key: 'countries_number' },
      { section: 'stats', key: 'countries_text' },
      { section: 'stats', key: 'shipments_number' },
      { section: 'stats', key: 'shipments_text' },
      { section: 'stats', key: 'experience_number' },
      { section: 'stats', key: 'experience_text' },
      { section: 'stats', key: 'satisfaction_number' },
      { section: 'stats', key: 'satisfaction_text' },
      
      // CTA Section (3 حقول)
      { section: 'cta', key: 'title' },
      { section: 'cta', key: 'subtitle' },
      { section: 'cta', key: 'buttonText' }
    ]

    // جلب الحقول الموجودة
    const existingFields = await prisma.pageContent.findMany({
      where: { pageKey: 'export' },
      select: { sectionKey: true, contentKey: true }
    })

    const existingSet = new Set(
      existingFields.map(f => `${f.sectionKey}.${f.contentKey}`)
    )

    const existing = []
    const missing = []

    for (const field of requiredFields) {
      const key = `${field.section}.${field.key}`
      if (existingSet.has(key)) {
        existing.push(key)
      } else {
        missing.push(key)
      }
    }

    console.log(`📊 الإحصائيات:`)
    console.log(`   - المطلوب: ${requiredFields.length} حقل`)
    console.log(`   - موجود: ${existing.length} حقل`)
    console.log(`   - ناقص: ${missing.length} حقل\n`)

    if (existing.length > 0) {
      console.log(`✅ الحقول الموجودة (${existing.length}):`)
      const sections = {}
      existing.forEach(key => {
        const section = key.split('.')[0]
        sections[section] = (sections[section] || 0) + 1
      })
      Object.entries(sections).forEach(([section, count]) => {
        console.log(`   - ${section}: ${count} حقل`)
      })
      console.log()
    }

    if (missing.length > 0) {
      console.log(`❌ الحقول الناقصة (${missing.length}):`)
      const sections = {}
      missing.forEach(key => {
        const section = key.split('.')[0]
        if (!sections[section]) sections[section] = []
        sections[section].push(key.split('.')[1])
      })
      Object.entries(sections).forEach(([section, keys]) => {
        console.log(`   - ${section}: ${keys.length} حقل`)
        keys.slice(0, 5).forEach(key => console.log(`     • ${key}`))
        if (keys.length > 5) console.log(`     ... و ${keys.length - 5} حقل آخر`)
      })
    }

    console.log(`\n📝 ملخص الأقسام:`)
    console.log(`   - Hero: 3 حقول (title, subtitle, backgroundImage)`)
    console.log(`   - Services: 20 حقل (title, subtitle + 6 خدمات × 3)`)
    console.log(`   - Process: 26 حقل (title, subtitle + 6 خطوات × 4)`)
    console.log(`   - Countries: 20 حقل (title, subtitle + 6 مناطق × 3)`)
    console.log(`   - Features: 13 حقل (title + 6 مميزات × 2)`)
    console.log(`   - Stats: 8 حقول (4 إحصائيات × 2)`)
    console.log(`   - CTA: 3 حقول (title, subtitle, buttonText)`)
    console.log(`   - المجموع: ${requiredFields.length} حقل`)

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeExportPage()
