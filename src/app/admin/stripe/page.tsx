'use client'

import { useState, useEffect } from 'react'
import { CreditCard, CheckCircle, XCircle, ExternalLink, Copy, Check, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface Donation {
  id: string
  amount: number
  currency: string
  donorName: string | null
  donorEmail: string | null
  status: string
  createdAt: string
}

export default function StripeSetupPage() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkStripeConfig()
    fetchDonations()
  }, [])

  async function checkStripeConfig() {
    try {
      const res = await fetch('/api/stripe/status')
      const data = await res.json()
      setIsConfigured(data.configured)
    } catch {
      setIsConfigured(false)
    }
  }

  async function fetchDonations() {
    try {
      const res = await fetch('/api/admin/donations')
      if (res.ok) {
        const data = await res.json()
        setDonations(data)
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0) / 100

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#e0f7fa]">Stripe Payments</h1>
        <p className="text-[#38b6c4] mt-1 text-sm sm:text-base">Manage online donations</p>
      </div>

      {/* Status Card */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <CreditCard size={32} className="text-[#38b6c4]" />
          <div>
            <h2 className="text-xl font-bold text-[#e0f7fa]">Stripe Configuration</h2>
            {isConfigured === null ? (
              <p className="text-[#e0f7fa]/50">Checking...</p>
            ) : isConfigured ? (
              <p className="text-green-400 flex items-center gap-2">
                <CheckCircle size={16} /> Connected and ready
              </p>
            ) : (
              <p className="text-yellow-400 flex items-center gap-2">
                <XCircle size={16} /> Not configured
              </p>
            )}
          </div>
        </div>

        {!isConfigured && isConfigured !== null && (
          <div className="bg-[#1a2e2e] rounded-lg p-4 mt-4">
            <h3 className="text-[#f5a623] font-bold mb-3">Setup Instructions</h3>
            <ol className="text-[#e0f7fa]/80 space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[#38b6c4] font-bold">1.</span>
                <span>
                  Go to{' '}
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38b6c4] hover:text-[#f5a623] inline-flex items-center gap-1"
                  >
                    Stripe Dashboard <ExternalLink size={14} />
                  </a>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#38b6c4] font-bold">2.</span>
                <span>Copy your Secret Key and Publishable Key</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#38b6c4] font-bold">3.</span>
                <span>Add them to your environment variables:</span>
              </li>
            </ol>

            <div className="bg-[#0d1717] rounded p-3 mt-3 font-mono text-xs overflow-x-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#e0f7fa]/50"># .env.local</span>
                <button
                  onClick={() => copyToClipboard(`STRIPE_SECRET_KEY=sk_test_...\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`)}
                  className="text-[#38b6c4] hover:text-[#f5a623]"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-green-400">STRIPE_SECRET_KEY=sk_test_...</p>
              <p className="text-green-400">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</p>
            </div>

            <p className="text-[#e0f7fa]/50 text-xs mt-3">
              After adding the keys, restart the development server.
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4">
          <DollarSign size={24} className="text-green-400 mb-2" />
          <p className="text-2xl font-bold text-[#e0f7fa]">${totalDonations.toFixed(2)}</p>
          <p className="text-[#e0f7fa]/70 text-sm">Total Online Donations</p>
        </div>
        <div className="glass-card p-4">
          <CreditCard size={24} className="text-[#38b6c4] mb-2" />
          <p className="text-2xl font-bold text-[#e0f7fa]">{donations.length}</p>
          <p className="text-[#e0f7fa]/70 text-sm">Total Transactions</p>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-[#e0f7fa] mb-4">Recent Online Donations</h2>

        {loading ? (
          <p className="text-[#e0f7fa]/50 text-center py-8">Loading...</p>
        ) : donations.length === 0 ? (
          <p className="text-[#e0f7fa]/50 text-center py-8">
            No online donations yet. Once configured, donations will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {donations.slice(0, 10).map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#1a2e2e] gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[#e0f7fa] font-medium text-sm sm:text-base">
                    {donation.donorName || 'Anonymous'}
                  </p>
                  <p className="text-[#38b6c4] text-xs sm:text-sm">
                    {donation.donorEmail || 'No email'} • {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">
                    ${(donation.amount / 100).toFixed(2)} {donation.currency.toUpperCase()}
                  </p>
                  <span className="text-xs text-green-400/70">{donation.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Webhook Setup */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold text-[#e0f7fa] mb-4">Webhook Setup (Optional)</h2>
        <p className="text-[#e0f7fa]/70 text-sm mb-4">
          To automatically record donations, set up a webhook in your Stripe dashboard:
        </p>
        <div className="bg-[#1a2e2e] rounded-lg p-4">
          <p className="text-[#e0f7fa]/50 text-xs mb-2">Webhook URL:</p>
          <code className="text-[#38b6c4] text-sm break-all">
            https://yourdomain.com/api/webhooks/stripe
          </code>
          <p className="text-[#e0f7fa]/50 text-xs mt-3">Events to listen for:</p>
          <code className="text-green-400 text-sm">checkout.session.completed</code>
        </div>
      </div>
    </div>
  )
}
