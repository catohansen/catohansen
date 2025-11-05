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
 * 
 * Hansen Security Policy Engine
 * World-class authorization system built by Cato Hansen Agency
 * 
 * Features:
 * - Policy-based authorization (policy-as-code)
 * - RBAC (Role-Based Access Control)
 * - ABAC (Attribute-Based Access Control)
 * - Derived Roles (dynamic role assignment)
 * - Role Hierarchies
 * - CEL-like condition evaluation
 * - Policy versioning & hot reload
 * - Decision reasoning
 * - Deny override (security-first)
 * 
 * Inspired by modern authorization patterns, built from scratch.
 */

import { conditionEvaluator } from './ConditionEvaluator'
import { derivedRolesEngine } from './DerivedRoles'
import { auditLogger } from './AuditLogger'
import { metricsCollector } from './MetricsCollector'

export type Principal = {
  id: string
  roles: string[]
  attributes?: Record<string, unknown>
}

export type Resource = {
  kind: string
  id?: string
  attributes?: Record<string, unknown>
}

export interface PolicyRule {
  resource: string
  actions: string[]
  roles?: string[]
  derivedRoles?: string[] // Derived roles that match this rule
  conditions?: Record<string, any> | string // ABAC conditions
  effect?: 'ALLOW' | 'DENY' // Default is ALLOW
  reason?: string // Human-readable reason
}

export interface EvaluationResult {
  allowed: boolean
  effect: 'ALLOW' | 'DENY'
  reason?: string
  matchedRules?: string[]
  derivedRoles?: string[]
  latencyMs?: number
  correlationId?: string
}

/**
 * Hansen Security Policy Engine
 * Evaluates policies to determine if a principal can perform an action on a resource
 */
export class HansenSecurityPolicyEngine {
  private policies: Map<string, PolicyRule[]> = new Map()
  private denyRules: Map<string, PolicyRule[]> = new Map() // Separate deny rules for deny-override
  private policyMetadata: Map<string, { version: number; compiled: boolean }> = new Map()

  /**
   * Load policies (can be from database, files, or in-memory)
   */
  async loadPolicies(policies: PolicyRule[]): Promise<void> {
    const grouped = new Map<string, PolicyRule[]>()
    const denyGrouped = new Map<string, PolicyRule[]>()
    
    for (const policy of policies) {
      const effect = policy.effect || 'ALLOW'
      const target = effect === 'DENY' ? denyGrouped : grouped
      
      const existing = target.get(policy.resource) || []
      existing.push(policy)
      target.set(policy.resource, existing)
      
      // Store metadata
      this.policyMetadata.set(`${policy.resource}:${policy.actions.join(',')}`, {
        version: 1,
        compiled: true
      })
    }
    
    this.policies = grouped
    this.denyRules = denyGrouped
  }

