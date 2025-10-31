import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import {headers} from 'next/headers';
import './globals.css'

import { Geist , Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Initialize fonts
const _geist = Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _poppins = Poppins({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const reqPath = headersList.get('x-req-path') || ''

  const isAuthPage = reqPath === '/signin' || reqPath === '/login'

  return {
    title: isAuthPage
      ? 'Sign In – Shipoff Console'
      : 'Shipoff Console – From Code to Cloud in Seconds',

    description: isAuthPage
      ? 'Sign in to your Shipoff account to access your projects and deployments.'
      : 'Deploy, monitor, and scale your web apps effortlessly — all from one powerful console.',

    applicationName: 'Shipoff Console',
    authors: [{ name: 'Shipoff', url: 'https://shipoff.in' }],

    openGraph: {
      title: 'Shipoff Console – From Code to Cloud in Seconds',
      description:
        'Deploy, monitor, and scale your apps effortlessly with Shipoff — from code to cloud in seconds.',
      url: 'https://console.shipoff.in',
      siteName: 'Shipoff Console',
      type: 'website',
      images: [
        {
          url: 'https://shipoff.in/meta/og-image.webp',
          width: 1200,
          height: 630,
          alt: 'Shipoff Console – From Code to Cloud in Seconds',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Shipoff Console – From Code to Cloud in Seconds',
      description:
        'Deploy, monitor, and scale your apps effortlessly with Shipoff — from code to cloud in seconds.',
      images: ['https://shipoff.in/meta/og-image.webp'],
    },

    icons: {
      icon: '/meta/favicon.ico',
      shortcut: '/meta/favicon-16x16.png',
      apple: '/meta/apple-touch-icon.png',
    },

    manifest: '/meta/site.webmanifest',

    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  const preferredTheme = session?.user?.preferredTheme || "system"
  
  return (
        <html lang="en">
          <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
            <ThemeProvider attribute="class" defaultTheme={preferredTheme} enableSystem>
              {children}
              <Toaster position="top-center" />
            </ThemeProvider>
            <Analytics />
          </body>
        </html>
  )
}
