import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        timeframes: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    const { timeframes, ...eventData } = data

    // Delete existing timeframes and create new ones
    await prisma.eventTimeframe.deleteMany({
      where: { eventId: id },
    })

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location || null,
        date: new Date(eventData.date),
        time: eventData.time || null,
        type: eventData.type || 'Community Event',
        imageUrl: eventData.imageUrl || null,
        published: eventData.published ?? true,
        isPast: eventData.isPast ?? false,
        timeframes: timeframes?.length > 0 ? {
          create: timeframes.map((tf: { title: string; description: string; startTime: string; endTime: string }, index: number) => ({
            title: tf.title,
            description: tf.description || null,
            startTime: tf.startTime,
            endTime: tf.endTime,
            order: index,
          })),
        } : undefined,
      },
      include: {
        timeframes: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
