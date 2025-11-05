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
 * RBAC Engine
 * Advanced Role-Based Access Control engine with permission inheritance
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { userManager } from './UserManager'
import { permissionManager } from './PermissionManager'
import { roleManager } from './RoleManager'

export interface CheckAccessInput {
  userId: string
  resource: string
  action: string
  resourceId?: string
}

export interface AccessDecision {
  allowed: boolean
  reason?: string
  roles?: string[]
  permissions?: string[]
  inheritedFrom?: string[]
}

/**
 * RBAC Engine
 * Centralized access control with role hierarchy and permission inheritance
 */
export class RBACEngine {
  /**
   * Check if user has access to perform action on resource
   */
  async checkAccess(input: CheckAccessInput): Promise<AccessDecision> {
    const { userId, resource, action, resourceId } = input

    try {
      // Get user with all roles and permissions
      const user = await userManager.getUserById(userId)
      if (!user) {
        return {
          allowed: false,
          reason: 'User not found',
        }
      }

      // Check user status
      if (user.status !== 'ACTIVE') {
        return {
          allowed: false,
          reason: `User status is ${user.status}`,
        }
      }

      // Check if user is owner (always allowed)
      if (await userManager.isOwner(userId)) {
        return {
          allowed: true,
          reason: 'User is owner',
          roles: [user.role],
        }
      }

      // Build permission name (e.g. "project.create")
      const permissionName = `${resource}.${action.toLowerCase()}`

      // Check direct permissions
      const hasDirectPermission = await permissionManager.userHasPermission(userId, permissionName)
      if (hasDirectPermission) {
        return {
          allowed: true,
          reason: `Direct permission: ${permissionName}`,
          permissions: [permissionName],
        }
      }

      // Check role permissions
      const userRoles = await this.getUserRoles(userId)
      const hasRolePermission = await this.checkRolePermissions(userRoles, permissionName)

      if (hasRolePermission) {
        return {
          allowed: true,
          reason: `Role permission: ${permissionName}`,
          roles: userRoles.map(r => r.id),
        }
      }

      // Check resource-specific role assignments
      if (resourceId) {
        const hasResourcePermission = await this.checkResourceRole(userId, resource, resourceId, action)
        if (hasResourcePermission) {
          return {
            allowed: true,
            reason: `Resource-specific role: ${resource}/${resourceId}`,
          }
        }
      }

      return {
        allowed: false,
        reason: `No permission: ${permissionName}`,
        roles: userRoles.map(r => r.id),
      }
    } catch (error) {
      console.error('Error checking access:', error)
      return {
        allowed: false,
        reason: 'Error checking access',
      }
    }
  }

  /**
   * Get all roles for user (including inherited roles)
   */
  async getUserRoles(userId: string): Promise<any[]> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.userRole === 'undefined') {
      return []
    }

    try {
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
          ...(await this.getActiveFilter()),
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
              childRoles: {
                include: {
                  child: {
                    include: {
                      rolePermissions: {
                        include: {
                          permission: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })

      // Flatten roles including inherited
      const allRoles: any[] = []
      for (const userRole of userRoles) {
        allRoles.push(userRole.role)
        // Add child roles (inherited)
        if (userRole.role.childRoles) {
          for (const childRole of userRole.role.childRoles) {
            if (!allRoles.find(r => r.id === childRole.child.id)) {
              allRoles.push(childRole.child)
            }
          }
        }
      }

      return allRoles
    } catch (error) {
      console.error('Error getting user roles:', error)
      return []
    }
  }

  /**
   * Check role permissions
   */
  private async checkRolePermissions(roles: any[], permissionName: string): Promise<boolean> {
    for (const role of roles) {
      if (!role.rolePermissions) continue

      const hasPermission = role.rolePermissions.some(
        (rp: any) => rp.granted && rp.permission.name === permissionName
      )

      if (hasPermission) return true
    }

    return false
  }

  /**
   * Check resource-specific role
   */
  private async checkResourceRole(
    userId: string,
    resourceType: string,
    resourceId: string,
    action: string
  ): Promise<boolean> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.roleAssignment === 'undefined') {
      return false
    }

    try {
      const assignment = await prisma.roleAssignment.findFirst({
        where: {
          userId,
          resourceType,
          resourceId,
          ...(await this.getActiveFilter()),
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      })

      if (!assignment) return false

      const permissionName = `${resourceType}.${action.toLowerCase()}`
      return assignment.role.rolePermissions.some(
        (rp: any) => rp.granted && rp.permission.name === permissionName
      )
    } catch (error) {
      console.error('Error checking resource role:', error)
      return false
    }
  }

  /**
   * Get active filter (exclude expired roles/permissions)
   */
  private async getActiveFilter() {
    const now = new Date()
    return {
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    }
  }

  /**
   * Get all permissions for user (direct + role-based + inherited)
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await userManager.getUserById(userId)
    if (!user) return []

    const permissions = new Set<string>()

    // Direct permissions
    if (user.permissions) {
      user.permissions.forEach(p => permissions.add(p))
    }

    // Role permissions
    const roles = await this.getUserRoles(userId)
    for (const role of roles) {
      if (role.rolePermissions) {
        for (const rp of role.rolePermissions) {
          if (rp.granted && rp.permission) {
            permissions.add(rp.permission.name)
          }
        }
      }
    }

    return Array.from(permissions)
  }
}

// Default RBAC engine instance
export const rbacEngine = new RBACEngine()







