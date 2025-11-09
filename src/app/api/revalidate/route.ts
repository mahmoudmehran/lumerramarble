import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * API endpoint to clear cache
 * Usage: POST /api/revalidate with body { tag: 'blog' } or { tag: 'all' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tag } = body

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag is required' },
        { status: 400 }
      )
    }

    // Revalidate specific tag or all tags
    if (tag === 'all') {
      // Clear all caches
      revalidateTag('blog')
      revalidateTag('products')
      revalidateTag('settings')
      revalidateTag('featured')
      revalidateTag('categories')
      
      return NextResponse.json({ 
        revalidated: true, 
        message: 'All caches cleared successfully',
        tags: ['blog', 'products', 'settings', 'featured', 'categories']
      })
    } else {
      // Clear specific tag
      revalidateTag(tag)
      
      return NextResponse.json({ 
        revalidated: true, 
        message: `Cache for ${tag} cleared successfully`,
        tag
      })
    }
  } catch (error) {
    console.error('Error revalidating cache:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    )
  }
}

// Allow GET request for quick cache clear
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tag = searchParams.get('tag') || 'all'

    if (tag === 'all') {
      revalidateTag('blog')
      revalidateTag('products')
      revalidateTag('settings')
      revalidateTag('featured')
      revalidateTag('categories')
      
      return NextResponse.json({ 
        revalidated: true, 
        message: 'All caches cleared successfully'
      })
    } else {
      revalidateTag(tag)
      
      return NextResponse.json({ 
        revalidated: true, 
        message: `Cache for ${tag} cleared successfully`
      })
    }
  } catch (error) {
    console.error('Error revalidating cache:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    )
  }
}
