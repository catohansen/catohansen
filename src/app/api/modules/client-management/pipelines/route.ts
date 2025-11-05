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
 * Pipelines API Route
 * GET /api/modules/client-management/pipelines
 * POST /api/modules/client-management/pipelines
 */

import { NextRequest, NextResponse } from 'next/server'
import { PipelineManager } from '@/modules/client-management/core/PipelineManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { withLogging } from '@/lib/observability/withLogging'

const pipelineManager = new PipelineManager()

async function getPipelines(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const result = await pipelineManager.getPipelines({
      clientId: searchParams.get('clientId') || undefined,
      stage: searchParams.get('stage') || undefined,
      won: searchParams.get('won') === 'true' ? true : searchParams.get('won') === 'false' ? false : undefined,
      lost: searchParams.get('lost') === 'true' ? true : searchParams.get('lost') === 'false' ? false : undefined,
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
    console.error('Get pipelines error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createPipeline(request: NextRequest) {
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
      kind: 'pipeline',
      id: 'pipeline-management',
      attributes: {}
    }, 'create')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const pipeline = await pipelineManager.createPipeline(body, userId)

    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: ['OWNER'],
      resource: 'pipeline',
      resourceId: pipeline.id,
      action: 'create',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Pipeline created successfully'
    })

    return NextResponse.json({
      success: true,
      data: pipeline
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create pipeline error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getPipelines)
export const POST = withLogging(createPipeline)







