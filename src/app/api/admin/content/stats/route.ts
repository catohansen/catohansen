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
 * Content Management Stats API Route
 * Production-ready content statistics from database
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'
import { audit } from '@/lib/audit/audit'

async function contentStatsHandler(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode token
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

    // Check authorization
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'content',
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
    const [totalPages, totalSections, totalMedia, seoPages] = await Promise.all([
      // Total pages (using Post model for now, can add Page model later)
      prisma.post.count().catch(() => 0),
      
      // Sections (count from Post content structure, simplified for now)
      Promise.resolve(0), // TODO: Add Section model if needed
      
      // Media files
      prisma.media.count().catch(() => 0),
      
      // SEO pages (posts with published status)
      prisma.post.count({
        where: { status: 'PUBLISHED' }
      }).catch(() => 0)
    ])

    const stats = {
      totalPages,
      totalSections,
      totalMedia,
      seoPages
    }

    // Audit log
    await audit(request, {
      action: 'content.stats.get',
      resource: 'content',
      meta: stats
    })

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Content stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(contentStatsHandler)



