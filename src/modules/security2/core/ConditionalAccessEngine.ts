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
 * Conditional Access Engine
 * Advanced IAM feature for context-aware access control
 * 
 * Supports:
 * - Device-based access (device fingerprinting, trusted devices)
 * - Geo-location based access (IP geolocation, country restrictions)
 * - Time-based access (business hours, time windows)
 * - Behavior-based access (anomaly detection, risk scoring)
 * - Network-based access (VPN required, corporate network only)
 * 
 * Based on Zero Trust and modern IAM best practices
 */

export interface ConditionalAccessRule {
  id: string
  name: string
  enabled: boolean
  priority: number // Lower number = higher priority
  
  // Conditions
  deviceConditions?: {
    requireTrustedDevice?: boolean
    blockDevices?: string[] // Device IDs to block
    requireDeviceCompliance?: boolean
  }
  
  geoConditions?: {
    allowedCountries?: string[] // ISO country codes
    blockedCountries?: string[]
    requireVPN?: boolean
  }
  
  timeConditions?: {
    allowedHours?: { start: number; end: number }[] // 0-23 hour format
    allowedDays?: number[] // 0-6 (Sunday-Saturday)
    timezone?: string // e.g. "Europe/Oslo"
  }
  
  networkConditions?: {
    requireCorporateNetwork?: boolean
    allowedIPRanges?: string[] // CIDR notation
    blockedIPRanges?: string[]
  }
  
  behaviorConditions?: {
    riskScoreThreshold?: number // 0-100
    requireMFA?: boolean
    blockOnAnomaly?: boolean
  }
  
  // Actions
  action: 'ALLOW' | 'DENY' | 'REQUIRE_MFA' | 'BLOCK_TEMPORARILY'
  gracePeriod?: number // Minutes before blocking
  
  // Metadata
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface AccessContext {
  userId: string
  deviceId?: string
  deviceFingerprint?: string
  ipAddress?: string
  userAgent?: string
  geoLocation?: {
    country?: string
    region?: string
    city?: string
    latitude?: number
    longitude?: number
  }
  timestamp: Date
  networkInfo?: {
    isVPN?: boolean
    isCorporateNetwork?: boolean
    ipRange?: string
  }
  behaviorMetrics?: {
    riskScore?: number
    anomalyDetected?: boolean
    loginAttempts?: number
    failedAttempts?: number
  }
}

export class ConditionalAccessEngine {
  private rules: ConditionalAccessRule[] = []
  private trustedDevices: Map<string, Set<string>> = new Map() // userId -> deviceIds

