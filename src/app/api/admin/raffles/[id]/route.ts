import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const raffle = await prisma.raffle.findUnique({
      where: { id },
      include: {
        event: true,
        entries: {
          where: { paymentStatus: 'completed' },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!raffle) {
      return NextResponse.json({ error: 'Raffle not found' }, { status: 404 })
    }

    return NextResponse.json(raffle)
  } catch (error) {
    console.error('Failed to fetch raffle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch raffle' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const raffle = await prisma.raffle.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.ticketPrice && { ticketPrice: data.ticketPrice }),
        ...(data.maxTickets !== undefined && { maxTickets: data.maxTickets }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.winnerId !== undefined && { winnerId: data.winnerId }),
        ...(data.eventId !== undefined && { eventId: data.eventId || null }),
      },
    })

    return NextResponse.json(raffle)
  } catch (error) {
    console.error('Failed to update raffle:', error)
    return NextResponse.json(
      { error: 'Failed to update raffle' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.raffle.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete raffle:', error)
    return NextResponse.json(
      { error: 'Failed to delete raffle' },
      { status: 500 }
    )
  }
}
