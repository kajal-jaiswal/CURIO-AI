import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://curio-ai.vercel.app'),
  title: {
    default: 'AI Tools for Jobs & Small Businesses | Curio AI Blog',
    template: '%s | Curio AI Blog',
  },
  description: 'Discover the best AI tools for jobs and small businesses. Expert reviews, guides, and insights to help you leverage AI for productivity and growth.',
  keywords: ['AI tools', 'small business', 'productivity', 'AI software', 'business automation'],
  authors: [{ name: 'Curio AI' }],
  creator: 'Curio AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://curio-ai.vercel.app',
    siteName: 'Curio AI Blog',
    title: 'AI Tools for Jobs & Small Businesses',
    description: 'Discover the best AI tools for jobs and small businesses.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Curio AI Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools for Jobs & Small Businesses',
    description: 'Discover the best AI tools for jobs and small businesses.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
