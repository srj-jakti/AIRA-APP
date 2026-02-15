import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import PWAHead from '@/components/PWAHead'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AIRA - AI Trading Platform | Automated Trading India',
    template: '%s | AIRA'
  },
  description: 'AI-powered trading platform with automated execution, strategy creation, backtesting, and real-time market analysis. Start algorithmic trading in India with AIRA.',
  keywords: ['AI trading platform', 'automated trading India', 'algo trading software', 'algorithmic trading', 'trading bot India', 'AI trading bot', 'automated stock trading'],
  authors: [{ name: 'AIRA' }],
  creator: 'AIRA',
  publisher: 'AIRA',
  metadataBase: new URL('https://aira.trading'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AIRA',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aira.trading',
    title: 'AIRA - AI Trading Platform',
    description: 'AI-powered trading platform with automated execution and strategy creation',
    siteName: 'AIRA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIRA - AI Trading Platform',
    description: 'AI-powered trading platform with automated execution and strategy creation',
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
  icons: {
    icon: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Structured Data (JSON-LD)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AIRA',
    description: 'AI-powered trading platform for automated execution and strategy creation',
    url: 'https://aira.trading',
    logo: 'https://aira.trading/icons/icon-512x512.svg',
    sameAs: [
      'https://twitter.com/aira_trading',
      'https://facebook.com/aira.trading',
      'https://instagram.com/aira.trading',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@aira.trading',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AIRA',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '999',
      highPrice: '9999',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    description: 'AI-powered trading platform with automated execution, strategy creation, backtesting, and real-time market analysis',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AIRA" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <PWAHead />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <PWAInstallPrompt />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
