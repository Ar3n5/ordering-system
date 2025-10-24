import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email: string | undefined = body.email
    const country: string = (body.country || 'US').toUpperCase()

    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    })

    return NextResponse.json({ id: account.id, details_submitted: account.details_submitted })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create account' }, { status: 500 })
  }
}
