import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
      include: {
        timeframes: {
          orderBy: { order: 'asc' },
        },
      },
    })
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { timeframes, ...eventData } = data

    const event = await prisma.event.create({
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
        isRaffle: eventData.isRaffle ?? false,
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

    return NextResponse.json(event, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
