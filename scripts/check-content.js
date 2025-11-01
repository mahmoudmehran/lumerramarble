const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking features content...\n')

  const featuresContent = await prisma.pageContent.findMany({
    where: {
      pageKey: 'homepage',
      sectionKey: 'features'
    },
    orderBy: {
      sortOrder: 'asc'
    }
  })

  if (featuresContent.length === 0) {
    console.log('❌ No features content found!')
  } else {
    console.log(`✅ Found ${featuresContent.length} features content items:\n`)
    featuresContent.forEach(item => {
      console.log(`- ${item.contentKey}:`)
      console.log(`  AR: ${item.valueAr}`)
      console.log(`  EN: ${item.valueEn}`)
      console.log('')
    })
  }

  // Check all homepage content
  const allContent = await prisma.pageContent.findMany({
    where: {
      pageKey: 'homepage'
    }
  })

  console.log(`\n📊 Total homepage content items: ${allContent.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
