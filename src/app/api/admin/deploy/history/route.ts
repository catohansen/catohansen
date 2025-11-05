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
 * Deployment History API
 * GET: Fetch deployment history
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'

/**
 * GET /api/admin/deploy/history
 * Fetch deployment history
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || (user.role !== 'OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Ikke autorisert' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [history, total] = await Promise.all([
      prisma.deploymentHistory.findMany({
        where,
        include: {
          config: {
            select: {
              id: true,
              name: true,
              serverUrl: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          startedAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.deploymentHistory.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      history,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Failed to fetch deployment history:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Kunne ikke hente historikk' },
      { status: 500 }
    )
  }
}





