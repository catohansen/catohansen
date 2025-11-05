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
 * Mark Notification as Read API Route
 * POST /api/modules/client-management/notifications/[id]/read
 */

import { NextRequest, NextResponse } from 'next/server'
import { NotificationManager } from '@/modules/client-management/core/NotificationManager'
import { withLogging } from '@/lib/observability/withLogging'

const notificationManager = new NotificationManager()

async function markAsRead(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notification = await notificationManager.markAsRead(params.id)

    return NextResponse.json({
      success: true,
      data: notification
    })
  } catch (error: any) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withLogging(markAsRead)







