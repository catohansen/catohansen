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

export const metadata: Metadata = {
  title: 'Hansen Auth - Modern Authentication Framework for TypeScript | Cato Hansen',
  description: 'Enterprise-grade authentication framework for TypeScript. Inspired by Better Auth, enhanced with advanced RBAC, policy engine, and audit logging. Framework-agnostic core with React, Vue, and Svelte adapters.',
  keywords: [
    'authentication',
    'auth framework',
    'TypeScript',
    'React',
    'Vue',
    'Svelte',
    'Next.js',
    'OAuth',
    'RBAC',
    'enterprise security',
    'Better Auth',
    'Hansen Auth',
    'Cato Hansen'
  ],
  openGraph: {
    title: 'Hansen Auth - Modern Authentication Framework',
    description: 'Enterprise-grade authentication framework for TypeScript. Framework-agnostic core with React, Vue, and Svelte adapters.',
    type: 'website',
    url: 'https://www.catohansen.no/hansen-auth',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hansen Auth - Modern Authentication Framework',
    description: 'Enterprise-grade authentication framework for TypeScript',
  },
}

export default function HansenAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}





