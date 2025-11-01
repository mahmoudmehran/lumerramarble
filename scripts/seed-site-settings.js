const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedSiteSettings() {
  try {
    // Delete existing settings
    await prisma.siteSettings.deleteMany()

    // Create new settings with correct 5-color system
    const settings = await prisma.siteSettings.create({
      data: {
        // Company Information
        companyName: 'Lumerra Marble',
        companyNameAr: 'شركة لوميرا للرخام',
        description: 'Leading marble and granite export company from Egypt',
        descriptionAr: 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
        
        // Contact Information
        phone: '+20 111 312 1444',
        email: 'info@lumerramarble.com', 
        whatsapp: '+20 111 312 1444',
        address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
        addressAr: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
        
        // Social Media
        facebook: 'https://facebook.com/lumerramarble',
        instagram: 'https://instagram.com/lumerramarble',
        linkedin: 'https://linkedin.com/company/lumerramarble',
        youtube: 'https://youtube.com/@lumerramarble',
        
        // SEO
        metaTitle: 'Lumerra Marble - Premium Egyptian Marble & Granite Export',
        metaTitleAr: 'لوميرا للرخام - تصدير الرخام والجرانيت المصري الفاخر',
        metaDescription: 'Leading Egyptian company exporting premium marble, granite and quartz worldwide.',
        metaDescriptionAr: 'شركة مصرية رائدة في تصدير الرخام والجرانيت والكوارتز الفاخر عالمياً.',
        keywords: 'marble, granite, quartz, export, Egypt, natural stone',
        keywordsAr: 'رخام, جرانيت, كوارتز, تصدير, مصر, أحجار طبيعية',
        
        // Business Hours
        businessHours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
        businessHoursAr: 'الأحد - الخميس: 9:00 ص - 6:00 م',
        
        // 5-Color System - الألوان الصحيحة
        primaryColor: '#f59000',      // Orange - Headers/Footers
        secondaryColor: '#2c3e50',    // Dark Blue - Buttons/Links  
        tertiaryColor: '#27ae60',     // Green - Important Headings/Company Text
        quaternaryColor: '#34495e',   // Dark Gray - General Text
        quinaryColor: '#ecf0f1'       // Light Gray - Backgrounds
      }
    })

    console.log('✅ Site settings created:', {
      id: settings.id,
      companyName: settings.companyName,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      tertiaryColor: settings.tertiaryColor,
      quaternaryColor: settings.quaternaryColor,
      quinaryColor: settings.quinaryColor
    })

    return settings

  } catch (error) {
    console.error('❌ Error seeding site settings:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  seedSiteSettings()
    .then(() => {
      console.log('✅ Site settings seeded successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Failed to seed site settings:', error)
      process.exit(1)
    })
}

module.exports = seedSiteSettings