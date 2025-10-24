'use client'

import { useMemo, useState } from 'react'

type Item = { id: string; name: string; price_cents: number }

const CATALOG: Item[] = [
  { id: 'burger', name: 'Burger', price_cents: 800 },
  { id: 'fries', name: 'Fries', price_cents: 300 },
  { id: 'soda', name: 'Soda', price_cents: 250 },
]

export default function Page() {
  const connected = process.env.NEXT_PUBLIC_CONNECTED_ACCOUNT_ID || ''
  const [cart, setCart] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalCents = useMemo(
    () => Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = CATALOG.find((i) => i.id === id)
      return sum + (item ? item.price_cents * qty : 0)
    }, 0),
    [cart]
  )

  function add(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
  }
  function remove(id: string) {
    setCart((c) => {
      const qty = (c[id] || 0) - 1
      const next = { ...c }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }

  async function checkout() {
    setLoading(true)
    setError(null)
    try {
      const items = Object.entries(cart).map(([id, qty]) => {
        const item = CATALOG.find((i) => i.id === id)!
        return { name: item.name, amount_cents: item.price_cents, quantity: qty }
      })
      if (items.length === 0) throw new Error('Cart is empty')

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeAccountId: connected || undefined,
          currency: 'eur',
          success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cancel`,
          items,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create session')
      if (data?.url) window.location.href = data.url
      else throw new Error('No URL returned from checkout')
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Foodtruck</h1>
      <p className="mt-1 text-gray-600">Pick your items and pay securely.</p>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CATALOG.map((i) => (
          <div key={i.id} className="rounded border p-4">
            <div className="font-medium">{i.name}</div>
            <div className="text-gray-600">{(i.price_cents / 100).toFixed(2)} EUR</div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={() => remove(i.id)} className="rounded border px-2 py-1">-</button>
              <span>{cart[i.id] || 0}</span>
              <button onClick={() => add(i.id)} className="rounded border px-2 py-1">+</button>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded border p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg">{(totalCents / 100).toFixed(2)} EUR</span>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          onClick={checkout}
          disabled={loading}
          className="mt-4 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Checkout'}
        </button>
        {!connected && (
          <p className="mt-2 text-xs text-amber-700">Tip: set NEXT_PUBLIC_CONNECTED_ACCOUNT_ID in .env.local to route payments to a specific vendor account.</p>
        )}
      </section>
    </main>
  )
}
