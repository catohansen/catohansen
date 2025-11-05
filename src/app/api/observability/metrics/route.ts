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
 * Observability Metrics API
 * Expose system metrics for monitoring
 */

import { NextResponse } from 'next/server'
import { apiLogger } from '@/lib/observability/apiLogger'
import { cacheManager } from '@/lib/cache/CacheManager'
import { metricsCollector } from '@/modules/security2/core/MetricsCollector'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const apiMetrics = apiLogger.getAllMetrics()
    const cacheStats = cacheManager.getStats()
    const securityMetrics = metricsCollector.getMetrics()

    return NextResponse.json({
      success: true,
      data: {
        api: {
          endpoints: apiMetrics,
          summary: {
            totalEndpoints: apiMetrics.length,
            totalRequests: apiMetrics.reduce((sum, m) => sum + m.count, 0),
            avgLatency: apiMetrics.reduce((sum, m) => sum + m.avgLatency, 0) / apiMetrics.length || 0,
            errorRate: apiMetrics.reduce((sum, m) => sum + m.errorRate, 0) / apiMetrics.length || 0
          }
        },
        cache: cacheStats,
        security: {
          decisions: securityMetrics.decisions,
          latency: securityMetrics.latency,
          errors: securityMetrics.errors
        },
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    logger.error('Metrics API error', { endpoint: '/api/observability/metrics' }, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





