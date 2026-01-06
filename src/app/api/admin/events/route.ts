import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
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

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location || null,
        date: new Date(data.date),
        time: data.time || null,
        type: data.type || 'Community Event',
        imageUrl: data.imageUrl || null,
        published: data.published ?? true,
        isPast: data.isPast ?? false,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
