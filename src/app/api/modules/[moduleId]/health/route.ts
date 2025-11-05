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
 * API Route: /api/modules/[moduleId]/health
 * Get module health metrics
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

    const latestHealth = module.healthChecks[0]

    const health = {
      buildStatus: module.buildStatus,
      testCoverage: module.testCoverage,
      lintStatus: module.lintStatus,
      lastBuild: module.lastBuild,
      lastTest: module.lastTest,
      lastLint: module.lintStatus,
      latestHealthCheck: latestHealth
        ? {
            buildPassing: latestHealth.buildPassing,
            testsPassing: latestHealth.testsPassing,
            lintPassing: latestHealth.lintPassing,
            coverage: latestHealth.coverage,
            dependenciesOutdated: latestHealth.dependenciesOutdated,
            vulnerabilities: latestHealth.vulnerabilities,
            buildTime: latestHealth.buildTime,
            testTime: latestHealth.testTime,
            bundleSize: latestHealth.bundleSize,
            checkedAt: latestHealth.checkedAt,
          }
        : null,
      history: module.healthChecks.map((hc) => ({
        checkedAt: hc.checkedAt,
        buildPassing: hc.buildPassing,
        testsPassing: hc.testsPassing,
        lintPassing: hc.lintPassing,
        coverage: hc.coverage,
        vulnerabilities: hc.vulnerabilities,
      })),
    }

    return NextResponse.json({ success: true, health })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch module health' },
      { status: 500 }
    )
  }
})





