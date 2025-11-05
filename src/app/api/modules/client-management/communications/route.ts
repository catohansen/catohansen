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
 * Communications API Route
 * GET /api/modules/client-management/communications
 * POST /api/modules/client-management/communications
 */

import { NextRequest, NextResponse } from 'next/server'
import { CommunicationLogger } from '@/modules/client-management/core/CommunicationLogger'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { withLogging } from '@/lib/observability/withLogging'

const communicationLogger = new CommunicationLogger()

async function getCommunications(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const result = await communicationLogger.getCommunications({
      clientId: searchParams.get('clientId') || undefined,
      type: searchParams.get('type') || undefined,
      direction: searchParams.get('direction') || undefined,
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
    console.error('Get communications error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createCommunication(request: NextRequest) {
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
      kind: 'communication',
      id: 'communication-management',
      attributes: {}
    }, 'create')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const communication = await communicationLogger.createCommunication(body, userId)

    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'communication',
      resourceId: communication.id,
      action: 'create',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Communication logged successfully'
    })

    return NextResponse.json({
      success: true,
      data: communication
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create communication error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getCommunications)
export const POST = withLogging(createCommunication)







