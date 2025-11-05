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
 * Just-In-Time (JIT) Access
 * Provides temporary, time-limited access to privileged resources
 * 
 * Features:
 * - Temporary role elevation
 * - Time-limited access grants
 * - Approval workflows (optional)
 * - Automatic revocation
 * - Audit trail for all JIT grants
 * 
 * Based on Zero Trust "least privilege" principles
 */

export interface JITGrant {
  id: string
  userId: string
  role: string // Role to grant temporarily
  resource?: string // Optional: specific resource
  duration: number // Minutes
  reason: string
  approvedBy?: string // Optional: who approved
  requestedAt: Date
  expiresAt: Date
  revokedAt?: Date
  used: boolean
  metadata?: Record<string, unknown>
}

export interface JITRequest {
  userId: string
  role: string
  resource?: string
  duration: number // Minutes (max 480 = 8 hours)
  reason: string
  requiresApproval?: boolean
  approverId?: string
}

export class JustInTimeAccess {
  private grants: Map<string, JITGrant> = new Map()
  private maxDuration = 480 // 8 hours max
  private defaultDuration = 60 // 1 hour default

  /**
   * Request JIT access
   */
  async requestAccess(request: JITRequest): Promise<{
    granted: boolean
    grantId?: string
    expiresAt?: Date
    requiresApproval?: boolean
    approverId?: string
  }> {
    // Validate duration
    const duration = Math.min(request.duration || this.defaultDuration, this.maxDuration)

    // If requires approval, return pending state
    if (request.requiresApproval && request.approverId) {
      return {
        granted: false,
        requiresApproval: true,
        approverId: request.approverId
      }
    }

    // Auto-approve and grant
    return this.grantAccess({
      userId: request.userId,
      role: request.role,
      resource: request.resource,
      duration,
      reason: request.reason
    })
  }

  /**
   * Grant JIT access
   */
  async grantAccess(params: {
    userId: string
    role: string
    resource?: string
    duration: number
    reason: string
    approvedBy?: string
  }): Promise<{
    granted: boolean
    grantId: string
    expiresAt: Date
  }> {
    const grantId = this.generateGrantId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + params.duration * 60 * 1000)

    const grant: JITGrant = {
      id: grantId,
      userId: params.userId,
      role: params.role,
      resource: params.resource,
      duration: params.duration,
      reason: params.reason,
      approvedBy: params.approvedBy,
      requestedAt: now,
      expiresAt,
      used: false
    }

    this.grants.set(grantId, grant)

    // Auto-revoke after expiration (schedule cleanup)
    setTimeout(() => {
      this.revokeGrant(grantId)
    }, params.duration * 60 * 1000)

    return {
      granted: true,
      grantId,
      expiresAt
    }
  }

  /**
   * Check if user has active JIT grant for role
   */
  hasActiveGrant(userId: string, role: string, resource?: string): boolean {
    const now = new Date()
    
    for (const grant of Array.from(this.grants.values())) {
      if (grant.userId === userId && 
          grant.role === role &&
          (!resource || grant.resource === resource) &&
          grant.expiresAt > now &&
          !grant.revokedAt &&
          !grant.used) {
        return true
      }
    }
    
    return false
  }

  /**
   * Get active grants for user
   */
  getActiveGrants(userId: string): JITGrant[] {
    const now = new Date()
    
    return Array.from(this.grants.values()).filter(
      grant => grant.userId === userId &&
                grant.expiresAt > now &&
                !grant.revokedAt
    )
  }

  /**
   * Use a grant (mark as used - optional, for tracking)
   */
  useGrant(grantId: string): boolean {
    const grant = this.grants.get(grantId)
    if (!grant || grant.revokedAt) return false

    grant.used = true
    return true
  }

  /**
   * Revoke grant early
   */
  revokeGrant(grantId: string): boolean {
    const grant = this.grants.get(grantId)
    if (!grant || grant.revokedAt) return false

    grant.revokedAt = new Date()
    return true
  }

  /**
   * Revoke all grants for user
   */
  revokeAllGrantsForUser(userId: string): number {
    let count = 0
    const now = new Date()

    for (const grant of Array.from(this.grants.values())) {
      if (grant.userId === userId && !grant.revokedAt) {
        grant.revokedAt = now
        count++
      }
    }

    return count
  }

  /**
   * Cleanup expired grants (should be called periodically)
   */
  cleanupExpiredGrants(): number {
    const now = new Date()
    let count = 0

    for (const [grantId, grant] of Array.from(this.grants.entries())) {
      if (grant.expiresAt < now && !grant.revokedAt) {
        grant.revokedAt = now
        count++
      }
    }

    return count
  }

  /**
   * Get grant by ID
   */
  getGrant(grantId: string): JITGrant | undefined {
    return this.grants.get(grantId)
  }

  /**
   * Generate unique grant ID
   */
  private generateGrantId(): string {
    return `jit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Default JIT access instance
export const jitAccess = new JustInTimeAccess()

// Cleanup expired grants every hour
setInterval(() => {
  jitAccess.cleanupExpiredGrants()
}, 60 * 60 * 1000)

