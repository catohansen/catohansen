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
 * Emails API Route
 * GET /api/modules/client-management/emails
 * POST /api/modules/client-management/emails
 */

import { NextRequest, NextResponse } from 'next/server'
import { EmailSystem } from '@/modules/client-management/core/EmailSystem'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { withLogging } from '@/lib/observability/withLogging'

const emailSystem = new EmailSystem()

async function getEmails(request: NextRequest) {
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
    if (searchParams.get('status')) filters.status = searchParams.get('status')
    if (searchParams.get('from')) filters.from = searchParams.get('from')
    if (searchParams.get('to')) filters.to = searchParams.get('to')
    if (searchParams.get('search')) filters.search = searchParams.get('search')
    if (searchParams.get('dateFrom')) filters.dateFrom = new Date(searchParams.get('dateFrom')!)
    if (searchParams.get('dateTo')) filters.dateTo = new Date(searchParams.get('dateTo')!)
    if (searchParams.get('limit')) filters.limit = parseInt(searchParams.get('limit') || '100')
    if (searchParams.get('offset')) filters.offset = parseInt(searchParams.get('offset') || '0')

    const result = await emailSystem.getEmails(filters)

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total
    })
  } catch (error: any) {
    console.error('Get emails error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendEmail(request: NextRequest) {
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
      id: '*',
      attributes: {}
    }, 'create')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const email = await emailSystem.sendEmail(body, userId)

    return NextResponse.json({
      success: true,
      data: email
    }, { status: 201 })
  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getEmails)
export const POST = withLogging(sendEmail)







