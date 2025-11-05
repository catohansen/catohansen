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

import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Nora - The Mind Behind Hansen Global | AI System Architect',
  description: 'Nora er AI-kjerneintelligensen og systemmaskoten for hele Hansen Global-universet. Hun forstår alle moduler, API-er, databaser og brukere — og hjelper deg med alt. Skapt av Cato Hansen.',
  keywords: [
    'Nora',
    'AI',
    'System Architect',
    'Hansen Global',
    'Cato Hansen',
    'AI Assistant',
    'Knowledge Base',
    'Automation',
    'Voice AI',
    'AI Chat'
  ],
  authors: [{ name: 'Cato Hansen', url: 'https://www.catohansen.no' }],
  creator: 'Cato Hansen',
  publisher: 'Cato Hansen Agency',
  openGraph: {
    type: 'website',
    locale: 'no_NO',
    url: 'https://www.catohansen.no/nora',
    siteName: 'Nora - Hansen Global',
    title: 'Nora - The Mind Behind Hansen Global',
    description: 'AI-kjerneintelligensen og systemmaskoten for hele Hansen Global-universet',
    images: [
      {
        url: '/nora-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nora - AI System Architect'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nora - The Mind Behind Hansen Global',
    description: 'AI-kjerneintelligensen og systemmaskoten for hele Hansen Global-universet',
    creator: '@catohansen'
  },
  alternates: {
    canonical: 'https://www.catohansen.no/nora'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function NoraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StructuredData />
      {children}
    </>
  )
}



