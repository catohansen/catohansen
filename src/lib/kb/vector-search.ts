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
 * Vector Search Utilities
 * Semantic search using pgvector
 */

import { prisma } from '@/lib/db/prisma'

export interface VectorSearchResult {
  docId: string
  title: string
  snippet: string
  chunkIndex: number
  score: number
}

/**
 * Perform semantic vector search
 * @param queryVec - Query vector (embedding)
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of search results with similarity scores
 */
export async function vectorSearch(
  queryVec: number[], 
  limit: number = 10
): Promise<VectorSearchResult[]> {
  try {
    // Convert array to PostgreSQL vector literal format: [1,2,3] -> '[1,2,3]'
    const vectorLiteral = JSON.stringify(queryVec)
    
    // Use cosine similarity (<-> operator) for better semantic matching
    // Lower score = more similar (cosine distance)
    const rows = await prisma.$queryRawUnsafe<Array<{
      docId: string
      title: string
      snippet: string
      chunkIndex: number
      score: number
    }>>(`
      SELECT
        kc."docId" as "docId",
        kd."title" as "title",
        kc."content" as "snippet",
        kc."chunkIndex" as "chunkIndex",
        kc.embedding_vec <=> $1::vector as score
      FROM "KnowledgeChunk" kc
      JOIN "KnowledgeDocument" kd ON kd.id = kc."docId"
      WHERE kc.embedding_vec IS NOT NULL
      ORDER BY kc.embedding_vec <=> $1::vector
      LIMIT $2
    `, vectorLiteral, limit)

    return rows.map(row => ({
      docId: row.docId,
      title: row.title,
      snippet: row.snippet,
      chunkIndex: row.chunkIndex,
      score: Number(row.score) // Ensure numeric
    }))
  } catch (error: any) {
    console.error('Vector search error:', error)
    throw new Error(`Failed to perform vector search: ${error.message}`)
  }
}



