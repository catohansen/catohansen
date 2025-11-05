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
 * Nora Permissions API Route
 * Manage voice permissions per user
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getVoiceEngine } from '../../core/voice-engine'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import { audit } from '@/lib/audit/audit'

const grantSchema = z.object({
  userId: z.string(),
  permissions: z.object({
    speak: z.boolean().optional(),
    listen: z.boolean().optional()
  }),
  expiresAt: z.string().optional(), // ISO date string
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // User can only grant permissions for themselves or admin can grant for others
    const body = await request.json()
    const parsed = grantSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      )
    }

    const { userId, permissions, expiresAt } = parsed.data

    // Check if user can grant permission (self or admin)
    if (userId !== user.id && user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Grant permission
    const voiceEngine = getVoiceEngine()
    const expires = expiresAt ? new Date(expiresAt) : undefined
    
    voiceEngine.grantPermission(userId, permissions, expires)

    await audit(request, {
      action: 'nora.permissions.grant',
      resource: 'nora',
      meta: { userId, permissions, expiresAt }
    })

    return NextResponse.json({
      success: true,
      message: 'Permission granted'
    })
  } catch (error: any) {
    console.error('Grant permission error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to grant permission' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('userId') || user.id

    // Check if user can revoke (self or admin)
    if (targetUserId !== user.id && user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const voiceEngine = getVoiceEngine()
    voiceEngine.revokePermission(targetUserId)

    await audit(request, {
      action: 'nora.permissions.revoke',
      resource: 'nora',
      meta: { userId: targetUserId }
    })

    return NextResponse.json({
      success: true,
      message: 'Permission revoked'
    })
  } catch (error: any) {
    console.error('Revoke permission error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to revoke permission' },
      { status: 500 }
    )
  }
}



