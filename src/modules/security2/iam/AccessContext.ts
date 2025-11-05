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
 * Access Context
 * Defines the context for access requests
 * 
 * Features:
 * - Tenant isolation
 * - Principal information
 * - Request metadata
 * - Environmental context
 */

export interface AccessContext {
  tenantId: string
  principal: {
    id: string
    roles: string[]
    attributes?: Record<string, any> // ABAC attributes: department, device, geo, time, riskScore, etc.
  }
  reqMeta?: {
    ip?: string
    userAgent?: string
    deviceId?: string
    sessionId?: string
  }
  env?: {
    mfa?: boolean
    riskScore?: number
    time?: string
    geo?: {
      country?: string
      region?: string
      city?: string
    }
    devicePosture?: {
      trusted?: boolean
      compliant?: boolean
      encrypted?: boolean
    }
  }
}

/**
 * Create access context from request
 */
export function createAccessContext(params: {
  tenantId: string
  principalId: string
  roles: string[]
  principalAttributes?: Record<string, any>
  reqMeta?: {
    ip?: string
    userAgent?: string
    deviceId?: string
    sessionId?: string
  }
  env?: {
    mfa?: boolean
    riskScore?: number
    time?: string
    geo?: {
      country?: string
      region?: string
      city?: string
    }
    devicePosture?: {
      trusted?: boolean
      compliant?: boolean
      encrypted?: boolean
    }
  }
}): AccessContext {
  return {
    tenantId: params.tenantId,
    principal: {
      id: params.principalId,
      roles: params.roles,
      attributes: params.principalAttributes || {}
    },
    reqMeta: params.reqMeta,
    env: params.env
  }
}





