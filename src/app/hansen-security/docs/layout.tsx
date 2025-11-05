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
  title: 'Hansen Security Documentation',
  description: 'Complete documentation for Hansen Security authorization system'
}

export default function HansenSecurityDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