  /**
   * Evaluate if principal can perform action on resource
   * Returns detailed result with reasoning
   */
  async evaluate(
    principal: Principal,
    resource: Resource,
    action: string
  ): Promise<EvaluationResult> {
    const startTime = Date.now()
    const correlationId = auditLogger.generateCorrelationId()

    try {
      // Step 1: Check explicit roles (fast path for OWNER)
      if (principal.roles.includes('OWNER')) {
        const latencyMs = Date.now() - startTime
        
        await auditLogger.logDecision({
          principalId: principal.id,
          principalRoles: principal.roles,
          resource: resource.kind,
          resourceId: resource.id,
          action,
          decision: 'ALLOW',
          effect: 'ALLOW',
          reason: 'OWNER role has full access',
          matchedRules: ['OWNER_FULL_ACCESS'],
          latencyMs,
          correlationId
        })

        metricsCollector.recordDecision('ALLOW', latencyMs, 'OWNER', resource.kind)

        return {
          allowed: true,
          effect: 'ALLOW',
          reason: 'OWNER role has full access',
          matchedRules: ['OWNER_FULL_ACCESS'],
          latencyMs,
          correlationId
        }
      }

      // Step 2: Compute derived roles (contextual roles)
      const derivedRoles = derivedRolesEngine.computeDerivedRoles(
        { id: principal.id, roles: principal.roles, attributes: principal.attributes },
        resource
      )
      const effectiveRoles = Array.from(new Set([...principal.roles, ...derivedRoles]))

      // Step 3: Check DENY rules first (deny-override security principle)
      const denyRules = this.denyRules.get(resource.kind) || []
      for (const rule of denyRules) {
        if (this.matchesRule(rule, action, effectiveRoles, principal, resource)) {
          const latencyMs = Date.now() - startTime
          const matchedRules = [`DENY:${rule.resource}:${action}`]

          await auditLogger.logDecision({
            principalId: principal.id,
            principalRoles: effectiveRoles,
            resource: resource.kind,
            resourceId: resource.id,
            action,
            decision: 'DENY',
            effect: 'DENY',
            reason: rule.reason || 'Denied by policy rule',
            matchedRules,
            latencyMs,
            correlationId
          })

          metricsCollector.recordDecision('DENY', latencyMs, rule.resource, resource.kind)

          return {
            allowed: false,
            effect: 'DENY',
            reason: rule.reason || 'Denied by policy rule',
            matchedRules,
            derivedRoles,
            latencyMs,
            correlationId
          }
        }
      }

      // Step 4: Check ALLOW rules
      const allowRules = this.policies.get(resource.kind) || []
      const matchedAllowRules: string[] = []

      for (const rule of allowRules) {
        if (this.matchesRule(rule, action, effectiveRoles, principal, resource)) {
          matchedAllowRules.push(`${rule.resource}:${action}:${rule.roles?.join(',')}`)
          
          const latencyMs = Date.now() - startTime

          await auditLogger.logDecision({
            principalId: principal.id,
            principalRoles: effectiveRoles,
            resource: resource.kind,
            resourceId: resource.id,
            action,
            decision: 'ALLOW',
            effect: 'ALLOW',
            reason: rule.reason || `Allowed by ${rule.resource} policy`,
            matchedRules: matchedAllowRules,
            derivedRoles,
            latencyMs,
            correlationId
          })

          metricsCollector.recordDecision('ALLOW', latencyMs, rule.resource, resource.kind)

          return {
            allowed: true,
            effect: 'ALLOW',
            reason: rule.reason || `Allowed by ${rule.resource} policy`,
            matchedRules: matchedAllowRules,
            derivedRoles,
            latencyMs,
            correlationId
          }
        }
      }

      // Step 5: Deny by default (fail-secure)
      const latencyMs = Date.now() - startTime

      await auditLogger.logDecision({
        principalId: principal.id,
        principalRoles: effectiveRoles,
        resource: resource.kind,
        resourceId: resource.id,
        action,
        decision: 'DENY',
        effect: 'DENY',
        reason: 'No matching policy rule found (deny by default)',
        matchedRules: [],
        derivedRoles,
        latencyMs,
        correlationId
      })

      metricsCollector.recordDecision('DENY', latencyMs, 'DEFAULT', resource.kind)

      return {
        allowed: false,
        effect: 'DENY',
        reason: 'No matching policy rule found (deny by default)',
        matchedRules: [],
        derivedRoles,
        latencyMs,
        correlationId
      }
    } catch (error) {
      const latencyMs = Date.now() - startTime
      metricsCollector.recordError('EVALUATION_ERROR')

      return {
        allowed: false,
        effect: 'DENY',
        reason: 'Policy evaluation error',
        latencyMs,
        correlationId
      }
    }
  }

  /**
   * Check if a rule matches the request
   */
  private matchesRule(
    rule: PolicyRule,
    action: string,
    effectiveRoles: string[],
    principal: Principal,
    resource: Resource
  ): boolean {
    // Check action match
    if (!rule.actions.includes(action) && !rule.actions.includes('*')) {
      return false
    }

    // Check role match (explicit roles or derived roles)
    if (rule.roles && rule.roles.length > 0) {
      const hasRole = rule.roles.some(role => effectiveRoles.includes(role))
      
      // Also check derived roles if specified
      const hasDerivedRole = rule.derivedRoles?.some(derived => 
        derivedRolesEngine.computeDerivedRoles(
          { id: principal.id, roles: principal.roles, attributes: principal.attributes },
          resource
        ).includes(derived)
      )

      if (!hasRole && !hasDerivedRole && !rule.roles.includes('*')) {
        return false
      }
    }

    // Check conditions (ABAC)
    if (rule.conditions) {
      if (typeof rule.conditions === 'string') {
        // CEL-like expression
        const matches = conditionEvaluator.evaluate(
          rule.conditions,
          principal.attributes || {},
          resource.attributes || {}
        )
        if (!matches) {
          return false
        }
      } else {
        // Simple key-value conditions
        for (const [key, value] of Object.entries(rule.conditions)) {
          if (key.startsWith('principal.')) {
            const attrKey = key.replace('principal.', '')
            const principalValue = principal.attributes?.[attrKey]
            
            if (principalValue !== value) {
              return false
            }
          } else if (key.startsWith('resource.')) {
            const attrKey = key.replace('resource.', '')
            const resourceValue = resource.attributes?.[attrKey]
            
            if (resourceValue !== value) {
              return false
            }
          }
        }
      }
    }

    return true
  }

  /**
   * Check multiple actions at once
   */
  async evaluateMultiple(
    principal: Principal,
    resource: Resource,
    actions: string[]
  ): Promise<Record<string, EvaluationResult>> {
    const results: Record<string, EvaluationResult> = {}
    
    for (const action of actions) {
      results[action] = await this.evaluate(principal, resource, action)
    }
    
    return results
  }

