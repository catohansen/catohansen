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
 * Role Manager
 * Advanced RBAC role management system
 */

import { getPrismaClient } from '@/lib/db/prisma'

export interface CreateRoleInput {
  name: string
  slug: string
  description?: string
  level?: number
  isSystem?: boolean
  tenantId?: string
  permissions?: string[] // Permission IDs
}

export interface UpdateRoleInput {
  name?: string
  description?: string
  level?: number
  isActive?: boolean
  permissions?: string[] // Permission IDs to add/remove
}

export interface RoleData {
  id: string
  name: string
  slug: string
  description?: string | null
  level: number
  isSystem: boolean
  isActive: boolean
  tenantId?: string | null
  permissions: string[] // Permission IDs
  createdAt: Date
  updatedAt: Date
}

/**
 * Role Manager
 * Handles role creation, updates, hierarchy, and permissions
 */
export class RoleManager {
  /**
   * Create a new role
   */
  async createRole(input: CreateRoleInput, createdBy?: string): Promise<RoleData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.role === 'undefined') {
      throw new Error('Database not available. Please set DATABASE_URL environment variable.')
    }

    try {
      const role = await prisma.role.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          level: input.level || 0,
          isSystem: input.isSystem || false,
          tenantId: input.tenantId,
          createdById: createdBy,
          rolePermissions: input.permissions
            ? {
                create: input.permissions.map(permissionId => ({
                  permissionId,
                  granted: true,
                })),
              }
            : undefined,
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return this.mapToRoleData(role)
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string): Promise<RoleData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.role === 'undefined') {
      return null
    }

    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return role ? this.mapToRoleData(role) : null
    } catch (error) {
      console.error('Error getting role:', error)
      return null
    }
  }

  /**
   * Get role by slug
   */
  async getRoleBySlug(slug: string, tenantId?: string): Promise<RoleData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.role === 'undefined') {
      return null
    }

    try {
      const role = await prisma.role.findFirst({
        where: {
          slug,
          ...(tenantId ? { tenantId } : { tenantId: null }),
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return role ? this.mapToRoleData(role) : null
    } catch (error) {
      console.error('Error getting role by slug:', error)
      return null
    }
  }

  /**
   * Update role
   */
  async updateRole(roleId: string, input: UpdateRoleInput): Promise<RoleData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.role === 'undefined') {
      throw new Error('Database not available')
    }

    try {
      // Update permissions if provided
      if (input.permissions !== undefined) {
        // Remove existing permissions
        await prisma.rolePermission.deleteMany({
          where: { roleId },
        })

        // Add new permissions
        if (input.permissions.length > 0) {
          await prisma.rolePermission.createMany({
            data: input.permissions.map(permissionId => ({
              roleId,
              permissionId,
              granted: true,
            })),
          })
        }
      }

      // Update role
      const role = await prisma.role.update({
        where: { id: roleId },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.level !== undefined && { level: input.level }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return this.mapToRoleData(role)
    } catch (error) {
      console.error('Error updating role:', error)
      throw error
    }
  }

  /**
   * Delete role (only if not system role)
   */
  async deleteRole(roleId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.role === 'undefined') {
      throw new Error('Database not available')
    }

    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
      })

      if (role?.isSystem) {
        throw new Error('Cannot delete system role')
      }

      await prisma.role.delete({
        where: { id: roleId },
      })
    } catch (error) {
      console.error('Error deleting role:', error)
      throw error
    }
  }

  /**
   * Get all roles for a tenant
   */
  async getRoles(tenantId?: string, includeInactive = false): Promise<RoleData[]> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.role === 'undefined') {
      return []
    }

    try {
      const roles = await prisma.role.findMany({
        where: {
          ...(tenantId ? { tenantId } : { tenantId: null }),
          ...(includeInactive ? {} : { isActive: true }),
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
        orderBy: { level: 'desc' },
      })

      return roles.map((role: any) => this.mapToRoleData(role))
    } catch (error) {
      console.error('Error getting roles:', error)
      return []
    }
  }

  /**
   * Map Prisma Role to RoleData
   */
  private mapToRoleData(role: any): RoleData {
    return {
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      level: role.level,
      isSystem: role.isSystem,
      isActive: role.isActive,
      tenantId: role.tenantId,
      permissions: role.rolePermissions
        ?.filter((rp: any) => rp.granted)
        .map((rp: any) => rp.permission.id) || [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }
  }
}

// Default role manager instance
export const roleManager = new RoleManager()

