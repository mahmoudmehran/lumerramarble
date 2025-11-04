import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'

/**
 * PATCH - Update message status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['NEW', 'READ', 'REPLIED', 'CLOSED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update message
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        status,
        readAt: status !== 'NEW' && !await prisma.contactMessage.findUnique({
          where: { id },
          select: { readAt: true }
        }).then(m => m?.readAt) ? new Date() : undefined
      }
    })

    return NextResponse.json({
      success: true,
      message: updatedMessage
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete a message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete message
    await prisma.contactMessage.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
