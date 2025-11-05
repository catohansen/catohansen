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
 * API Route: /api/modules/onboarding/github/auth/login
 * GitHub OAuth Login
 * Redirects to GitHub OAuth authorization
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub OAuth not configured. Please set GITHUB_CLIENT_ID in environment variables.' },
      { status: 500 }
    )
  }

  const redirectUri = `${req.nextUrl.origin}/api/modules/onboarding/github/auth/callback`
  const scope = 'repo read:org user:email'
  const state = crypto.randomBytes(32).toString('hex')

  // Store state in cookie for verification
  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`
  )

  response.cookies.set('github-oauth-state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  })

  return response
}





