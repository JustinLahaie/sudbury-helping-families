import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    const { raffleId, name, email, phone, ticketCount } = await request.json()

    if (!raffleId || !name || !email || ticketCount < 1) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    const totalAmount = raffle.ticketPrice * ticketCount
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create pending raffle entry
    const entry = await prisma.raffleEntry.create({
      data: {
        raffleId,
        name,
        email,
        phone: phone || null,
        ticketCount,
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
              name: `Raffle Ticket${ticketCount > 1 ? 's' : ''} - ${raffle.title}`,
              description: `${ticketCount} ticket${ticketCount > 1 ? 's' : ''} for ${raffle.title}`,
            },
            unit_amount: raffle.ticketPrice,
          },
          quantity: ticketCount,
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
        ticket_count: ticketCount.toString(),
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
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
