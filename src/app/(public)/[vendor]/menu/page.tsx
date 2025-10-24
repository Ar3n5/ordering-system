import Link from 'next/link'

export default async function MenuPage({ params }: { params: { vendor: string } }) {
  const vendor = params.vendor
  // TODO: fetch vendor theme and menu from Supabase
  return (
    <main className="mx-auto max-w-3xl p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{vendor} menu</h1>
        <p className="text-sm text-gray-600">Pick your items and checkout</p>
      </header>
      <section className="space-y-4">
        <div className="rounded border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Sample Burger</h2>
              <p className="text-sm text-gray-600">A tasty sample item</p>
            </div>
            <Link href={`/${vendor}/cart`} className="rounded bg-black px-3 py-2 text-white">Add</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
