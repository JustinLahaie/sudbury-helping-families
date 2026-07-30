import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'

// TESTING MODE - Skip Stripe payment
const TESTING_MODE = true

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const raffleId = typeof body.raffleId === 'string' ? body.raffleId.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const ticketCount = Number(body.ticketCount)

    if (!raffleId) {
      return NextResponse.json({ error: 'Missing raffle id' }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: 'Please enter your name' }, { status: 400 })
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }
    if (!Number.isFinite(ticketCount) || ticketCount < 1) {
      return NextResponse.json(
        { error: 'Please choose at least one ticket' },
        { status: 400 }
      )
    }

    // Get the raffle
    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
    })

    if (!raffle) {
      return NextResponse.json(
        { error: 'Raffle not found' },
        { status: 404 }
      )
    }

    // Check if raffle is still active
    const now = new Date()
    if (!raffle.isActive || now < raffle.startDate || now > raffle.endDate) {
      return NextResponse.json(
        { error: 'This raffle is not currently active' },
        { status: 400 }
      )
    }

    // Check max tickets
    if (raffle.maxTickets) {
      const existingEntries = await prisma.raffleEntry.aggregate({
        where: {
          raffleId,
          paymentStatus: 'completed',
        },
        _sum: { ticketCount: true },
      })

      const totalSold = existingEntries._sum.ticketCount || 0
      if (totalSold + ticketCount > raffle.maxTickets) {
        return NextResponse.json(
          { error: 'Not enough tickets available' },
          { status: 400 }
        )
      }
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // TESTING MODE: Skip payment, create entry directly as completed
    if (TESTING_MODE) {
      const entry = await prisma.raffleEntry.create({
        data: {
          raffleId,
          name,
          email,
          phone: phone || null,
          ticketCount: Math.floor(ticketCount),
          paymentStatus: 'completed',
          stripeSessionId: `test_${randomUUID()}`,
        },
      })

      console.log('[raffle-checkout] Test entry created:', {
        id: entry.id,
        raffleId,
        ticketCount: entry.ticketCount,
      })

      return NextResponse.json({
        url: `${origin}/donate/raffle-tickets/success?session_id=test_${entry.id}`
      })
    }

    // Production mode with Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[raffle-checkout] STRIPE_SECRET_KEY is not set')
      return NextResponse.json(
        { error: 'Payments are not configured. Please contact the site owner.' },
        { status: 500 }
      )
    }

    const { stripe } = await import('@/lib/stripe')
    const quantity = Math.floor(ticketCount)

    // Create pending raffle entry
    const entry = await prisma.raffleEntry.create({
      data: {
        raffleId,
        name,
        email,
        phone: phone || null,
        ticketCount: quantity,
        paymentStatus: 'pending',
      },
    })

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Raffle Ticket${quantity > 1 ? 's' : ''} - ${raffle.title}`,
              description: `${quantity} ticket${quantity > 1 ? 's' : ''} for ${raffle.title}`,
            },
            unit_amount: raffle.ticketPrice,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/donate/raffle-tickets/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate/raffle-tickets?cancelled=true`,
      customer_email: email,
      metadata: {
        type: 'raffle_ticket',
        raffle_id: raffleId,
        entry_id: entry.id,
        ticket_count: quantity.toString(),
      },
    })

    // Update entry with session ID
    await prisma.raffleEntry.update({
      where: { id: entry.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Raffle checkout error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
