import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { CONFIG } from '../config/config'

export const metadata: Metadata = {
  title: 'Privacy Policy | Shipoff',
  description: 'Shipoff Privacy Policy - Learn how we collect, use, and protect your data.',
  keywords: [
    'Privacy Policy',
    'Shipoff privacy',
    'data protection',
    'user privacy',
  ],
  openGraph: {
    title: 'Privacy Policy | Shipoff',
    description: 'Shipoff Privacy Policy - Learn how we collect, use, and protect your data.',
    url: 'https://shipoff.in/privacy',
    type: 'website',
    siteName: 'Shipoff',
    images: [
      {
        url: 'https://shipoff.in/meta/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy | Shipoff',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Shipoff',
    description: 'Shipoff Privacy Policy - Learn how we collect, use, and protect your data.',
    images: ['https://shipoff.in/meta/og-image.webp'],
  },
  alternates: {
    canonical: 'https://shipoff.in/privacy',
  },
}

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Shipoff. We are committed to protecting your privacy and ensuring you have a positive experience on our platform. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (name, email address, password)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Project information (repository URLs, deployment configurations, environment variables)</li>
                <li>Communication data (support requests, feedback, bug reports)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Usage data (how you interact with our platform)</li>
                <li>Log data (IP addresses, browser type, device information)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Performance metrics (deployment times, error rates, resource usage)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide, maintain, and improve our services</li>
                <li>To process transactions and send related information</li>
                <li>To send you technical notices, updates, and support messages</li>
                <li>To respond to your comments, questions, and requests</li>
                <li>To monitor and analyze trends, usage, and activities</li>
                <li>To detect, prevent, and address technical issues and security vulnerabilities</li>
                <li>To personalize your experience and provide content and features relevant to you</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf (payment processing, hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
                <li><strong>Business Transfers:</strong> Information may be transferred in connection with any merger, sale of assets, or acquisition of all or a portion of our business</li>
                <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit and at rest, regular 
                security audits, and access controls. However, no method of transmission over the Internet or electronic storage is 
                100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law. When you delete your account, we will delete or 
                anonymize your personal information, except where we are required to retain it for legal or legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing your personal information</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do 
                not accept cookies, you may not be able to use some portions of our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information 
                from children under 18. If you become aware that a child has provided us with personal information, please contact 
                us, and we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state, province, country, 
                or other governmental jurisdiction where data protection laws may differ. By using our service, you consent to the 
                transfer of your information to our facilities and those third parties with whom we share it as described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground mt-4">
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

