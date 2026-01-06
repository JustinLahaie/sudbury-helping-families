import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Calendar, Pencil } from 'lucide-react'
import DeleteEventButton from '@/components/admin/DeleteEventButton'

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#e0f7fa]">Events</h1>
          <p className="text-[#38b6c4] mt-1">Manage upcoming and past events</p>
        </div>
        <Link href="/admin/events/new" className="btn-accent flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={18} />
          Add Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Calendar size={48} className="mx-auto text-[#38b6c4]/50 mb-4" />
          <p className="text-[#e0f7fa]/70 mb-4">No events yet</p>
          <Link href="/admin/events/new" className="btn-primary">
            Create your first event
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
          {events.map((event) => (
            <div key={event.id} className="glass-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[#e0f7fa] font-medium truncate">{event.title}</p>
                  {event.location && (
                    <p className="text-[#38b6c4] text-sm truncate">{event.location}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-2">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="p-2 rounded-lg hover:bg-[#38b6c4]/20 text-[#38b6c4] transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </Link>
                  <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#e0f7fa]/70 text-sm">
                  {new Date(event.date).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="px-2 py-1 rounded text-xs bg-[#38b6c4]/20 text-[#38b6c4]">
                  {event.type}
                </span>
                {event.isPast && (
                  <span className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400">
                    Past
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    event.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {event.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#38b6c4]/20">
                  <th className="text-left p-4 text-[#38b6c4] font-medium">Event</th>
                  <th className="text-left p-4 text-[#38b6c4] font-medium">Date</th>
                  <th className="text-left p-4 text-[#38b6c4] font-medium">Type</th>
                  <th className="text-left p-4 text-[#38b6c4] font-medium">Status</th>
                  <th className="text-right p-4 text-[#38b6c4] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-[#38b6c4]/10 hover:bg-[#38b6c4]/5 transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-[#e0f7fa] font-medium">{event.title}</p>
                      {event.location && (
                        <p className="text-[#38b6c4] text-sm">{event.location}</p>
                      )}
                    </td>
                    <td className="p-4 text-[#e0f7fa]/70">
                      {new Date(event.date).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs bg-[#38b6c4]/20 text-[#38b6c4]">
                        {event.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {event.isPast && (
                          <span className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400">
                            Past
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            event.published
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {event.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="p-2 rounded-lg hover:bg-[#38b6c4]/20 text-[#38b6c4] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
    </div>
  )
}
