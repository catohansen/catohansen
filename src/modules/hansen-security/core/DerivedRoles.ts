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
 * Derived Roles System
 * Dynamically compute roles based on context and attributes
 * 
 * Similar to Cerbos Derived Roles - allows contextual role assignment
 */

export interface DerivedRoleRule {
  name: string // e.g. "owner", "manager"
  condition: string // Expression to evaluate (e.g. "resource.owner == principal.id")
  parentRoles?: string[] // Roles that inherit from this derived role
}

export class DerivedRolesEngine {
  private derivedRoles: Map<string, DerivedRoleRule[]> = new Map()

  /**
   * Register derived role rules for a resource kind
   */
  registerDerivedRoles(resourceKind: string, rules: DerivedRoleRule[]): void {
    this.derivedRoles.set(resourceKind, rules)
  }

  /**
   * Compute derived roles for a principal-resource pair
   */
  computeDerivedRoles(
    principal: { id: string; roles: string[]; attributes?: Record<string, unknown> },
    resource: { kind: string; id?: string; attributes?: Record<string, unknown> }
  ): string[] {
    const rules = this.derivedRoles.get(resource.kind) || []
    const derived: string[] = []

    for (const rule of rules) {
      if (this.evaluateCondition(rule.condition, principal, resource)) {
        derived.push(rule.name)
        
        // Add parent roles if defined
        if (rule.parentRoles) {
          derived.push(...rule.parentRoles)
        }
      }
    }

    return derived
  }

  /**
   * Get all effective roles (explicit + derived)
   */
  getEffectiveRoles(
    principal: { id: string; roles: string[]; attributes?: Record<string, unknown> },
    resource: { kind: string; id?: string; attributes?: Record<string, unknown> }
  ): string[] {
    const explicitRoles = principal.roles || []
    const derived = this.computeDerivedRoles(principal, resource)
    
    // Combine and deduplicate
    return Array.from(new Set([...explicitRoles, ...derived]))
  }

  /**
   * Evaluate condition (simple expression evaluator)
   */
  private evaluateCondition(
    condition: string,
    principal: { id: string; attributes?: Record<string, unknown> },
    resource: { id?: string; attributes?: Record<string, unknown> }
  ): boolean {
    try {
      // Simple condition evaluation
      // Replace common patterns
      let expr = condition
      
      // resource.owner == principal.id
      expr = expr.replace(/resource\.owner/g, `"${resource.attributes?.owner || ''}"`)
      expr = expr.replace(/principal\.id/g, `"${principal.id}"`)
      
      // resource.team == principal.team
      if (resource.attributes?.team) {
        expr = expr.replace(/resource\.team/g, `"${resource.attributes.team}"`)
      }
      if (principal.attributes?.team) {
        expr = expr.replace(/principal\.team/g, `"${principal.attributes.team}"`)
      }
      
      // Evaluate
      const result = new Function(`return ${expr}`)()
      return Boolean(result)
    } catch {
      return false
    }
  }
}

// Default derived roles engine
export const derivedRolesEngine = new DerivedRolesEngine()

// Register common derived roles
derivedRolesEngine.registerDerivedRoles('project', [
  {
    name: 'PROJECT_OWNER',
    condition: 'resource.owner == principal.id',
    parentRoles: ['EDITOR'] // PROJECT_OWNER inherits EDITOR permissions
  }
])

derivedRolesEngine.registerDerivedRoles('content', [
  {
    name: 'CONTENT_OWNER',
    condition: 'resource.owner == principal.id',
    parentRoles: ['EDITOR']
  }
])

