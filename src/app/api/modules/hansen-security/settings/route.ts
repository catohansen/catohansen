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
 * Hansen Security Settings API
 * GET: Get current security settings
 * PUT: Update security settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { securitySettings } from '@/modules/security2/core/SecuritySettings'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only OWNER and ADMIN can view security settings
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const settings = await securitySettings.getSettings()
    
    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error: any) {
    console.error('Get security settings error:', error)
    return NextResponse.json(
      { error: 'Failed to get security settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only OWNER can update security settings
    if (user.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Forbidden. Only OWNER can update security settings.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updates = body.settings || {}

    // Validate updates
    if (updates.rememberMeEnabled !== undefined && typeof updates.rememberMeEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'rememberMeEnabled must be a boolean' },
        { status: 400 }
      )
    }

    const updatedSettings = await securitySettings.updateSettings(
      updates,
      user.id
    )
    
    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: 'Security settings updated successfully'
    })
  } catch (error: any) {
    console.error('Update security settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update security settings' },
      { status: 500 }
    )
  }
}

