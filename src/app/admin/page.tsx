export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Admin</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded border p-4">
          <h2 className="text-lg font-semibold">Live Orders</h2>
          <p className="text-sm text-gray-600">Queue will appear here.</p>
        </section>
        <section className="rounded border p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <p className="text-sm text-gray-600">Add/edit items and modifiers.</p>
        </section>
        <section className="rounded border p-4">
          <h2 className="text-lg font-semibold">Branding</h2>
          <p className="text-sm text-gray-600">Upload logo, choose colors/background.</p>
        </section>
      </div>
    </main>
  )
}
