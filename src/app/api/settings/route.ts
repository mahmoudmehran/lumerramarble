import { NextRequest, NextResponse } from 'next/server'
import { getCachedSettings } from '../../../lib/cache'

/**
 * Public API endpoint for site settings
 * This endpoint is for frontend consumption (no authentication required)
 * For admin operations, use /api/admin/settings
 */

// Enable caching for API route (1 hour)
export const revalidate = 3600

// GET endpoint for public settings (no authentication required)
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching settings from cache...')
    // Use cached settings
    const settings = await getCachedSettings()

    console.log('Settings fetched successfully from cache')
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching public settings:', error)
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
