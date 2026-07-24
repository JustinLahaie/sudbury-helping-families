import { prisma } from '@/lib/prisma'
import { getApiSession } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
      include: {
        timeframes: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
      },
    })
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getApiSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { timeframes, images, ...eventData } = data
    const imageUrls: string[] = Array.isArray(images) ? images.filter(Boolean) : []
    const coverUrl = eventData.imageUrl || imageUrls[0] || null

    if (!eventData.title || !eventData.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const parsedDate = new Date(eventData.date)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'A valid date is required' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location || null,
        date: parsedDate,
        time: eventData.time || null,
        type: eventData.type || 'Community Event',
        imageUrl: coverUrl,
        published: eventData.published ?? true,
        isPast: eventData.isPast ?? false,
        isRaffle: eventData.isRaffle ?? false,
        timeframes: timeframes?.length > 0 ? {
          create: timeframes.map((tf: { title: string; description: string | null; startTime: string; endTime: string }, index: number) => ({
            title: tf.title,
            description: tf.description || null,
            startTime: tf.startTime,
            endTime: tf.endTime,
            order: index,
          })),
        } : undefined,
        images: imageUrls.length > 0 ? {
          create: imageUrls.map((url, index) => ({ url, order: index })),
        } : undefined,
      },
      include: {
        timeframes: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
