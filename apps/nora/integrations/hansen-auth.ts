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
 * Nora BetterAuth Integration
 * Connector for BetterAuth authentication system
 */

import { prisma } from '@/lib/db/prisma'

export interface AuthUser {
  id: string
  email: string
  role: string
  name?: string
}

/**
 * Verify user token and get user info
 */
export async function verifyNoraAuth(token: string): Promise<AuthUser | null> {
  try {
    // Decode token (in production, use proper JWT verification)
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userId] = decoded.split(':')

    if (!userId) {
      return null
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || undefined
    }
  } catch (error: any) {
    console.error('❌ Auth verification failed:', error)
    return null
  }
}

/**
 * Check if user session is valid
 */
export async function isSessionValid(token: string): Promise<boolean> {
  try {
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: token,
        expires: {
          gt: new Date()
        }
      }
    })

    return !!session
  } catch (error: any) {
    console.error('❌ Session validation failed:', error)
    return false
  }
}



