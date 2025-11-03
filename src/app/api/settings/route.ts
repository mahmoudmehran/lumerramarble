import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

/**
 * Public API endpoint for site settings
 * This endpoint is for frontend consumption (no authentication required)
 * For admin operations, use /api/admin/settings
 */

// GET endpoint for public settings (no authentication required)
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Attempting to fetch settings from database...')
    const settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      console.log('⚠️ No settings found in database, returning defaults')
      return NextResponse.json({ 
        settings: {
          companyName: 'Lumerra Marble',
          companyNameAr: 'شركة لوميرا للرخام',
          description: 'Leading marble and granite export company from Egypt',
          descriptionAr: 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
          phone: '+20 111 312 1444',
          email: 'info@lumerramarble.com',
          whatsapp: '+20 111 312 1444', 
          address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
          addressAr: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
          facebook: 'https://facebook.com/lumerramarble',
          instagram: 'https://instagram.com/lumerramarble',
          linkedin: 'https://linkedin.com/company/lumerramarble',
          youtube: 'https://youtube.com/@lumerramarble',
          metaTitle: 'Lumerra Marble - Premium Egyptian Marble & Granite Export',
          metaTitleAr: 'لوميرا للرخام - تصدير الرخام والجرانيت المصري الفاخر',
          metaDescription: 'Leading Egyptian company exporting premium marble, granite and quartz worldwide.',
          metaDescriptionAr: 'شركة مصرية رائدة في تصدير الرخام والجرانيت والكوارتز الفاخر عالمياً.',
          keywords: 'marble, granite, quartz, export, Egypt, natural stone',
          keywordsAr: 'رخام, جرانيت, كوارتز, تصدير, مصر, أحجار طبيعية',
          businessHours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
          businessHoursAr: 'الأحد - الخميس: 9:00 ص - 6:00 م',
          primaryColor: '#f59000',
          secondaryColor: '#2c3e50',
          tertiaryColor: '#27ae60',
          quaternaryColor: '#34495e',
          quinaryColor: '#ecf0f1'
        }
      })
    }

    console.log('✅ Settings found and returned successfully')
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('❌ Error fetching public settings:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      settings: {
        companyName: 'Lumerra Marble',
        companyNameAr: 'شركة لوميرا للرخام',
        primaryColor: '#f59000',
        secondaryColor: '#2c3e50',
        tertiaryColor: '#27ae60',
        quaternaryColor: '#34495e',
        quinaryColor: '#ecf0f1'
      }
    }, { status: 500 })
  }
}