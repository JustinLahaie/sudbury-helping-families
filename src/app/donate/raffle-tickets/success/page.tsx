'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Ticket, Home, Loader2 } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

function RaffleSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Trigger confetti on load
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38b6c4', '#f5a623', '#e0f7fa'],
      })
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 size={40} className="text-[#38b6c4] animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle size={50} className="text-green-400" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-[#e0f7fa] mb-4"
        >
          You're In!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#38b6c4] text-lg mb-8"
        >
          Your raffle ticket purchase was successful. You'll receive a confirmation
          email shortly with your ticket details.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mb-8"
        >
          <Ticket size={32} className="text-[#f5a623] mx-auto mb-4" />
          <p className="text-[#e0f7fa]/70 text-sm">
            Good luck! We'll announce the winner after the draw date.
            Thank you for supporting families in need in our community.
          </p>
        </motion.div>

        {sessionId && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[#e0f7fa]/40 text-xs mb-8"
          >
            Confirmation ID: {sessionId.slice(0, 20)}...
          </motion.p>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/donate/raffle-tickets" className="btn-primary px-6 py-3 flex items-center justify-center">
            <Ticket size={18} className="mr-2" />
            Buy More Tickets
          </Link>
          <Link href="/" className="btn-secondary px-6 py-3 flex items-center justify-center">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Loader2 size={40} className="text-[#38b6c4] animate-spin" />
    </div>
  )
}

export default function RaffleSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RaffleSuccessContent />
    </Suspense>
  )
}
