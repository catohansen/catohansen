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
 * API Route: /api/modules/discover
 * Auto-discover and register modules from src/modules directory
 */

import { NextRequest, NextResponse } from 'next/server'
import { moduleManager } from '@/modules/module-management/core/ModuleManager'
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

export const POST = withLogging(async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Module discovery requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    const result = await moduleManager.registerAllModules()

    return NextResponse.json({
      success: true,
      discovered: result.success,
      failed: result.failed,
      errors: result.errors,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to discover modules' },
      { status: 500 }
    )
  }
})





