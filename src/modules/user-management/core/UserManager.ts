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
 * User Management Core
 * Handles user authentication, sessions, roles, and permissions
 */

import { getPrismaClient } from '@/lib/db/prisma'

// Types (matching Prisma schema)
export type SystemRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'CLIENT' | 'SERVICE' | 'VIEWER' | 'MODERATOR' | 'DEVELOPER'
export type Role = SystemRole // Alias for backwards compatibility

export interface UserData {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: Role // Legacy system role
  twoFAEnabled: boolean
  status?: string
  emailVerified?: boolean
  roles?: string[] // Advanced RBAC role IDs
  permissions?: string[] // Direct permission IDs
}

export interface CreateUserInput {
  email: string
  name?: string
  password: string
  role?: Role // Legacy system role
  tenantId?: string
  roles?: string[] // Advanced RBAC role IDs
}

export interface UpdateUserInput {
  name?: string
  image?: string
  role?: Role
  twoFAEnabled?: boolean
}

interface PrismaUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: SystemRole
  status: string
  emailVerified: boolean
  twoFAEnabled: boolean
  createdAt: Date
  updatedAt: Date
  userRoles?: any[]
  userPermissions?: any[]
}

/**
 * User Manager
 * Core functionality for user management with advanced RBAC
 */
export class UserManager {
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.user === 'undefined') {
      return null
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          userPermissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return user ? this.mapToUserData(user) : null
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.user === 'undefined') {
      return null
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          userPermissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return user ? this.mapToUserData(user) : null
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  /**
   * Create user
   */
  async createUser(input: CreateUserInput): Promise<UserData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.user === 'undefined') {
      throw new Error('Database not available. Please set DATABASE_URL environment variable.')
    }

    const { hashPassword } = await import('@/lib/auth/password')
    const passwordHash = await hashPassword(input.password)

    try {
      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash,
          role: input.role || 'EDITOR',
          status: 'PENDING_VERIFICATION',
        },
      })

      return this.mapToUserData(user)
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, input: UpdateUserInput): Promise<UserData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.user === 'undefined') {
      throw new Error('Database not available')
    }

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.image !== undefined && { image: input.image }),
          ...(input.role !== undefined && { role: input.role }),
          ...(input.twoFAEnabled !== undefined && { twoFAEnabled: input.twoFAEnabled }),
        },
      })

      return this.mapToUserData(user)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.user === 'undefined') {
      throw new Error('Database not available')
    }

    try {
      await prisma.user.delete({
        where: { id: userId },
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<UserData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.user === 'undefined') {
      throw new Error('Database not available')
    }

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          status: 'ACTIVE',
        },
      })

      return this.mapToUserData(user)
    } catch (error) {
      console.error('Error verifying email:', error)
      throw error
    }
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const user = await this.getUserById(userId)
    return user ? [user.role] : []
  }

  /**
   * Check if user has role
   */
  async userHasRole(userId: string, roles: Role[]): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId)
    return roles.some(role => userRoles.includes(role))
  }

  /**
   * Check if user is admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    return this.userHasRole(userId, ['ADMIN', 'OWNER'])
  }

  /**
   * Check if user is owner
   */
  async isOwner(userId: string): Promise<boolean> {
    return this.userHasRole(userId, ['OWNER'])
  }

  /**
   * Map Prisma User to UserData
   */
  private mapToUserData(user: any): UserData {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      twoFAEnabled: user.twoFAEnabled,
      status: user.status,
      emailVerified: user.emailVerified,
      roles: user.userRoles?.map((ur: any) => ur.role.id) || [],
      permissions: user.userPermissions
        ?.filter((up: any) => up.granted)
        .map((up: any) => up.permission.id) || [],
    }
  }
}

// Default user manager instance
export const userManager = new UserManager()