  /**
   * Register conditional access rule
   */
  registerRule(rule: ConditionalAccessRule): void {
    this.rules.push(rule)
    // Sort by priority
    this.rules.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Evaluate conditional access for a user context
   */
  async evaluate(context: AccessContext): Promise<{
    allowed: boolean
    action: 'ALLOW' | 'DENY' | 'REQUIRE_MFA' | 'BLOCK_TEMPORARILY'
    reason?: string
    requiredSteps?: string[]
  }> {
    // Check each rule in priority order
    for (const rule of this.rules) {
      if (!rule.enabled) continue

      const matches = await this.matchesRule(context, rule)
      
      if (matches) {
        // Rule matches - apply action
        return {
          allowed: rule.action === 'ALLOW',
          action: rule.action,
          reason: rule.description || `Conditional access rule: ${rule.name}`,
          requiredSteps: this.getRequiredSteps(rule)
        }
      }
    }

    // No rules matched - allow by default (can be changed)
    return {
      allowed: true,
      action: 'ALLOW',
      reason: 'No conditional access rules matched'
    }
  }

  /**
   * Check if context matches rule conditions
   */
  private async matchesRule(context: AccessContext, rule: ConditionalAccessRule): Promise<boolean> {
    // Device conditions
    if (rule.deviceConditions) {
      if (rule.deviceConditions.requireTrustedDevice) {
        const trusted = this.trustedDevices.get(context.userId)?.has(context.deviceId || '')
        if (!trusted) return false
      }

      if (rule.deviceConditions.blockDevices?.includes(context.deviceId || '')) {
        return true // Matches (will be blocked)
      }
    }

    // Geo conditions
    if (rule.geoConditions) {
      const country = context.geoLocation?.country
      
      if (country) {
        if (rule.geoConditions.blockedCountries?.includes(country)) {
          return true // Matches (will be blocked)
        }
        
        if (rule.geoConditions.allowedCountries && 
            !rule.geoConditions.allowedCountries.includes(country)) {
          return false // Doesn't match
        }
      }

      if (rule.geoConditions.requireVPN && !context.networkInfo?.isVPN) {
        return true // Matches (will require VPN)
      }
    }

    // Time conditions
    if (rule.timeConditions) {
      const now = context.timestamp || new Date()
      const hour = now.getHours()
      const day = now.getDay()

      if (rule.timeConditions.allowedHours) {
        const inAllowedHours = rule.timeConditions.allowedHours.some(
          window => hour >= window.start && hour < window.end
        )
        if (!inAllowedHours) return false
      }

      if (rule.timeConditions.allowedDays && !rule.timeConditions.allowedDays.includes(day)) {
        return false
      }
    }

    // Network conditions
    if (rule.networkConditions) {
      if (rule.networkConditions.requireCorporateNetwork && !context.networkInfo?.isCorporateNetwork) {
        return true // Matches (will be blocked/require)
      }

      if (context.networkInfo?.ipRange) {
        // Check IP ranges (simplified - in production use proper CIDR matching)
        const inAllowedRange = rule.networkConditions.allowedIPRanges?.some(
          range => context.networkInfo?.ipRange?.startsWith(range.split('/')[0])
        )
        if (rule.networkConditions.allowedIPRanges && !inAllowedRange) {
          return false
        }
      }
    }

    // Behavior conditions
    if (rule.behaviorConditions) {
      if (rule.behaviorConditions.riskScoreThreshold) {
        const riskScore = context.behaviorMetrics?.riskScore || 0
        if (riskScore > rule.behaviorConditions.riskScoreThreshold) {
          return true // Matches (high risk)
        }
      }

      if (rule.behaviorConditions.blockOnAnomaly && context.behaviorMetrics?.anomalyDetected) {
        return true // Matches (anomaly detected)
      }

      if (rule.behaviorConditions.requireMFA) {
        return true // Matches (will require MFA)
      }
    }

    return true // Rule matches
  }

  /**
   * Get required steps for action
   */
  private getRequiredSteps(rule: ConditionalAccessRule): string[] {
    const steps: string[] = []

    if (rule.action === 'REQUIRE_MFA') {
      steps.push('Complete MFA verification')
    }

    if (rule.geoConditions?.requireVPN) {
      steps.push('Connect to VPN')
    }

    if (rule.deviceConditions?.requireTrustedDevice) {
      steps.push('Register this device as trusted')
    }

    if (rule.networkConditions?.requireCorporateNetwork) {
      steps.push('Connect to corporate network')
    }

    return steps
  }

  /**
   * Mark device as trusted
   */
  markDeviceAsTrusted(userId: string, deviceId: string): void {
    if (!this.trustedDevices.has(userId)) {
      this.trustedDevices.set(userId, new Set())
    }
    this.trustedDevices.get(userId)!.add(deviceId)
  }

  /**
   * Revoke trusted device
   */
  revokeTrustedDevice(userId: string, deviceId: string): void {
    this.trustedDevices.get(userId)?.delete(deviceId)
  }

  /**
   * Get trusted devices for user
   */
  getTrustedDevices(userId: string): string[] {
    return Array.from(this.trustedDevices.get(userId) || [])
  }
}

// Default conditional access engine instance
export const conditionalAccessEngine = new ConditionalAccessEngine()

// Register default rules (can be customized)
conditionalAccessEngine.registerRule({
  id: 'default-high-risk-block',
  name: 'Block High Risk Access',
  enabled: true,
  priority: 1,
  behaviorConditions: {
    riskScoreThreshold: 80,
    blockOnAnomaly: true
  },
  action: 'BLOCK_TEMPORARILY',
  description: 'Automatically block access for high-risk sessions',
  createdAt: new Date(),
  updatedAt: new Date()
})





