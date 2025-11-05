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
 * Security 2.0 SDK
 * Client SDK for external use
 */

export type Principal = {
  id: string
  roles: string[]
  attributes?: Record<string, unknown>
}

export type Resource = {
  kind: string
  id?: string
  attributes?: Record<string, unknown>
}

export interface CheckResult {
  allowed: boolean
  reason?: string
}

export interface CheckMultipleResult {
  [action: string]: boolean
}

/**
 * Security 2.0 Client
 * Client for checking permissions via API
 */
export class HansenSecurityClient {
  constructor(private baseUrl: string = '/api/modules/security2') {}

  /**
   * Check if principal can perform action on resource
   */
  async check(
    principal: Principal,
    resource: Resource,
    action: string
  ): Promise<CheckResult> {
    try {
      const response = await fetch(`${this.baseUrl}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          principal,
          resource,
          action
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Security 2.0 check failed:', error)
      return {
        allowed: false,
        reason: 'Authorization check failed'
      }
    }
  }

  /**
   * Check multiple actions at once
   */
  async checkMultiple(
    principal: Principal,
    resource: Resource,
    actions: string[]
  ): Promise<CheckMultipleResult> {
    try {
      const response = await fetch(`${this.baseUrl}/check-multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          principal,
          resource,
          actions
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Security 2.0 checkMultiple failed:', error)
      // Return all false on error
      const result: CheckMultipleResult = {}
      for (const action of actions) {
        result[action] = false
      }
      return result
    }
  }

  /**
   * Check if principal has role
   */
  hasRole(principal: Principal, roles: string[]): boolean {
    return roles.some(role => principal.roles.includes(role))
  }

  /**
   * Check if principal is admin
   */
  isAdmin(principal: Principal): boolean {
    return this.hasRole(principal, ['ADMIN', 'OWNER'])
  }

  /**
   * Check if principal is owner
   */
  isOwner(principal: Principal): boolean {
    return principal.roles.includes('OWNER')
  }
}

// Default client instance
export const hansenSecurity = new HansenSecurityClient()

// Export types
export type {
  Principal as HansenPrincipal,
  Resource as HansenResource,
  CheckResult as HansenCheckResult,
  CheckMultipleResult as HansenCheckMultipleResult
}

