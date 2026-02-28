import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id, published: true },
    include: {
      timeframes: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!event) {
    notFound()
  }

  const date = new Date(event.date)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-[#38b6c4] hover:text-[#e0f7fa] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        {/* Event Card */}
        <div className="glass-card overflow-hidden">
          {/* Image */}
          {event.imageUrl && (
            <div className="relative w-full h-72 md:h-96 bg-black/20">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-contain"
              />
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* Type Badge */}
            <span className="inline-block px-3 py-1 rounded-full bg-[#38b6c4]/20 text-[#38b6c4] text-xs font-medium mb-4">
              {event.type}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#e0f7fa] mb-6">
              {event.title}
            </h1>

            {/* Date, Time, Location */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-[#f5a623]">
                <Calendar size={18} />
                <span>{formattedDate}</span>
              </div>

              {event.time && (
                <div className="flex items-center gap-2 text-[#38b6c4]">
                  <Clock size={18} />
                  <span>{event.time}</span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-2 text-[#38b6c4]">
                  <MapPin size={18} />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-[#e0f7fa]/80 text-lg leading-relaxed mb-8 whitespace-pre-line">
              {event.description}
            </div>

            {/* Timeframes */}
            {event.timeframes.length > 0 && (
              <div className="border-t border-[#38b6c4]/20 pt-8">
                <h2 className="text-xl font-bold text-[#e0f7fa] mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-[#f5a623]" />
                  Schedule
                </h2>
                <div className="space-y-3">
                  {event.timeframes.map((tf) => (
                    <div
                      key={tf.id}
                      className="flex items-start gap-4 bg-[#1a2e2e]/50 rounded-lg px-4 py-3 border border-[#38b6c4]/10"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[#e0f7fa] font-semibold">{tf.title}</span>
                          <span className="text-[#38b6c4] text-sm">
                            {tf.startTime} - {tf.endTime}
                          </span>
                        </div>
                        {tf.description && (
                          <p className="text-[#e0f7fa]/60 text-sm mt-1">{tf.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
