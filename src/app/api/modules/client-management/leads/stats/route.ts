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
 * Lead Stats API Route
 * GET /api/modules/client-management/leads/stats
 */

import { NextRequest, NextResponse } from 'next/server'
import { LeadManager } from '@/modules/client-management/core/LeadManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { withLogging } from '@/lib/observability/withLogging'

const leadManager = new LeadManager()

async function getLeadStats(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const hasAccess = await policyEngine.evaluate({
      id: userId,
      roles: ['OWNER'],
      attributes: {}
    }, {
      kind: 'lead',
      id: 'lead-management',
      attributes: {}
    }, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const stats = await leadManager.getLeadStats()

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error: any) {
    console.error('Get lead stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getLeadStats)







