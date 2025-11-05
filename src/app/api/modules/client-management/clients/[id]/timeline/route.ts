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
 * Client Timeline API Route
 * GET /api/modules/client-management/clients/[id]/timeline
 */

import { NextRequest, NextResponse } from 'next/server'
import { Communication360 } from '@/modules/client-management/core/Communication360'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { withLogging } from '@/lib/observability/withLogging'

const communication360 = new Communication360()

async function getClientTimeline(request: NextRequest, { params }: { params: { id: string } }) {
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
      kind: 'client',
      id: params.id,
      attributes: {}
    }, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const timeline = await communication360.getClientTimeline(params.id)
    const stats = await communication360.getClientStats(params.id)

    return NextResponse.json({
      success: true,
      data: {
        timeline,
        stats
      }
    })
  } catch (error: any) {
    console.error('Get client timeline error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getClientTimeline)







