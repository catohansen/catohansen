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
 * Anomaly Detection System
 * Detects unusual patterns in authorization decisions and user behavior
 * 
 * Features:
 * - Policy usage anomaly detection
 * - User behavior anomaly detection
 * - Risk scoring
 * - Real-time alerts
 * - Historical pattern analysis
 */

export interface Anomaly {
  id: string
  type: 'POLICY_ANOMALY' | 'BEHAVIOR_ANOMALY' | 'RISK_ANOMALY'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  principalId?: string
  resource?: string
  action?: string
  description: string
  riskScore: number // 0-100
  detectedAt: Date
  resolvedAt?: Date
  metadata?: Record<string, unknown>
}

export interface BehaviorBaseline {
  userId: string
  averageDecisionsPerHour: number
  commonResources: string[]
  commonActions: string[]
  typicalHours: number[] // Hours of day when user is active (0-23)
  typicalLocations?: string[] // Common countries/IP ranges
  lastUpdated: Date
}

export class AnomalyDetector {
  private anomalies: Anomaly[] = []
  private behaviorBaselines: Map<string, BehaviorBaseline> = new Map()
  private decisionHistory: Array<{
    principalId: string
    resource: string
    action: string
    decision: 'ALLOW' | 'DENY'
    timestamp: Date
  }> = []
  private maxHistory = 10000 // Keep last 10k decisions

  /**
   * Analyze decision for anomalies
   */
  async analyzeDecision(
    principalId: string,
    resource: string,
    action: string,
    decision: 'ALLOW' | 'DENY',
    context?: Record<string, unknown>
  ): Promise<{
    anomalyDetected: boolean
    riskScore: number
    anomalies?: Anomaly[]
  }> {
    const timestamp = new Date()

    // Record decision
    this.recordDecision(principalId, resource, action, decision, timestamp)

    // Check for anomalies
    const anomalies: Anomaly[] = []
    let riskScore = 0

    // 1. Check policy usage anomalies
    const policyAnomaly = this.detectPolicyAnomaly(principalId, resource, action)
    if (policyAnomaly) {
      anomalies.push(policyAnomaly)
      riskScore += 30
    }

    // 2. Check behavior anomalies
    const behaviorAnomaly = this.detectBehaviorAnomaly(principalId, resource, action, timestamp)
    if (behaviorAnomaly) {
      anomalies.push(behaviorAnomaly)
      riskScore += 40
    }

    // 3. Check risk patterns
    const riskAnomaly = this.detectRiskAnomaly(principalId, decision, context)
    if (riskAnomaly) {
      anomalies.push(riskAnomaly)
      riskScore += riskAnomaly.riskScore
    }

    // Update behavior baseline
    this.updateBaseline(principalId, resource, action, timestamp)

    if (anomalies.length > 0) {
      this.anomalies.push(...anomalies)
    }

    return {
      anomalyDetected: anomalies.length > 0,
      riskScore: Math.min(riskScore, 100),
      anomalies: anomalies.length > 0 ? anomalies : undefined
    }
  }

  /**
   * Detect policy usage anomalies
   */
  private detectPolicyAnomaly(
    principalId: string,
    resource: string,
    action: string
  ): Anomaly | null {
    // Check if user suddenly starts accessing new resource types
    const userHistory = this.decisionHistory.filter(d => d.principalId === principalId)
    const recentResources = userHistory
      .slice(-100)
      .map(d => d.resource)
      .filter((v, i, a) => a.indexOf(v) === i)

    // If user accesses resource type they've never accessed before
    if (!recentResources.includes(resource)) {
      return {
        id: this.generateAnomalyId(),
        type: 'POLICY_ANOMALY',
        severity: 'MEDIUM',
        principalId,
        resource,
        action,
        description: `User accessing new resource type: ${resource}`,
        riskScore: 30,
        detectedAt: new Date()
      }
    }

    return null
  }

  /**
   * Detect behavior anomalies
   */
  private detectBehaviorAnomaly(
    principalId: string,
    resource: string,
    action: string,
    timestamp: Date
  ): Anomaly | null {
    const baseline = this.behaviorBaselines.get(principalId)

    if (!baseline) {
      // First time - create baseline
      return null
    }

    const hour = timestamp.getHours()
    const isUnusualHour = !baseline.typicalHours.includes(hour)

    // Check for unusual activity time
    if (isUnusualHour) {
      return {
        id: this.generateAnomalyId(),
        type: 'BEHAVIOR_ANOMALY',
        severity: 'LOW',
        principalId,
        resource,
        action,
        description: `Activity outside typical hours (${hour}:00)`,
        riskScore: 20,
        detectedAt: timestamp
      }
    }

    // Check for unusual frequency
    const recentDecisions = this.decisionHistory
      .filter(d => d.principalId === principalId)
      .slice(-60) // Last 60 decisions

    if (recentDecisions.length > baseline.averageDecisionsPerHour * 2) {
      return {
        id: this.generateAnomalyId(),
        type: 'BEHAVIOR_ANOMALY',
        severity: 'MEDIUM',
        principalId,
        resource,
        action,
        description: `Unusually high activity rate detected`,
        riskScore: 40,
        detectedAt: timestamp
      }
    }

    return null
  }

