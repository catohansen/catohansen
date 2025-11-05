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
 * Communication by ID API Route
 * GET /api/modules/client-management/communications/[id]
 * PATCH /api/modules/client-management/communications/[id]
 * DELETE /api/modules/client-management/communications/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { CommunicationLogger } from '@/modules/client-management/core/CommunicationLogger'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { withLogging } from '@/lib/observability/withLogging'

const communicationLogger = new CommunicationLogger()

async function getCommunication(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const communication = await communicationLogger.getCommunicationById(params.id)
    
    if (!communication) {
      return NextResponse.json({ error: 'Communication not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: communication })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateCommunication(request: NextRequest, { params }: { params: { id: string } }) {
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
      id: params.id,
      attributes: {}
    }, 'update')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const communication = await communicationLogger.updateCommunication(params.id, body)
    
    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'communication',
      resourceId: params.id,
      action: 'update',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Communication updated successfully'
    })

    return NextResponse.json({ success: true, data: communication })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function deleteCommunication(request: NextRequest, { params }: { params: { id: string } }) {
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
      id: params.id,
      attributes: {}
    }, 'delete')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await communicationLogger.deleteCommunication(params.id)

    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'communication',
      resourceId: params.id,
      action: 'delete',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Communication deleted successfully'
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getCommunication)
export const PATCH = withLogging(updateCommunication)
export const DELETE = withLogging(deleteCommunication)