  /**
   * Get effective roles for principal-resource pair
   */
  getEffectiveRoles(principal: Principal, resource: Resource): string[] {
    return derivedRolesEngine.getEffectiveRoles(
      { id: principal.id, roles: principal.roles, attributes: principal.attributes },
      resource
    )
  }

  /**
   * Check if principal has any of the specified roles
   */
  hasRole(principal: Principal, roles: string[]): boolean {
    return roles.some(role => principal.roles.includes(role))
  }

  /**
   * Check if principal is admin (ADMIN or OWNER)
   */
  isAdmin(principal: Principal): boolean {
    return this.hasRole(principal, ['ADMIN', 'OWNER'])
  }

  /**
   * Check if principal is owner
   */
  isOwner(principal: Principal): boolean {
    return principal.roles.includes('OWNER')
  }

  /**
   * Reload policies (hot reload support)
   */
  async reloadPolicies(policies: PolicyRule[]): Promise<void> {
    await this.loadPolicies(policies)
  }

  /**
   * Get policy metadata
   */
  getPolicyMetadata(resource: string, actions: string[]): { version: number; compiled: boolean } | undefined {
    const key = `${resource}:${actions.join(',')}`
    return this.policyMetadata.get(key)
  }
}

// Default policy engine instance
export const policyEngine = new HansenSecurityPolicyEngine()

// Load default policies
policyEngine.loadPolicies([
  // Content policies
  {
    resource: 'content',
    actions: ['read', 'write', 'delete'],
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    effect: 'ALLOW',
    reason: 'Owners, admins, and editors can manage content'
  },
  {
    resource: 'content',
    actions: ['read'],
    roles: ['CLIENT'],
    effect: 'ALLOW',
    reason: 'Clients can read content'
  },
  
  // Project policies
  {
    resource: 'project',
    actions: ['read', 'write', 'delete', 'create'],
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    effect: 'ALLOW',
    reason: 'Owners, admins, and editors can manage projects'
  },
  {
    resource: 'project',
    actions: ['read'],
    roles: ['CLIENT'],
    effect: 'ALLOW',
    reason: 'Clients can read projects'
  },
  
  // User policies
  {
    resource: 'user',
    actions: ['read', 'write', 'delete'],
    roles: ['OWNER', 'ADMIN'],
    effect: 'ALLOW',
    reason: 'Only owners and admins can manage users'
  },
  
  // Security policies
  {
    resource: 'security',
    actions: ['*'],
    roles: ['OWNER'],
    effect: 'ALLOW',
    reason: 'Only owners have full security access'
  },
  {
    resource: 'security',
    actions: ['read'],
    roles: ['ADMIN'],
    effect: 'ALLOW',
    reason: 'Admins can view security settings'
  },
  
  // Billing policies
  {
    resource: 'billing',
    actions: ['*'],
    roles: ['OWNER'],
    effect: 'ALLOW',
    reason: 'Only owners have full billing access'
  },
  {
    resource: 'billing',
    actions: ['read', 'write'],
    roles: ['ADMIN'],
    effect: 'ALLOW',
    reason: 'Admins can manage billing'
  },
  
  // Dashboard policies
  {
    resource: 'dashboard',
    actions: ['read'],
    roles: ['OWNER', 'ADMIN', 'EDITOR', 'CLIENT'],
    effect: 'ALLOW',
    reason: 'All authenticated users can view dashboard'
  },
  
  // Admin access policies
  {
    resource: 'admin',
    actions: ['access', 'login', 'read', 'write', 'delete', '*'],
    roles: ['OWNER', 'ADMIN'],
    effect: 'ALLOW',
    reason: 'Owners and admins have full admin access'
  },
  {
    resource: 'admin',
    actions: ['read'],
    roles: ['EDITOR', 'CLIENT'],
    effect: 'ALLOW',
    reason: 'Editors and clients have limited admin read access'
  },
  
  // CRM Policies (Client, Lead, Pipeline, Communication)
  {
    resource: 'client',
    actions: ['read', 'write', 'delete', 'create', '*'],
    roles: ['OWNER', 'ADMIN'],
    effect: 'ALLOW',
    reason: 'Owners and admins have full client management access'
  },
  {
    resource: 'lead',
    actions: ['read', 'write', 'delete', 'create', 'convert', '*'],
    roles: ['OWNER', 'ADMIN'],
    effect: 'ALLOW',
    reason: 'Owners and admins have full lead management access'
  },
  {
    resource: 'pipeline',
    actions: ['read', 'write', 'delete', 'create', '*'],
    roles: ['OWNER', 'ADMIN'],
    effect: 'ALLOW',
    reason: 'Owners and admins have full pipeline management access'
  },
  {
    resource: 'communication',
    actions: ['read', 'write', 'delete', 'create', '*'],
    roles: ['OWNER', 'ADMIN'],
    effect: 'ALLOW',
    reason: 'Owners and admins have full communication management access'
  }
])
