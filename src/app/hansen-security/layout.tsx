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
 * Hansen Security Layout
 * SEO optimized layout for Hansen Security page - Inspired by Cerbos
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hansen Security - Enterprise Authorization System | Fine-grained Access Control | Cato Hansen',
  description: 'Enterprise-grade fine-grained authorization system. Policy-based access control with RBAC and ABAC support. Zero-trust architecture, audit logging, and battle-tested security. Built by Cato Hansen Agency. Production-ready authorization engine.',
  keywords: [
    'Hansen Security',
    'authorization',
    'access control',
    'RBAC',
    'ABAC',
    'policy engine',
    'zero trust',
    'audit logging',
    'enterprise security',
    'Cato Hansen',
    'Cerbos alternative',
    'fine-grained authorization'
  ],
  authors: [{ name: 'Cato Hansen', url: 'https://www.catohansen.no' }],
  creator: 'Cato Hansen Agency',
  publisher: 'Cato Hansen Agency',
  openGraph: {
    type: 'website',
    locale: 'no_NO',
    url: 'https://www.catohansen.no/hansen-security',
    siteName: 'Cato Hansen',
    title: 'Hansen Security - Enterprise Authorization System',
    description: 'Enterprise-grade fine-grained authorization system. Policy-based access control with RBAC and ABAC support. Zero-trust architecture and audit logging.',
    images: [
      {
        url: '/og-hansen-security.jpg',
        width: 1200,
        height: 630,
        alt: 'Hansen Security - Enterprise Authorization System'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hansen Security - Enterprise Authorization System',
    description: 'Enterprise-grade fine-grained authorization system. Policy-based access control with RBAC and ABAC support.',
    creator: '@catohansen'
  },
  alternates: {
    canonical: 'https://www.catohansen.no/hansen-security'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function HansenSecurityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



