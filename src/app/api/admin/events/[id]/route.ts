import { prisma } from '@/lib/prisma'
import { getApiSession } from '@/lib/api-auth'
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
        timeframes: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to fetch event:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getApiSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    const event = await prisma.$transaction(async (tx) => {
      await tx.eventTimeframe.deleteMany({ where: { eventId: id } })
      await tx.eventImage.deleteMany({ where: { eventId: id } })

      return tx.event.update({
        where: { id },
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
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to update event:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to update event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getApiSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to delete event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
