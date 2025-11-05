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
 * Admin Profile API Route
 * Get and update user profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/db/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { auditLogger } from '@/modules/security2/core/AuditLogger'

async function getProfile(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode token to get user ID (simplified - use JWT in production)
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const prisma = await getPrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        phone: true,
        timezone: true,
        locale: true,
        twoFAEnabled: true,
        emailVerified: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateProfile(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode token to get user ID
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const body = await request.json()
    const { name, phone, timezone, locale } = body

    const prisma = await getPrismaClient()
    
    // Update user profile
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(timezone && { timezone }),
        ...(locale && { locale }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        timezone: true,
        locale: true,
      }
    })

    // Audit log profile update
    await auditLogger.logDecision({
      principalId: userId,
      principalRoles: [],
      resource: 'user',
      resourceId: userId,
      action: 'update',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Profile updated',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      success: true,
      user: updated
    })
  } catch (error: any) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function changePassword(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode token to get user ID
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const prisma = await getPrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
        role: true,
      }
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.passwordHash)
    
    if (!isCurrentPasswordValid) {
      // Audit log failed password change attempt
      await auditLogger.logDecision({
        principalId: user.id,
        principalRoles: [user.role],
        resource: 'user',
        resourceId: user.id,
        action: 'change-password',
        decision: 'DENY',
        effect: 'DENY',
        reason: 'Current password incorrect',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      }
    })

    // Audit log successful password change
    await auditLogger.logDecision({
      principalId: user.id,
      principalRoles: [user.role],
      resource: 'user',
      resourceId: user.id,
      action: 'change-password',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Password changed successfully',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error: any) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return getProfile(request)
}

export async function PATCH(request: NextRequest) {
  return updateProfile(request)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  if (body.action === 'change-password') {
    return changePassword(request)
  }
  
  return updateProfile(request)
}







