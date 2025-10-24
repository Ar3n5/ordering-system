'use client'

import { useState } from 'react'

export default function Page() {
  const [acct, setAcct] = useState('')
  const [currency, setCurrency] = useState('eur')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeAccountId: acct.trim() || undefined,
          currency,
          success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cancel`,
          items: [
            { name: 'Burger', amount_cents: 800, quantity: 1 },
            { name: 'Fries', amount_cents: 300, quantity: 1 },
          ],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create session')
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error('No URL returned from checkout')
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold">Checkout test</h1>
      <p className="mt-2 text-gray-600">Trigger a Stripe Checkout session.</p>

      <form onSubmit={startCheckout} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Connected account ID (acct_...)</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="acct_123..."
            value={acct}
            onChange={(e) => setAcct(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">Leave blank if using vendorSlug (DB path). For now, paste your acct_ ID.</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Currency</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Creating session…' : 'Start checkout'}
        </button>
      </form>
    </main>
  )
}
