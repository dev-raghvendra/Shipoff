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
  title: 'Shipoff - Ship Your Apps Lightning Fast',
  description: 'Deploy your web applications in seconds. One-stop solution for deploying from Git to production with zero configuration. Support for Next.js, React, Vue, and more.',
  keywords: ['deployment', 'hosting', 'web apps', 'git integration', 'cloud platform', 'vercel alternative', 'netlify alternative'],
  authors: [{ name: 'Shipoff' }],
  openGraph: {
    title: 'Shipoff - Ship Your Apps Lightning Fast',
    description: 'Deploy your web applications in seconds with our optimized build pipeline and global CDN.',
    type: 'website',
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
