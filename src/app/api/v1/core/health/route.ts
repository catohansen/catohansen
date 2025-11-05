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
 * Health Check API - v1
 * 
 * Provides system health status for monitoring and load balancers
 * 
 * GET /api/v1/core/health
 * 
 * Returns:
 * - status: 'ok' | 'degraded' | 'error'
 * - uptime: Process uptime in seconds
 * - timestamp: Current server timestamp
 * - version: API version
 * - environment: NODE_ENV
 * - checks: Individual service health checks
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

interface HealthCheck {
  name: string
  status: 'ok' | 'degraded' | 'error'
  message?: string
  latency?: number
}

export async function GET() {
  const startTime = Date.now()
  const checks: HealthCheck[] = []
  let overallStatus: 'ok' | 'degraded' | 'error' = 'ok'

  // Database health check
  try {
    const dbStartTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbLatency = Date.now() - dbStartTime
    
    checks.push({
      name: 'database',
      status: dbLatency < 1000 ? 'ok' : dbLatency < 5000 ? 'degraded' : 'error',
      latency: dbLatency,
      message: dbLatency < 1000 
        ? 'Database connection healthy' 
        : dbLatency < 5000 
          ? 'Database response slow' 
          : 'Database response very slow'
    })

    if (dbLatency >= 5000) {
      overallStatus = 'error'
    } else if (dbLatency >= 1000) {
      overallStatus = overallStatus === 'ok' ? 'degraded' : overallStatus
    }
  } catch (error) {
    checks.push({
      name: 'database',
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed'
    })
    overallStatus = 'error'
  }

  // Memory check
  try {
    const memoryUsage = process.memoryUsage()
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024
    const heapTotalMB = memoryUsage.heapTotal / 1024 / 1024
    const memoryPercent = (heapUsedMB / heapTotalMB) * 100

    checks.push({
      name: 'memory',
      status: memoryPercent < 80 ? 'ok' : memoryPercent < 95 ? 'degraded' : 'error',
      message: `Heap: ${heapUsedMB.toFixed(2)}MB / ${heapTotalMB.toFixed(2)}MB (${memoryPercent.toFixed(1)}%)`,
      latency: memoryPercent
    })

    if (memoryPercent >= 95) {
      overallStatus = 'error'
    } else if (memoryPercent >= 80) {
      overallStatus = overallStatus === 'ok' ? 'degraded' : overallStatus
    }
  } catch (error) {
    checks.push({
      name: 'memory',
      status: 'error',
      message: 'Failed to check memory usage'
    })
    overallStatus = 'error'
  }

  // API version and environment
  const responseTime = Date.now() - startTime

  return NextResponse.json({
    status: overallStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: 'v1',
    environment: process.env.NODE_ENV || 'unknown',
    responseTime,
    checks,
    metadata: {
      nodeVersion: process.version,
      platform: process.platform,
    }
  }, {
    status: overallStatus === 'error' ? 503 : overallStatus === 'degraded' ? 200 : 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Check': 'true',
    }
  })
}



