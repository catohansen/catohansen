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
 * API Route: /api/modules/[moduleId]/sync
 * Sync module to/from GitHub
 */

import { NextRequest, NextResponse } from 'next/server'
import { moduleSyncManager } from '@/modules/module-management/core/ModuleSyncManager'
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

export const POST = withLogging(async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Module sync requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { direction = 'to-github', dryRun = false, force = false } = body

    let result

    if (direction === 'to-github') {
      result = await moduleSyncManager.syncToGitHub(params.moduleId, {
        dryRun,
        force,
      })
    } else if (direction === 'from-github') {
      result = await moduleSyncManager.syncFromGitHub(params.moduleId, {
        dryRun,
        force,
      })
    } else if (direction === 'bidirectional') {
      const { toGitHub, fromGitHub } = await moduleSyncManager.bidirectionalSync(
        params.moduleId,
        { dryRun, force }
      )
      result = {
        success: toGitHub.success && fromGitHub.success,
        toGitHub,
        fromGitHub,
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid direction. Must be: to-github, from-github, or bidirectional' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to sync module' },
      { status: 500 }
    )
  }
})

