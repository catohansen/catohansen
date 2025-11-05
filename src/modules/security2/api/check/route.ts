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
 * Security 2.0 API - Check Permission
 * POST /api/v1/modules/security2/check
 */

import { policyEngine } from '../../core/PolicyEngine'
import type { Principal, Resource } from '../../core/PolicyEngine'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { audit } from '@/lib/audit/audit'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { principal, resource, action }: {
      principal: Principal
      resource: Resource
      action: string
    } = body

    // Validate input
    if (!principal || !resource || !action) {
      return NextResponse.json(
        { allowed: false, reason: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Evaluate permission
    const result = await policyEngine.evaluate(principal, resource, action)

    // Log to centralized audit system (in addition to Security 2.0's internal audit)
    await audit(req, {
      actorId: principal.id,
      action: `security2.check.${action}`,
      resource: resource.kind,
      target: resource.id,
      decision: result.effect,
      reason: result.reason,
      meta: {
        principalRoles: principal.roles,
        matchedRules: result.matchedRules,
        derivedRoles: result.derivedRoles,
        correlationId: result.correlationId,
        latencyMs: result.latencyMs,
        allowed: result.allowed
      }
    }).catch(err => {
      // Don't fail request if audit logging fails
      logger.warn('Failed to log Security 2.0 check to audit', { error: err })
    })

    return NextResponse.json({
      allowed: result.allowed,
      effect: result.effect,
      reason: result.reason,
      matchedRules: result.matchedRules,
      derivedRoles: result.derivedRoles,
      correlationId: result.correlationId,
      latencyMs: result.latencyMs
    })
  } catch (error) {
    logger.error('Security 2.0 check error', { endpoint: '/api/v1/modules/security2/check' }, error as Error)
    return NextResponse.json(
      { allowed: false, reason: 'Authorization check failed' },
      { status: 500 }
    )
  }
}

