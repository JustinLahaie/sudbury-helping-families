import { prisma } from '@/lib/prisma'
import { getApiSession } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sponsors = await prisma.partner.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(sponsors)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getApiSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const sponsor = await prisma.partner.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl || null,
        websiteUrl: data.websiteUrl || null,
        order: data.order ?? 0,
      },
    })

    return NextResponse.json(sponsor, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 })
  }
}
