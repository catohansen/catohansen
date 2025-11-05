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
 * API Logger
 * Observability for all API routes
 * 
 * Features:
 * - Request/response logging
 * - Performance metrics (latency)
 * - Error tracking
 * - Cache hit rate
 * - Automatic alerting for slow APIs
 */

export interface APILogEntry {
  method: string
  path: string
  status: number
  latency: number // milliseconds
  timestamp: Date
  userId?: string
  error?: string
  cacheHit?: boolean
  metadata?: Record<string, unknown>
}

export interface APIMetrics {
  path: string
  method: string
  count: number
  avgLatency: number
  p50Latency: number
  p95Latency: number
  p99Latency: number
  minLatency: number
  maxLatency: number
  errorRate: number
  cacheHitRate: number
  successRate: number
  lastRequest: Date
  requestsPerSecond?: number
}

export class APILogger {
  private logs: APILogEntry[] = []
  private maxLogs = 10000
  private metrics: Map<string, APIMetrics> = new Map()

  /**
   * Log API request
   */
  logRequest(entry: APILogEntry): void {
    this.logs.push(entry)
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Update metrics
    this.updateMetrics(entry)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const statusColor = entry.status >= 500 ? '🔴' : entry.status >= 400 ? '🟡' : '🟢'
      const cacheIndicator = entry.cacheHit ? '💾' : ''
      console.log(
        `${statusColor} ${cacheIndicator} ${entry.method} ${entry.path} - ${entry.status} - ${entry.latency}ms`
      )
    }

    // Alert on slow requests (P95 > 1s)
    if (entry.latency > 1000) {
      this.alertSlowRequest(entry)
    }
  }

  /**
   * Update metrics for API endpoint
   */
  private updateMetrics(entry: APILogEntry): void {
    const key = `${entry.method}:${entry.path}`
    let metric = this.metrics.get(key)

    if (!metric) {
      metric = {
        path: entry.path,
        method: entry.method,
        count: 0,
        avgLatency: 0,
        p50Latency: 0,
        p95Latency: 0,
        p99Latency: 0,
        minLatency: 0,
        maxLatency: 0,
        errorRate: 0,
        cacheHitRate: 0,
        successRate: 100,
        lastRequest: new Date()
      }
    }

    metric.count++
    metric.avgLatency = (metric.avgLatency * (metric.count - 1) + entry.latency) / metric.count
    metric.lastRequest = entry.timestamp

    // Calculate error rate
    if (entry.status >= 400) {
      metric.errorRate = (metric.errorRate * (metric.count - 1) + 1) / metric.count
    } else {
      metric.errorRate = (metric.errorRate * (metric.count - 1)) / metric.count
    }

    // Calculate success rate
    metric.successRate = entry.status < 400 
      ? (metric.successRate * (metric.count - 1) + 1) / metric.count * 100
      : (metric.successRate * (metric.count - 1)) / metric.count * 100

    // Calculate cache hit rate
    if (entry.cacheHit !== undefined) {
      metric.cacheHitRate = (metric.cacheHitRate * (metric.count - 1) + (entry.cacheHit ? 1 : 0)) / metric.count
    }

    // Calculate requests per second (simplified - based on last 60 seconds)
    const recentRequests = this.logs
      .filter(l => l.path === entry.path && l.method === entry.method)
      .filter(l => {
        const timeDiff = entry.timestamp.getTime() - l.timestamp.getTime()
        return timeDiff <= 60000 // Last 60 seconds
      })
    
    if (recentRequests.length > 0) {
      metric.requestsPerSecond = recentRequests.length / 60
    }

    // Calculate percentiles (improved percentile calculation)
    const recentLogs = this.logs
      .filter(l => l.path === entry.path && l.method === entry.method)
      .slice(-1000) // Increased sample size for better accuracy
      .map(l => l.latency)
      .sort((a, b) => a - b)

    if (recentLogs.length > 0) {
      // Calculate P50 (median), P95, P99 percentiles
      metric.p50Latency = recentLogs[Math.floor(recentLogs.length * 0.50)] || 0
      metric.p95Latency = recentLogs[Math.floor(recentLogs.length * 0.95)] || 0
      metric.p99Latency = recentLogs[Math.floor(recentLogs.length * 0.99)] || 0
      
      // Calculate min and max latency
      metric.minLatency = recentLogs[0] || 0
      metric.maxLatency = recentLogs[recentLogs.length - 1] || 0
    }

    this.metrics.set(key, metric)
  }

  /**
   * Alert on slow requests
   */
  private alertSlowRequest(entry: APILogEntry): void {
    // In production, send to monitoring system (Sentry, Datadog, etc.)
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Slow API request: ${entry.method} ${entry.path} - ${entry.latency}ms`)
    }
  }

  /**
   * Get metrics for API endpoint
   */
  getMetrics(path: string, method: string): APIMetrics | undefined {
    const key = `${method}:${path}`
    return this.metrics.get(key)
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): APIMetrics[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit = 100): APILogEntry[] {
    return this.logs.slice(-limit).reverse()
  }

  /**
   * Get logs for path
   */
  getLogsForPath(path: string, limit = 100): APILogEntry[] {
    return this.logs
      .filter(l => l.path === path)
      .slice(-limit)
      .reverse()
  }
}

// Default API logger instance
export const apiLogger = new APILogger()





