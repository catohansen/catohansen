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
 * API Route: /api/modules/onboarding/auto-fill
 * Auto-fill module info from MODULE_INFO.json
 */

import { NextRequest, NextResponse } from 'next/server'
import { onboardingStateManager } from '@/modules/module-management/core/OnboardingState'
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

    const { searchParams } = req.nextUrl
    const moduleName = searchParams.get('module')

    if (!moduleName) {
      return NextResponse.json(
        { error: 'Module name is required' },
        { status: 400 }
      )
    }

    const moduleInfo = await onboardingStateManager.autoFillFromModuleInfo(moduleName)

    return NextResponse.json({
      success: true,
      moduleInfo,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to auto-fill module info' },
      { status: 500 }
    )
  }
})





