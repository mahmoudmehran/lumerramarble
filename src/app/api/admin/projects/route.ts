import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const project = await prisma.project.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameEs: body.nameEs,
        nameFr: body.nameFr,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionEs: body.descriptionEs,
        descriptionFr: body.descriptionFr,
        clientName: body.clientName || null,
        location: body.location || null,
        locationAr: body.locationAr || null,
        locationEn: body.locationEn || null,
        locationEs: body.locationEs || null,
        locationFr: body.locationFr || null,
        area: body.area || null,
        duration: body.duration || null,
        completionDate: body.completionDate ? new Date(body.completionDate) : null,
        category: body.category || null,
        images: body.images || null,
        featuredImage: body.featuredImage || null,
        slug: body.slug,
        featured: body.featured || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        sortOrder: body.sortOrder || 0
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
