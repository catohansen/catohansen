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
 * ClientAgent API Route
 * Auto-responses and lead management automation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClientAgent } from '@/modules/ai-agents/core/ClientAgent'
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

    const agent = getClientAgent()

    switch (action) {
      case 'auto-respond':
        const response = await agent.generateAutoResponse(data.lead)
        return NextResponse.json({ success: true, result: response })

      case 'score-lead':
        const score = await agent.scoreLead(data.lead)
        return NextResponse.json({ success: true, result: score })

      case 'generate-follow-up':
        const followUp = await agent.generateFollowUp(data.lead)
        return NextResponse.json({ success: true, result: followUp })

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('ClientAgent API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
})

