const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function analyzeAboutPage() {
  try {
    console.log('📊 تحليل محتوى صفحة "عن الشركة"\n')
    console.log('='  .repeat(60))

    // جلب جميع محتويات صفحة about
    const aboutContent = await prisma.pageContent.findMany({
      where: {
        pageKey: 'about'
      },
      orderBy: [
        { sectionKey: 'asc' },
        { contentKey: 'asc' }
      ]
    })

    // تجميع حسب القسم
    const sections = {}
    aboutContent.forEach(item => {
      if (!sections[item.sectionKey]) {
        sections[item.sectionKey] = []
      }
      sections[item.sectionKey].push(item.contentKey)
    })

    console.log('\n✅ الأقسام الموجودة في قاعدة البيانات:\n')
    for (const section in sections) {
      console.log(`📁 ${section}:`)
      sections[section].forEach(key => {
        console.log(`   - ${key}`)
      })
      console.log('')
    }

    // المحتوى المطلوب من الصفحة
    const requiredContent = {
      hero: ['title', 'subtitle', 'backgroundImage'],
      story: ['title', 'content'],
      mission: ['title', 'vision', 'mission', 'image'],
      values: [
        'title',
        // 6 قيم
        'quality_title', 'quality_description',
        'trust_title', 'trust_description',
        'global_title', 'global_description',
        'service_title', 'service_description',
        'precision_title', 'precision_description',
        'passion_title', 'passion_description'
      ],
      location: ['title', 'address', 'description', 'image'],
      stats: [
        'title',
        'experience_number', 'experience_text',
        'countries_number', 'countries_text',
        'projects_number', 'projects_text',
        'satisfaction_number', 'satisfaction_text'
      ]
    }

    console.log('\n' + '='.repeat(60))
    console.log('📋 مقارنة المحتوى المطلوب مع الموجود:\n')

    let totalRequired = 0
    let totalExisting = 0
    let missingFields = []

    for (const section in requiredContent) {
      const required = requiredContent[section]
      const existing = sections[section] || []
      
      totalRequired += required.length

      console.log(`\n🔍 ${section}:`)
      console.log(`   مطلوب: ${required.length} حقل`)
      console.log(`   موجود: ${existing.length} حقل`)

      const missing = required.filter(field => !existing.includes(field))
      if (missing.length > 0) {
        console.log(`   ❌ ناقص: ${missing.length} حقل`)
        missing.forEach(field => {
          console.log(`      - ${field}`)
          missingFields.push({ section, field })
        })
      } else {
        console.log(`   ✅ كامل`)
      }

      totalExisting += existing.length
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n📊 الملخص النهائي:\n')
    console.log(`   المطلوب: ${totalRequired} حقل`)
    console.log(`   الموجود: ${totalExisting} حقل`)
    console.log(`   الناقص: ${totalRequired - totalExisting} حقل`)
    
    if (missingFields.length > 0) {
      console.log(`\n❌ الحقول المفقودة (${missingFields.length}):`)
      missingFields.forEach(({ section, field }) => {
        console.log(`   - ${section}.${field}`)
      })
    } else {
      console.log('\n✅ جميع الحقول موجودة!')
    }

    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeAboutPage()
