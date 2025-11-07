import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { revalidateSettingsCache } from '../../../../lib/revalidate'
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
    
    // التحقق من role - يقبل ADMIN أو admin
    if (decoded.role !== 'ADMIN' && decoded.role !== 'admin') {
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

    console.log('🔍 Fetching settings from database...')

    // Try to get existing settings
    let settings = await prisma.siteSettings.findFirst()
    
    console.log('📊 Settings found:', settings ? 'Yes' : 'No')
    
    // If no settings exist, create default ones
    if (!settings) {
      console.log('🆕 Creating default settings...')
      settings = await prisma.siteSettings.create({
        data: {
          companyName: 'Lumerra Marble',
          companyNameAr: 'شركة لوميرا للرخام',
          phone: '+20 111 312 1444',
          email: 'info@lumerramarble.com',
          whatsapp: '+20 111 312 1444',
          address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
          addressAr: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
          primaryColor: '#f59000',
          secondaryColor: '#2c3e50',
          tertiaryColor: '#34495e',
          quaternaryColor: '#2c3e50',
          quinaryColor: '#ffffff',
        }
      })
      console.log('✅ Default settings created')
    }

    console.log('✅ Returning settings')
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('❌ Error fetching settings:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      console.log('❌ Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    console.log('📥 Received settings update:', { 
      logoUrl: body.logoUrl, 
      darkModeLogoUrl: body.darkModeLogoUrl,
      faviconUrl: body.faviconUrl 
    })
    
    const {
      companyName,
      companyNameAr,
      companyNameEs,
      companyNameFr,
      logoUrl,
      logoAlt,
      logoAltAr,
      logoAltEs,
      logoAltFr,
      darkModeLogoUrl,
      faviconUrl,
      description,
      descriptionAr,
      descriptionEs,
      descriptionFr,
      phone,
      email,
      whatsapp,
      address,
      addressAr,
      addressEs,
      addressFr,
      facebook,
      instagram,
      linkedin,
      youtube,
      metaTitle,
      metaTitleAr,
      metaTitleEs,
      metaTitleFr,
      metaDescription,
      metaDescriptionAr,
      metaDescriptionEs,
      metaDescriptionFr,
      keywords,
      keywordsAr,
      keywordsEs,
      keywordsFr,
      businessHours,
      businessHoursAr,
      businessHoursEs,
      businessHoursFr,
      footerDescriptionAr,
      footerDescriptionEn,
      footerDescriptionEs,
      footerDescriptionFr,
      primaryColor,
      secondaryColor,
      tertiaryColor,
      quaternaryColor,
      quinaryColor,
      ...otherSettings
    } = body

    // Get existing settings or create new one
    const existingSettings = await prisma.siteSettings.findFirst()
    
    console.log('🔍 Existing settings found:', existingSettings ? 'Yes' : 'No')
    
    let settings
    if (existingSettings) {
      // Update existing settings
      console.log('🔄 Updating existing settings...')
      
      settings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          companyName,
          companyNameAr,
          companyNameEs,
          companyNameFr,
          logoUrl,
          logoAlt,
          logoAltAr,
          logoAltEs,
          logoAltFr,
          darkModeLogoUrl,
          faviconUrl,
          description,
          descriptionAr,
          descriptionEs,
          descriptionFr,
          phone,
          email,
          whatsapp,
          address,
          addressAr,
          addressEs,
          addressFr,
          facebook,
          instagram,
          linkedin,
          youtube,
          metaTitle,
          metaTitleAr,
          metaTitleEs,
          metaTitleFr,
          metaDescription,
          metaDescriptionAr,
          metaDescriptionEs,
          metaDescriptionFr,
          keywords,
          keywordsAr,
          keywordsEs,
          keywordsFr,
          businessHours,
          businessHoursAr,
          businessHoursEs,
          businessHoursFr,
          footerDescriptionAr,
          footerDescriptionEn,
          footerDescriptionEs,
          footerDescriptionFr,
          primaryColor,
          secondaryColor,
          tertiaryColor,
          quaternaryColor,
          quinaryColor,
          ...otherSettings,
          updatedAt: new Date()
        }
      })
      
      console.log('✅ Settings updated successfully')
    } else {
      // Create new settings
      console.log('➕ Creating new settings...')
      
      settings = await prisma.siteSettings.create({
        data: {
          companyName,
          companyNameAr,
          companyNameEs,
          companyNameFr,
          logoUrl,
          logoAlt,
          logoAltAr,
          logoAltEs,
          logoAltFr,
          darkModeLogoUrl,
          faviconUrl,
          description,
          descriptionAr,
          descriptionEs,
          descriptionFr,
          phone,
          email,
          whatsapp,
          address,
          addressAr,
          addressEs,
          addressFr,
          facebook,
          instagram,
          linkedin,
          youtube,
          metaTitle,
          metaTitleAr,
          metaTitleEs,
          metaTitleFr,
          metaDescription,
          metaDescriptionAr,
          metaDescriptionEs,
          metaDescriptionFr,
          keywords,
          keywordsAr,
          keywordsEs,
          keywordsFr,
          businessHours,
          businessHoursAr,
          businessHoursEs,
          businessHoursFr,
          footerDescriptionAr,
          footerDescriptionEn,
          footerDescriptionEs,
          footerDescriptionFr,
          primaryColor,
          secondaryColor,
          tertiaryColor,
          quaternaryColor,
          quinaryColor,
          ...otherSettings,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      console.log('✅ Settings created successfully')
    }

    // Revalidate cache to reflect changes immediately
    await revalidateSettingsCache()

    console.log('📤 Returning response with settings')

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    })
  } catch (error) {
    console.error('💥 Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}