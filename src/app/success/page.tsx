import { stripe } from '@/lib/stripe'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const sessionId = typeof searchParams.session_id === 'string' ? searchParams.session_id : undefined
  const acct = typeof searchParams.acct === 'string' ? searchParams.acct : undefined

  let summary: { amount?: string; email?: string; id?: string } | undefined
  let error: string | undefined

  if (sessionId && sessionId !== '{CHECKOUT_SESSION_ID}') {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, acct ? { stripeAccount: acct } : undefined)
      const amount = session.amount_total && session.currency
        ? `${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}`
        : undefined
      summary = {
        id: session.id,
        email: typeof session.customer_details?.email === 'string' ? session.customer_details?.email : undefined,
        amount,
      }
    } catch (e: any) {
      error = e?.message || 'Could not retrieve session'
    }
  }

  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Payment successful</h1>
      <p className="mt-2 text-gray-600">Thanks for your order.</p>

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : (
        <div className="mt-4 text-sm text-gray-700">
          {summary?.id && <p><span className="font-medium">Session:</span> {summary.id}</p>}
          {summary?.email && <p><span className="font-medium">Email:</span> {summary.email}</p>}
          {summary?.amount && <p><span className="font-medium">Total:</span> {summary.amount}</p>}
        </div>
      )}

      <a href="/" className="mt-6 inline-block rounded bg-black px-4 py-2 text-white">Go home</a>
    </main>
  )
}
