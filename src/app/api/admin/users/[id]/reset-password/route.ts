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
 * Admin User Reset Password API Route
 * Reset user password
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { prisma } from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'
import { audit } from '@/lib/audit/audit'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { newPassword, sendEmail = false } = body

    // Generate new password or use provided one
    const password = newPassword || Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)
    const passwordHash = await hashPassword(password)

    await prisma.user.update({
      where: { id: params.id },
      data: { passwordHash }
    })

    // TODO: Send email if sendEmail is true

    await audit(request, {
      action: 'users.reset-password',
      resource: 'user-management',
      meta: { userId: params.id, sendEmail }
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      ...(newPassword ? {} : { temporaryPassword: password })
    })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset password' },
      { status: 500 }
    )
  }
}



