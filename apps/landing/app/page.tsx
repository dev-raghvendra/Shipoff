'use client'

import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { McpSection } from '@/components/landing/mcp-section'
import { FrameworksSection } from '@/components/landing/frameworks-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <HowItWorksSection />
      <McpSection />
      <FrameworksSection />
      <BenefitsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
