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
 * Hansen Security API - Check Permission
 * POST /api/modules/hansen-security/check
 */

import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import type { Principal, Resource } from '@/modules/security2/core/PolicyEngine'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

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
    logger.error('Security 2.0 check error', { endpoint: '/api/modules/hansen-security/check' }, error as Error)
    return NextResponse.json(
      { allowed: false, reason: 'Authorization check failed' },
      { status: 500 }
    )
  }
}

