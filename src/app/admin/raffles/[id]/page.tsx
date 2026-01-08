import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RaffleDetailClient from './RaffleDetailClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RaffleDetailPage({ params }: PageProps) {
  const { id } = await params

  const raffle = await prisma.raffle.findUnique({
    where: { id },
    include: {
      event: true,
      entries: {
        where: { paymentStatus: 'completed' },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!raffle) {
    notFound()
  }

  return <RaffleDetailClient raffle={raffle} />
}
