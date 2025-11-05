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
 * Convert Lead to Client API Route
 * POST /api/modules/client-management/leads/convert/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { LeadManager } from '@/modules/client-management/core/LeadManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { withLogging } from '@/lib/observability/withLogging'

const leadManager = new LeadManager()

async function convertLead(request: NextRequest, { params }: { params: { id: string } }) {
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
      id: params.id,
      attributes: {}
    }, 'update')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const lead = await leadManager.convertLeadToClient(params.id, userId)

    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'lead',
      resourceId: params.id,
      action: 'convert',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: `Lead converted to client: ${lead.clientId}`
    })

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead converted to client successfully'
    })
  } catch (error: any) {
    console.error('Convert lead error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withLogging(convertLead)







