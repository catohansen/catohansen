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
 * Policy Validator
 * Validates policy structure and rules
 * 
 * Features:
 * - Schema validation
 * - Rule validation
 * - Type checking
 * - Security checks
 */

import type { PolicyRule } from './PolicyEngine'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export class PolicyValidator {
  /**
   * Validate policy rule
   */
  validate(rule: PolicyRule): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields
    if (!rule.resource || typeof rule.resource !== 'string') {
      errors.push('Policy rule must have a resource field (string)')
    }

    if (!rule.actions) {
      errors.push('Policy rule must have actions field')
    } else {
      if (!Array.isArray(rule.actions) && typeof rule.actions !== 'string') {
        errors.push('Policy rule actions must be a string or array of strings')
      }
    }

    // Effect validation
    if (rule.effect && !['ALLOW', 'DENY'].includes(rule.effect)) {
      errors.push(`Policy rule effect must be 'ALLOW' or 'DENY', got: ${rule.effect}`)
    }

    // Roles validation
    if (rule.roles) {
      if (!Array.isArray(rule.roles)) {
        errors.push('Policy rule roles must be an array of strings')
      } else {
        for (const role of rule.roles) {
          if (typeof role !== 'string') {
            errors.push(`Policy rule roles must be strings, got: ${typeof role}`)
          }
        }
      }
    }

    // Conditions validation
    if (rule.conditions) {
      if (typeof rule.conditions !== 'object') {
        errors.push('Policy rule conditions must be an object')
      }
    }

    // Security warnings
    if (rule.actions && Array.isArray(rule.actions) && rule.actions.includes('*') && rule.effect === 'ALLOW') {
      warnings.push('Wildcard action (*) with ALLOW effect grants broad access - ensure this is intended')
    }

    if (!rule.roles && !rule.conditions) {
      warnings.push('Policy rule has no role or condition restrictions - this may allow all principals')
    }

    // Resource validation
    if (rule.resource && typeof rule.resource === 'string') {
      // Check for valid resource names
      if (!/^[a-z0-9_-]+$/i.test(rule.resource)) {
        warnings.push(`Resource name '${rule.resource}' contains unusual characters - ensure this is intended`)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate multiple policies
   */
  validateMany(rules: PolicyRule[]): {
    valid: boolean
    errors: Array<{ index: number; rule: PolicyRule; errors: string[] }>
    warnings: Array<{ index: number; rule: PolicyRule; warnings: string[] }>
  } {
    const errors: Array<{ index: number; rule: PolicyRule; errors: string[] }> = []
    const warnings: Array<{ index: number; rule: PolicyRule; warnings: string[] }> = []

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const result = this.validate(rule)

      if (result.errors.length > 0) {
        errors.push({
          index: i,
          rule,
          errors: result.errors
        })
      }

      if (result.warnings.length > 0) {
        warnings.push({
          index: i,
          rule,
          warnings: result.warnings
        })
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate policy set for conflicts
   */
  validatePolicySet(rules: PolicyRule[]): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check for duplicate rules
    const seen = new Map<string, number>()
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const key = `${rule.resource}:${JSON.stringify(rule.actions)}:${JSON.stringify(rule.roles)}`
      
      if (seen.has(key)) {
        warnings.push(`Duplicate rule detected at index ${i} (duplicate of index ${seen.get(key)})`)
      } else {
        seen.set(key, i)
      }
    }

    // Check for conflicting DENY and ALLOW rules
    const denyRules = rules.filter(r => r.effect === 'DENY')
    const allowRules = rules.filter(r => r.effect === 'ALLOW')

    for (const denyRule of denyRules) {
      for (const allowRule of allowRules) {
        if (this.rulesConflict(denyRule, allowRule)) {
          warnings.push(
            `Potential conflict: DENY rule for resource '${denyRule.resource}' ` +
            `conflicts with ALLOW rule for same resource`
          )
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Check if two rules conflict
   */
  private rulesConflict(rule1: PolicyRule, rule2: PolicyRule): boolean {
    // Same resource
    if (rule1.resource !== rule2.resource) {
      return false
    }

    // Overlapping actions
    const actions1 = Array.isArray(rule1.actions) ? rule1.actions : [rule1.actions]
    const actions2 = Array.isArray(rule2.actions) ? rule2.actions : [rule2.actions]

    const hasWildcard = actions1.includes('*') || actions2.includes('*')
    const hasOverlap = actions1.some(a => actions2.includes(a))

    if (!hasWildcard && !hasOverlap) {
      return false
    }

    // Overlapping roles
    const roles1 = rule1.roles || []
    const roles2 = rule2.roles || []

    // If either rule has no roles, they apply to all roles
    if (roles1.length === 0 || roles2.length === 0) {
      return true
    }

    const rolesOverlap = roles1.some(r => roles2.includes(r))
    return rolesOverlap
  }
}

// Default policy validator instance
export const policyValidator = new PolicyValidator()





