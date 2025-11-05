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
 * API Route: /api/modules/[moduleId]
 * Get, update, or delete specific module
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'

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
      include: {
        dependencies: {
          include: {
            dependsOn: true,
          },
        },
        dependents: {
          include: {
            module: true,
          },
        },
        releases: {
          orderBy: { createdAt: 'desc' },
        },
        syncHistory: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        healthChecks: {
          orderBy: { checkedAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, module })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch module' },
      { status: 500 }
    )
  }
})

export const PATCH = withLogging(async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Forbidden - Only OWNER can update modules' },
        { status: 403 }
      )
    }

    const body = await req.json()

    const module = await prisma.module.update({
      where: { id: params.moduleId },
      data: {
        displayName: body.displayName,
        description: body.description,
        githubRepo: body.githubRepo,
        githubUrl: body.githubUrl,
        npmPackage: body.npmPackage,
        version: body.version,
        category: body.category,
        status: body.status,
        autoSync: body.autoSync,
        syncStrategy: body.syncStrategy,
      },
    })

    return NextResponse.json({ success: true, module })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update module' },
      { status: 500 }
    )
  }
})

export const DELETE = withLogging(async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Forbidden - Only OWNER can delete modules' },
        { status: 403 }
      )
    }

    await prisma.module.delete({
      where: { id: params.moduleId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete module' },
      { status: 500 }
    )
  }
})

