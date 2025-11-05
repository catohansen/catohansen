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
 * Session API Route
 * Verify and get current session
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/modules/user-management/core/AuthEngine'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { valid: false },
        { status: 401 }
      )
    }

    const result = await auth.verifySession(token)

    if (!result.valid) {
      return NextResponse.json(
        { valid: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: result.user,
      session: result.session,
    })
  } catch (error: any) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { valid: false },
      { status: 500 }
    )
  }
}





