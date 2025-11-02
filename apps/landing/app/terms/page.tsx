import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { CONFIG } from '../config/config'

export const metadata: Metadata = {
  title: 'Terms of Service | Shipoff',
  description: 'Shipoff Terms of Service - Read our terms and conditions for using our platform.',
  keywords: [
    'Terms of Service',
    'Shipoff terms',
    'terms and conditions',
    'user agreement',
  ],
  openGraph: {
    title: 'Terms of Service | Shipoff',
    description: 'Shipoff Terms of Service - Read our terms and conditions for using our platform.',
    url: 'https://shipoff.in/terms',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | Shipoff',
    description: 'Shipoff Terms of Service - Read our terms and conditions for using our platform.',
  },
  alternates: {
    canonical: 'https://shipoff.in/terms',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8" />
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild size="sm">
                <Link href="/">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="size-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Shipoff ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service. These Terms apply to all visitors, 
                users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily use Shipoff for personal and commercial purposes. This is the grant of a license, 
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Modify or copy the Service</li>
                <li>Use the Service for any commercial purpose without prior written consent</li>
                <li>Attempt to reverse engineer or decompile any software contained in Shipoff</li>
                <li>Remove any copyright or proprietary notations from the Service</li>
                <li>Transfer the Service to another person or mirror the Service on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any 
                breach of security or unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                <li>To engage in any automated use of the Service, such as using scripts to send comments or messages</li>
                <li>To interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>To use the Service in a manner that could disable, overburden, damage, or impair the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Content</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, 
                or other material ("Content"). You are responsible for the Content that you post on or through the Service, including 
                its legality, reliability, and appropriateness.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By posting Content on or through the Service, you grant us the right and license to use, modify, publicly perform, 
                publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your 
                rights to any Content you submit, post or display on or through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Shipoff 
                and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may 
                not be used in connection with any product or service without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Pricing and Payment</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Some aspects of the Service are provided free of charge, while others may require payment. When you upgrade to a paid plan:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You agree to pay all fees associated with your subscription</li>
                <li>Fees are billed in advance on a recurring basis</li>
                <li>All fees are non-refundable unless otherwise stated</li>
                <li>We reserve the right to change our pricing at any time, but will notify you in advance</li>
                <li>If payment fails, we may suspend or terminate your access to paid features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain high availability of the Service, but we do not guarantee that the Service will be available at all 
                times. The Service may be temporarily unavailable due to maintenance, updates, or unforeseen circumstances. We reserve the 
                right to modify or discontinue the Service (or any part of it) at any time with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall Shipoff, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, 
                goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to defend, indemnify, and hold harmless Shipoff and its licensee and licensors, and their employees, contractors, 
                agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, 
                and expenses (including but not limited to attorney's fees), resulting from or arising out of your use and access of the Service, 
                or a breach of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our 
                sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you 
                wish to terminate your account, you may simply discontinue using the Service or contact us to delete your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which Shipoff operates, without regard to its 
                conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will 
                provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined 
                at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound 
                by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li><strong>Email:</strong> {CONFIG.EMAIL_SUPPORT}</li>
                <li><strong>Support:</strong> {CONFIG.EMAIL_SUPPORT}</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

