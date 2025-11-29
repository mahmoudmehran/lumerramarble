import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameEs: body.nameEs,
        nameFr: body.nameFr,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionEs: body.descriptionEs,
        descriptionFr: body.descriptionFr,
        clientName: body.clientName,
        location: body.location,
        locationAr: body.locationAr,
        locationEn: body.locationEn,
        locationEs: body.locationEs,
        locationFr: body.locationFr,
        area: body.area,
        duration: body.duration,
        completionDate: body.completionDate ? new Date(body.completionDate) : null,
        category: body.category,
        images: body.images,
        featuredImage: body.featuredImage,
        slug: body.slug,
        featured: body.featured,
        isActive: body.isActive,
        sortOrder: body.sortOrder
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
