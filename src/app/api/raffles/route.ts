import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const now = new Date()

    // Show active raffles that haven't ended yet (including upcoming ones)
    const raffles = await prisma.raffle.findMany({
      where: {
        isActive: true,
        endDate: { gte: now },
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            time: true,
            imageUrl: true,
            isRaffle: true,
          },
        },
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json(raffles, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    console.error('Failed to fetch raffles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch raffles' },
      { status: 500 }
    )
  }
}
