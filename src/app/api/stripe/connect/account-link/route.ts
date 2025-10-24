import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const account: string | undefined = body.account
    if (!account) return NextResponse.json({ error: 'account is required' }, { status: 400 })

    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const return_url = body.return_url || `${base}/success`
    const refresh_url = body.refresh_url || `${base}/connect-test`

    const link = await stripe.accountLinks.create({
      account,
      refresh_url,
      return_url,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: link.url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create account link' }, { status: 500 })
  }
}
