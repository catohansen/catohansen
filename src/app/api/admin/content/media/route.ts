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
 * Media Library API Route
 * Production-ready media management from database
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'
import { audit } from '@/lib/audit/audit'

async function mediaHandler(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userId] = decoded.split(':')

    // Get user from database
    const prisma = await getPrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
      kind: 'content',
      id: 'media',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // GET - List media files
    if (request.method === 'GET') {
      const media = await prisma.media.findMany({
        select: {
          id: true,
          url: true,
          alt: true,
          width: true,
          height: true,
          size: true,
          mimeType: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }).catch(() => [])

      // Audit log
      await audit(request, {
        action: 'content.media.list',
        resource: 'content',
        meta: {
          count: media.length
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          media
        }
      })
    }

    // POST - Upload media (simplified - actual upload should use file upload service)
    if (request.method === 'POST') {
      const body = await request.json()
      const { url, alt, width, height, size, mimeType } = body

      const media = await prisma.media.create({
        data: {
          url,
          alt,
          width,
          height,
          size,
          mimeType
        }
      })

      // Audit log
      await audit(request, {
        action: 'content.media.upload',
        resource: 'content',
        target: media.id,
        meta: {
          mimeType: media.mimeType,
          size: media.size
        }
      })

      return NextResponse.json({
        success: true,
        data: media
      }, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(mediaHandler)
export const POST = withLogging(mediaHandler)



