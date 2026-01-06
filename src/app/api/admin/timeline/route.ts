import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const slides = await prisma.timelineSlide.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(slides)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch timeline slides' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Get the max order to place new slide at the end
    const maxOrder = await prisma.timelineSlide.aggregate({
      _max: { order: true },
    })
    const nextOrder = (maxOrder._max.order ?? -1) + 1

    const slide = await prisma.timelineSlide.create({
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        order: data.order ?? nextOrder,
      },
    })

    return NextResponse.json(slide, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create timeline slide' }, { status: 500 })
  }
}
