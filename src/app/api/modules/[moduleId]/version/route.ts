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
 * API Route: /api/modules/[moduleId]/version
 * Bump module version
 */

import { NextRequest, NextResponse } from 'next/server'
import { versionManager } from '@/modules/module-management/core/VersionManager'
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
        { error: 'Forbidden - Version bump requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { type = 'auto', prerelease = false, prereleaseId = 'beta', createGitTag = true } = body

    const result = await versionManager.autoBumpVersion(params.moduleId, {
      type,
      prerelease,
      prereleaseId,
      createGitTag,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to bump version' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      oldVersion: result.oldVersion,
      newVersion: result.newVersion,
      type: result.type,
      changes: result.changes,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to bump version' },
      { status: 500 }
    )
  }
})

