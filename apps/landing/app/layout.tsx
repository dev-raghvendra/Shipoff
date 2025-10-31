import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { Geist , Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ui/theme-provider'

// Initialize fonts
const _geist = Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _poppins = Poppins({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: 'Shipoff – From Code to Cloud in Seconds',
  description:
    'Deploy your web apps directly from Git to a global cloud in seconds. Shipoff makes deployment effortless with zero configuration, optimized builds, and a lightning-fast CDN.',
  keywords: [
    'deployment platform',
    'web hosting',
    'cloud hosting',
    'CI/CD',
    'Git deployments',
    'Next.js hosting',
    'React hosting',
    'Vercel alternative',
    'Netlify alternative',
    'Shipoff',
    'deploy apps fast',
  ],
  authors: [{ name: 'Shipoff', url: 'https://shipoff.in' }],
  creator: 'Shipoff Team',
  publisher: 'Shipoff',
  openGraph: {
    title: 'Shipoff – From Code to Cloud in Seconds',
    description:
      'Deploy your applications from Git to the cloud instantly. Zero config, global CDN, and optimized builds.',
    url: 'https://shipoff.in',
    siteName: 'Shipoff',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://shipoff.in/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Shipoff – From Code to Cloud in Seconds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipoff – From Code to Cloud in Seconds',
    description:
      'Deploy your web apps directly from Git to a global CDN in seconds. Zero setup, infinite scalability.',
    creator: '@shipoff',
    images: ['https://shipoff.in/og-image.webp'],
  },
  icons: {
    icon: '/meta/favicon.ico',
    shortcut: '/meta/favicon-16x16.png',
    apple: '/meta/apple-touch-icon.png',
  },
  manifest: '/meta/site.webmanifest',
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
  alternates: {
    canonical: 'https://shipoff.in',
  },
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
        <html lang="en">
          <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
            <ThemeProvider attribute="class" enableSystem>
              {children}
              <Toaster position="top-center" />
            </ThemeProvider>
            <Analytics />
          </body>
        </html>
  )
}
