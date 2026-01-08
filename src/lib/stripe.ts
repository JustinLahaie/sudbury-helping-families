import Stripe from 'stripe'

// Use a placeholder key during build if not set
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'production') {
  console.warn('STRIPE_SECRET_KEY is not set - Stripe functionality will not work')
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

export const DONATION_AMOUNTS = [
  { amount: 2500, label: '$25', description: 'Meals for a family' },
  { amount: 5000, label: '$50', description: 'Essential supplies' },
  { amount: 10000, label: '$100', description: 'Weekly support' },
  { amount: 25000, label: '$250', description: 'Monthly assistance' },
]
