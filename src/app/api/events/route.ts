import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { published: true },
      orderBy: { date: 'asc' },
      include: {
        timeframes: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
      },
    })
    return NextResponse.json(events, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
