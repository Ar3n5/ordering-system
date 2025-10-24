export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) {
      return new NextResponse('Missing STRIPE_WEBHOOK_SECRET', { status: 500 })
    }

    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      return new NextResponse('Missing stripe-signature header', { status: 400 })
    }

    let event: Stripe.Event
    try {
      const rawBody = await request.text()
      event = stripe.webhooks.constructEvent(rawBody, signature, secret)
    } catch (err: any) {
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const connectedAccount = request.headers.get('stripe-account') || undefined

    switch (event.type) {
      case 'checkout.session.completed': {
        break
      }
      default: {
        break
      }
    }

    return new NextResponse('ok', { status: 200 })
  } catch (e: any) {
    console.error('Webhook handler error:', e)
    return new NextResponse('ok', { status: 200 })
  }
}
