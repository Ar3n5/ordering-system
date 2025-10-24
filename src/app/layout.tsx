import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Festival Orders',
  description: 'Order food without the queue',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
