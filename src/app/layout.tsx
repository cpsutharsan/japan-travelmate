import type { Metadata, Viewport } from 'next'
import { Inter, Shippori_Mincho, JetBrains_Mono, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/AppShell'
import { PWARegister } from '@/components/PWARegister'
import { OfflineIndicator } from '@/components/OfflineIndicator'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const shippori = Shippori_Mincho({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-shippori', display: 'swap' })
const jet = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jet', display: 'swap' })
const notoJp = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-jp', display: 'swap', weight: ['400', '500', '700', '900'] })

export const metadata: Metadata = {
  title: 'Japan TravelMate',
  description: 'Personal travel companion for the Parthasarathy family trip to Japan, 22–30 May 2026.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Japan TravelMate',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TravelMate',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#faf7f2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${shippori.variable} ${jet.variable} ${notoJp.variable}`}>
      <body className="font-sans antialiased">
        <PWARegister />
        <OfflineIndicator />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