  /**
   * Detect risk anomalies
   */
  private detectRiskAnomaly(
    principalId: string,
    decision: 'ALLOW' | 'DENY',
    context?: Record<string, unknown>
  ): Anomaly | null {
    // Check for repeated denials (possible attack)
    const recentDenials = this.decisionHistory
      .filter(d => d.principalId === principalId && d.decision === 'DENY')
      .slice(-10)

    if (recentDenials.length >= 5) {
      return {
        id: this.generateAnomalyId(),
        type: 'RISK_ANOMALY',
        severity: 'HIGH',
        principalId,
        description: `Multiple consecutive access denials (${recentDenials.length})`,
        riskScore: 60,
        detectedAt: new Date()
      }
    }

    return null
  }

  /**
   * Record decision in history
   */
  private recordDecision(
    principalId: string,
    resource: string,
    action: string,
    decision: 'ALLOW' | 'DENY',
    timestamp: Date
  ): void {
    this.decisionHistory.push({
      principalId,
      resource,
      action,
      decision,
      timestamp
    })

    // Keep only recent history
    if (this.decisionHistory.length > this.maxHistory) {
      this.decisionHistory.shift()
    }
  }

  /**
   * Update behavior baseline for user
   */
  private updateBaseline(
    userId: string,
    resource: string,
    action: string,
    timestamp: Date
  ): void {
    const userHistory = this.decisionHistory.filter(d => d.principalId === userId)
    const hour = timestamp.getHours()

    let baseline = this.behaviorBaselines.get(userId)

    if (!baseline) {
      baseline = {
        userId,
        averageDecisionsPerHour: 0,
        commonResources: [],
        commonActions: [],
        typicalHours: [],
        lastUpdated: timestamp
      }
    }

    // Update averages
    const decisionsLastHour = userHistory.filter(
      d => d.timestamp > new Date(timestamp.getTime() - 60 * 60 * 1000)
    ).length

    baseline.averageDecisionsPerHour = 
      (baseline.averageDecisionsPerHour + decisionsLastHour) / 2

    // Update common resources/actions
    const resourceCounts = new Map<string, number>()
    const actionCounts = new Map<string, number>()

    userHistory.slice(-1000).forEach(d => {
      resourceCounts.set(d.resource, (resourceCounts.get(d.resource) || 0) + 1)
      actionCounts.set(d.action, (actionCounts.get(d.action) || 0) + 1)
    })

    baseline.commonResources = Array.from(resourceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([resource]) => resource)

    baseline.commonActions = Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([action]) => action)

    // Update typical hours
    const hourCounts = new Map<number, number>()
    userHistory.slice(-1000).forEach(d => {
      const h = d.timestamp.getHours()
      hourCounts.set(h, (hourCounts.get(h) || 0) + 1)
    })

    baseline.typicalHours = Array.from(hourCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8) // Top 8 hours
      .map(([hour]) => hour)

    baseline.lastUpdated = timestamp
    this.behaviorBaselines.set(userId, baseline)
  }

  /**
   * Get anomalies for user
   */
  getAnomaliesForUser(userId: string, limit = 50): Anomaly[] {
    return this.anomalies
      .filter(a => a.principalId === userId)
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
      .slice(0, limit)
  }

  /**
   * Get recent anomalies
   */
  getRecentAnomalies(limit = 100): Anomaly[] {
    return this.anomalies
      .filter(a => !a.resolvedAt)
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
      .slice(0, limit)
  }

  /**
   * Resolve anomaly
   */
  resolveAnomaly(anomalyId: string): boolean {
    const anomaly = this.anomalies.find(a => a.id === anomalyId)
    if (!anomaly || anomaly.resolvedAt) return false

    anomaly.resolvedAt = new Date()
    return true
  }

  /**
   * Get risk score for user
   */
  getRiskScore(userId: string): number {
    const userAnomalies = this.anomalies.filter(
      a => a.principalId === userId && !a.resolvedAt
    )

    if (userAnomalies.length === 0) return 0

    const totalRisk = userAnomalies.reduce((sum, a) => sum + a.riskScore, 0)
    return Math.min(Math.round(totalRisk / userAnomalies.length), 100)
  }

  /**
   * Generate anomaly ID
   */
  private generateAnomalyId(): string {
    return `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Default anomaly detector instance
export const anomalyDetector = new AnomalyDetector()







