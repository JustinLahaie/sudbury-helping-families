import TimelineForm from '@/components/admin/TimelineForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewTimelinePage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/timeline"
          className="inline-flex items-center gap-2 text-[#38b6c4] hover:text-[#f5a623] transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          Back to Timeline
        </Link>
        <h1 className="text-3xl font-bold text-[#e0f7fa]">Create Timeline Slide</h1>
        <p className="text-[#38b6c4] mt-1">Add a new moment to your timeline</p>
      </div>

      <TimelineForm />
    </div>
  )
}
