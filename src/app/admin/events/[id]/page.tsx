import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EventForm from '@/components/admin/EventForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      timeframes: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!event) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-[#38b6c4] hover:text-[#f5a623] transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>
        <h1 className="text-3xl font-bold text-[#e0f7fa]">Edit Event</h1>
        <p className="text-[#38b6c4] mt-1">Update event details</p>
      </div>

      <EventForm event={event} />
    </div>
  )
}
