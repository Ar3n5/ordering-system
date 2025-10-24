import Link from 'next/link'

export default function CheckoutPage({ params }: { params: { vendor: string } }) {
  const vendor = params.vendor
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
      <form action={`/${vendor}/status/abc`}>
        <label className="mb-2 block text-sm font-medium">Your name</label>
        <input className="w-full rounded border p-2" placeholder="Jane" required />
        <button className="mt-4 rounded bg-black px-3 py-2 text-white">Pay (mock)</button>
      </form>
      <p className="mt-3 text-sm text-gray-600">Stripe integration to be wired</p>
    </main>
  )
}
