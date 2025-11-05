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
 * API Route: /api/modules/onboarding/github/auth/check
 * Check GitHub Authentication Status and Fetch Repositories
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

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

function decryptToken(encryptedToken: string): string {
  // Decrypt token (reverse of base64 encoding)
  try {
    return Buffer.from(encryptedToken, 'base64').toString('utf-8')
  } catch {
    return encryptedToken // Fallback if decryption fails
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const metadata = (user.metadata as any) || {}
    const encryptedToken = metadata.githubToken

    if (!encryptedToken) {
      return NextResponse.json({ authenticated: false })
    }

    // Check if token expired
    const expiresAt = metadata.githubTokenExpiresAt
      ? new Date(metadata.githubTokenExpiresAt)
      : null

    if (expiresAt && expiresAt < new Date()) {
      return NextResponse.json({
        authenticated: false,
        error: 'Token expired',
      })
    }

    // Decrypt token
    const githubToken = decryptToken(encryptedToken)

    // Verify token is still valid and fetch user's repositories
    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }),
        fetch(
          'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator',
          {
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        ),
      ])

      if (!userResponse.ok || !reposResponse.ok) {
        // Token is invalid, clear it
        await prisma.user.update({
          where: { id: user.id },
          data: {
            metadata: {
              ...metadata,
              githubToken: null,
              githubTokenExpiresAt: null,
            },
          },
        })

        return NextResponse.json({
          authenticated: false,
          error: 'Invalid token',
        })
      }

      const repos = await reposResponse.json()

      return NextResponse.json({
        authenticated: true,
        repos: repos.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          private: repo.private,
          default_branch: repo.default_branch || 'main',
          html_url: repo.html_url,
          updated_at: repo.updated_at,
          language: repo.language,
        })),
      })
    } catch (error: any) {
      console.error('GitHub API error:', error)
      return NextResponse.json({
        authenticated: false,
        error: error.message || 'Failed to fetch repositories',
      })
    }
  } catch (error: any) {
    console.error('GitHub auth check error:', error)
    return NextResponse.json(
      { authenticated: false, error: error.message || 'Authentication check failed' },
      { status: 500 }
    )
  }
}





