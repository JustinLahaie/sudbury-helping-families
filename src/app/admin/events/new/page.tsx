import EventForm from '@/components/admin/EventForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewEventPage() {
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
        <h1 className="text-3xl font-bold text-[#e0f7fa]">Create Event</h1>
        <p className="text-[#38b6c4] mt-1">Add a new event to the website</p>
      </div>

      <EventForm />
    </div>
  )
}
