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
 * Audit Log API Route
 * Get audit logs for Hansen Security
 */

import { NextRequest, NextResponse } from 'next/server'
import { auditLogger } from '@/modules/security2/core/AuditLogger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const principalId = searchParams.get('principalId')
    const resource = searchParams.get('resource')
    const resourceId = searchParams.get('resourceId')
    const decision = searchParams.get('decision') as 'ALLOW' | 'DENY' | null
    const limit = parseInt(searchParams.get('limit') || '100')

    let logs

    if (principalId) {
      logs = auditLogger.getLogsForPrincipal(principalId, limit)
    } else if (resource) {
      logs = auditLogger.getLogsForResource(resource, resourceId || undefined, limit)
    } else if (decision) {
      logs = auditLogger.getLogsByDecision(decision, limit)
    } else {
      // Return recent logs (limited)
      logs = auditLogger.getLogsForPrincipal('', limit)
    }

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length
    })
  } catch (error) {
    console.error('Audit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}







