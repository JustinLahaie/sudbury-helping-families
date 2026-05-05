import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const sponsors = await prisma.partner.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(sponsors, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 })
  }
}
