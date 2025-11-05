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
 * Permission Manager
 * Advanced permission management system
 */

import { getPrismaClient } from '@/lib/db/prisma'

export type PermissionAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'ARCHIVE' | 'MANAGE' | 'ADMINISTER'

export interface CreatePermissionInput {
  name: string // e.g. "project.create"
  resource: string // e.g. "project"
  action: PermissionAction
  description?: string
  category?: string
}

export interface UpdatePermissionInput {
  description?: string
  category?: string
}

export interface PermissionData {
  id: string
  name: string
  resource: string
  action: PermissionAction
  description?: string | null
  category?: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Permission Manager
 * Handles permission creation, updates, and queries
 */
export class PermissionManager {
  /**
   * Create a new permission
   */
  async createPermission(input: CreatePermissionInput, createdBy?: string): Promise<PermissionData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.permission === 'undefined') {
      throw new Error('Database not available. Please set DATABASE_URL environment variable.')
    }

    try {
      const permission = await prisma.permission.create({
        data: {
          name: input.name,
          resource: input.resource,
          action: input.action,
          description: input.description,
          category: input.category,
          createdById: createdBy,
        },
      })

      return this.mapToPermissionData(permission)
    } catch (error) {
      console.error('Error creating permission:', error)
      throw error
    }
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(permissionId: string): Promise<PermissionData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.permission === 'undefined') {
      return null
    }

    try {
      const permission = await prisma.permission.findUnique({
        where: { id: permissionId },
      })

      return permission ? this.mapToPermissionData(permission) : null
    } catch (error) {
      console.error('Error getting permission:', error)
      return null
    }
  }

  /**
   * Get permission by name
   */
  async getPermissionByName(name: string): Promise<PermissionData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.permission === 'undefined') {
      return null
    }

    try {
      const permission = await prisma.permission.findUnique({
        where: { name },
      })

      return permission ? this.mapToPermissionData(permission) : null
    } catch (error) {
      console.error('Error getting permission by name:', error)
      return null
    }
  }

  /**
   * Get all permissions for a resource
   */
  async getPermissionsByResource(resource: string): Promise<PermissionData[]> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.permission === 'undefined') {
      return []
    }

    try {
      const permissions = await prisma.permission.findMany({
        where: { resource },
        orderBy: { name: 'asc' },
      })

      return permissions.map((p: any) => this.mapToPermissionData(p))
    } catch (error) {
      console.error('Error getting permissions by resource:', error)
      return []
    }
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(): Promise<PermissionData[]> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.permission === 'undefined') {
      return []
    }

    try {
      const permissions = await prisma.permission.findMany({
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      })

      return permissions.map((p: any) => this.mapToPermissionData(p))
    } catch (error) {
      console.error('Error getting all permissions:', error)
      return []
    }
  }

  /**
   * Check if user has permission
   */
  async userHasPermission(userId: string, permissionName: string): Promise<boolean> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.user === 'undefined') {
      return false
    }

    try {
      // Get user with roles and permissions
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
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
          },
          userPermissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      if (!user) return false

      // Check direct permissions
      const hasDirectPermission = user.userPermissions.some(
        (up: any) => up.granted && up.permission.name === permissionName
      )

      if (hasDirectPermission) return true

      // Check role permissions
      for (const userRole of user.userRoles) {
        const hasRolePermission = userRole.role.rolePermissions.some(
          (rp: any) => rp.granted && rp.permission.name === permissionName
        )
        if (hasRolePermission) return true
      }

      return false
    } catch (error) {
      console.error('Error checking user permission:', error)
      return false
    }
  }

  /**
   * Map Prisma Permission to PermissionData
   */
  private mapToPermissionData(permission: any): PermissionData {
    return {
      id: permission.id,
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description,
      category: permission.category,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    }
  }
}

// Default permission manager instance
export const permissionManager = new PermissionManager()

