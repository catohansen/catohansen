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
  title: 'Hansen Security Admin Demo | Dashboard Preview | Cato Hansen',
  description: 'Demo preview of Hansen Security admin dashboard. Enterprise-grade authorization system with zero-trust architecture. Not connected to real system - marketing showcase.',
  openGraph: {
    title: 'Hansen Security Admin Demo',
    description: 'Demo preview of Hansen Security admin dashboard'
  }
}

export default function HansenSecurityDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



