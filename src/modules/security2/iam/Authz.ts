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
 * Authorization (Authz)
 * Integration layer for PolicyEngine
 * 
 * Features:
 * - Simplified authorization interface
 * - Access context integration
 * - Automatic policy evaluation
 */

import { policyEngine } from '../core/PolicyEngine'
import type { AccessContext } from './AccessContext'
import type { EvaluationResult } from '../core/PolicyEngine'

export interface AuthorizationRequest {
  context: AccessContext
  resource: {
    type: string
    id?: string
    attributes?: Record<string, any>
  }
  action: string
}

export interface AuthorizationResult extends EvaluationResult {
  context: AccessContext
  resource: {
    type: string
    id?: string
  }
  action: string
}

/**
 * Authorize access request
 */
export async function authorize(
  context: AccessContext,
  resource: { type: string; id?: string; attributes?: Record<string, any> },
  action: string
): Promise<AuthorizationResult> {
  // Build principal with context attributes
  const principal = {
    id: context.principal.id,
    roles: context.principal.roles,
    attributes: {
      ...context.principal.attributes,
      // Add environmental context to attributes
      mfa: context.env?.mfa,
      riskScore: context.env?.riskScore,
      geo: context.env?.geo,
      devicePosture: context.env?.devicePosture,
      ip: context.reqMeta?.ip,
      deviceId: context.reqMeta?.deviceId
    }
  }

  // Build resource with attributes
  const resourceWithAttrs = {
    kind: resource.type,
    id: resource.id,
    attributes: resource.attributes || {}
  }

  // Evaluate policy
  const result = await policyEngine.evaluate(principal, resourceWithAttrs, action)

  // Return authorization result with context
  return {
    ...result,
    context,
    resource: {
      type: resource.type,
      id: resource.id
    },
    action
  }
}

/**
 * Check if access is allowed (simple boolean)
 */
export async function isAllowed(
  context: AccessContext,
  resource: { type: string; id?: string; attributes?: Record<string, any> },
  action: string
): Promise<boolean> {
  const result = await authorize(context, resource, action)
  return result.allowed
}

/**
 * Check multiple actions at once
 */
export async function checkMultiple(
  context: AccessContext,
  resource: { type: string; id?: string; attributes?: Record<string, any> },
  actions: string[]
): Promise<Record<string, AuthorizationResult>> {
  const results: Record<string, AuthorizationResult> = {}

  for (const action of actions) {
    results[action] = await authorize(context, resource, action)
  }

  return results
}





