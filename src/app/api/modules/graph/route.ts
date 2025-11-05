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
 * API Route: /api/modules/graph
 * Get dependency graph data for visualization
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

export const GET = withLogging(async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Module graph requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    // Get all modules with dependencies
    const modules = await prisma.module.findMany({
      include: {
        dependencies: {
          include: {
            dependsOn: {
              select: {
                id: true,
                name: true,
                displayName: true,
                version: true,
                buildStatus: true,
                syncStatus: true,
              },
            },
          },
        },
        dependents: {
          include: {
            module: {
              select: {
                id: true,
                name: true,
                displayName: true,
                version: true,
                buildStatus: true,
                syncStatus: true,
              },
            },
          },
        },
      },
    })

    // Transform to graph format (nodes and edges)
    const nodes = modules.map((module) => ({
      id: module.id,
      name: module.name,
      displayName: module.displayName,
      version: module.version,
      status: module.syncStatus,
      buildStatus: module.buildStatus,
      category: module.category,
      position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
    }))

    const edges: Array<{
      id: string
      source: string
      target: string
      type: string
      label?: string
    }> = []

    for (const module of modules) {
      // Add dependency edges
      for (const dep of module.dependencies) {
        edges.push({
          id: `${module.id}-${dep.dependsOnId}`,
          source: module.id,
          target: dep.dependsOnId,
          type: dep.type, // runtime, dev, peer
          label: dep.version,
        })
      }
    }

    return NextResponse.json({
      success: true,
      graph: {
        nodes,
        edges,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dependency graph' },
      { status: 500 }
    )
  }
})





