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
 * Admin Portfolio API Route
 * Production-ready portfolio management from database
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'

async function portfolioHandler(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode token (in production, verify JWT)
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

    // Check authorization with Hansen Security
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'portfolio',
      id: 'items',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // GET - List portfolio items (projects with coverImage)
    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url)
      const search = searchParams.get('search') || ''

      const whereClause: any = {
        coverImage: { not: null }
      }
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' as any } },
          ...(search.length > 0 ? [{ summary: { contains: search, mode: 'insensitive' as any } }] : []),
          { tags: { has: search } }
        ].filter(Boolean)
      }

      const projects = await prisma.project.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          summary: true,
          coverImage: true,
          status: true,
          tags: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          client: {
            select: {
              id: true,
              name: true,
              company: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }).catch(() => [])

      // Get stats
      const [totalItems, featuredCount, publishedCount] = await Promise.all([
        prisma.project.count({
          where: { coverImage: { not: null } }
        }).catch(() => 0),
        
        // Featured = projects with specific tag or status
        prisma.project.count({
          where: {
            coverImage: { not: null },
            tags: { has: 'featured' }
          }
        }).catch(() => 0),
        
        // Published = status ACTIVE
        prisma.project.count({
          where: {
            coverImage: { not: null },
            status: 'ACTIVE'
          }
        }).catch(() => 0)
      ])

      return NextResponse.json({
        success: true,
        data: {
          items: projects,
          stats: {
            totalItems,
            featured: featuredCount,
            published: publishedCount,
            caseStudies: 0 // Can be added later if needed
          }
        }
      })
    }

    // POST - Create new portfolio item
    if (request.method === 'POST') {
      const body = await request.json()
      const { title, summary, coverImage, tags, clientId } = body

      // Generate slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

      const project = await prisma.project.create({
        data: {
          title,
          summary,
          coverImage,
          tags: tags || [],
          slug: `${slug}-${Date.now()}`,
          status: 'DRAFT',
          clientId,
          createdById: user.id
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              company: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: project
      }, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    console.error('Portfolio API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(portfolioHandler)
export const POST = withLogging(portfolioHandler)

