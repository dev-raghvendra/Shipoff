import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { Geist , Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Initialize fonts
const _geist = Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _poppins = Poppins({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: 'Shipoff',
  description: 'One-stop solution for your web applications'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  const preferredTheme = session?.user?.preferredTheme || "system"
  console.log("Preferred Theme:", preferredTheme)
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
