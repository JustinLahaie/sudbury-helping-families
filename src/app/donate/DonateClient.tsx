'use client'

import { motion } from 'framer-motion'
import { Heart, Copy, Check, ShoppingBag, Pizza, Backpack, Gift, Home, Users, Utensils, LucideIcon, CreditCard, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Impact {
  id: string
  amount: string
  title: string
  description: string
  icon: string
  order: number
}

interface Props {
  impacts: Impact[]
}

const iconMap: Record<string, LucideIcon> = {
  Pizza,
  ShoppingBag,
  Backpack,
  Gift,
  Heart,
  Home,
  Users,
  Utensils,
}

const DONATION_AMOUNTS = [
  { amount: 2500, label: '$25' },
  { amount: 5000, label: '$50' },
  { amount: 10000, label: '$100' },
  { amount: 25000, label: '$250' },
]

export default function DonateClient({ impacts }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stripeConfigured, setStripeConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if Stripe is configured
    fetch('/api/stripe/status')
      .then(res => res.json())
      .then(data => setStripeConfigured(data.configured))
      .catch(() => setStripeConfigured(false))
  }, [])

  const handleDonate = async () => {
    if (!selectedAmount && !customAmount) {
      toast.error('Please select or enter an amount')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          customAmount: customAmount || undefined,
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
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast.success(`${label} copied to clipboard!`)
    setTimeout(() => setCopied(null), 2000)
  }

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Gift
  }

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f5a623]/20 flex items-center justify-center"
          >
            <Heart size={40} className="text-[#f5a623]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e0f7fa] mb-4">Make a Difference</h1>
          <p className="text-[#38b6c4] text-lg max-w-2xl mx-auto">
            Every donation helps us provide direct support to families and individuals
            in our community during times of hardship.
          </p>
        </motion.div>

        {/* Impact Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-8 text-center">What Your Donation Provides</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {impacts.map((item, index) => {
              const Icon = getIcon(item.icon)
              return (
                <motion.div
                  key={item.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#38b6c4]/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-[#38b6c4]" />
                    </div>
                    <div>
                      <span className="text-[#f5a623] font-bold text-lg">{item.amount}</span>
                      <h3 className="text-[#e0f7fa] font-semibold mt-1">{item.title}</h3>
                      <p className="text-[#e0f7fa]/60 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Credit Card Donation */}
        {stripeConfigured && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-8 md:p-10 mb-12 border-[#38b6c4]/30"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <CreditCard size={28} className="text-[#38b6c4]" />
              <h2 className="text-2xl font-bold text-[#e0f7fa]">Donate with Card</h2>
            </div>

            <div className="max-w-md mx-auto">
              {/* Amount Selection */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {DONATION_AMOUNTS.map((item) => (
                  <button
                    key={item.amount}
                    onClick={() => {
                      setSelectedAmount(item.amount)
                      setCustomAmount('')
                    }}
                    className={`py-3 px-4 rounded-xl font-bold transition-all ${
                      selectedAmount === item.amount
                        ? 'bg-[#38b6c4] text-white'
                        : 'bg-[#1a2e2e] text-[#e0f7fa] hover:bg-[#38b6c4]/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#e0f7fa]/50 font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                    className="w-full bg-[#1a2e2e] text-[#e0f7fa] rounded-xl py-3 pl-8 pr-4 placeholder:text-[#e0f7fa]/30 focus:outline-none focus:ring-2 focus:ring-[#38b6c4]"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                disabled={isLoading || (!selectedAmount && !customAmount)}
                className="w-full btn-accent py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart size={20} />
                    Donate {selectedAmount ? DONATION_AMOUNTS.find(a => a.amount === selectedAmount)?.label : customAmount ? `$${customAmount}` : ''}
                  </>
                )}
              </button>

              <p className="text-center text-[#e0f7fa]/50 text-xs mt-4">
                Secure payment powered by Stripe
              </p>
            </div>
          </motion.div>
        )}

        {/* Divider */}
        {stripeConfigured && (
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-[#38b6c4]/20"></div>
            <span className="text-[#e0f7fa]/50 text-sm">or</span>
            <div className="flex-1 h-px bg-[#38b6c4]/20"></div>
          </div>
        )}

        {/* E-Transfer Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 md:p-10 mb-12 border-[#f5a623]/30"
        >
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-6 text-center">Donate via E-Transfer</h2>

          <div className="space-y-4 max-w-md mx-auto">
            {/* Email */}
            <div className="bg-[#1a2e2e] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[#38b6c4]/70 text-sm">Email</p>
                <p className="text-[#e0f7fa] font-mono">sudburyhelpingfamilies@hotmail.com</p>
              </div>
              <button
                onClick={() => copyToClipboard('sudburyhelpingfamilies@hotmail.com', 'Email')}
                className="p-2 rounded-lg bg-[#38b6c4]/20 hover:bg-[#38b6c4]/30 transition-colors"
              >
                {copied === 'Email' ? (
                  <Check size={20} className="text-green-400" />
                ) : (
                  <Copy size={20} className="text-[#38b6c4]" />
                )}
              </button>
            </div>

            {/* Password */}
            <div className="bg-[#1a2e2e] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[#38b6c4]/70 text-sm">Password</p>
                <p className="text-[#e0f7fa] font-mono">Charity</p>
              </div>
              <button
                onClick={() => copyToClipboard('Charity', 'Password')}
                className="p-2 rounded-lg bg-[#38b6c4]/20 hover:bg-[#38b6c4]/30 transition-colors"
              >
                {copied === 'Password' ? (
                  <Check size={20} className="text-green-400" />
                ) : (
                  <Copy size={20} className="text-[#38b6c4]" />
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-[#e0f7fa]/60 text-sm mt-6">
            Please include your name in the message if you would like to be acknowledged.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {[
            { value: '12+', label: 'Years Active' },
            { value: '200+', label: 'Families Helped' },
            { value: '100%', label: 'Goes to Community' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-[#f5a623]">{stat.value}</p>
              <p className="text-[#e0f7fa]/60 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 text-center"
        >
          <p className="text-[#e0f7fa]/70 text-sm">
            <span className="text-[#f5a623]">Please note:</span> At this time, we are not a registered
            charity and are unable to issue tax receipts. Every dollar goes directly to helping
            families in our community.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
