import { NextRequest, NextResponse } from 'next/server'
import { getCachedProducts } from '../../../lib/cache'

// ✅ Enable caching for API route (1 hour)
export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // ✅ Use cached products
    let products = await getCachedProducts()

    // Filter by category if needed
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category.toUpperCase())
    }

    // Filter by search if needed
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(p => 
        p.nameAr.toLowerCase().includes(searchLower) ||
        p.nameEn.toLowerCase().includes(searchLower) ||
        p.nameEs.toLowerCase().includes(searchLower) ||
        p.nameFr.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({ 
      success: true,
      products 
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
