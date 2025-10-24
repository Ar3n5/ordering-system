export default function StatusPage({ params }: { params: { vendor: string, orderId: string } }) {
  const { vendor, orderId } = params
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-2 text-2xl font-bold">Order #{orderId}</h1>
      <p className="text-gray-700">Current status: <span className="font-semibold">received</span></p>
      <p className="mt-2 text-sm text-gray-600">This page will live-update as your order moves to preparing → ready.</p>
      <div className="mt-6 text-sm text-gray-500">Vendor: {vendor}</div>
    </main>
  )
}
