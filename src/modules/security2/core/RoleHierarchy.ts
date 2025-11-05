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
 * Role Hierarchy System
 * Manages role inheritance and hierarchy flattening
 * 
 * Features:
 * - Role inheritance (admin inherits from editor, editor inherits from viewer)
 * - Hierarchical role expansion
 * - Configurable hierarchies per tenant
 */

export interface RoleHierarchyDefinition {
  role: string
  inherits: string[] // Roles that this role inherits from
}

export class RoleHierarchy {
  private hierarchies: Map<string, RoleHierarchyDefinition[]> = new Map()

  /**
   * Set role hierarchy for tenant (or default)
   */
  setHierarchy(tenantId: string, hierarchy: RoleHierarchyDefinition[]): void {
    this.hierarchies.set(tenantId, hierarchy)
  }

  /**
   * Get role hierarchy for tenant (or default)
   */
  getHierarchy(tenantId: string = 'default'): RoleHierarchyDefinition[] {
    return this.hierarchies.get(tenantId) || this.getDefaultHierarchy()
  }

  /**
   * Get default role hierarchy
   */
  private getDefaultHierarchy(): RoleHierarchyDefinition[] {
    return [
      { role: 'OWNER', inherits: [] },
      { role: 'ADMIN', inherits: ['OWNER'] }, // ADMIN inherits from OWNER
      { role: 'EDITOR', inherits: ['ADMIN'] }, // EDITOR inherits from ADMIN
      { role: 'CLIENT', inherits: [] },
      { role: 'SERVICE', inherits: [] }
    ]
  }

  /**
   * Flatten roles - expand with inherited roles
   */
  flatten(roles: string[], tenantId: string = 'default'): string[] {
    const hierarchy = this.getHierarchy(tenantId)
    const hierarchyMap = new Map<string, string[]>()
    
    // Build hierarchy map
    for (const def of hierarchy) {
      hierarchyMap.set(def.role, def.inherits || [])
    }

    const expanded = new Set<string>()
    
    /**
     * Recursively add role and all inherited roles
     */
    const visit = (role: string) => {
      if (expanded.has(role)) return
      
      expanded.add(role)
      
      // Add inherited roles
      const inherits = hierarchyMap.get(role) || []
      for (const inheritedRole of inherits) {
        visit(inheritedRole)
      }
    }

    // Expand all input roles
    for (const role of roles) {
      visit(role)
    }

    return Array.from(expanded)
  }

  /**
   * Check if role inherits from another role
   */
  inherits(role: string, fromRole: string, tenantId: string = 'default'): boolean {
    const flattened = this.flatten([role], tenantId)
    return flattened.includes(fromRole)
  }

  /**
   * Get all roles that inherit from a role
   */
  getDescendants(role: string, tenantId: string = 'default'): string[] {
    const hierarchy = this.getHierarchy(tenantId)
    const descendants: string[] = []

    for (const def of hierarchy) {
      if (def.inherits.includes(role)) {
        descendants.push(def.role)
        // Recursively get descendants of descendants
        descendants.push(...this.getDescendants(def.role, tenantId))
      }
    }

    return Array.from(new Set(descendants))
  }
}

// Default role hierarchy instance
export const roleHierarchy = new RoleHierarchy()





