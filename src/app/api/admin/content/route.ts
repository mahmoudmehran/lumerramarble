import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidateContentCache } from '@/lib/revalidate'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pageKey = url.searchParams.get('page') || 'homepage'
    
    const contentRows = await prisma.pageContent.findMany({
      where: { pageKey },
      orderBy: [
        { sectionKey: 'asc' },
        { contentKey: 'asc' }
      ]
    })

    // تحويل البيانات للشكل المطلوب
    const content: any = {}
    contentRows.forEach(row => {
      if (!content[row.sectionKey]) {
        content[row.sectionKey] = {}
      }
      content[row.sectionKey][row.contentKey] = {
        ar: row.valueAr || '',
        en: row.valueEn || '',
        es: row.valueEs || '',
        fr: row.valueFr || ''
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageKey, sectionKey, contentKey, ...translations } = body

    const content = await prisma.pageContent.upsert({
      where: {
        pageKey_sectionKey_contentKey: {
          pageKey,
          sectionKey,
          contentKey
        }
      },
      update: translations,
      create: {
        pageKey,
        sectionKey,
        contentKey,
        ...translations
      }
    })

    // Revalidate content cache
    await revalidateContentCache()

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const url = new URL(request.url)
    const pageKey = url.searchParams.get('page') || 'homepage'

    // إذا كان الـ body يحتوي على pageKey, sectionKey, contentKey (تحديث عنصر واحد)
    if (body.pageKey && body.sectionKey && body.contentKey) {
      const { sectionKey, contentKey, ar, en, es, fr } = body
      
      const content = await prisma.pageContent.upsert({
        where: {
          pageKey_sectionKey_contentKey: {
            pageKey: body.pageKey,
            sectionKey,
            contentKey
          }
        },
        update: {
          valueAr: ar || '',
          valueEn: en || '',
          valueEs: es || '',
          valueFr: fr || ''
        },
        create: {
          pageKey: body.pageKey,
          sectionKey,
          contentKey,
          valueAr: ar || '',
          valueEn: en || '',
          valueEs: es || '',
          valueFr: fr || ''
        }
      })

      await revalidateContentCache()
      return NextResponse.json(content)
    }

    // إذا كان الـ body يحتوي على كل المحتوى (تحديث متعدد)
    const updates = []
    for (const [sectionKey, sectionContent] of Object.entries(body)) {
      if (typeof sectionContent === 'object' && sectionContent !== null) {
        for (const [contentKey, values] of Object.entries(sectionContent as Record<string, any>)) {
          if (typeof values === 'object' && values !== null) {
            const langs = values as { ar?: string; en?: string; es?: string; fr?: string }
            updates.push(
              prisma.pageContent.upsert({
                where: {
                  pageKey_sectionKey_contentKey: {
                    pageKey,
                    sectionKey,
                    contentKey
                  }
                },
                update: {
                  valueAr: langs.ar || '',
                  valueEn: langs.en || '',
                  valueEs: langs.es || '',
                  valueFr: langs.fr || ''
                },
                create: {
                  pageKey,
                  sectionKey,
                  contentKey,
                  valueAr: langs.ar || '',
                  valueEn: langs.en || '',
                  valueEs: langs.es || '',
                  valueFr: langs.fr || ''
                }
              })
            )
          }
        }
      }
    }

    await Promise.all(updates)
    await revalidateContentCache()

    return NextResponse.json({ success: true, updated: updates.length })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
