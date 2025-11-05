/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hansen CRM 2.0 - Enterprise CRM System | Cato Hansen Agency',
  description: 'Verdens beste CRM-system med AI-drevne innsikter, salgsautomatisering og enterprise-grad sikkerhet. Modulær løsning som kan selges som standalone produkt.',
  keywords: ['CRM', 'customer relationship management', 'sales', 'pipeline', 'lead management', 'enterprise', 'ai-powered', 'Cato Hansen'],
  authors: [{ name: 'Cato Hansen', url: 'https://www.catohansen.no' }],
  openGraph: {
    title: 'Hansen CRM 2.0 - Enterprise CRM System',
    description: 'Verdens beste CRM-system med AI-drevne innsikter og enterprise-grad sikkerhet.',
    url: 'https://www.catohansen.no/hansen-crm',
    siteName: 'Cato Hansen Agency',
    type: 'website',
    images: [
      {
        url: '/og-hansen-crm.png',
        width: 1200,
        height: 630,
        alt: 'Hansen CRM 2.0',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hansen CRM 2.0 - Enterprise CRM System',
    description: 'Verdens beste CRM-system med AI-drevne innsikter og enterprise-grad sikkerhet.',
    images: ['/og-hansen-crm.png'],
  },
  alternates: {
    canonical: 'https://www.catohansen.no/hansen-crm',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HansenCRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



