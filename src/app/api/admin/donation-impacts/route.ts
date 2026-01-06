import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const impacts = await prisma.donationImpact.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(impacts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch donation impacts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const impact = await prisma.donationImpact.create({
      data: {
        amount: data.amount,
        title: data.title,
        description: data.description,
        icon: data.icon || 'Gift',
        order: data.order || 0,
      },
    })

    return NextResponse.json(impact, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create donation impact' }, { status: 500 })
  }
}
