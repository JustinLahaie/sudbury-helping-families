import { prisma } from '@/lib/prisma'
import { getApiSession } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const session = await getApiSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items } = await request.json()

    await Promise.all(
      items.map((item: { id: string; order: number }) =>
        prisma.partner.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to reorder sponsors' }, { status: 500 })
  }
}
