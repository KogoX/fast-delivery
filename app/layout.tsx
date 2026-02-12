import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://baratonride.com'),
  title: {
    default: 'BaratonRide | Campus Ride and Delivery',
    template: '%s | BaratonRide',
  },
  description:
    'BaratonRide is Bowen University\'s ride, errand, package, and food delivery platform for faster campus transport and orders.',
  applicationName: 'BaratonRide',
  keywords: [
    'BaratonRide',
    'Bowen University rides',
    'campus delivery app',
    'food delivery Baraton',
    'ride booking app',
  ],
  authors: [{ name: 'BaratonRide' }],
  creator: 'BaratonRide',
  publisher: 'BaratonRide',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BaratonRide | Campus Ride and Delivery',
    description:
      'Fast and safe rides, errands, package delivery, and food ordering around campus.',
    url: '/',
    siteName: 'BaratonRide',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/apple-icon.png',
        width: 180,
        height: 180,
        alt: 'BaratonRide logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BaratonRide | Campus Ride and Delivery',
    description:
      'Fast and safe rides, errands, package delivery, and food ordering around campus.',
    images: ['/apple-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
