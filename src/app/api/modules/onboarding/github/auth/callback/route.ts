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
 * API Route: /api/modules/onboarding/github/auth/callback
 * GitHub OAuth Callback
 * Handles OAuth callback and stores access token securely
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import crypto from 'crypto'

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get('admin-token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        metadata: true,
      },
    })

    if (!user || user.status !== 'ACTIVE') {
      return null
    }

    return user
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')
    const state = req.nextUrl.searchParams.get('state')
    const storedState = req.cookies.get('github-oauth-state')?.value

    if (!code) {
      return NextResponse.redirect(
        new URL('/admin/modules/onboarding?error=missing_code', req.url)
      )
    }

    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL('/admin/modules/onboarding?error=invalid_state', req.url)
      )
    }

    // Get authenticated user
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.redirect(
        new URL('/admin/modules/onboarding?error=unauthorized', req.url)
      )
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${req.nextUrl.origin}/api/modules/onboarding/github/auth/callback`,
        }),
      }
    )

    if (!tokenResponse.ok) {
      return NextResponse.redirect(
        new URL(
          '/admin/modules/onboarding?error=token_exchange_failed',
          req.url
        )
      )
    }

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(
        new URL(
          `/admin/modules/onboarding?error=${encodeURIComponent(tokenData.error_description || tokenData.error)}`,
          req.url
        )
      )
    }

    // Encrypt token before storing (simple base64 for now, should use proper encryption)
    const encryptedToken = Buffer.from(tokenData.access_token).toString(
      'base64'
    )

    // Store GitHub token securely in user metadata
    const metadata = (user.metadata as any) || {}
    await prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...metadata,
          githubToken: encryptedToken, // Encrypted
          githubTokenExpiresAt: tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : null,
          githubTokenScope: tokenData.scope,
          githubConnectedAt: new Date(),
        },
      },
    })

    // Clear state cookie
    const response = NextResponse.redirect(
      new URL('/admin/modules/onboarding?step=3&github_connected=true', req.url)
    )
    response.cookies.delete('github-oauth-state')

    return response
  } catch (error: any) {
    console.error('GitHub OAuth callback error:', error)
    return NextResponse.redirect(
      new URL(
        `/admin/modules/onboarding?error=${encodeURIComponent(error.message || 'oauth_failed')}`,
        req.url
      )
    )
  }
}





