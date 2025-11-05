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
 * Knowledge Base Ingest API Route
 * Upload and ingest documents (PDF, MD, MDX) into knowledge base with embeddings
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { prisma } from '@/lib/db/prisma'
import { readPDF, readMD } from '@/lib/kb/readers'
import { chunkText } from '@/lib/kb/chunk'
import { getEmbeddingProvider } from '@/lib/embeddings'
import { audit } from '@/lib/audit/audit'
import { z } from 'zod'

export const runtime = 'nodejs' // Required for pdf-parse

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization - admin only
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'knowledge-base',
      id: 'ingest',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'write')
    if (!hasAccess.allowed) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = (formData.get('title') as string) || file?.name || 'Untitled Document'
    const source = (formData.get('source') as string) || 'pdf'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File is required' },
        { status: 400 }
      )
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Read file
    const arrayBuffer = await file.arrayBuffer()
    const buf = Buffer.from(arrayBuffer)

    // Extract text based on file type
    let text = ''
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || source

    try {
      if (fileExtension === 'pdf' || source === 'pdf') {
        text = await readPDF(buf)
      } else if (fileExtension === 'mdx' || source === 'mdx') {
        text = await readMD(buf) // MDX handled same as MD for now
      } else {
        text = await readMD(buf)
      }
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: `Failed to parse file: ${error.message}` },
        { status: 422 }
      )
    }

    if (!text.trim()) {
      return NextResponse.json(
        { success: false, error: 'No text extracted from file' },
        { status: 422 }
      )
    }

    // Create document
    const doc = await prisma.knowledgeDocument.create({
      data: {
        title,
        source: fileExtension || source,
        path: file.name
      }
    })

    // Chunk text
    const { chunks, tokensApprox } = chunkText(text, 2000)

    if (chunks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No chunks generated from text' },
        { status: 422 }
      )
    }

    // Generate embeddings
    const provider = getEmbeddingProvider()
    const { vectors, dims } = await provider.embed({ texts: chunks })

    if (vectors.length !== chunks.length) {
      return NextResponse.json(
        { success: false, error: 'Embedding generation failed - vector count mismatch' },
        { status: 500 }
      )
    }

    // Create chunks and embeddings
    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i]
      const tokens = tokensApprox[i]
      const vec = vectors[i]

      // Create chunk (without embedding_vec - Prisma doesn't support vector type directly)
      const chunk = await prisma.knowledgeChunk.create({
        data: {
          docId: doc.id,
          chunkIndex: i,
          content,
          tokens
        }
      })

      // Update embedding_vec using raw SQL
      // Format vector as PostgreSQL vector literal: [v1, v2, ...]
      const vectorLiteral = JSON.stringify(vec)
      
      await prisma.$executeRawUnsafe(
        `UPDATE "KnowledgeChunk" SET embedding_vec = $1::vector WHERE id = $2`,
        vectorLiteral,
        chunk.id
      )
    }

    // Audit log
    await audit(request, {
      action: 'kb.ingest',
      resource: 'knowledge-base',
      meta: {
        docId: doc.id,
        title,
        chunks: chunks.length,
        dims,
        source: fileExtension || source
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        docId: doc.id,
        title,
        chunks: chunks.length,
        dims
      }
    })
  } catch (error: any) {
    console.error('Knowledge Base ingest error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to ingest document' },
      { status: 500 }
    )
  }
}

