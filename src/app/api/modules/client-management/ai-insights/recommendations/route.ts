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
 * AI Recommendations API Route
 * GET /api/modules/client-management/ai-insights/recommendations
 */

import { NextRequest, NextResponse } from 'next/server'
import { AIInsightsEngine } from '@/modules/client-management/core/AIInsightsEngine'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { withLogging } from '@/lib/observability/withLogging'

const aiInsights = new AIInsightsEngine()

async function getRecommendations(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')
    const dealId = searchParams.get('dealId')

    if (clientId) {
      const recommendations = await aiInsights.getClientRecommendations(clientId)
      return NextResponse.json({
        success: true,
        data: recommendations
      })
    } else if (dealId) {
      const recommendation = await aiInsights.getNextBestAction(dealId)
      return NextResponse.json({
        success: true,
        data: recommendation ? [recommendation] : []
      })
    } else {
      return NextResponse.json({ error: 'clientId or dealId required' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Get recommendations error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getRecommendations)







