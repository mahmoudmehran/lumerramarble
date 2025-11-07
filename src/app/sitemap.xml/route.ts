import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lumerramarble.com'
const LANGUAGES = ['ar', 'en', 'es', 'fr']

export async function GET() {
  try {
    // Static pages
    const staticPages = [
      '',
      'about',
      'contact',
      'products',
      'blog',
      'quote',
      'export',
    ]

    // Get all products
    const products = await prisma.product.findMany({
      where: { active: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Get all published blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Build sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
    sitemap += 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

    // Add static pages for all languages
    for (const lang of LANGUAGES) {
      for (const page of staticPages) {
        const url = page ? `${BASE_URL}/${lang}/${page}` : `${BASE_URL}/${lang}`
        
        sitemap += '  <url>\n'
        sitemap += `    <loc>${url}</loc>\n`
        
        // Add alternate language links
        for (const altLang of LANGUAGES) {
          const altUrl = page ? `${BASE_URL}/${altLang}/${page}` : `${BASE_URL}/${altLang}`
          sitemap += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />\n`
        }
        
        sitemap += '    <lastmod>' + new Date().toISOString() + '</lastmod>\n'
        sitemap += '    <changefreq>weekly</changefreq>\n'
        sitemap += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`
        sitemap += '  </url>\n'
      }
    }

    // Add product pages for all languages
    for (const product of products) {
      for (const lang of LANGUAGES) {
        const url = `${BASE_URL}/${lang}/products/${product.slug}`
        
        sitemap += '  <url>\n'
        sitemap += `    <loc>${url}</loc>\n`
        
        // Add alternate language links
        for (const altLang of LANGUAGES) {
          const altUrl = `${BASE_URL}/${altLang}/products/${product.slug}`
          sitemap += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />\n`
        }
        
        sitemap += '    <lastmod>' + product.updatedAt.toISOString() + '</lastmod>\n'
        sitemap += '    <changefreq>monthly</changefreq>\n'
        sitemap += '    <priority>0.7</priority>\n'
        sitemap += '  </url>\n'
      }
    }

    // Add blog post pages for all languages
    for (const post of blogPosts) {
      for (const lang of LANGUAGES) {
        const url = `${BASE_URL}/${lang}/blog/${post.slug}`
        
        sitemap += '  <url>\n'
        sitemap += `    <loc>${url}</loc>\n`
        
        // Add alternate language links
        for (const altLang of LANGUAGES) {
          const altUrl = `${BASE_URL}/${altLang}/blog/${post.slug}`
          sitemap += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />\n`
        }
        
        sitemap += '    <lastmod>' + post.updatedAt.toISOString() + '</lastmod>\n'
        sitemap += '    <changefreq>monthly</changefreq>\n'
        sitemap += '    <priority>0.6</priority>\n'
        sitemap += '  </url>\n'
      }
    }

    sitemap += '</urlset>'

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
