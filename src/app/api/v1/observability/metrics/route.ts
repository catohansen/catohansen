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
 * Observability Metrics API - v1
 * 
 * Provides real-time metrics for all modules including:
 * - API response times
 * - Error rates
 * - Request counts
 * - Module health status
 * - Uptime statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getModules } from '@/lib/modules/modules.service'
import { apiLogger } from '@/lib/observability/apiLogger'
import { getModuleMetrics, getAllMetrics } from '@/lib/observability/metrics'
import { addCompressionHeaders, getResponseSize } from '@/lib/performance/compress'

/**
 * GET - Get metrics for all modules or a specific module
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const moduleId = searchParams.get('moduleId')
    
    let modules: any[]
    try {
      modules = await getModules()
    } catch (error) {
      logger.error('Failed to get modules in metrics API', {}, error as Error)
      return NextResponse.json({
        success: false,
        error: 'Failed to load modules',
        modules: [],
        aggregate: null
      }, { status: 500 })
    }

    // If specific module requested
    if (moduleId) {
      const metrics = getModuleMetrics(moduleId)
      if (!metrics) {
        return NextResponse.json({
          success: false,
          error: `No metrics found for module: ${moduleId}`
        }, { status: 404 })
      }

      // Try to get live status from module API with timeout
      let liveStatus = 'offline'
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
        
        const statusRes = await fetch(`${req.nextUrl.origin}/api/v1/modules/${moduleId}/status`, {
          cache: 'no-store',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (statusRes.ok) {
          const statusData = await statusRes.json()
          liveStatus = statusData.status === 'ok' ? 'ok' : 'offline'
        }
      } catch (error) {
        // Module API not available or timeout
        // Keep default 'offline' status
      }

      const response = NextResponse.json({
        success: true,
        module: moduleId,
        metrics: {
          ...metrics,
          status: liveStatus !== 'offline' ? liveStatus : metrics.status
        },
        timestamp: new Date().toISOString()
      })
      
      // Add compression headers
      addCompressionHeaders(response)
      
      // Cache headers for performance
      response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')
      response.headers.set('CDN-Cache-Control', 'public, s-maxage=60')
      
      return response
    }

    // Get API metrics from apiLogger
    let apiMetrics: any[] = []
    try {
      apiMetrics = apiLogger.getAllMetrics() || []
    } catch (error) {
      logger.error('Failed to get API metrics', {}, error as Error)
      // Continue with empty metrics array
    }
    
    // Get metrics for all modules
    const allMetrics = await Promise.all(
      modules.map(async (module) => {
        // Get metrics from store
        const metrics = getModuleMetrics(module.id) || {
          moduleId: module.id,
          requests: 0,
          errors: 0,
          avgResponseTime: 0,
          status: 'offline' as const,
          uptime: 0
        }

        // Try to get live status from module API with timeout
        let liveStatus = metrics.status
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
          
          const statusRes = await fetch(`${req.nextUrl.origin}/api/v1/modules/${module.id}/status`, {
            cache: 'no-store',
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          
          if (statusRes.ok) {
            const statusData = await statusRes.json()
            liveStatus = statusData.status === 'ok' ? 'ok' : 'offline'
          }
        } catch (error) {
          // Module API not available or timeout
          // Keep existing status
        }

        // Try to get API metrics for this module
        const moduleApiMetrics = (apiMetrics || []).filter(m => 
          m && m.path && (
            m.path.includes(`/modules/${module.id}`) || 
            m.path.includes(`/api/${module.id}`) ||
            m.path.includes(`/api/v1/modules/${module.id}`)
          )
        )
        
        const apiRequests = moduleApiMetrics.reduce((sum, m) => sum + (m.count || 0), 0)
        const apiErrors = moduleApiMetrics.reduce((sum, m) => sum + ((m.errorRate || 0) * (m.count || 0)), 0)
        const apiAvgLatency = moduleApiMetrics.length > 0
          ? moduleApiMetrics.reduce((sum, m) => sum + (m.avgLatency || 0), 0) / moduleApiMetrics.length
          : 0

        // Merge metrics from API logger with stored metrics
        return {
          ...metrics,
          name: module.displayName || module.name,
          status: liveStatus !== 'offline' ? liveStatus : metrics.status,
          requests: Math.max(metrics.requests, apiRequests),
          errors: Math.max(metrics.errors, Math.round(apiErrors)),
          avgResponseTime: apiAvgLatency > 0 ? apiAvgLatency : metrics.avgResponseTime
        }
      })
    )

    // Calculate aggregate statistics
    const totalRequests = allMetrics.reduce((sum, m) => sum + (m.requests || 0), 0)
    const totalErrors = allMetrics.reduce((sum, m) => sum + (m.errors || 0), 0)
    const avgResponseTime = allMetrics.length > 0
      ? allMetrics.reduce((sum, m) => sum + (m.avgResponseTime || 0), 0) / allMetrics.length
      : 0
    const overallUptime = totalRequests > 0
      ? ((totalRequests - totalErrors) / totalRequests) * 100
      : 100

    const responseData = {
      success: true,
      modules: allMetrics,
      aggregate: {
        totalModules: allMetrics.length,
        totalRequests,
        totalErrors,
        avgResponseTime: Math.round(avgResponseTime),
        overallUptime: Math.round(overallUptime * 100) / 100,
        healthyModules: allMetrics.filter(m => m && m.status === 'ok').length,
        offlineModules: allMetrics.filter(m => m && m.status === 'offline').length,
        errorModules: allMetrics.filter(m => m && m.status === 'error').length
      },
      timestamp: new Date().toISOString()
    }
    
    const response = NextResponse.json(responseData)
    
    // Add compression headers and performance metadata
    addCompressionHeaders(response)
    response.headers.set('X-Response-Size', getResponseSize(responseData).toString())
    
    // Cache headers for performance
    // Short cache for metrics (30 seconds) with stale-while-revalidate
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60')
    
    return response
  } catch (error) {
    logger.error('Failed to get observability metrics', { endpoint: '/api/v1/observability/metrics' }, error as Error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve metrics'
    }, { status: 500 })
  }
}

