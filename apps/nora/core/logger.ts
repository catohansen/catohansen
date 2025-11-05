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
 * Nora Logger
 * Logs all system events and interactions
 */

import { prisma } from '@/lib/db/prisma'

export interface LogEntry {
  type: string
  action: string
  data: Record<string, unknown>
  timestamp?: Date
}

export class NoraLogger {
  /**
   * Log an event
   */
  async log(entry: LogEntry): Promise<void> {
    try {
      // Store in audit log
      await prisma.auditLog.create({
        data: {
          action: `nora.${entry.type}.${entry.action}`,
          resource: 'nora',
          meta: entry.data as any,
          decision: 'ALLOW',
          reason: `Nora ${entry.action}: ${entry.type}`
        }
      })
    } catch (error: any) {
      console.error('Nora logger error:', error)
      // Don't throw - logging failures shouldn't break the system
    }
  }

  /**
   * Get logs
   */
  async getLogs(
    filters?: {
      type?: string
      action?: string
      userId?: string
      limit?: number
    }
  ): Promise<any[]> {
    try {
      const where: any = {
        resource: 'nora'
      }

      if (filters?.action) {
        where.action = { contains: filters.action }
      }

      const logs = await prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 100
      })

      return logs
    } catch (error: any) {
      console.error('Get logs error:', error)
      return []
    }
  }
}

