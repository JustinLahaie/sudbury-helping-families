'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Ticket, Users, Clock, Mail, Phone, Calendar, Trophy } from 'lucide-react'
import { format } from 'date-fns'
import SpinningWheel from '@/components/SpinningWheel'
import toast from 'react-hot-toast'

interface Entry {
  id: string
  name: string
  email: string
  phone: string | null
  ticketCount: number
  createdAt: Date
}

interface Raffle {
  id: string
  title: string
  description: string | null
  ticketPrice: number
  maxTickets: number | null
  startDate: Date
  endDate: Date
  isActive: boolean
  winnerId: string | null
  event: {
    id: string
    title: string
  } | null
  entries: Entry[]
}

interface Props {
  raffle: Raffle
}

export default function RaffleDetailClient({ raffle }: Props) {
  const [winner, setWinner] = useState<Entry | null>(
    raffle.winnerId ? raffle.entries.find((e) => e.id === raffle.winnerId) || null : null
  )
  const [isSaving, setIsSaving] = useState(false)

  const totalTickets = raffle.entries.reduce((sum, e) => sum + e.ticketCount, 0)
  const totalRevenue = totalTickets * raffle.ticketPrice

  const handleSelectWinner = async (entry: Entry) => {
    setWinner(entry)
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/raffles/${raffle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId: entry.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to save winner')
      }

      toast.success(`${entry.name} has been selected as the winner!`)
    } catch {
      toast.error('Failed to save winner')
    } finally {
      setIsSaving(false)
    }
  }

  const now = new Date()
  const isActive = raffle.isActive && now >= raffle.startDate && now <= raffle.endDate
  const hasEnded = now > raffle.endDate

  return (
    <div>
      <Link
        href="/admin/raffles"
        className="inline-flex items-center gap-2 text-[#38b6c4] hover:text-[#f5a623] transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Back to Raffles
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Raffle Info & Entries */}
        <div className="flex-1 space-y-6">
          {/* Raffle Header */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-[#e0f7fa]">{raffle.title}</h1>
                {raffle.description && (
                  <p className="text-[#e0f7fa]/60 mt-1">{raffle.description}</p>
                )}
                {raffle.event && (
                  <p className="text-[#38b6c4] text-sm mt-2">
                    Linked to: {raffle.event.title}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    isActive
                      ? 'bg-green-500/20 text-green-400'
                      : hasEnded
                      ? 'bg-gray-500/20 text-gray-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {isActive ? 'Active' : hasEnded ? 'Ended' : 'Upcoming'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1a2e2e] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#38b6c4] mb-1">
                  <Ticket size={16} />
                  <span className="text-sm">Tickets Sold</span>
                </div>
                <p className="text-2xl font-bold text-[#e0f7fa]">{totalTickets}</p>
              </div>
              <div className="bg-[#1a2e2e] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#38b6c4] mb-1">
                  <Users size={16} />
                  <span className="text-sm">Participants</span>
                </div>
                <p className="text-2xl font-bold text-[#e0f7fa]">{raffle.entries.length}</p>
              </div>
              <div className="bg-[#1a2e2e] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#f5a623] mb-1">
                  <span className="text-sm">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-[#f5a623]">
                  ${(totalRevenue / 100).toFixed(2)}
                </p>
              </div>
              <div className="bg-[#1a2e2e] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#38b6c4] mb-1">
                  <Clock size={16} />
                  <span className="text-sm">Draw Date</span>
                </div>
                <p className="text-lg font-bold text-[#e0f7fa]">
                  {format(new Date(raffle.endDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Winner Display */}
          {winner && (
            <div className="glass-card p-6 border-[#f5a623]/30">
              <div className="flex items-center gap-3 mb-4">
                <Trophy size={24} className="text-[#f5a623]" />
                <h2 className="text-xl font-bold text-[#e0f7fa]">Winner</h2>
              </div>
              <div className="bg-[#f5a623]/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-[#f5a623] mb-2">{winner.name}</p>
                <div className="flex flex-wrap gap-4 text-[#e0f7fa]/70 text-sm">
                  <span className="flex items-center gap-1">
                    <Mail size={14} />
                    {winner.email}
                  </span>
                  {winner.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={14} />
                      {winner.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Ticket size={14} />
                    {winner.ticketCount} ticket{winner.ticketCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Entries List */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-[#e0f7fa] mb-4">
              All Entries ({raffle.entries.length})
            </h2>

            {raffle.entries.length === 0 ? (
              <div className="text-center py-8">
                <Ticket size={40} className="mx-auto text-[#38b6c4]/50 mb-3" />
                <p className="text-[#e0f7fa]/60">No entries yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {raffle.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`bg-[#1a2e2e] rounded-xl p-4 ${
                      winner?.id === entry.id ? 'ring-2 ring-[#f5a623]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#e0f7fa] font-medium">{entry.name}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-[#e0f7fa]/60">
                          <span className="flex items-center gap-1">
                            <Mail size={12} />
                            {entry.email}
                          </span>
                          {entry.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} />
                              {entry.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-sm bg-[#38b6c4]/20 text-[#38b6c4]">
                          {entry.ticketCount} ticket{entry.ticketCount !== 1 ? 's' : ''}
                        </span>
                        <p className="text-[#e0f7fa]/40 text-xs mt-2 flex items-center justify-end gap-1">
                          <Calendar size={10} />
                          {format(new Date(entry.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Spinning Wheel */}
        <div className="lg:w-[450px]">
          <div className="glass-card p-6 sticky top-4">
            <h2 className="text-xl font-bold text-[#e0f7fa] mb-6 text-center">
              Draw Winner
            </h2>

            <SpinningWheel
              entries={raffle.entries.map((e) => ({
                id: e.id,
                name: e.name,
                ticketCount: e.ticketCount,
              }))}
              onSelectWinner={(entry) => {
                const fullEntry = raffle.entries.find((e) => e.id === entry.id)
                if (fullEntry) {
                  handleSelectWinner(fullEntry)
                }
              }}
            />

            {isSaving && (
              <p className="text-center text-[#38b6c4] text-sm mt-4">
                Saving winner...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
