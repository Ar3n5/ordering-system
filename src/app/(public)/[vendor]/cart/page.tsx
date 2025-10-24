import Link from 'next/link'

export default function CartPage({ params }: { params: { vendor: string } }) {
  const vendor = params.vendor
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      <div className="rounded border p-4">
        <p className="text-gray-600">Sample Burger x1 — €10.00</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Link href={`/${vendor}/menu`} className="rounded border px-3 py-2">Continue shopping</Link>
        <Link href={`/${vendor}/checkout`} className="rounded bg-black px-3 py-2 text-white">Checkout</Link>
      </div>
    </main>
  )
}
