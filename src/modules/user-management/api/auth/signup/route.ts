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
 * Sign Up API Route
 * Modern authentication endpoint using AuthEngine
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/modules/user-management/core/AuthEngine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const result = await auth.signUp(
      { email, password, name },
      {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    )

    if (!result.success) {
      return NextResponse.json(
        result,
        { status: 400 }
      )
    }

    const response = NextResponse.json(result)

    // Set secure httpOnly cookie
    if (result.session) {
      response.cookies.set('auth-token', result.session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days default
      })
    }

    return response
  } catch (error: any) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during sign up' },
      { status: 500 }
    )
  }
}





