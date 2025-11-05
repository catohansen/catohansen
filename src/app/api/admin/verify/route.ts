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
 * Admin Verify Route
 * Verifies admin authentication token by checking session
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify token by checking session in database
    try {
      const prisma = await getPrismaClient()
      
      // Check if session exists and is valid
      const session = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
            }
          }
        }
      })

      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Invalid token - session not found' },
          { status: 401 }
        )
      }

      // Check if session is expired
      if (session.expires < new Date()) {
        // Delete expired session
        await prisma.session.delete({
          where: { sessionToken: token }
        })
        
        return NextResponse.json(
          { success: false, error: 'Token expired' },
          { status: 401 }
        )
      }

      // Check if user is active
      if (session.user.status !== 'ACTIVE') {
        return NextResponse.json(
          { success: false, error: 'User account is not active' },
          { status: 403 }
        )
      }

      // Token is valid
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role
        },
        message: 'Token is valid'
      })
    } catch (dbError: any) {
      // Database might not be available - allow with basic token check
      console.warn('Database check failed, using basic token validation:', dbError)
      
      // Basic token validation (fallback)
      if (token === 'invalid' || token.length < 10) {
        return NextResponse.json(
          { success: false, error: 'Invalid token format' },
          { status: 401 }
        )
      }

      // Allow access (basic validation)
      return NextResponse.json({
        success: true,
        authenticated: true,
        message: 'Token validated (basic check)'
      })
    }
  } catch (error: any) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Token verification failed'
      },
      { status: 500 }
    )
  }
}
