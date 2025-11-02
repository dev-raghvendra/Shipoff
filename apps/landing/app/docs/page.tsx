import PageDocs from '@/components/docs/docs';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation | Shipoff',
  description:
    'Comprehensive documentation for Shipoff.in, covering setup, features, and usage guidelines to help you get the most out of our platform.',
  keywords: [
    'Shipoff documentation',
    'deployment guide',
    'getting started',
    'project setup',
    'deployment states',
    'frameworks support',
    'environment variables',
    'troubleshooting',
  ],
  openGraph: {
    title: 'Documentation | Shipoff',
    description:
      'Comprehensive documentation for Shipoff.in, covering setup, features, and usage guidelines.',
    url: 'https://shipoff.in/docs',
    type: 'website',
    siteName: 'Shipoff',
    images: [
      {
        url: 'https://shipoff.in/meta/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Documentation | Shipoff',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Documentation | Shipoff',
    description: 'Comprehensive documentation for Shipoff.in.',
    images: ['https://shipoff.in/meta/og-image.webp'],
  },
  alternates: {
    canonical: 'https://shipoff.in/docs',
  },
}

export default function DocsPage() {
  return <PageDocs />;
}