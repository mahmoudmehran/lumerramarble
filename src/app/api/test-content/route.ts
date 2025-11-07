import { NextResponse } from 'next/server'
import { getContent } from '@/lib/content'

export async function GET() {
  try {
    console.log('🧪 Testing getContent...')
    
    const homepage = await getContent('homepage')
    const about = await getContent('about')
    const exportPage = await getContent('export')
    
    return NextResponse.json({
      success: true,
      homepage: {
        sections: Object.keys(homepage),
        heroTitle: homepage?.hero?.title || 'NOT FOUND'
      },
      about: {
        sections: Object.keys(about),
        heroTitle: about?.hero?.title || 'NOT FOUND'
      },
      export: {
        sections: Object.keys(exportPage),
        heroTitle: exportPage?.hero?.title || 'NOT FOUND'
      }
    })
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
