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
 * Documents API Route
 * GET /api/modules/client-management/documents
 * POST /api/modules/client-management/documents
 */

import { NextRequest, NextResponse } from 'next/server'
import { DocumentManager } from '@/modules/client-management/core/DocumentManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { withLogging } from '@/lib/observability/withLogging'

const documentManager = new DocumentManager()

async function getDocuments(request: NextRequest) {
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
      kind: 'document',
      id: '*',
      attributes: {}
    }, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const filters: any = {}

    if (searchParams.get('clientId')) filters.clientId = searchParams.get('clientId')
    if (searchParams.get('pipelineId')) filters.pipelineId = searchParams.get('pipelineId')
    if (searchParams.get('category')) filters.category = searchParams.get('category')
    if (searchParams.get('search')) filters.search = searchParams.get('search')
    if (searchParams.get('limit')) filters.limit = parseInt(searchParams.get('limit') || '100')
    if (searchParams.get('offset')) filters.offset = parseInt(searchParams.get('offset') || '0')

    const result = await documentManager.getDocuments(filters)

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total
    })
  } catch (error: any) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createDocument(request: NextRequest) {
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
      kind: 'document',
      id: '*',
      attributes: {}
    }, 'create')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const document = await documentManager.createDocument(body, userId)

    return NextResponse.json({
      success: true,
      data: document
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create document error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getDocuments)
export const POST = withLogging(createDocument)







