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
 * API Route: /api/modules
 * List all modules and module management endpoints
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
    // Check authentication
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization (OWNER/ADMIN only)
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Module management requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const syncStatus = searchParams.get('syncStatus')

    // Build where clause
    const where: any = {}
    
    if (category) {
      where.category = category
    }
    
    if (status) {
      where.status = status
    }
    
    if (syncStatus) {
      where.syncStatus = syncStatus
    }

    // Fetch modules with relations
    const modules = await prisma.module.findMany({
      where,
      include: {
        dependencies: {
          include: {
            dependsOn: {
              select: {
                id: true,
                name: true,
                displayName: true,
                version: true,
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
              },
            },
          },
        },
        releases: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        syncHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        healthChecks: {
          orderBy: { checkedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { displayName: 'asc' },
    })

    return NextResponse.json({
      success: true,
      modules,
      count: modules.length,
    })
  } catch (error: any) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch modules' },
      { status: 500 }
    )
  }
})

