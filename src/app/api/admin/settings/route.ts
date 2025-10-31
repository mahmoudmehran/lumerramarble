import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import jwt from 'jsonwebtoken'

/**
 * Admin API endpoint for site settings management
 * Requires authentication token
 * For public access to settings, use /api/settings
 */

// Type definition for theme settings
interface ThemeSettings {
  id?: string
  companyName?: string
  companyNameAr?: string
  description?: string
  descriptionAr?: string
  phone?: string
  email?: string
  whatsapp?: string
  address?: string
  addressAr?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  metaTitle?: string
  metaTitleAr?: string
  metaDescription?: string
  metaDescriptionAr?: string
  keywords?: string
  keywordsAr?: string
  businessHours?: string
  businessHoursAr?: string
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  quaternaryColor?: string
  quinaryColor?: string
  backgroundColors?: {
    light: string
    dark: string
  }
  textColors?: {
    primary: string
    secondary: string
    muted: string
  }
  fontFamily?: {
    arabic: string
    latin: string
  }
  borderRadius?: string
  shadows?: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// Verify admin authentication
function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      role: string
      userId: string
      email: string
    }
    
    if (decoded.role !== 'admin') {
      return null
    }

    return decoded
  } catch {
    return null
  }
}

// GET - Retrieve current settings
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to get existing settings
    let settings = await prisma.siteSettings.findFirst()
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
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
          metaDescription: 'Leading Egyptian company exporting premium marble, granite and quartz worldwide. High quality natural stones for construction and decoration.',
          metaDescriptionAr: 'شركة مصرية رائدة في تصدير الرخام والجرانيت والكوارتز الفاخر عالمياً. أحجار طبيعية عالية الجودة للبناء والديكور.',
          keywords: 'marble, granite, quartz, export, Egypt, natural stone',
          keywordsAr: 'رخام, جرانيت, كوارتز, تصدير, مصر, أحجار طبيعية',
          businessHours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
          businessHoursAr: 'الأحد - الخميس: 9:00 ص - 6:00 م',
          primaryColor: '#f59000',
          secondaryColor: '#2c3e50',
          tertiaryColor: '#34495e',
          quaternaryColor: '#2c3e50',
          quinaryColor: '#ffffff',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      companyName,
      companyNameAr,
      description,
      descriptionAr,
      phone,
      email,
      whatsapp,
      address,
      addressAr,
      facebook,
      instagram,
      linkedin,
      youtube,
      metaTitle,
      metaTitleAr,
      metaDescription,
      metaDescriptionAr,
      keywords,
      keywordsAr,
      businessHours,
      businessHoursAr,
      primaryColor,
      secondaryColor,
      tertiaryColor,
      quaternaryColor,
      quinaryColor
    } = body

    // Get existing settings or create new one
    const existingSettings = await prisma.siteSettings.findFirst()
    
    let settings
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          companyName,
          companyNameAr,
          description,
          descriptionAr,
          phone,
          email,
          whatsapp,
          address,
          addressAr,
          facebook,
          instagram,
          linkedin,
          youtube,
          metaTitle,
          metaTitleAr,
          metaDescription,
          metaDescriptionAr,
          keywords,
          keywordsAr,
          businessHours,
          businessHoursAr,
          primaryColor,
          secondaryColor,
          tertiaryColor,
          quaternaryColor,
          quinaryColor,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new settings
      settings = await prisma.siteSettings.create({
        data: {
          companyName,
          companyNameAr,
          description,
          descriptionAr,
          phone,
          email,
          whatsapp,
          address,
          addressAr,
          facebook,
          instagram,
          linkedin,
          youtube,
          metaTitle,
          metaTitleAr,
          metaDescription,
          metaDescriptionAr,
          keywords,
          keywordsAr,
          businessHours,
          businessHoursAr,
          primaryColor,
          secondaryColor,
          tertiaryColor,
          quaternaryColor,
          quinaryColor,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}