import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RaffleForm from '@/components/admin/RaffleForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditRafflePage({ params }: PageProps) {
  const { id } = await params

  const [raffle, events] = await Promise.all([
    prisma.raffle.findUnique({
      where: { id },
    }),
    prisma.event.findMany({
      where: { isRaffle: true },
      select: { id: true, title: true },
      orderBy: { date: 'desc' },
    }),
  ])

  if (!raffle) {
    notFound()
  }

  return (
    <div>
      <Link
        href={`/admin/raffles/${id}`}
        className="inline-flex items-center gap-2 text-[#38b6c4] hover:text-[#f5a623] transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Back to Raffle
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#e0f7fa]">Edit Raffle</h1>
        <p className="text-[#38b6c4] mt-1">Update raffle details</p>
      </div>

      <RaffleForm raffle={raffle} events={events} />
    </div>
  )
}
