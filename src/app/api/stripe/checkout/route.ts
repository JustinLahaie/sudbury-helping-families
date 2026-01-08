import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add your Stripe API keys.' },
        { status: 500 }
      )
    }

    const { amount, customAmount } = await request.json()

    // Calculate the final amount in cents
    let finalAmount: number
    if (customAmount) {
      // Custom amount comes in as dollars, convert to cents
      finalAmount = Math.round(parseFloat(customAmount) * 100)
      if (finalAmount < 100) {
        return NextResponse.json(
          { error: 'Minimum donation is $1.00' },
          { status: 400 }
        )
      }
    } else if (amount) {
      finalAmount = amount // Preset amounts are already in cents
    } else {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      )
    }

    // Get the origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Donation to Sudbury Helping Families',
              description: 'Thank you for supporting families in need in the Sudbury area.',
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?cancelled=true`,
      metadata: {
        donation_type: 'one_time',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
