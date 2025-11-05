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
 * API Route Wrapper with Automatic Logging
 * Use this wrapper to automatically log all API requests
 */

import { NextRequest, NextResponse } from 'next/server'
import { apiLogger } from './apiLogger'
import { updateModuleMetrics } from '@/lib/observability/metrics'

export function withLogging(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const startTime = Date.now()
    const method = request.method
    const path = request.nextUrl.pathname
    
    try {
      const response = await handler(request, ...args)
      const latency = Date.now() - startTime
      const status = response.status

      // Log successful request
      apiLogger.logRequest({
        method,
        path,
        status,
        latency,
        timestamp: new Date(),
        cacheHit: response.headers.get('x-cache-hit') === 'true',
        metadata: {
          userAgent: request.headers.get('user-agent') || undefined,
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        }
      })

      // Update module metrics if path is module-related
      const moduleMatch = path.match(/\/api\/v1\/modules\/([^\/]+)/)
      if (moduleMatch) {
        const moduleId = moduleMatch[1]
        updateModuleMetrics(moduleId, latency, status >= 400)
      }

      return response
    } catch (error) {
      const latency = Date.now() - startTime

      // Log error
      apiLogger.logRequest({
        method,
        path,
        status: 500,
        latency,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          userAgent: request.headers.get('user-agent') || undefined,
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        }
      })

      // Update module metrics if path is module-related
      const moduleMatch = path.match(/\/api\/v1\/modules\/([^\/]+)/)
      if (moduleMatch) {
        const moduleId = moduleMatch[1]
        updateModuleMetrics(moduleId, latency, true)
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

