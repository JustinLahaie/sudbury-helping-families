'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Heart, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function DonationSuccessPage() {
  useEffect(() => {
    // Celebrate with confetti!
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#38b6c4', '#f5a623', '#e0f7fa'],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#38b6c4', '#f5a623', '#e0f7fa'],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 py-12 px-6 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle size={56} className="text-green-400" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-[#e0f7fa] mb-4"
        >
          Thank You!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#38b6c4] text-lg mb-8"
        >
          Your generous donation will help families in need in the Sudbury area.
          Together, we are making a difference in our community.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-[#f5a623] mb-2">
            <Heart size={20} className="fill-current" />
            <span className="font-bold">Your impact matters</span>
          </div>
          <p className="text-[#e0f7fa]/70 text-sm">
            100% of your donation goes directly to helping families with food,
            essentials, and emergency support.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            href="/donate"
            className="btn-accent flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Donate Again
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
