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
 * Audit Helper
 * Simple audit logging using Prisma AuditLog model
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { NextRequest } from 'next/server'

export interface AuditData {
  actorId?: string
  action: string
  resource?: string
  target?: string
  meta?: Record<string, unknown>
  decision?: 'ALLOW' | 'DENY'
  reason?: string
}

/**
 * Log audit event to database
 */
export async function audit(
  request: NextRequest,
  data: AuditData
): Promise<void> {
  try {
    const prisma = await getPrismaClient()
    
    // Get user from token if available
    const token = request.cookies.get('admin-token')?.value
    let actorId = data.actorId
    
    if (!actorId && token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8')
        const [userId] = decoded.split(':')
        actorId = userId
      } catch {
        // Ignore token decode errors
      }
    }

    // Get IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        action: data.action,
        resource: data.resource || null,
        target: data.target || null,
        decision: data.decision || null,
        reason: data.reason || null,
        meta: (data.meta as any) || null,
        ip: ip || null,
        userAgent: userAgent || null,
      }
    })
  } catch (error) {
    // Don't throw - audit logging should not break the request
    console.error('Audit logging error:', error)
  }
}

