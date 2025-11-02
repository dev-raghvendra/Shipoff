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
  },
  twitter: {
    card: 'summary',
    title: 'Documentation | Shipoff',
    description: 'Comprehensive documentation for Shipoff.in.',
  },
  alternates: {
    canonical: 'https://shipoff.in/docs',
  },
}

export default function DocsPage() {
  return <PageDocs />;
}