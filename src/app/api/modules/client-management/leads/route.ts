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
 * Leads API Route
 * GET /api/modules/client-management/leads
 * POST /api/modules/client-management/leads
 */

import { NextRequest, NextResponse } from 'next/server'
import { LeadManager } from '@/modules/client-management/core/LeadManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { withLogging } from '@/lib/observability/withLogging'

const leadManager = new LeadManager()

async function getLeads(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const result = await leadManager.getLeads({
      status: searchParams.get('status') || undefined,
      source: searchParams.get('source') || undefined,
      qualified: searchParams.get('qualified') === 'true' ? true : searchParams.get('qualified') === 'false' ? false : undefined,
      converted: searchParams.get('converted') === 'true' ? true : searchParams.get('converted') === 'false' ? false : undefined,
      minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total
    })
  } catch (error: any) {
    console.error('Get leads error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createLead(request: NextRequest) {
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
    }, 'create')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const lead = await leadManager.createLead(body)

    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'lead',
      resourceId: lead.id,
      action: 'create',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Lead created with AI score: ' + lead.score
    })

    return NextResponse.json({
      success: true,
      data: lead
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create lead error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getLeads)
export const POST = withLogging(createLead)







