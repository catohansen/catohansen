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
 * OAuth Callback API Route
 * Handle OAuth callback from providers
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/modules/user-management/core/AuthEngine'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider as 'google' | 'github' | 'discord' | 'twitter'
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/admin/login?error=missing_code_or_state', request.url)
      )
    }

    if (!['google', 'github', 'discord', 'twitter'].includes(provider)) {
      return NextResponse.redirect(
        new URL('/admin/login?error=invalid_provider', request.url)
      )
    }

    const result = await auth.handleOAuthCallback(
      provider,
      code,
      state,
      {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    )

    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent(result.error || 'oauth_failed')}`, request.url)
      )
    }

    // Set session cookie
    const response = NextResponse.redirect(new URL('/admin', request.url))
    
    if (result.session) {
      response.cookies.set('auth-token', result.session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return response
  } catch (error: any) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/admin/login?error=oauth_callback_failed', request.url)
    )
  }
}





