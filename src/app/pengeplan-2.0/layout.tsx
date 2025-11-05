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
 * Pengeplan 2.0 Layout
 * SEO optimized layout for Pengeplan 2.0 page
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pengeplan 2.0 - Enterprise AI Økonomiplattform | Cato Hansen',
  description: 'Norges første enterprise-grade AI økonomiplattform. Kombinerer brukerens kontroll, vergens støtte, AI-intelligens og admin governance. Støtt utviklingen via Spleis.',
  keywords: ['Pengeplan 2.0', 'AI økonomiplattform', 'Enterprise', 'Ungdomsbeskyttelse', 'Verge-system', 'GDPR', 'Spleis', 'crowdfunding'],
  openGraph: {
    title: 'Pengeplan 2.0 - Enterprise AI Økonomiplattform',
    description: 'Norges første enterprise-grade AI økonomiplattform med ungdomsbeskyttelse og verge-system. Production-ready med 100+ admin sider.',
    type: 'website',
    url: 'https://www.catohansen.no/pengeplan-2.0',
    images: [
      {
        url: '/og-pengeplan-2.0.jpg',
        width: 1200,
        height: 630,
        alt: 'Pengeplan 2.0 - Enterprise AI Økonomiplattform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pengeplan 2.0 - Enterprise AI Økonomiplattform',
    description: 'Norges første enterprise-grade AI økonomiplattform med ungdomsbeskyttelse og verge-system.',
  },
  alternates: {
    canonical: 'https://www.catohansen.no/pengeplan-2.0',
  },
}

export default function PengeplanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}





