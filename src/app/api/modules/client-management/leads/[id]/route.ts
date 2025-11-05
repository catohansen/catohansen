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
 * Lead by ID API Route
 * GET /api/modules/client-management/leads/[id]
 * PATCH /api/modules/client-management/leads/[id]
 * DELETE /api/modules/client-management/leads/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { LeadManager } from '@/modules/client-management/core/LeadManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { withLogging } from '@/lib/observability/withLogging'

const leadManager = new LeadManager()

async function getLead(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lead = await leadManager.getLeadById(params.id)
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: lead })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateLead(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json()
    const lead = await leadManager.updateLead(params.id, body)
    
    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'lead',
      resourceId: params.id,
      action: 'update',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Lead updated successfully'
    })

    return NextResponse.json({ success: true, data: lead })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function deleteLead(request: NextRequest, { params }: { params: { id: string } }) {
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
    }, 'delete')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await leadManager.deleteLead(params.id)

    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'lead',
      resourceId: params.id,
      action: 'delete',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Lead deleted successfully'
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getLead)
export const PATCH = withLogging(updateLead)
export const DELETE = withLogging(deleteLead)







