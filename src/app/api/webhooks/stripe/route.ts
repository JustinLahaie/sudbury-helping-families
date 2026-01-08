import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } else {
      // In development without webhook secret, parse the event directly
      event = JSON.parse(body) as Stripe.Event
      console.warn('STRIPE_WEBHOOK_SECRET not set - webhook signature not verified')
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata || {}

      // Check if this is a raffle ticket purchase
      if (metadata.type === 'raffle_ticket') {
        try {
          // Update the raffle entry to completed
          await prisma.raffleEntry.update({
            where: { id: metadata.entry_id },
            data: {
              paymentStatus: 'completed',
              stripeSessionId: session.id,
            },
          })
          console.log('Raffle entry updated:', metadata.entry_id)
        } catch (error) {
          console.error('Failed to update raffle entry:', error)
        }
      } else {
        // Regular donation
        try {
          await prisma.donation.create({
            data: {
              stripeSessionId: session.id,
              amount: session.amount_total || 0,
              currency: session.currency || 'cad',
              donorEmail: session.customer_details?.email || null,
              donorName: session.customer_details?.name || null,
              status: 'completed',
            },
          })
          console.log('Donation recorded:', session.id)
        } catch (error) {
          console.error('Failed to record donation:', error)
        }
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Checkout session expired:', session.id)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
