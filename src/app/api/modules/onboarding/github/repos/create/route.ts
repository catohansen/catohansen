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
 * API Route: /api/modules/onboarding/github/repos/create
 * Create New GitHub Repository
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
  try {
    return Buffer.from(encryptedToken, 'base64').toString('utf-8')
  } catch {
    return encryptedToken
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, private: isPrivate, description } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Repository name is required' },
        { status: 400 }
      )
    }

    // Validate repository name format
    if (!/^[a-z0-9_-]+$/.test(name.toLowerCase())) {
      return NextResponse.json(
        {
          error:
            'Repository name can only contain lowercase letters, numbers, hyphens, and underscores',
        },
        { status: 400 }
      )
    }

    const metadata = (user.metadata as any) || {}
    const encryptedToken = metadata.githubToken

    if (!encryptedToken) {
      return NextResponse.json(
        { error: 'GitHub not authenticated' },
        { status: 401 }
      )
    }

    const githubToken = decryptToken(encryptedToken)

    // Create repository via GitHub API
    const createResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.toLowerCase().trim(),
        private: isPrivate !== false,
        description: (description || '').trim(),
        auto_init: true, // Initialize with README
        license_template: 'mit', // Default license
      }),
    })

    if (!createResponse.ok) {
      const error = await createResponse.json()
      throw new Error(error.message || 'Failed to create repository')
    }

    const repo = await createResponse.json()

    return NextResponse.json({
      success: true,
      repo: {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        default_branch: repo.default_branch || 'main',
        html_url: repo.html_url,
        updated_at: repo.updated_at,
        language: repo.language,
      },
    })
  } catch (error: any) {
    console.error('Create repo error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create repository' },
      { status: 500 }
    )
  }
}





