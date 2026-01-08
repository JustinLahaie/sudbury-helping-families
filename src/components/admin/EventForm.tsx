'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2, Clock, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import DatePicker from '@/components/ui/DatePicker'
import TimePicker from '@/components/ui/TimePicker'
import ImageUpload from '@/components/admin/ImageUpload'

interface Timeframe {
  id?: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  order: number
}

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
    isRaffle: boolean
    timeframes?: Timeframe[]
  }
}

// Parse time range string like "7:00 PM - 10:00 PM" into start and end times
const parseTimeRange = (timeStr: string | null) => {
  if (!timeStr) return { startTime: '', endTime: '' }
  const parts = timeStr.split(' - ')
  if (parts.length === 2) {
    return { startTime: parts[0].trim(), endTime: parts[1].trim() }
  }
  return { startTime: timeStr.trim(), endTime: '' }
}

export default function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const parsedTime = parseTimeRange(event?.time || null)
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    location: event?.location || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    startTime: parsedTime.startTime,
    endTime: parsedTime.endTime,
    type: event?.type || 'Community Event',
    imageUrl: event?.imageUrl || '',
    isPast: event?.isPast || false,
    isRaffle: event?.isRaffle || false,
    published: event?.published ?? true,
  })
  const [timeframes, setTimeframes] = useState<Timeframe[]>(
    event?.timeframes || []
  )

  const addTimeframe = () => {
    setTimeframes([
      ...timeframes,
      {
        title: '',
        description: null,
        startTime: '',
        endTime: '',
        order: timeframes.length,
      },
    ])
  }

  const removeTimeframe = (index: number) => {
    setTimeframes(timeframes.filter((_, i) => i !== index))
  }

  const updateTimeframe = (index: number, field: keyof Timeframe, value: string) => {
    setTimeframes(
      timeframes.map((tf, i) =>
        i === index ? { ...tf, [field]: field === 'description' && value === '' ? null : value } : tf
      )
    )
  }

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

      // Combine start and end time into single time string
      const time = formData.startTime
        ? formData.endTime
          ? `${formData.startTime} - ${formData.endTime}`
          : formData.startTime
        : ''

      const { startTime: _startTime, endTime: _endTime, ...restFormData } = formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...restFormData, time, timeframes }),
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

      {/* Date */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
          Date *
        </label>
        <DatePicker
          value={formData.date}
          onChange={(value) => setFormData((prev) => ({ ...prev, date: value }))}
          placeholder="Select event date"
          required
        />
      </div>

      {/* Time Range */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
          Time
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="block text-[#e0f7fa]/60 text-xs mb-1">Start Time</span>
            <TimePicker
              value={formData.startTime}
              onChange={(value) => setFormData((prev) => ({ ...prev, startTime: value }))}
              placeholder="Start time"
            />
          </div>
          <div>
            <span className="block text-[#e0f7fa]/60 text-xs mb-1">End Time</span>
            <TimePicker
              value={formData.endTime}
              onChange={(value) => setFormData((prev) => ({ ...prev, endTime: value }))}
              placeholder="End time"
            />
          </div>
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
            <option value="Raffle">Raffle</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Thumbnail Image */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium flex items-center gap-2">
          <ImageIcon size={16} className="text-[#f5a623]" />
          Event Thumbnail
        </label>
        <p className="text-[#e0f7fa]/60 text-sm mb-3">
          Add an image to display with this event (optional)
        </p>
        <ImageUpload
          value={formData.imageUrl || null}
          onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url || '' }))}
        />
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
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isRaffle"
            checked={formData.isRaffle}
            onChange={handleChange}
            className="w-5 h-5 rounded border-[#f5a623]/30 bg-[#1a2e2e] text-[#f5a623] focus:ring-[#f5a623]"
          />
          <span className="text-[#e0f7fa]">Raffle Event</span>
        </label>
      </div>

      {formData.isRaffle && (
        <div className="bg-[#f5a623]/10 border border-[#f5a623]/30 rounded-lg p-4">
          <p className="text-[#f5a623] text-sm">
            This event can be linked to a raffle. After creating the event, go to
            <span className="font-semibold"> Admin → Raffles </span>
            to create a raffle and link it to this event.
          </p>
        </div>
      )}

      {/* Timeframes Section */}
      <div className="border-t border-[#38b6c4]/20 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[#f5a623]" />
            <h3 className="text-lg font-medium text-[#e0f7fa]">Event Timeframes</h3>
          </div>
          <button
            type="button"
            onClick={addTimeframe}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#38b6c4]/20 text-[#38b6c4] hover:bg-[#38b6c4]/30 transition-colors text-sm"
          >
            <Plus size={16} />
            Add Timeframe
          </button>
        </div>
        <p className="text-[#e0f7fa]/60 text-sm mb-4">
          Add multiple time slots for events with different sessions (e.g., Toddler Dance 4-5pm, Teen Dance 6-8pm)
        </p>

        {timeframes.length === 0 ? (
          <div className="text-center py-6 text-[#e0f7fa]/50 border border-dashed border-[#38b6c4]/20 rounded-lg">
            No timeframes added. Use the general time field above or add specific timeframes.
          </div>
        ) : (
          <div className="space-y-4">
            {timeframes.map((tf, index) => (
              <div
                key={index}
                className="bg-[#1a2e2e]/50 border border-[#38b6c4]/20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#f5a623] font-medium">
                    Timeframe {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTimeframe(index)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mb-3">
                  <label className="block text-[#e0f7fa]/70 mb-1 text-xs">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={tf.title}
                    onChange={(e) => updateTimeframe(index, 'title', e.target.value)}
                    placeholder="e.g., Toddler Dance"
                    className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[#38b6c4]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[#e0f7fa]/70 mb-1 text-xs">
                      Start Time *
                    </label>
                    <TimePicker
                      value={tf.startTime}
                      onChange={(value) => updateTimeframe(index, 'startTime', value)}
                      placeholder="Start"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#e0f7fa]/70 mb-1 text-xs">
                      End Time *
                    </label>
                    <TimePicker
                      value={tf.endTime}
                      onChange={(value) => updateTimeframe(index, 'endTime', value)}
                      placeholder="End"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#e0f7fa]/70 mb-1 text-xs">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={tf.description || ''}
                    onChange={(e) => updateTimeframe(index, 'description', e.target.value)}
                    placeholder="e.g., Ages 2-5, parents welcome"
                    className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[#38b6c4]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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
