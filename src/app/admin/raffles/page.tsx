import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Ticket, Pencil, Users, Clock } from 'lucide-react'
import DeleteRaffleButton from '@/components/admin/DeleteRaffleButton'
import { format } from 'date-fns'

export default async function RafflesPage() {
  const raffles = await prisma.raffle.findMany({
    include: {
      event: {
        select: { id: true, title: true },
      },
      _count: {
        select: { entries: true },
      },
      entries: {
        where: { paymentStatus: 'completed' },
        select: { ticketCount: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const getRaffleStatus = (raffle: typeof raffles[0]) => {
    const now = new Date()
    if (!raffle.isActive) return { label: 'Inactive', color: 'gray' }
    if (now < raffle.startDate) return { label: 'Upcoming', color: 'blue' }
    if (now > raffle.endDate) return { label: 'Ended', color: 'gray' }
    return { label: 'Active', color: 'green' }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#e0f7fa]">Raffles</h1>
          <p className="text-[#38b6c4] mt-1">Manage raffles and view entries</p>
        </div>
        <Link href="/admin/raffles/new" className="btn-accent flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={18} />
          Create Raffle
        </Link>
      </div>

      {raffles.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Ticket size={48} className="mx-auto text-[#38b6c4]/50 mb-4" />
          <p className="text-[#e0f7fa]/70 mb-4">No raffles yet</p>
          <Link href="/admin/raffles/new" className="btn-primary">
            Create your first raffle
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {raffles.map((raffle) => {
            const status = getRaffleStatus(raffle)
            const totalTickets = raffle.entries.reduce((sum, e) => sum + e.ticketCount, 0)

            return (
              <div key={raffle.id} className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-[#e0f7fa]">{raffle.title}</h2>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          status.color === 'green'
                            ? 'bg-green-500/20 text-green-400'
                            : status.color === 'blue'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {status.label}
                      </span>
                      {raffle.winnerId && (
                        <span className="px-2 py-1 rounded text-xs bg-[#f5a623]/20 text-[#f5a623]">
                          Winner Drawn
                        </span>
                      )}
                    </div>
                    {raffle.description && (
                      <p className="text-[#e0f7fa]/60 text-sm mb-2">{raffle.description}</p>
                    )}
                    {raffle.event && (
                      <p className="text-[#38b6c4] text-sm">
                        Linked to: {raffle.event.title}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-[#e0f7fa]/70">
                      <Users size={16} />
                      <span>{totalTickets} ticket{totalTickets !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#e0f7fa]/70">
                      <Clock size={16} />
                      <span className="text-sm">
                        {format(new Date(raffle.startDate), 'MMM d')} - {format(new Date(raffle.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="text-[#f5a623] font-bold">
                      ${(raffle.ticketPrice / 100).toFixed(2)}/ticket
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#38b6c4]/20">
                  <Link
                    href={`/admin/raffles/${raffle.id}`}
                    className="px-4 py-2 rounded-lg bg-[#38b6c4]/20 text-[#38b6c4] hover:bg-[#38b6c4]/30 transition-colors flex items-center gap-2"
                  >
                    <Users size={16} />
                    View Entries & Draw
                  </Link>
                  <Link
                    href={`/admin/raffles/${raffle.id}/edit`}
                    className="p-2 rounded-lg hover:bg-[#38b6c4]/20 text-[#38b6c4] transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </Link>
                  <DeleteRaffleButton raffleId={raffle.id} raffleTitle={raffle.title} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
