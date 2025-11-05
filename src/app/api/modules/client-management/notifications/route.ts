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
 * Notifications API Route
 * GET /api/modules/client-management/notifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { NotificationManager } from '@/modules/client-management/core/NotificationManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { withLogging } from '@/lib/observability/withLogging'

const notificationManager = new NotificationManager()

async function getNotifications(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const searchParams = request.nextUrl.searchParams
    const filters: any = {
      userId
    }

    if (searchParams.get('read') !== null) {
      filters.read = searchParams.get('read') === 'true'
    }
    if (searchParams.get('type')) filters.type = searchParams.get('type')
    if (searchParams.get('limit')) filters.limit = parseInt(searchParams.get('limit') || '50')
    if (searchParams.get('offset')) filters.offset = parseInt(searchParams.get('offset') || '0')

    const result = await notificationManager.getNotifications(filters)

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
      unread: result.unread
    })
  } catch (error: any) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getNotifications)







