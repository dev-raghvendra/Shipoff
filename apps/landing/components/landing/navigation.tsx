"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
        <Logo className='h-8' />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-sm hover:text-primary transition-colors">
              Benefits
            </Link>
            <Link href="#pricing" className="text-sm hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm hover:text-primary transition-colors">
              Docs
            </Link>
            <Link href="https://console.shipoff.in/dashboard/overview">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="https://console.shipoff.in">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

