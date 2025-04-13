import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Duna Draw ',
  description: 'created by techwithdunamix',
  generator: 'https://github.com/techwithdunamix',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
