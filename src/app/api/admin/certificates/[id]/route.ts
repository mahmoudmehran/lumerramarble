import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const certificate = await prisma.certificate.update({
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
        issuer: body.issuer,
        issuerAr: body.issuerAr,
        issuerEn: body.issuerEn,
        issuerEs: body.issuerEs,
        issuerFr: body.issuerFr,
        issueDate: body.issueDate ? new Date(body.issueDate) : null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        certificateUrl: body.certificateUrl,
        imageUrl: body.imageUrl,
        category: body.category,
        sortOrder: body.sortOrder,
        isActive: body.isActive
      }
    })

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Error updating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to update certificate' },
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
    await prisma.certificate.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting certificate:', error)
    return NextResponse.json(
      { error: 'Failed to delete certificate' },
      { status: 500 }
    )
  }
}
