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
 * Observability Metrics Store
 * Centralized metrics storage for all modules
 */

// In-memory metrics store (in production, use Redis or database)
export interface ModuleMetrics {
  moduleId: string
  requests: number
  errors: number
  avgResponseTime: number
  status: 'ok' | 'offline' | 'error'
  lastRequest?: Date
  lastError?: Date
  uptime: number // percentage
}

const metricsStore = new Map<string, ModuleMetrics>()

/**
 * Update metrics for a module
 */
export function updateModuleMetrics(
  moduleId: string,
  responseTime: number,
  isError: boolean = false
) {
  const existing = metricsStore.get(moduleId) || {
    moduleId,
    requests: 0,
    errors: 0,
    avgResponseTime: 0,
    status: 'ok' as const,
    uptime: 100
  }

  existing.requests++
  if (isError) {
    existing.errors++
    existing.lastError = new Date()
    existing.status = 'error'
  } else {
    existing.lastRequest = new Date()
    if (existing.status === 'error' && existing.errors / existing.requests < 0.1) {
      existing.status = 'ok'
    }
  }

  // Calculate rolling average response time
  existing.avgResponseTime = (existing.avgResponseTime * (existing.requests - 1) + responseTime) / existing.requests

  // Calculate uptime (percentage of successful requests)
  existing.uptime = existing.requests > 0 
    ? ((existing.requests - existing.errors) / existing.requests) * 100 
    : 100

  metricsStore.set(moduleId, existing)
}

/**
 * Get metrics for a module
 */
export function getModuleMetrics(moduleId: string): ModuleMetrics | undefined {
  return metricsStore.get(moduleId)
}

/**
 * Get all metrics
 */
export function getAllMetrics(): ModuleMetrics[] {
  return Array.from(metricsStore.values())
}

/**
 * Clear metrics for a module
 */
export function clearModuleMetrics(moduleId: string): void {
  metricsStore.delete(moduleId)
}

/**
 * Clear all metrics
 */
export function clearAllMetrics(): void {
  metricsStore.clear()
}



