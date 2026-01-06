import { prisma } from '@/lib/prisma'
import { Calendar, Image, Settings, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [eventCount, timelineCount, settingsCount, donationSetting] = await Promise.all([
    prisma.event.count(),
    prisma.timelineSlide.count(),
    prisma.siteSetting.count(),
    prisma.siteSetting.findUnique({ where: { key: 'total_donations' } }),
  ])

  const totalDonations = donationSetting?.value || '0'

  const stats = [
    {
      label: 'Total Donations',
      count: `$${Number(totalDonations).toLocaleString()}`,
      icon: DollarSign,
      href: '/admin/settings',
      color: '#22c55e',
    },
    {
      label: 'Events',
      count: eventCount,
      icon: Calendar,
      href: '/admin/events',
      color: '#38b6c4',
    },
    {
      label: 'Timeline Slides',
      count: timelineCount,
      icon: Image,
      href: '/admin/timeline',
      color: '#f5a623',
    },
    {
      label: 'Site Settings',
      count: settingsCount,
      icon: Settings,
      href: '/admin/settings',
      color: '#38b6c4',
    },
  ]

  const recentEvents = await prisma.event.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#e0f7fa]">Dashboard</h1>
        <p className="text-[#38b6c4] mt-1 text-sm sm:text-base">Welcome to the SAHFIN admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass-card p-4 sm:p-6 hover:scale-105 transition-transform group"
          >
            <stat.icon
              className="mb-2 sm:mb-4 group-hover:scale-110 transition-transform"
              size={24}
              style={{ color: stat.color }}
            />
            <p className="text-xl sm:text-3xl font-bold text-[#e0f7fa]">{stat.count}</p>
            <p className="text-[#e0f7fa]/70 text-xs sm:text-base">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#e0f7fa] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 sm:gap-4">
          <Link href="/admin/events/new" className="btn-accent text-center">
            + New Event
          </Link>
          <Link href="/admin/timeline/new" className="btn-primary text-center">
            + New Timeline Slide
          </Link>
          <Link href="/admin/settings" className="btn-primary text-center">
            Edit Site Settings
          </Link>
        </div>
      </div>

      {/* Recent Events */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#e0f7fa]">Recent Events</h2>
          <Link href="/admin/events" className="text-[#38b6c4] hover:text-[#f5a623] text-sm">
            View all
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <p className="text-[#e0f7fa]/50 text-center py-8">
            No events yet. Create your first event!
          </p>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                href={`/admin/events/${event.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-[#1a2e2e] hover:bg-[#38b6c4]/10 transition-colors gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[#e0f7fa] font-medium text-sm sm:text-base truncate">{event.title}</p>
                  <p className="text-[#38b6c4] text-xs sm:text-sm">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs flex-shrink-0 ${
                    event.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {event.published ? 'Published' : 'Draft'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
