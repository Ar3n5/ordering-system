import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const vendorSlug: string | undefined = body.vendorSlug
    const stripeAccountId: string | undefined = body.stripeAccountId
    const items: Array<{ name: string; amount_cents: number; quantity?: number }> = body.items || []
    const currency: string = body.currency || 'eur'
    let success_url: string = body.success_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success`
    const cancel_url: string = body.cancel_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cancel`

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 })
    }
    // Determine connected account
    let connectedAccount = stripeAccountId || process.env.CONNECTED_ACCOUNT_ID || process.env.NEXT_PUBLIC_CONNECTED_ACCOUNT_ID
    if (!connectedAccount) {
      if (!vendorSlug) {
        return NextResponse.json({ error: 'Provide either stripeAccountId or vendorSlug' }, { status: 400 })
      }
      const { supabase } = await import('@/lib/supabaseClient')
      const { data: vendor, error: vendorErr } = await supabase
        .from('vendors')
        .select('stripe_account_id')
        .eq('slug', vendorSlug)
        .single()
      if (vendorErr) {
        return NextResponse.json({ error: 'Vendor lookup failed' }, { status: 400 })
      }
      if (!vendor || !vendor.stripe_account_id) {
        return NextResponse.json({ error: 'Vendor not configured for payments' }, { status: 400 })
      }
      connectedAccount = vendor.stripe_account_id
    }

    // Ensure success_url contains the session_id token and include connected account for convenience
    const url = new URL(success_url)
    if (!url.searchParams.has('session_id')) {
      url.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}')
    }
    if (connectedAccount && !url.searchParams.has('acct')) {
      url.searchParams.set('acct', connectedAccount)
    }
    success_url = url.toString()

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: items.map((i) => ({
          price_data: {
            currency,
            product_data: { name: i.name },
            unit_amount: i.amount_cents,
          },
          quantity: i.quantity ?? 1,
        })),
        success_url,
        cancel_url,
        metadata: {
          vendorSlug: vendorSlug || '',
          stripeAccountId: connectedAccount || '',
          items: JSON.stringify(items),
        },
      },
      { stripeAccount: connectedAccount }
    )

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Checkout error' }, { status: 500 })
  }
}
