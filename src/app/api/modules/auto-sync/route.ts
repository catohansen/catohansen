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
 * API Route: /api/modules/auto-sync
 * Trigger automatic module synchronization
 * Can be called by cron jobs or webhooks
 */

import { NextRequest, NextResponse } from 'next/server'
import { autoSyncManager } from '@/modules/module-management/core/AutoSyncManager'
import { withLogging } from '@/lib/observability/withLogging'

export const POST = withLogging(async (req: NextRequest) => {
  try {
    // Optional: Check for webhook secret or cron token
    const authHeader = req.headers.get('authorization')
    const cronToken = process.env.CRON_SECRET || process.env.WEBHOOK_SECRET

    if (cronToken && authHeader !== `Bearer ${cronToken}`) {
      // If cron token is set, require it
      // Otherwise, allow unauthenticated (for webhook triggers)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Run auto-sync
    const result = await autoSyncManager.syncAll()

    return NextResponse.json({
      success: result.success,
      discovered: result.discovered,
      registered: result.registered,
      synced: result.synced,
      errors: result.errors,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Auto-sync failed' },
      { status: 500 }
    )
  }
})





