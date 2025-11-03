import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/settings'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    
    // إذا كان هناك محتوى مخصص في الإعدادات، استخدمه
    if (settings.robotsTxt && settings.robotsTxt.trim()) {
      return new NextResponse(settings.robotsTxt, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      })
    }
    
    // إذا لم يكن هناك محتوى مخصص، استخدم الافتراضي
    const canonicalUrl = settings.canonicalUrl || 'https://lumerramarble.com'
    const seoIndexing = settings.seoIndexing ?? true
    
    const robotsTxt = `# robots.txt for Lumerra Marble
# ${canonicalUrl}

# ${seoIndexing ? 'Allow' : 'Disallow'} all crawlers to index the site
User-agent: *
${seoIndexing ? 'Allow: /' : 'Disallow: /'}

# Disallow admin and API routes
Disallow: /admin
Disallow: /admin/
Disallow: /api/

# Disallow temporary and upload directories
Disallow: /temp/
Disallow: /uploads/

# Allow specific static files
Allow: /images/
Allow: /_next/static/
Allow: /_next/image

# Sitemap location
Sitemap: ${canonicalUrl}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1
`
    
    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    
    // Fallback to default robots.txt
    const defaultRobots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Sitemap: https://lumerramarble.com/sitemap.xml
`
    
    return new NextResponse(defaultRobots, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
