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
 * API Route: /api/modules/onboarding/validate
 * Real-time validation for module onboarding
 */

import { NextRequest, NextResponse } from 'next/server'
import { moduleValidator } from '@/modules/module-management/core/ModuleValidator'
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

/**
 * POST /api/modules/onboarding/validate
 * Validate complete module information
 */
export const POST = withLogging(async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { moduleInfo, moduleName } = body

    const result = await moduleValidator.validateModule(moduleInfo, moduleName)

    return NextResponse.json({
      success: true,
      validation: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Validation failed' },
      { status: 500 }
    )
  }
})

/**
 * GET /api/modules/onboarding/validate
 * Quick validation for single field (real-time)
 */
export const GET = withLogging(async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = req.nextUrl
    const field = searchParams.get('field')
    const value = searchParams.get('value')
    const moduleInfoStr = searchParams.get('moduleInfo')

    if (!field || !value) {
      return NextResponse.json(
        { error: 'Field and value are required' },
        { status: 400 }
      )
    }

    const moduleInfo = moduleInfoStr ? JSON.parse(moduleInfoStr) : undefined

    const result = await moduleValidator.quickValidate(field, value, moduleInfo)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Validation failed' },
      { status: 500 }
    )
  }
})





