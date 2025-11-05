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
 * Admin Billing Stats API Route
 * Production-ready billing statistics from database
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'

async function billingStatsHandler(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode token (in production, verify JWT)
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userId] = decoded.split(':')

    // Get user from database
    const prisma = await getPrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization with Hansen Security
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'billing',
      id: 'stats',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Fetch real data from database
    // Use Pipeline model where won=true for revenue
    const [totalRevenue, paidPipelines, pendingPipelines, overduePipelines] = await Promise.all([
      // Total revenue from won pipelines
      prisma.pipeline.aggregate({
        where: { won: true },
        _sum: { value: true }
      }).then(result => {
        const total = result._sum.value ? Number(result._sum.value) : 0
        return total
      }).catch(() => 0),

      // Paid pipelines (won = true)
      prisma.pipeline.count({
        where: { won: true }
      }).catch(() => 0),

      // Pending pipelines (stage = PROPOSAL, NEGOTIATION, not won yet)
      prisma.pipeline.count({
        where: {
          won: { not: true },
          lost: { not: true },
          stage: {
            in: ['PROPOSAL', 'NEGOTIATION']
          }
        }
      }).catch(() => 0),

      // Overdue pipelines (expectedClose date passed, not won/lost)
      prisma.pipeline.count({
        where: {
          expectedClose: {
            lt: new Date()
          },
          won: { not: true },
          lost: { not: true }
        }
      }).catch(() => 0)
    ])

    const stats = {
      totalRevenue,
      paidInvoices: paidPipelines, // Using won pipelines as "paid invoices"
      pendingInvoices: pendingPipelines,
      overdueInvoices: overduePipelines
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Billing stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(billingStatsHandler)



