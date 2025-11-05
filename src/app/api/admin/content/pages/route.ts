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
 * Content Pages API Route
 * Production-ready page management from database
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'
import { audit } from '@/lib/audit/audit'
import { z } from 'zod'

const searchSchema = z.object({
  search: z.string().optional(),
})

async function pagesHandler(request: NextRequest) {
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
      id: 'pages',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // GET - List pages (using Post model)
    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url)
      const search = searchParams.get('search') || ''

      const whereClause: any = {}
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' as any } },
          { excerpt: { contains: search, mode: 'insensitive' as any } },
        ].filter(Boolean)
      }

      const pages = await prisma.post.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          excerpt: true,
          status: true,
          slug: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }).catch(() => [])

      // Audit log
      await audit(request, {
        action: 'content.pages.list',
        resource: 'content',
        meta: {
          count: pages.length,
          search
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          pages
        }
      })
    }

    // POST - Create new page
    if (request.method === 'POST') {
      const body = await request.json()
      const { title, excerpt, slug, content, status } = body

      // Generate slug if not provided
      const pageSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

      const page = await prisma.post.create({
        data: {
          title,
          excerpt,
          slug: `${pageSlug}-${Date.now()}`,
          content: content || {},
          status: status || 'DRAFT',
          createdById: user.id
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      // Audit log
      await audit(request, {
        action: 'content.page.create',
        resource: 'content',
        target: page.id,
        meta: {
          title: page.title,
          status: page.status
        }
      })

      return NextResponse.json({
        success: true,
        data: page
      }, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    console.error('Content pages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(pagesHandler)
export const POST = withLogging(pagesHandler)



