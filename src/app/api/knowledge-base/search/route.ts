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
 * Knowledge Base Search API Route
 * RAG search using vector similarity (placeholder for pgvector implementation)
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'
import { audit } from '@/lib/audit/audit'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().min(2),
  limit: z.coerce.number().min(1).max(20).default(10),
})

async function searchHandler(request: NextRequest) {
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

    // Check authorization with Hansen Security
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'knowledge-base',
      id: 'search',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Parse and validate query params
    const { searchParams } = new URL(request.url)
    const parsed = searchSchema.safeParse({
      q: searchParams.get('q') || '',
      limit: searchParams.get('limit') || '10'
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { q, limit } = parsed.data

    // Use vector search if embeddings are available, otherwise fallback to text search
    let results: any[] = []

    try {
      // Try vector search first
      const { getEmbeddingProvider } = await import('@/lib/embeddings')
      const { vectorSearch } = await import('@/lib/kb/vector-search')

      const provider = getEmbeddingProvider()
      const { vectors } = await provider.embed({ texts: [q] })
      const queryVec = vectors[0]

      const vectorResults = await vectorSearch(queryVec, limit)

      if (vectorResults.length > 0) {
        // Get full chunk details for vector results
        const chunkIds = vectorResults.map(r => {
          // We need to find chunks by docId and chunkIndex since vector search doesn't return chunk ID
          return { docId: r.docId, chunkIndex: r.chunkIndex }
        })

        const chunks = await prisma.knowledgeChunk.findMany({
          where: {
            OR: chunkIds.map(c => ({
              docId: c.docId,
              chunkIndex: c.chunkIndex
            }))
          },
          include: {
            doc: {
              select: {
                id: true,
                title: true,
                source: true,
                path: true
              }
            }
          }
        })

        // Map vector results with full chunk data
        results = vectorResults.map((vr, index) => {
          const chunk = chunks.find(c => c.docId === vr.docId && c.chunkIndex === vr.chunkIndex)!
          
          // Convert distance to relevance score (lower distance = higher relevance)
          // Cosine distance ranges from 0 (identical) to 2 (opposite)
          const relevance = Math.max(0, Math.min(1, 1 - (vr.score / 2)))

          return {
            id: chunk.id,
            docId: chunk.doc.id,
            title: chunk.doc.title,
            content: chunk.content.substring(0, 200) + '...',
            snippet: vr.snippet.substring(0, 300) + '...',
            type: chunk.doc.source || 'document',
            module: chunk.doc.path?.split('/')[0] || undefined,
            relevance: Math.round(relevance * 100) / 100,
            chunkIndex: chunk.chunkIndex,
            url: `/admin/knowledge-base/documents?id=${chunk.doc.id}#chunk-${chunk.chunkIndex}`,
            highlights: [q],
            searchType: 'vector'
          }
        })
      }
    } catch (error) {
      console.warn('Vector search failed, falling back to text search:', error)
    }

    // Fallback to text search if vector search failed or returned no results
    if (results.length === 0) {
      const chunks = await prisma.knowledgeChunk.findMany({
        where: {
          content: {
            contains: q,
            mode: 'insensitive' as any
          }
        },
        include: {
          doc: {
            select: {
              id: true,
              title: true,
              source: true,
              path: true
            }
          }
        },
        take: limit,
        orderBy: {
          chunkIndex: 'asc'
        }
      })

      // Format results
      results = chunks.map((chunk, index) => {
        // Calculate simple relevance score (based on position and match count)
        const matchCount = (chunk.content.toLowerCase().match(new RegExp(q.toLowerCase(), 'g')) || []).length
        const relevance = Math.min(0.95, 0.5 + (matchCount / 10) + (1 - index / chunks.length) * 0.3)

        return {
          id: chunk.id,
          docId: chunk.doc.id,
          title: chunk.doc.title,
          content: chunk.content.substring(0, 200) + '...',
          snippet: chunk.content,
          type: chunk.doc.source || 'document',
          module: chunk.doc.path?.split('/')[0] || undefined,
          relevance: Math.round(relevance * 100) / 100,
          chunkIndex: chunk.chunkIndex,
          url: `/admin/knowledge-base/documents?id=${chunk.doc.id}#chunk-${chunk.chunkIndex}`,
          highlights: [q],
          searchType: 'text'
        }
      })
    }

    // Audit log
    await audit(request, {
      action: 'kb.search',
      resource: 'knowledge-base',
      meta: {
        query: q,
        limit,
        resultsCount: results.length
      }
    })

    return NextResponse.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Knowledge Base search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(searchHandler)

