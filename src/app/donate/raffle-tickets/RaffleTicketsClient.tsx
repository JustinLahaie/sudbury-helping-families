'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Clock, Users, Loader2, X, Minus, Plus, AlertCircle, ChevronLeft, MapPin, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface Raffle {
  id: string
  title: string
  description: string | null
  ticketPrice: number
  maxTickets: number | null
  startDate: string
  endDate: string
  event: {
    id: string
    title: string
    description: string
    date: string
    location: string | null
    time: string | null
    imageUrl: string | null
    isRaffle: boolean
  } | null
  _count: {
    entries: number
  }
}

export default function RaffleTicketsClient() {
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketCount: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchRaffles()
  }, [])

  const fetchRaffles = async () => {
    try {
      const response = await fetch('/api/raffles')
      const data = await response.json()
      setRaffles(data)
    } catch (error) {
      console.error('Failed to fetch raffles:', error)
      toast.error('Failed to load raffles')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRaffle) return

    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/raffles/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raffleId: selectedRaffle.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const isRaffleStarted = (startDate: string) => {
    return new Date(startDate) <= new Date()
  }

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return 'Ended'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`
    return `${hours} hour${hours > 1 ? 's' : ''} left`
  }

  const getTimeUntilStart = (startDate: string) => {
    const start = new Date(startDate)
    const now = new Date()
    const diff = start.getTime() - now.getTime()

    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`
    return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 size={40} className="text-[#38b6c4] animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 text-[#38b6c4] hover:text-[#f5a623] transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          Back to Donate
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f5a623]/20 flex items-center justify-center"
          >
            <Ticket size={40} className="text-[#f5a623]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e0f7fa] mb-4">Raffle Tickets</h1>
          <p className="text-[#38b6c4] text-lg max-w-2xl mx-auto">
            Purchase raffle tickets for a chance to win amazing prizes while supporting
            families in need in our community.
          </p>
        </motion.div>

        {/* Active Raffles */}
        {raffles.length === 0 ? (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <AlertCircle size={48} className="text-[#38b6c4]/50 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#e0f7fa] mb-2">No Active Raffles</h2>
            <p className="text-[#e0f7fa]/60">
              Check back soon for upcoming raffle opportunities!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {raffles.map((raffle, index) => {
              const isEventRaffle = raffle.event?.isRaffle
              return (
                <motion.div
                  key={raffle.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card overflow-hidden"
                >
                  {/* Event Image Banner for Raffle Events */}
                  {isEventRaffle && raffle.event?.imageUrl && (
                    <div className="relative w-full h-48 md:h-64">
                      <Image
                        src={raffle.event.imageUrl}
                        alt={raffle.event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e2e] via-[#1a2e2e]/50 to-transparent" />
                      <div className="absolute bottom-4 left-6 right-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#f5a623]/90 text-[#1a2e2e] text-xs font-bold mb-2">
                          RAFFLE EVENT
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#e0f7fa]">
                          {raffle.event.title}
                        </h2>
                      </div>
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    {/* Event Details for Raffle Events */}
                    {isEventRaffle && raffle.event && (
                      <div className="mb-6 pb-6 border-b border-[#38b6c4]/20">
                        {!raffle.event.imageUrl && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-[#f5a623]/20 text-[#f5a623] text-xs font-bold">
                              RAFFLE EVENT
                            </span>
                            {!isRaffleStarted(raffle.startDate) && (
                              <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                                Coming Soon
                              </span>
                            )}
                          </div>
                        )}
                        {!raffle.event.imageUrl && (
                          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-2">{raffle.event.title}</h2>
                        )}
                        <p className="text-[#e0f7fa]/70 mb-4">{raffle.event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-[#38b6c4]">
                            <Calendar size={16} />
                            <span>{format(new Date(raffle.event.date), 'MMMM d, yyyy')}</span>
                          </div>
                          {raffle.event.time && (
                            <div className="flex items-center gap-2 text-[#38b6c4]">
                              <Clock size={16} />
                              <span>{raffle.event.time}</span>
                            </div>
                          )}
                          {raffle.event.location && (
                            <div className="flex items-center gap-2 text-[#38b6c4]">
                              <MapPin size={16} />
                              <span>{raffle.event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Raffle Details */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3">
                          <Ticket size={20} className="text-[#f5a623]" />
                          <h3 className={`font-bold text-[#e0f7fa] ${isEventRaffle ? 'text-lg' : 'text-2xl'}`}>
                            {raffle.title}
                          </h3>
                          {!isEventRaffle && !isRaffleStarted(raffle.startDate) && (
                            <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        {raffle.description && (
                          <p className="text-[#e0f7fa]/60 mt-1 ml-7">{raffle.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        {!isRaffleStarted(raffle.startDate) ? (
                          <div className="flex items-center gap-2 text-blue-400">
                            <Clock size={16} />
                            <span>{getTimeUntilStart(raffle.startDate)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#f5a623]">
                            <Clock size={16} />
                            <span>{getTimeRemaining(raffle.endDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[#38b6c4]">
                          <Users size={16} />
                          <span>{raffle._count.entries} entries</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#1a2e2e] rounded-xl">
                      <div>
                        <p className="text-[#e0f7fa]/60 text-sm">Ticket Price</p>
                        <p className="text-2xl font-bold text-[#f5a623]">
                          {formatPrice(raffle.ticketPrice)}
                        </p>
                      </div>
                      <div className="text-sm text-[#e0f7fa]/60">
                        {!isRaffleStarted(raffle.startDate) && (
                          <p className="text-blue-400">Starts: {format(new Date(raffle.startDate), 'MMM d, yyyy')}</p>
                        )}
                        <p>Draw Date: {format(new Date(raffle.endDate), 'MMM d, yyyy')}</p>
                        {raffle.maxTickets && (
                          <p className="text-[#38b6c4]">
                            Limited to {raffle.maxTickets} tickets
                          </p>
                        )}
                      </div>
                      {isRaffleStarted(raffle.startDate) ? (
                        <button
                          onClick={() => {
                            setSelectedRaffle(raffle)
                            setFormData({ name: '', email: '', phone: '', ticketCount: 1 })
                          }}
                          className="btn-accent px-6 py-3"
                        >
                          Buy Tickets
                        </button>
                      ) : (
                        <div className="px-6 py-3 rounded-lg bg-[#38b6c4]/10 text-[#38b6c4] text-center">
                          Available {format(new Date(raffle.startDate), 'MMM d')}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Purchase Modal */}
        <AnimatePresence>
          {selectedRaffle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRaffle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-6 md:p-8 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#e0f7fa]">
                    Buy Raffle Tickets
                  </h3>
                  <button
                    onClick={() => setSelectedRaffle(null)}
                    className="p-2 text-[#e0f7fa]/60 hover:text-[#e0f7fa] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-[#38b6c4] mb-6">{selectedRaffle.title}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#e0f7fa]/70 mb-1">
                      Name <span className="text-[#f5a623]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#e0f7fa]/70 mb-1">
                      Email <span className="text-[#f5a623]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#e0f7fa]/70 mb-1">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
                      placeholder="705-555-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#e0f7fa]/70 mb-1">
                      Number of Tickets
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            ticketCount: Math.max(1, formData.ticketCount - 1),
                          })
                        }
                        className="p-2 bg-[#1a2e2e] rounded-lg hover:bg-[#38b6c4]/20 transition-colors"
                      >
                        <Minus size={20} className="text-[#38b6c4]" />
                      </button>
                      <span className="text-2xl font-bold text-[#e0f7fa] min-w-[60px] text-center">
                        {formData.ticketCount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            ticketCount: formData.ticketCount + 1,
                          })
                        }
                        className="p-2 bg-[#1a2e2e] rounded-lg hover:bg-[#38b6c4]/20 transition-colors"
                      >
                        <Plus size={20} className="text-[#38b6c4]" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#38b6c4]/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#e0f7fa]/70">Total</span>
                      <span className="text-2xl font-bold text-[#f5a623]">
                        {formatPrice(selectedRaffle.ticketPrice * formData.ticketCount)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-accent py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Ticket size={20} />
                          Purchase Tickets
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-center text-[#e0f7fa]/50 text-xs mt-4">
                  Secure payment powered by Stripe
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
