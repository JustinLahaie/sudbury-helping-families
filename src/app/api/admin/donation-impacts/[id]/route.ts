import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const impact = await prisma.donationImpact.findUnique({
      where: { id },
    })

    if (!impact) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(impact)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch donation impact' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const impact = await prisma.donationImpact.update({
      where: { id },
      data: {
        amount: data.amount,
        title: data.title,
        description: data.description,
        icon: data.icon,
        order: data.order,
      },
    })

    return NextResponse.json(impact)
  } catch {
    return NextResponse.json({ error: 'Failed to update donation impact' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.donationImpact.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete donation impact' }, { status: 500 })
  }
}
