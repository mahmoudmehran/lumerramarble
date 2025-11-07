const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function moveImage() {
  try {
    // Get mission.image data for all languages
    const missionImages = await prisma.pageContent.findMany({
      where: {
        pageKey: 'about',
        sectionKey: 'mission',
        contentKey: 'image'
      }
    })

    console.log('Found mission.image records:', missionImages.length)

    // For each language, move to story.image
    for (const record of missionImages) {
      console.log(`Moving image for language: ar=${record.valueAr}, en=${record.valueEn}`)
      
      // Check if story.image already exists
      const existingStoryImage = await prisma.pageContent.findUnique({
        where: {
          pageKey_sectionKey_contentKey: {
            pageKey: 'about',
            sectionKey: 'story',
            contentKey: 'image'
          }
        }
      })

      if (existingStoryImage) {
        // Update existing
        await prisma.pageContent.update({
          where: {
            pageKey_sectionKey_contentKey: {
              pageKey: 'about',
              sectionKey: 'story',
              contentKey: 'image'
            }
          },
          data: {
            valueAr: record.valueAr,
            valueEn: record.valueEn,
            valueEs: record.valueEs,
            valueFr: record.valueFr
          }
        })
        console.log('✓ Updated story.image')
      } else {
        // Create new
        await prisma.pageContent.create({
          data: {
            pageKey: 'about',
            sectionKey: 'story',
            contentKey: 'image',
            valueAr: record.valueAr,
            valueEn: record.valueEn,
            valueEs: record.valueEs,
            valueFr: record.valueFr
          }
        })
        console.log('✓ Created story.image')
      }

      // Delete mission.image
      await prisma.pageContent.delete({
        where: {
          pageKey_sectionKey_contentKey: {
            pageKey: 'about',
            sectionKey: 'mission',
            contentKey: 'image'
          }
        }
      })
      console.log('✓ Deleted mission.image')
    }

    console.log('\n✅ Successfully moved image from mission to story!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

moveImage()
