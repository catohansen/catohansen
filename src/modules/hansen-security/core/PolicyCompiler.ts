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
 * Policy Compiler
 * Compiles and caches policies for efficient evaluation
 * 
 * Features:
 * - Policy compilation to efficient format
 * - Caching compiled policies
 * - Hot reload support
 * - Tenant-aware caching
 */

import type { PolicyRule } from './PolicyEngine'

export interface CompiledPolicy {
  tenantId: string
  resource: string
  rules: CompiledRule[]
  compiledAt: Date
  version: number
}

export interface CompiledRule {
  id?: string
  resource: string
  actions: string[]
  roles?: string[]
  conditions?: any
  effect: 'ALLOW' | 'DENY'
  priority?: number
  reason?: string
}

export class PolicyCompiler {
  private cache: Map<string, CompiledPolicy> = new Map()
  private defaultVersion = 1

  /**
   * Compile policy rule
   */
  compile(tenantId: string, policy: PolicyRule): CompiledRule {
    // Normalize actions
    const actions = Array.isArray(policy.actions)
      ? policy.actions
      : [policy.actions]

    // Normalize roles
    const roles = policy.roles || []

    return {
      resource: policy.resource,
      actions,
      roles,
      conditions: policy.conditions,
      effect: policy.effect || 'ALLOW',
      priority: this.calculatePriority(policy),
      reason: policy.reason
    }
  }

  /**
   * Compile multiple policies for a resource
   */
  compilePolicies(tenantId: string, policies: PolicyRule[]): CompiledPolicy {
    const resource = policies[0]?.resource || 'unknown'
    const cacheKey = this.getCacheKey(tenantId, resource)

    // Check if already compiled
    const cached = this.cache.get(cacheKey)
    if (cached && cached.compiledAt > new Date(Date.now() - 60 * 1000)) {
      return cached
    }

    // Compile all rules
    const compiledRules: CompiledRule[] = policies.map((policy, index) => ({
      ...this.compile(tenantId, policy),
      id: `rule-${index}-${Date.now()}`
    }))

    // Sort by priority (DENY rules first, then by priority)
    compiledRules.sort((a, b) => {
      if (a.effect !== b.effect) {
        return a.effect === 'DENY' ? -1 : 1 // DENY first
      }
      return (a.priority || 0) - (b.priority || 0)
    })

    const compiled: CompiledPolicy = {
      tenantId,
      resource,
      rules: compiledRules,
      compiledAt: new Date(),
      version: this.defaultVersion
    }

    // Cache compiled policy
    this.cache.set(cacheKey, compiled)

    return compiled
  }

  /**
   * Get compiled policies for resource
   */
  async getCompiledPolicies(tenantId: string, resource: string): Promise<CompiledRule[]> {
    const cacheKey = this.getCacheKey(tenantId, resource)
    const compiled = this.cache.get(cacheKey)

    if (compiled) {
      return compiled.rules
    }

    // Return empty if not found
    return []
  }

  /**
   * Clear cache for tenant/resource
   */
  clearCache(tenantId?: string, resource?: string): void {
    if (tenantId && resource) {
      const key = this.getCacheKey(tenantId, resource)
      this.cache.delete(key)
    } else if (tenantId) {
      // Clear all for tenant
      for (const key of Array.from(this.cache.keys())) {
        if (key.startsWith(`${tenantId}::`)) {
          this.cache.delete(key)
        }
      }
    } else {
      // Clear all
      this.cache.clear()
    }
  }

  /**
   * Invalidate cache (force recompilation)
   */
  invalidate(tenantId: string, resource: string): void {
    this.clearCache(tenantId, resource)
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number
    entries: Array<{ key: string; resource: string; rulesCount: number }>
  } {
    const entries: Array<{ key: string; resource: string; rulesCount: number }> = []

    for (const [key, compiled] of Array.from(this.cache.entries())) {
      entries.push({
        key,
        resource: compiled.resource,
        rulesCount: compiled.rules.length
      })
    }

    return {
      size: this.cache.size,
      entries
    }
  }

  /**
   * Calculate priority for rule
   */
  private calculatePriority(policy: PolicyRule): number {
    // DENY rules have higher priority (lower number = higher priority)
    let priority = policy.effect === 'DENY' ? 0 : 100

    // More specific actions get higher priority
    if (Array.isArray(policy.actions)) {
      priority += policy.actions.length === 1 && policy.actions[0] !== '*' ? -10 : 0
    }

    // More specific roles get higher priority
    if (policy.roles && policy.roles.length > 0) {
      priority -= policy.roles.length * 5
    }

    // Conditions add specificity (higher priority)
    if (policy.conditions) {
      priority -= 20
    }

    return priority
  }

  /**
   * Generate cache key
   */
  private getCacheKey(tenantId: string, resource: string): string {
    return `${tenantId}::${resource}`
  }
}

// Default policy compiler instance
export const policyCompiler = new PolicyCompiler()

