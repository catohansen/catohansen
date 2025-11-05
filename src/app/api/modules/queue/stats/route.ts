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
 * API Route: /api/modules/queue/stats
 * Get sync queue statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { syncQueueManager } from '@/modules/module-management/core/SyncQueueManager'
import { withLogging } from '@/lib/observability/withLogging'
import { prisma } from '@/lib/db/prisma'

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get('admin-token')?.value
  
  if (!token) {
    return null
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    })

    if (!user || user.status !== 'ACTIVE') {
      return null
    }

    return user
  } catch {
    return null
  }
}

export const GET = withLogging(async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await syncQueueManager.getQueueStats()

    return NextResponse.json({ success: true, stats })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch queue stats' },
      { status: 500 }
    )
  }
})





