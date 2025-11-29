const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration...')
  
  try {
    // Execute raw SQL to migrate the data
    await prisma.$executeRawUnsafe(`
      -- First, add the new ogImage column
      ALTER TABLE page_seo ADD COLUMN ogImage TEXT;
    `)
    
    console.log('Added ogImage column')
    
    await prisma.$executeRawUnsafe(`
      -- Copy data from ogImageAr to ogImage
      UPDATE page_seo 
      SET ogImage = COALESCE(ogImageAr, ogImageEn, ogImageEs, ogImageFr);
    `)
    
    console.log('Copied data to ogImage')
    
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys=off;`)
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "new_page_seo" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "pageKey" TEXT NOT NULL,
        "titleAr" TEXT,
        "titleEn" TEXT,
        "titleEs" TEXT,
        "titleFr" TEXT,
        "descriptionAr" TEXT,
        "descriptionEn" TEXT,
        "descriptionEs" TEXT,
        "descriptionFr" TEXT,
        "keywordsAr" TEXT,
        "keywordsEn" TEXT,
        "keywordsEs" TEXT,
        "keywordsFr" TEXT,
        "ogImage" TEXT,
        "schemaMarkup" TEXT,
        "canonicalUrl" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `)
    
    console.log('Created new table')
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO "new_page_seo" ("id", "pageKey", "titleAr", "titleEn", "titleEs", "titleFr", "descriptionAr", "descriptionEn", "descriptionEs", "descriptionFr", "keywordsAr", "keywordsEn", "keywordsEs", "keywordsFr", "ogImage", "schemaMarkup", "canonicalUrl", "isActive", "createdAt", "updatedAt")
      SELECT "id", "pageKey", "titleAr", "titleEn", "titleEs", "titleFr", "descriptionAr", "descriptionEn", "descriptionEs", "descriptionFr", "keywordsAr", "keywordsEn", "keywordsEs", "keywordsFr", "ogImage", "schemaMarkup", "canonicalUrl", "isActive", "createdAt", "updatedAt"
      FROM "page_seo";
    `)
    
    console.log('Copied data to new table')
    
    await prisma.$executeRawUnsafe(`DROP TABLE "page_seo";`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "new_page_seo" RENAME TO "page_seo";`)
    
    console.log('Replaced old table')
    
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "page_seo_pageKey_key" ON "page_seo"("pageKey");`)
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys=on;`)
    
    console.log('Migration completed successfully! ✅')
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
