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
 * API Route: /api/modules/onboarding/analytics
 * Track onboarding analytics
 */

import { NextRequest, NextResponse } from 'next/server'
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

    const body = await req.json()
    const { sessionId, step, action, field, errorCode, metadata, duration } = body

    // Create analytics record
    await prisma.onboardingAnalytics.create({
      data: {
        userId: user.id,
        sessionId: sessionId || `session-${Date.now()}`,
        step: step || 1,
        action: action || 'unknown',
        field: field || null,
        errorCode: errorCode || null,
        duration: duration || null,
        metadata: metadata || {},
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    // Don't fail the request if analytics fails
    console.error('Analytics error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * GET /api/modules/onboarding/analytics
 * Get onboarding analytics summary
 */
export const GET = withLogging(async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Analytics requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    const { searchParams } = req.nextUrl
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Get analytics summary
    const where: any = {}
    if (startDate) {
      where.timestamp = { ...where.timestamp, gte: new Date(startDate) }
    }
    if (endDate) {
      where.timestamp = { ...where.timestamp, lte: new Date(endDate) }
    }

    const [total, byStep, byAction, dropOffs] = await Promise.all([
      prisma.onboardingAnalytics.count({ where }),
      prisma.onboardingAnalytics.groupBy({
        by: ['step'],
        where,
        _count: true,
      }),
      prisma.onboardingAnalytics.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      prisma.onboardingAnalytics.findMany({
        where: { ...where, action: 'abandon' },
        orderBy: { step: 'asc' },
      }),
    ])

    // Calculate completion rate
    const started = await prisma.onboardingAnalytics.count({
      where: { ...where, action: 'start' },
    })
    const completed = await prisma.onboardingAnalytics.count({
      where: { ...where, action: 'complete' },
    })
    const completionRate = started > 0 ? (completed / started) * 100 : 0

    // Calculate average duration per step
    const stepDurations = await prisma.onboardingAnalytics.findMany({
      where: { ...where, duration: { not: null } },
      select: { step: true, duration: true },
    })

    const avgDurationByStep = stepDurations.reduce(
      (acc: Record<number, { total: number; count: number }>, record) => {
        if (!record.duration) return acc
        if (!acc[record.step]) {
          acc[record.step] = { total: 0, count: 0 }
        }
        acc[record.step].total += record.duration
        acc[record.step].count += 1
        return acc
      },
      {}
    )

    const avgDurations = Object.entries(avgDurationByStep).map(([step, data]) => ({
      step: parseInt(step),
      avgDuration: data.total / data.count,
    }))

    // Calculate error frequency
    const errors = await prisma.onboardingAnalytics.groupBy({
      by: ['errorCode'],
      where: { ...where, action: 'error', errorCode: { not: null } },
      _count: true,
      orderBy: {
        _count: {
          errorCode: 'desc',
        },
      },
    })

    return NextResponse.json({
      success: true,
      analytics: {
        total,
        started,
        completed,
        completionRate: Math.round(completionRate * 100) / 100,
        byStep: byStep.map((s) => ({
          step: s.step,
          count: s._count,
        })),
        byAction: byAction.map((a) => ({
          action: a.action,
          count: a._count,
        })),
        dropOffs: dropOffs.map((d) => ({
          step: d.step,
          timestamp: d.timestamp,
        })),
        avgDurations,
        errors: errors.map((e) => ({
          errorCode: e.errorCode,
          count: e._count,
        })),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get analytics' },
      { status: 500 }
    )
  }
})

