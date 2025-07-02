import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nicatours - Transporte Turístico en Nicaragua',
  description: 'Servicio de transporte turístico con van de 13 pasajeros por toda Nicaragua',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-nicaragua-blue to-blue-800">
          {children}
        </div>
      </body>
    </html>
  )
}