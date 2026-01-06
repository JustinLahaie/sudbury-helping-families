import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { published: true },
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
