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
 * Query Planner
 * Generate database query filters from policies
 * 
 * Similar to Cerbos PlanResources API - generates WHERE clauses
 * based on policy rules to filter resources a principal can access
 */

import type { Principal, Resource } from './PolicyEngine'
import { policyEngine } from './PolicyEngine'

export interface QueryFilter {
  where: Record<string, unknown>
  orderBy?: Record<string, 'asc' | 'desc'>
}

export class QueryPlanner {
  /**
   * Plan query filters for a resource kind and action
   * Returns filters that can be used in Prisma/ORM queries
   */
  async planQuery(
    principal: Principal,
    resourceKind: string,
    action: string
  ): Promise<QueryFilter> {
    // Get all resources the principal can access
    // This is a simplified version - in production, we'd analyze policies
    // and generate optimized WHERE clauses

    const filters: Record<string, unknown> = {}

    // If user is OWNER or ADMIN, no filters needed (access all)
    if (principal.roles.includes('OWNER') || principal.roles.includes('ADMIN')) {
      return { where: {} }
    }

    // For other roles, we need to filter based on policies
    // Common patterns:
    
    // 1. Owner-based filtering
    if (resourceKind === 'project' || resourceKind === 'content') {
      filters.OR = [
        { ownerId: principal.id },
        { createdById: principal.id },
        { team: { in: principal.attributes?.teams as string[] || [] } }
      ]
    }

    // 2. Tenant-based filtering
    if (principal.attributes?.tenantId) {
      filters.tenantId = principal.attributes.tenantId
    }

    // 3. Department/team-based filtering
    if (principal.attributes?.department) {
      filters.department = principal.attributes.department
    }

    return {
      where: filters,
      orderBy: { createdAt: 'desc' }
    }
  }

  /**
   * Generate Prisma query filter
   */
  async generatePrismaFilter(
    principal: Principal,
    resourceKind: string,
    action: string
  ): Promise<Record<string, unknown>> {
    const plan = await this.planQuery(principal, resourceKind, action)
    return plan.where
  }

  /**
   * Generate SQL WHERE clause (for raw SQL queries)
   */
  async generateSQLWhere(
    principal: Principal,
    resourceKind: string,
    action: string
  ): Promise<string> {
    const filter = await this.generatePrismaFilter(principal, resourceKind, action)
    
    // Convert Prisma filter to SQL WHERE clause
    const conditions: string[] = []

    if (Object.keys(filter).length === 0) {
      return '1=1' // Allow all
    }

    // Handle OR conditions
    if (filter.OR && Array.isArray(filter.OR)) {
      const orConditions = filter.OR.map((or: Record<string, unknown>) => {
        const parts: string[] = []
        for (const [key, value] of Object.entries(or)) {
          if (typeof value === 'string') {
            parts.push(`${key} = '${value}'`)
          } else if (typeof value === 'object' && value !== null && 'in' in value) {
            const values = (value as { in: string[] }).in
            parts.push(`${key} IN (${values.map(v => `'${v}'`).join(', ')})`)
          }
        }
        return `(${parts.join(' OR ')})`
      })
      conditions.push(`(${orConditions.join(' OR ')})`)
    } else {
      // Simple conditions
      for (const [key, value] of Object.entries(filter)) {
        if (typeof value === 'string') {
          conditions.push(`${key} = '${value}'`)
        } else if (typeof value === 'number') {
          conditions.push(`${key} = ${value}`)
        }
      }
    }

    return conditions.length > 0 ? conditions.join(' AND ') : '1=1'
  }
}

// Default query planner instance
export const queryPlanner = new QueryPlanner()

