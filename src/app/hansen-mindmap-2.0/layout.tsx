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
 * MindMap 2.0 Layout
 * Created by Cato Hansen - SEO optimized layout - Coming Soon Mars 2026
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindMap 2.0 - AI-Drevet Mindmapping | Laget av Cato Hansen | Coming Soon Mars 2026',
  description: 'MindMap 2.0 - AI-drevet mindmapping med Copilot, multi-input (PDF/bilde/audio/video), sanntidssamarbeid og enterprise-eksport. Laget av Cato Hansen. Coming Soon - Mars 2026.',
  keywords: [
    'MindMap 2.0',
    'MindMap laget av Cato Hansen',
    'AI mindmap',
    'mind mapping',
    'AI Copilot',
    'collaboration',
    'Coming Soon Mars 2026',
    'Cato Hansen',
    'enterprise mindmap'
  ],
  openGraph: {
    type: 'website',
    locale: 'no_NO',
    url: 'https://www.catohansen.no/hansen-mindmap-2.0',
    siteName: 'Cato Hansen',
    title: 'MindMap 2.0 - AI-Drevet Mindmapping | Laget av Cato Hansen | Coming Soon Mars 2026',
    description: 'MindMap 2.0 - AI-drevet mindmapping med Copilot, multi-input, sanntidssamarbeid og enterprise-eksport. Laget av Cato Hansen. Coming Soon - Mars 2026.',
    images: [
      {
        url: '/og-hansen-mindmap.jpg',
        width: 1200,
        height: 630,
        alt: 'MindMap 2.0 - Laget av Cato Hansen - Coming Soon Mars 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindMap 2.0 - Laget av Cato Hansen - Coming Soon Mars 2026',
    description: 'MindMap 2.0 - AI-drevet mindmapping med Copilot og sanntidssamarbeid. Laget av Cato Hansen. Coming Soon - Mars 2026.'
  },
  alternates: {
    canonical: 'https://www.catohansen.no/hansen-mindmap-2.0'
  }
}

export default function HansenMindmapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

