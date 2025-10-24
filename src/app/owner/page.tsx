import { stripe } from '@/lib/stripe'

export default async function Page() {
  const acct = process.env.NEXT_PUBLIC_CONNECTED_ACCOUNT_ID || process.env.CONNECTED_ACCOUNT_ID

  let items: Array<{ id: string; amount: string; status: string; created: string; customer?: string }> = []
  let error: string | undefined

  if (!acct) {
    error = 'Set NEXT_PUBLIC_CONNECTED_ACCOUNT_ID (or CONNECTED_ACCOUNT_ID) in .env.local to view recent payments.'
  } else {
    try {
      const list = await stripe.paymentIntents.list({ limit: 10 }, { stripeAccount: acct })
      items = list.data.map((pi) => ({
        id: pi.id,
        status: pi.status,
        amount: `${(pi.amount / 100).toFixed(2)} ${pi.currency.toUpperCase()}`,
        created: new Date((pi.created || 0) * 1000).toLocaleString(),
        customer: typeof pi.receipt_email === 'string' ? pi.receipt_email : undefined,
      }))
    } catch (e: any) {
      error = e?.message || 'Failed to load payments'
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Owner dashboard</h1>
      <p className="mt-1 text-gray-600">Recent payments for the connected account.</p>

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : (
        <ul className="mt-6 divide-y rounded border">
          {items.map((it) => (
            <li key={it.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">{it.created}</div>
                  <div className="font-medium">{it.amount}</div>
                  {it.customer && <div className="text-sm text-gray-600">{it.customer}</div>}
                </div>
                <div className="rounded bg-gray-100 px-2 py-1 text-sm capitalize">{it.status}</div>
              </div>
              <div className="mt-2 text-xs text-gray-500">{it.id}</div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-4 text-sm text-gray-600">No recent payments</li>
          )}
        </ul>
      )}
    </main>
  )
}
