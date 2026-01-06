'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#1a2e2e] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.jpg"
            alt="SAHFIN Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#e0f7fa] text-center mb-2">
          Admin Login
        </h1>
        <p className="text-[#38b6c4] text-center mb-8">
          Sudbury and Area Helping Families in Need
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 border border-red-500/30"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#38b6c4]"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-10 py-3 text-[#e0f7fa] placeholder-[#38b6c4]/50 focus:outline-none focus:border-[#38b6c4] focus:ring-1 focus:ring-[#38b6c4] transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#38b6c4]"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-10 py-3 text-[#e0f7fa] placeholder-[#38b6c4]/50 focus:outline-none focus:border-[#38b6c4] focus:ring-1 focus:ring-[#38b6c4] transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
