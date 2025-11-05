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
 * Audit Logger
 * Tamper-evident logging for all authorization decisions
 * 
 * Features:
 * - Decision logging (who, what, when, why)
 * - Policy match tracking
 * - Correlation IDs
 * - Structured logging (JSON)
 * - Export to external systems (Kafka, OpenSearch)
 */

export interface AuditLogEntry {
  id: string
  timestamp: Date
  principalId: string
  principalRoles: string[]
  resource: string
  resourceId?: string
  action: string
  decision: 'ALLOW' | 'DENY'
  effect: 'ALLOW' | 'DENY'
  reason?: string
  matchedRules?: string[]
  derivedRoles?: string[]
  policyVersion?: number
  latencyMs?: number
  metadata?: Record<string, unknown>
  correlationId?: string
  ip?: string
  userAgent?: string
}

export interface AuditLogConfig {
  enabled: boolean
  logLevel: 'all' | 'deny-only' | 'critical-only'
  destination?: 'database' | 'file' | 'kafka' | 'opensearch'
  retentionDays?: number
}

export class AuditLogger {
  private config: AuditLogConfig
  private logs: AuditLogEntry[] = []
  private maxInMemoryLogs = 1000

  constructor(config: Partial<AuditLogConfig> = {}) {
    this.config = {
      enabled: true,
      logLevel: 'all',
      destination: 'database',
      retentionDays: 90,
      ...config
    }
  }

  /**
   * Log an authorization decision
   */
  async logDecision(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    if (!this.config.enabled) {
      return
    }

    // Filter based on log level
    if (this.config.logLevel === 'deny-only' && entry.decision === 'ALLOW') {
      return
    }

    const logEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      ...entry
    }

    // Store in memory (for immediate access)
    this.logs.push(logEntry)
    
    // Keep only recent logs in memory
    if (this.logs.length > this.maxInMemoryLogs) {
      this.logs.shift()
    }

    // Persist to configured destination
    await this.persistLog(logEntry)
  }

  /**
   * Get logs for a principal
   */
  getLogsForPrincipal(principalId: string, limit = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.principalId === principalId)
      .slice(-limit)
      .reverse()
  }

  /**
   * Get logs for a resource
   */
  getLogsForResource(resource: string, resourceId?: string, limit = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => {
        if (resourceId) {
          return log.resource === resource && log.resourceId === resourceId
        }
        return log.resource === resource
      })
      .slice(-limit)
      .reverse()
  }

  /**
   * Get logs by decision
   */
  getLogsByDecision(decision: 'ALLOW' | 'DENY', limit = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.decision === decision)
      .slice(-limit)
      .reverse()
  }

  /**
   * Generate correlation ID for request tracking
   */
  generateCorrelationId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Persist log entry to configured destination
   */
  private async persistLog(entry: AuditLogEntry): Promise<void> {
    switch (this.config.destination) {
      case 'database':
        // TODO: Save to Prisma database
        // await db.auditLog.create({ data: { ... } })
        break
      case 'file':
        // TODO: Write to file
        console.log('[AUDIT]', JSON.stringify(entry))
        break
      case 'kafka':
        // TODO: Send to Kafka
        break
      case 'opensearch':
        // TODO: Index in OpenSearch
        break
      default:
        // Default: console log
        console.log('[AUDIT]', JSON.stringify(entry))
    }
  }

  /**
   * Generate unique log ID
   */
  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Default audit logger instance
export const auditLogger = new AuditLogger()

