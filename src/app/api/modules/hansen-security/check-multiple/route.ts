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
 * Hansen Security API - Check Multiple Permissions
 * POST /api/modules/hansen-security/check-multiple
 */

import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import type { Principal, Resource } from '@/modules/security2/core/PolicyEngine'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { principal, resource, actions }: {
      principal: Principal
      resource: Resource
      actions: string[]
    } = body

    // Validate input
    if (!principal || !resource || !actions || !Array.isArray(actions)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Evaluate permissions
    const results = await policyEngine.evaluateMultiple(principal, resource, actions)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Hansen Security checkMultiple error:', error)
    return NextResponse.json(
      { error: 'Authorization check failed' },
      { status: 500 }
    )
  }
}

