'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface EventFormProps {
  event?: {
    id: string
    title: string
    description: string
    location: string | null
    date: Date
    time: string | null
    type: string
    imageUrl: string | null
    published: boolean
    isPast: boolean
  }
}

export default function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    location: event?.location || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    time: event?.time || '',
    type: event?.type || 'Community Event',
    imageUrl: event?.imageUrl || '',
    isPast: event?.isPast || false,
    published: event?.published ?? true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = event ? `/api/admin/events/${event.id}` : '/api/admin/events'
      const method = event ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to save event')
      }

      toast.success(event ? 'Event updated!' : 'Event created!')
      router.push('/admin/events')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] resize-none"
          required
        />
      </div>

      {/* Date and Time */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            required
          />
        </div>
        <div>
          <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
            Time
          </label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="e.g., 7:00 PM - 10:00 PM"
            className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
          />
        </div>
      </div>

      {/* Location and Type */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Valley East"
            className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
          />
        </div>
        <div>
          <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
            Event Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
          >
            <option value="Community Event">Community Event</option>
            <option value="Youth Event">Youth Event</option>
            <option value="Fundraiser">Fundraiser</option>
            <option value="Food Drive">Food Drive</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-5 h-5 rounded border-[#38b6c4]/30 bg-[#1a2e2e] text-[#38b6c4] focus:ring-[#38b6c4]"
          />
          <span className="text-[#e0f7fa]">Published</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isPast"
            checked={formData.isPast}
            onChange={handleChange}
            className="w-5 h-5 rounded border-[#38b6c4]/30 bg-[#1a2e2e] text-[#38b6c4] focus:ring-[#38b6c4]"
          />
          <span className="text-[#e0f7fa]">Past Event</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {event ? 'Update Event' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg border border-[#38b6c4]/30 text-[#e0f7fa] hover:bg-[#38b6c4]/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
