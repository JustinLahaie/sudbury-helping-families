'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface Event {
  id: string
  title: string
}

interface RaffleFormProps {
  events: Event[]
  raffle?: {
    id: string
    title: string
    description: string | null
    ticketPrice: number
    maxTickets: number | null
    startDate: Date
    endDate: Date
    isActive: boolean
    eventId: string | null
  }
}

export default function RaffleForm({ events, raffle }: RaffleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: raffle?.title || '',
    description: raffle?.description || '',
    ticketPrice: raffle ? raffle.ticketPrice / 100 : 5,
    maxTickets: raffle?.maxTickets || '',
    startDate: raffle ? new Date(raffle.startDate).toISOString().split('T')[0] : '',
    endDate: raffle ? new Date(raffle.endDate).toISOString().split('T')[0] : '',
    isActive: raffle?.isActive ?? true,
    eventId: raffle?.eventId || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = raffle ? `/api/admin/raffles/${raffle.id}` : '/api/admin/raffles'
      const method = raffle ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          ticketPrice: Math.round(formData.ticketPrice * 100),
          maxTickets: formData.maxTickets ? parseInt(formData.maxTickets.toString()) : null,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive,
          eventId: formData.eventId || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save raffle')
      }

      toast.success(raffle ? 'Raffle updated!' : 'Raffle created!')
      router.push('/admin/raffles')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-[#e0f7fa]/70 mb-2">
            Title <span className="text-[#f5a623]">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
            placeholder="e.g., Holiday Raffle 2024"
          />
        </div>

        <div>
          <label className="block text-sm text-[#e0f7fa]/70 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4] resize-none"
            placeholder="Describe the prizes and rules..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-[#e0f7fa]/70 mb-2">
              Ticket Price (CAD) <span className="text-[#f5a623]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#e0f7fa]/50">$</span>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#e0f7fa]/70 mb-2">
              Max Tickets (optional)
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxTickets}
              onChange={(e) => setFormData({ ...formData, maxTickets: e.target.value })}
              className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
              placeholder="Unlimited"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-[#e0f7fa]/70 mb-2">
              Start Date <span className="text-[#f5a623]">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#e0f7fa]/70 mb-2">
              End Date (Draw Date) <span className="text-[#f5a623]">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
            />
          </div>
        </div>

        {events.length > 0 && (
          <div>
            <label className="block text-sm text-[#e0f7fa]/70 mb-2">
              Link to Event (optional)
            </label>
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
            >
              <option value="">No linked event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 rounded bg-[#1a2e2e] border-[#38b6c4]/30 text-[#38b6c4] focus:ring-[#38b6c4]"
          />
          <label htmlFor="isActive" className="text-[#e0f7fa]/70">
            Active (visible to public)
          </label>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-accent flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            raffle ? 'Update Raffle' : 'Create Raffle'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary px-6 py-3"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
