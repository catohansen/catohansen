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
 * Admin Users API Route
 * List all users with filtering and search
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { prisma } from '@/lib/db/prisma'
import { audit } from '@/lib/audit/audit'

async function getUsers(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization - admin only
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'user-management',
      id: 'list',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')
    if (!hasAccess.allowed) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}

    if (role && role !== 'all') {
      where.role = role
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' as any } },
        { name: { contains: search, mode: 'insensitive' as any } }
      ]
    }

    // Get users from database
    const users = await prisma.user.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format users for frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      twoFAEnabled: user.twoFAEnabled,
      mustChangePassword: false, // TODO: Add field to schema if needed
      plan: 'free', // TODO: Add plan field if needed
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      phone: user.phone || '',
      image: user.image || ''
    }))

    // Audit log
    await audit(request, {
      action: 'users.list',
      resource: 'user-management',
      meta: {
        count: formattedUsers.length,
        filters: { role, status, search }
      }
    })

    return NextResponse.json({
      success: true,
      users: formattedUsers
    })
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return getUsers(request)
}



