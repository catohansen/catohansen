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
// import dynamic from 'next/dynamic' // TEMPORARILY DISABLED
import './globals.css'

export const metadata: Metadata = {
  title: 'Cato Hansen - AI Ekspert & Systemarkitekt',
  description: 'AI & LLM ekspert, systemarkitekt, webdesigner og entreprenør. Bygger innovative AI-systemer, skalerbare plattformer og digital innovasjon.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TEMPORARILY DISABLED FOR DEBUGGING - Re-enable after fixing loading issue
  // const NoraChatBubble = dynamic(() => import('@/modules/nora/ui/chat/NoraChatBubble'), {
  //   ssr: false,
  //   loading: () => null,
  // })
  return (
    <html lang="no">
      <body>
        {children}
        {/* TEMPORARILY DISABLED FOR DEBUGGING */}
        {/* <NoraChatBubble defaultOpen={false} enabled={true} /> */}
      </body>
    </html>
  )
}

