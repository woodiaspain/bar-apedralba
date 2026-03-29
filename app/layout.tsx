import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageLoadOverlay from '@/components/ui/PageLoadOverlay'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  title: 'Bar A Pedralba — Pizzería & Bar del Club de Tenis',
  description:
    'Pizzería artesana, paellas de fin de semana y menú del día. El bar del Club de Tenis A Pedralba en Bergondo, Galicia.',
  keywords: ['bar', 'pizzería', 'Bergondo', 'Galicia', 'Club de Tenis A Pedralba', 'menú del día', 'paellas'],
  openGraph: {
    title: 'Bar A Pedralba',
    description: 'Pizzería artesana, paellas y menú del día. Bergondo, Galicia.',
    locale: 'es_ES',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a3a2a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <PageLoadOverlay />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
