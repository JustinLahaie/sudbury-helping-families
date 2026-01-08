import { prisma } from '@/lib/prisma'
import RaffleForm from '@/components/admin/RaffleForm'

export default async function NewRafflePage() {
  const events = await prisma.event.findMany({
    where: { isRaffle: true },
    select: { id: true, title: true },
    orderBy: { date: 'desc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#e0f7fa]">Create New Raffle</h1>
        <p className="text-[#38b6c4] mt-1">Set up a new raffle for your community</p>
      </div>

      <RaffleForm events={events} />
    </div>
  )
}
