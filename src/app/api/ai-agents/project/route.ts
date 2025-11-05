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
 * ProjectAgent API Route
 * Project status tracking and deadline management
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProjectAgent } from '@/modules/ai-agents/core/ProjectAgent'
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

    const agent = getProjectAgent()

    switch (action) {
      case 'analyze-status':
        const status = await agent.analyzeProjectStatus(data.project)
        return NextResponse.json({ success: true, result: status })

      case 'deadline-alert':
        const alert = await agent.generateDeadlineAlert(data.project)
        return NextResponse.json({ success: true, result: alert })

      case 'status-report':
        const report = await agent.generateStatusReport(data.project)
        return NextResponse.json({ success: true, result: report })

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('ProjectAgent API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
})

