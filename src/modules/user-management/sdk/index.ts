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
 * User Management SDK
 * Client SDK for external use
 */

export type User = {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: string
  twoFAEnabled: boolean
}

export interface LoginResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export interface MeResponse {
  user?: User
  error?: string
}

/**
 * User Management Client
 * Client for user management via API
 */
export class UserManagementClient {
  constructor(private baseUrl: string = '/api/modules/user-management') {}

  /**
   * Login
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: 'Login failed'
      }
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  /**
   * Get current user
   */
  async me(): Promise<MeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        method: 'GET'
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Get user failed:', error)
      return {
        error: 'Failed to get user'
      }
    }
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'GET'
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.user || null
    } catch (error) {
      console.error('Get user failed:', error)
      return null
    }
  }
}

// Default client instance
export const userManagement = new UserManagementClient()

