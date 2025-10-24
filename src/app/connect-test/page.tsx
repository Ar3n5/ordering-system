'use client'

import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('owner@example.com')
  const [country, setCountry] = useState('US')
  const [acct, setAcct] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function createAccount() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/connect/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, country }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create account')
      setAcct(data.id)
    } catch (e: any) {
      setError(e?.message || 'Error creating account')
    } finally {
      setLoading(false)
    }
  }

  async function startOnboarding() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/connect/account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: acct }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create account link')
      if (data.url) {
        window.location.href = data.url
      }
    } catch (e: any) {
      setError(e?.message || 'Error creating account link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-xl p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Connect onboarding (test)</h1>
      <p className="text-gray-600">Create a connected account and open the onboarding link.</p>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Owner email</label>
        <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Country (ISO)</label>
        <input className="w-full rounded border px-3 py-2" value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>

      <div className="space-y-2">
        <button onClick={createAccount} disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">{loading ? 'Working…' : 'Create account'}</button>
        {acct && <p className="text-sm text-gray-700">Account ID: <span className="font-mono">{acct}</span></p>}
      </div>

      <div className="space-y-2">
        <button onClick={startOnboarding} disabled={!acct || loading} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{loading ? 'Working…' : 'Start onboarding'}</button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </main>
  )
}
