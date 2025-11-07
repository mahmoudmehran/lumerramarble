const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function analyzeHomepageContent() {
  try {
    console.log('📊 محتوى الصفحة الرئيسية في قاعدة البيانات:\n')
    
    const homepage = await prisma.pageContent.findMany({
      where: { pageKey: 'homepage' },
      orderBy: [
        { sectionKey: 'asc' },
        { contentKey: 'asc' }
      ]
    })
    
    // تجميع حسب القسم
    const sections = {}
    homepage.forEach(item => {
      if (!sections[item.sectionKey]) {
        sections[item.sectionKey] = []
      }
      sections[item.sectionKey].push(item.contentKey)
    })
    
    console.log('الأقسام الموجودة:')
    for (const section in sections) {
      console.log(`\n${section}:`)
      sections[section].forEach(key => {
        console.log(`  - ${key}`)
      })
    }
    
    console.log('\n\n=== ما هو مطلوب في الصفحة ===')
    const required = {
      hero: ['title', 'subtitle', 'primaryButton', 'secondaryButton', 'backgroundImage'],
      stats: ['title', 'clients_number', 'clients_text', 'projects_number', 'projects_text', 'countries_number', 'countries_text', 'satisfaction_number', 'satisfaction_text'],
      categories: ['title', 'subtitle'],
      features: ['title', 'quality_title', 'quality_description', 'global_title', 'global_description', 'service_title', 'service_description', 'experience_title', 'experience_description'],
      cta: ['title', 'subtitle', 'button']
    }
    
    console.log('\nمقارنة:')
    for (const section in required) {
      const existing = sections[section] || []
      const missing = required[section].filter(key => !existing.includes(key))
      
      if (missing.length > 0) {
        console.log(`\n❌ ${section}: ناقص ${missing.length} حقل`)
        missing.forEach(key => console.log(`   - ${key}`))
      } else {
        console.log(`\n✅ ${section}: كامل`)
      }
    }
    
  } catch (error) {
    console.error('خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeHomepageContent()
