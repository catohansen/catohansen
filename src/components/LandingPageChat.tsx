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
 * Landing Page Chat
 * Wrapper for Nora Chat Bubble on landing page
 * Uses NoraChatBubble component from Nora module
 */

'use client'

import NoraChatBubble from '@/modules/nora/ui/chat/NoraChatBubble'

export interface LandingPageChatProps {
  currentPage?: string
  pageContent?: string
}

export default function LandingPageChat({ 
  currentPage = '/',
  pageContent
}: LandingPageChatProps) {
  return (
    <NoraChatBubble
      position="bottom-right" // Default, but will be overridden by admin config
      enabled={true}
      pageContext={currentPage}
      moduleContext={['landing', 'hansen-global']}
    />
  )
}
