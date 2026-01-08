import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const raffles = await prisma.raffle.findMany({
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        entries: {
          where: { paymentStatus: 'completed' },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(raffles)
  } catch (error) {
    console.error('Failed to fetch raffles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch raffles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const raffle = await prisma.raffle.create({
      data: {
        title: data.title,
        description: data.description || null,
        ticketPrice: data.ticketPrice || 500,
        maxTickets: data.maxTickets || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive ?? true,
        eventId: data.eventId || null,
      },
    })

    return NextResponse.json(raffle)
  } catch (error) {
    console.error('Failed to create raffle:', error)
    return NextResponse.json(
      { error: 'Failed to create raffle' },
      { status: 500 }
    )
  }
}
