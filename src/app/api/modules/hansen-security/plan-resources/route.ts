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
 * Plan Resources API Route
 * Generate database query filters from policies
 * Similar to Cerbos PlanResources API
 */

import { NextRequest, NextResponse } from 'next/server'
import { queryPlanner } from '@/modules/security2/core/QueryPlanner'
import type { Principal } from '@/modules/security2/core/PolicyEngine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { principal, resourceKind, action }: {
      principal: Principal
      resourceKind: string
      action: string
    } = body

    // Validate input
    if (!principal || !resourceKind || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate query plan
    const filter = await queryPlanner.planQuery(principal, resourceKind, action)

    const sqlWhere = await queryPlanner.generateSQLWhere(principal, resourceKind, action)

    return NextResponse.json({
      success: true,
      filter,
      prismaFilter: filter.where,
      sqlWhere
    })
  } catch (error) {
    console.error('Plan Resources API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

