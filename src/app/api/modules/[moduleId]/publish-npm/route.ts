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
 * API Route: /api/modules/[moduleId]/publish-npm
 * Publish module to NPM
 */

import { NextRequest, NextResponse } from 'next/server'
import { npmPublisher } from '@/modules/module-management/core/NPMPublisher'
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
        { error: 'Forbidden - NPM publishing requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { version, access, tag, dryRun } = body

    const result = await npmPublisher.publishToNPM({
      moduleId: params.moduleId,
      version,
      access: access || 'public',
      tag: tag || 'latest',
      dryRun: dryRun || false,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to publish to NPM' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...result,
      success: result.success ?? true,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to publish to NPM' },
      { status: 500 }
    )
  }
})

/**
 * GET /api/modules/[moduleId]/publish-npm
 * Check package name availability and validate package.json
 */
export const GET = withLogging(async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const module = await prisma.module.findUnique({
      where: { id: params.moduleId },
    })

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Validate package.json
    const validation = await npmPublisher.validatePackageJson(module.name)

    // Check package name availability if package.json is valid
    let availability = null
    if (
      validation.valid &&
      validation.packageJson &&
      validation.packageJson.name
    ) {
      availability = await npmPublisher.checkPackageNameAvailability(
        validation.packageJson.name
      )
    }

    return NextResponse.json({
      success: true,
      validation,
      availability,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to check NPM publish status' },
      { status: 500 }
    )
  }
})

