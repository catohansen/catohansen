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

/**
 * Hansen Hub Layout
 * SEO optimized layout for Hansen Hub page
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hansen Hub - Enterprise Modules & Solutions | Cato Hansen',
  description: 'Enterprise-grade modules and solutions. Hansen Security, Hansen Auth, Pengeplan 2.0, Mindmap 2.0, and more. Production-ready, modular, and battle-tested. Built by Cato Hansen Agency.',
  keywords: [
    'Hansen Hub',
    'enterprise modules',
    'Hansen Security',
    'Hansen Auth',
    'Pengeplan 2.0',
    'Mindmap 2.0',
    'Cato Hansen',
    'enterprise software',
    'modular architecture'
  ],
  openGraph: {
    type: 'website',
    locale: 'no_NO',
    url: 'https://www.catohansen.no/hansen-hub',
    siteName: 'Cato Hansen',
    title: 'Hansen Hub - Enterprise Modules & Solutions',
    description: 'Enterprise-grade modules and solutions. Production-ready, modular, and battle-tested.',
    images: [
      {
        url: '/og-hansen-hub.jpg',
        width: 1200,
        height: 630,
        alt: 'Hansen Hub - Enterprise Modules'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hansen Hub - Enterprise Modules & Solutions',
    description: 'Enterprise-grade modules and solutions. Production-ready, modular, and battle-tested.'
  },
  alternates: {
    canonical: 'https://www.catohansen.no/hansen-hub'
  }
}

export default function HansenHubLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



