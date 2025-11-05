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
 * ContentAgent API Route
 * SEO optimization and alt-text generation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getContentAgent } from '@/modules/ai-agents/core/ContentAgent'
import { withLogging } from '@/lib/observability/withLogging'

export const POST = withLogging(async (req: NextRequest) => {
  try {
    const { action, data } = await req.json()

    if (!action || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing action or data' },
        { status: 400 }
      )
    }

    const agent = getContentAgent()

    switch (action) {
      case 'optimize-seo':
        const seo = await agent.optimizeSEO(data.content, data.url)
        return NextResponse.json({ success: true, result: seo })

      case 'generate-alt-text':
        const altText = await agent.generateAltText(data.imagePath, data.context)
        return NextResponse.json({ success: true, result: altText })

      case 'improve-readability':
        const improved = await agent.improveReadability(data.content)
        return NextResponse.json({ success: true, result: improved })

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('ContentAgent API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
})

