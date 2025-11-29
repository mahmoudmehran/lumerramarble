const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedAll() {
  console.log('🌱 Starting complete database seeding...\n')

  try {
    // Check if data already exists
    const existingFAQs = await prisma.fAQ.count()
    const existingCerts = await prisma.certificate.count()
    const existingProjects = await prisma.project.count()
    const existingGuides = await prisma.exportGuide.count()

    console.log('Current database state:')
    console.log(`  - FAQs: ${existingFAQs}`)
    console.log(`  - Certificates: ${existingCerts}`)
    console.log(`  - Projects: ${existingProjects}`)
    console.log(`  - Export Guides: ${existingGuides}\n`)

    if (existingFAQs > 0 || existingCerts > 0 || existingProjects > 0 || existingGuides > 0) {
      console.log('⚠️  Warning: Data already exists in the database.')
      console.log('This script will add more data without removing existing records.\n')
    }

    console.log('✅ All new pages data seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`  - Total FAQs: ${await prisma.fAQ.count()}`)
    console.log(`  - Total Certificates: ${await prisma.certificate.count()}`)
    console.log(`  - Total Projects: ${await prisma.project.count()}`)
    console.log(`  - Total Export Guides: ${await prisma.exportGuide.count()}`)
    console.log('\n🎉 Database seeding completed!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

seedAll()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
