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
 * AI Predictions API Route
 * GET /api/modules/client-management/ai-insights/predictions
 */

import { NextRequest, NextResponse } from 'next/server'
import { AIInsightsEngine } from '@/modules/client-management/core/AIInsightsEngine'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { withLogging } from '@/lib/observability/withLogging'

const aiInsights = new AIInsightsEngine()

async function getPredictions(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'deal', 'churn', 'lead'
    const dealId = searchParams.get('dealId')
    const clientId = searchParams.get('clientId')
    const leadId = searchParams.get('leadId')

    if (type === 'deal' && dealId) {
      const prediction = await aiInsights.predictDealWinProbability(dealId)
      return NextResponse.json({
        success: true,
        data: prediction
      })
    } else if (type === 'churn' && clientId) {
      const churnRisk = await aiInsights.predictChurnRisk(clientId)
      return NextResponse.json({
        success: true,
        data: {
          churnRisk,
          confidence: 75,
          factors: []
        }
      })
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Get predictions error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getPredictions)







