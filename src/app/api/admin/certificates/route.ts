import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const certificate = await prisma.certificate.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameEs: body.nameEs,
        nameFr: body.nameFr,
        descriptionAr: body.descriptionAr || null,
        descriptionEn: body.descriptionEn || null,
        descriptionEs: body.descriptionEs || null,
        descriptionFr: body.descriptionFr || null,
        issuer: body.issuer || null,
        issuerAr: body.issuerAr || null,
        issuerEn: body.issuerEn || null,
        issuerEs: body.issuerEs || null,
        issuerFr: body.issuerFr || null,
        issueDate: body.issueDate ? new Date(body.issueDate) : null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        certificateUrl: body.certificateUrl || null,
        imageUrl: body.imageUrl || null,
        category: body.category || null,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    )
  }
}
