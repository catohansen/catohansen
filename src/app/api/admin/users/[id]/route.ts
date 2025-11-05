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
 * Admin User API Route
 * Get, update, or delete a specific user
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { prisma } from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'
import { audit } from '@/lib/audit/audit'

async function getUser(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'user-management',
      id: params.id,
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')
    if (!hasAccess.allowed) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerified: true,
        twoFAEnabled: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        phone: true,
        image: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        ...targetUser,
        lastLoginAt: targetUser.lastLoginAt?.toISOString() || null,
        createdAt: targetUser.createdAt.toISOString(),
        updatedAt: targetUser.updatedAt.toISOString()
      }
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

async function updateUser(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'user-management',
      id: params.id,
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'update')
    if (!hasAccess.allowed) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, role, status, emailVerified, twoFAEnabled, phone } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (role !== undefined) updateData.role = role
    if (status !== undefined) updateData.status = status
    if (emailVerified !== undefined) updateData.emailVerified = emailVerified
    if (twoFAEnabled !== undefined) updateData.twoFAEnabled = twoFAEnabled
    if (phone !== undefined) updateData.phone = phone

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerified: true,
        twoFAEnabled: true,
        createdAt: true,
        updatedAt: true
      }
    })

    await audit(request, {
      action: 'users.update',
      resource: 'user-management',
      meta: { userId: params.id, changes: body }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser
    })
  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

async function deleteUser(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'user-management',
      id: params.id,
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'delete')
    if (!hasAccess.allowed) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id: params.id }
    })

    await audit(request, {
      action: 'users.delete',
      resource: 'user-management',
      meta: { userId: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getUser(request, { params })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateUser(request, { params })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteUser(request, { params })
}



