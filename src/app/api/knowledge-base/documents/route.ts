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
 * Knowledge Base Documents API Route
 * Get full document with all chunks
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'
import { audit } from '@/lib/audit/audit'
import { z } from 'zod'

const documentSchema = z.object({
  id: z.string().cuid()
})

async function documentsHandler(request: NextRequest) {
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
      kind: 'knowledge-base',
      id: 'documents',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const parsed = documentSchema.safeParse({ id })
    if (!parsed.success || !id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Get document with all chunks
    const doc = await prisma.knowledgeDocument.findUnique({
      where: { id: parsed.data.id },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' }
        }
      }
    })

    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Combine chunks into full text
    const fullText = doc.chunks.map(c => c.content).join('\n\n')

    // Audit log
    await audit(request, {
      action: 'kb.doc.get',
      resource: 'knowledge-base',
      target: doc.id,
      meta: {
        docId: doc.id,
        chunkCount: doc.chunks.length
      }
    })

    return NextResponse.json({
      success: true,
      doc: {
        id: doc.id,
        title: doc.title,
        source: doc.source,
        path: doc.path,
        fullText,
        chunkCount: doc.chunks.length,
        chunks: doc.chunks.map(c => ({
          id: c.id,
          chunkIndex: c.chunkIndex,
          content: c.content,
          tokens: c.tokens
        })),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    })
  } catch (error) {
    console.error('Knowledge Base documents error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(documentsHandler)



