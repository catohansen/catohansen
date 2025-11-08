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
 * Session Renewal API Route
 * Manually renew a session before it expires
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/modules/user-management/core/AuthEngine'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No session token provided' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { rememberMe } = body

    const result = await auth.renewSession(token, rememberMe)

    if (!result.success) {
      return NextResponse.json(
        result,
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      session: result.session,
    })

    // Update cookie expiry if session was renewed
    if (result.session) {
      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge,
      })
    }

    return response
  } catch (error: any) {
    console.error('Session renewal error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during session renewal' },
      { status: 500 }
    )
  }
}


