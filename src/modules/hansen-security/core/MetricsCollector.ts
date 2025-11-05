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
 * Metrics Collector
 * Prometheus-compatible metrics for Hansen Security
 * 
 * Features:
 * - Decision counts (allow/deny)
 * - Latency metrics
 * - Policy evaluation metrics
 * - Error tracking
 */

export interface Metrics {
  decisions: {
    total: number
    allowed: number
    denied: number
  }
  latency: {
    p50: number // 50th percentile
    p95: number // 95th percentile
    p99: number // 99th percentile
    average: number
  }
  policyEvaluations: {
    total: number
    byPolicy: Record<string, number>
    byResource: Record<string, number>
  }
  errors: {
    total: number
    byType: Record<string, number>
  }
}

export class MetricsCollector {
  private decisionCounts = {
    total: 0,
    allowed: 0,
    denied: 0
  }
  private latencies: number[] = []
  private policyCounts: Map<string, number> = new Map()
  private resourceCounts: Map<string, number> = new Map()
  private errorCounts: Map<string, number> = new Map()

  /**
   * Record a decision
   */
  recordDecision(decision: 'ALLOW' | 'DENY', latencyMs: number, policyName?: string, resource?: string): void {
    this.decisionCounts.total++
    
    if (decision === 'ALLOW') {
      this.decisionCounts.allowed++
    } else {
      this.decisionCounts.denied++
    }

    // Record latency
    this.latencies.push(latencyMs)
    if (this.latencies.length > 10000) {
      this.latencies.shift() // Keep only recent 10k measurements
    }

    // Record policy usage
    if (policyName) {
      const count = this.policyCounts.get(policyName) || 0
      this.policyCounts.set(policyName, count + 1)
    }

    // Record resource usage
    if (resource) {
      const count = this.resourceCounts.get(resource) || 0
      this.resourceCounts.set(resource, count + 1)
    }
  }

  /**
   * Record an error
   */
  recordError(errorType: string): void {
    const count = this.errorCounts.get(errorType) || 0
    this.errorCounts.set(errorType, count + 1)
  }

  /**
   * Get current metrics
   */
  getMetrics(): Metrics {
    const sortedLatencies = [...this.latencies].sort((a, b) => a - b)
    const len = sortedLatencies.length

    return {
      decisions: { ...this.decisionCounts },
      latency: {
        p50: len > 0 ? sortedLatencies[Math.floor(len * 0.5)] : 0,
        p95: len > 0 ? sortedLatencies[Math.floor(len * 0.95)] : 0,
        p99: len > 0 ? sortedLatencies[Math.floor(len * 0.99)] : 0,
        average: len > 0 ? sortedLatencies.reduce((a, b) => a + b, 0) / len : 0
      },
      policyEvaluations: {
        total: this.decisionCounts.total,
        byPolicy: Object.fromEntries(this.policyCounts),
        byResource: Object.fromEntries(this.resourceCounts)
      },
      errors: {
        total: Array.from(this.errorCounts.values()).reduce((a, b) => a + b, 0),
        byType: Object.fromEntries(this.errorCounts)
      }
    }
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheus(): string {
    const metrics = this.getMetrics()
    const lines: string[] = []

    // Decision counts
    lines.push(`# TYPE hansen_security_decisions_total counter`)
    lines.push(`hansen_security_decisions_total{decision="allow"} ${metrics.decisions.allowed}`)
    lines.push(`hansen_security_decisions_total{decision="deny"} ${metrics.decisions.denied}`)
    lines.push(`hansen_security_decisions_total ${metrics.decisions.total}`)

    // Latency histogram
    lines.push(`# TYPE hansen_security_latency_ms histogram`)
    lines.push(`hansen_security_latency_ms{quantile="0.5"} ${metrics.latency.p50}`)
    lines.push(`hansen_security_latency_ms{quantile="0.95"} ${metrics.latency.p95}`)
    lines.push(`hansen_security_latency_ms{quantile="0.99"} ${metrics.latency.p99}`)
    lines.push(`hansen_security_latency_ms{quantile="avg"} ${metrics.latency.average}`)

    // Policy evaluations
    lines.push(`# TYPE hansen_security_policy_evaluations counter`)
    for (const [policy, count] of Object.entries(metrics.policyEvaluations.byPolicy)) {
      lines.push(`hansen_security_policy_evaluations{policy="${policy}"} ${count}`)
    }

    // Resource evaluations
    lines.push(`# TYPE hansen_security_resource_evaluations counter`)
    for (const [resource, count] of Object.entries(metrics.policyEvaluations.byResource)) {
      lines.push(`hansen_security_resource_evaluations{resource="${resource}"} ${count}`)
    }

    // Errors
    lines.push(`# TYPE hansen_security_errors_total counter`)
    lines.push(`hansen_security_errors_total ${metrics.errors.total}`)
    for (const [type, count] of Object.entries(metrics.errors.byType)) {
      lines.push(`hansen_security_errors_total{type="${type}"} ${count}`)
    }

    return lines.join('\n')
  }

  /**
   * Reset metrics (for testing)
   */
  reset(): void {
    this.decisionCounts = { total: 0, allowed: 0, denied: 0 }
    this.latencies = []
    this.policyCounts.clear()
    this.resourceCounts.clear()
    this.errorCounts.clear()
  }
}

// Default metrics collector instance
export const metricsCollector = new MetricsCollector()







