import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const slide = await prisma.timelineSlide.findUnique({
      where: { id },
    })

    if (!slide) {
      return NextResponse.json({ error: 'Timeline slide not found' }, { status: 404 })
    }

    return NextResponse.json(slide)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch timeline slide' }, { status: 500 })
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

    const slide = await prisma.timelineSlide.update({
      where: { id },
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        order: data.order,
      },
    })

    return NextResponse.json(slide)
  } catch {
    return NextResponse.json({ error: 'Failed to update timeline slide' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.timelineSlide.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete timeline slide' }, { status: 500 })
  }
}
