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
 * Clients API Route
 * GET /api/modules/client-management/clients
 * POST /api/modules/client-management/clients
 */

import { NextRequest, NextResponse } from 'next/server'
import { ClientManager } from '@/modules/client-management/core/ClientManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { withLogging } from '@/lib/observability/withLogging'

const clientManager = new ClientManager()

async function getClients(request: NextRequest) {
  try {
    // Check authorization
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token (simplified - use proper JWT in production)
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    // Check authorization with Hansen Security
    const principal = {
      id: userId,
      roles: ['OWNER'], // Get from token/database
      attributes: {}
    }

    const resource = {
      kind: 'client',
      id: 'client-management',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      await auditLogger.logDecision({
        principalId: userId,
        principalRoles: ['OWNER'],
        resource: 'client',
        resourceId: 'client-management',
        action: 'read',
        decision: 'DENY',
        effect: 'DENY',
        reason: hasAccess.reason || 'Access denied by policy'
      })

      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const lifecycleStage = searchParams.get('lifecycleStage') || undefined
    const industry = searchParams.get('industry') || undefined
    const search = searchParams.get('search') || undefined
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    // Get clients
    const result = await clientManager.getClients({
      status,
      lifecycleStage,
      industry,
      search,
      tags,
      limit,
      offset
    })

    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'client',
      resourceId: 'client-management',
      action: 'read',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Clients fetched successfully'
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total
    })
  } catch (error: any) {
    console.error('Get clients error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createClient(request: NextRequest) {
  try {
    // Check authorization
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token and get user
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    // Check authorization with Hansen Security
    const principal = {
      id: userId,
      roles: ['OWNER'],
      attributes: {}
    }

    const resource = {
      kind: 'client',
      id: 'client-management',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'create')

    if (!hasAccess.allowed) {
      await auditLogger.logDecision({
        principalId: userId,
        principalRoles: ['OWNER'],
        resource: 'client',
        resourceId: 'client-management',
        action: 'create',
        decision: 'DENY',
        effect: 'DENY',
        reason: hasAccess.reason || 'Access denied by policy'
      })

      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const client = await clientManager.createClient(body, userId)

    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'client',
      resourceId: client.id,
      action: 'create',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Client created successfully'
    })

    return NextResponse.json({
      success: true,
      data: client
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create client error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getClients)
export const POST = withLogging(createClient)







