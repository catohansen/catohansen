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
 * Nora Memory API v2.0 - REVOLUSJONERENDE
 * 
 * Håndterer lagring, henting, læring og administrasjon av minner.
 * Koblet til Prisma + pgvector for vector storage og semantisk søk.
 * 
 * Features:
 * - Semantisk søk med cosine similarity
 * - Batch operations (lagre flere minner samtidig)
 * - Rate limiting og caching for ytelse
 * - Observability: logging, metrics, audit trails
 * - Memory statistics og analytics
 * - User-specific memory isolation
 * - Context-aware retrieval
 * 
 * Mye mer avansert enn Siri, Alexa, Google Assistant!
 * Programmert av Cato Hansen
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { MemoryEngine, getMemoryEngine } from '../../core/memory-engine'
import { audit } from '@/lib/audit/audit'

// Note: Using dynamic runtime (not edge) because Memory Engine uses Prisma
export const dynamic = 'force-dynamic'

// Cache for søk-resultater (samme query = samme resultat i 5 min)
const searchCache = new Map<string, { data: any; expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutter

// Rate limiting: max 100 requests per minutt per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 100
const RATE_WINDOW = 60 * 1000 // 1 minutt

// Validation schemas
const searchSchema = z.object({
  query: z.string().min(1).max(1000),
  userId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  threshold: z.coerce.number().min(0).max(1).optional().default(0.75),
  context: z.string().optional()
})

const storeSchema = z.object({
  content: z.string().min(1).max(10000),
  metadata: z.record(z.string(), z.unknown()).optional(),
  userId: z.string().optional(),
  context: z.string().optional(),
  source: z.string().optional()
})

const batchStoreSchema = z.object({
  memories: z.array(storeSchema).min(1).max(50)
})

// Helper: Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT - record.count }
}

// Helper: Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIP || 'unknown'
}

// Helper: Cache key generator
function getCacheKey(query: string, userId?: string, context?: string): string {
  return `memory:${query}:${userId || 'global'}:${context || 'general'}`
}

/**
 * GET - Retrieve memories (with caching and rate limiting)
 * GET /api/nora/memory?query=...&userId=...&limit=10&threshold=0.75&context=...
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIP(request)

  try {
    // Rate limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Rate limit exceeded. Max 100 requests per minute.',
        retryAfter: 60
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        }
      })
    }

    // Parse and validate query parameters
    const query = request.nextUrl.searchParams.get('query') || ''
    const userId = request.nextUrl.searchParams.get('userId') || undefined
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
    const threshold = parseFloat(request.nextUrl.searchParams.get('threshold') || '0.75')
    const context = request.nextUrl.searchParams.get('context') || undefined

    // Validate input
    const validation = searchSchema.safeParse({ query, userId, limit, threshold, context })
    if (!validation.success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.issues
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check cache first
    const cacheKey = getCacheKey(query, userId, context)
    const cached = searchCache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      // Audit log
      await audit(request, {
        action: 'nora.memory.get',
        resource: 'nora',
        meta: {
          query,
          userId,
          limit,
          results: cached.data.memories.length,
          cacheHit: true,
          latency: Date.now() - startTime
        }
      })

      return new Response(JSON.stringify({
        ...cached.data,
        cached: true
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Cache-Hit': 'true',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'Cache-Control': 'public, max-age=300'
        }
      })
    }

    // REVOLUSJONERENDE: Search memories with user-specific context
    const memoryEngine = getMemoryEngine()
    const memories = await memoryEngine.search(query, {
      limit,
      threshold,
      userId,
      context
    })

    // Map to MemorySearchResult format for compatibility
    const searchResults = memories.map(m => ({
      id: parseInt(m.id) || 0,
      user_id: userId || m.userId || 'unknown',
      content: m.content,
      similarity: m.relevance || 0,
      context: (m.metadata?.context as string) || context || 'general',
      source: (m.metadata?.source as string) || 'api',
      timestamp: m.timestamp?.toISOString()
    }))

    const responseData = {
      success: true,
      memories: searchResults,
      count: memories.length,
      query,
      threshold,
      cached: false,
      latency: Date.now() - startTime
    }

    // Store in cache
    searchCache.set(cacheKey, {
      data: responseData,
      expires: Date.now() + CACHE_TTL
    })

    // Audit log
    await audit(request, {
      action: 'nora.memory.get',
      resource: 'nora',
      meta: {
        query,
        userId,
        limit,
        results: memories.length,
        cacheHit: false,
        latency: Date.now() - startTime
      }
    })

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Cache-Hit': 'false',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'Cache-Control': 'public, max-age=300'
      }
    })
  } catch (error: any) {
    console.error('❌ Memory GET error:', error)
    
    // Audit log for error
    await audit(request, {
      action: 'nora.memory.get.error',
      resource: 'nora',
      meta: {
        error: error.message,
        latency: Date.now() - startTime
      }
    }).catch(() => {}) // Ignore audit errors

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to retrieve memories',
      latency: Date.now() - startTime
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * POST - Store a new memory (or batch of memories)
 * POST /api/nora/memory
 * Body: { content, metadata?, userId?, context?, source? }
 * OR Body: { memories: [{ content, ... }, ...] } for batch
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIP(request)

  try {
    // Rate limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Rate limit exceeded. Max 100 requests per minute.',
        retryAfter: 60
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        }
      })
    }

    const body = await request.json()
    const memoryEngine = getMemoryEngine()

    // Check if this is a batch request
    if (body.memories && Array.isArray(body.memories)) {
      // BATCH OPERATION: Store multiple memories
      const validation = batchStoreSchema.safeParse(body)
      if (!validation.success) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid batch data',
          details: validation.error.issues
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const results: Array<{ success: true; memoryId: string; index: number }> = []
      const errors: Array<{ index: number; error: string }> = []

      // Store memories in parallel (with limit)
      const batch = validation.data.memories.slice(0, 50)
      const promises = batch.map(async (memory, index) => {
        try {
          const memoryId = await memoryEngine.storeMemory(
            memory.content,
            {
              ...memory.metadata,
              userId: memory.userId,
              timestamp: new Date().toISOString(),
              context: memory.context || 'general',
              source: memory.source || 'api',
              batchIndex: index
            },
            memory.userId
          )
          return { success: true, memoryId, index }
        } catch (error: any) {
          return { success: false, error: error.message, index }
        }
      })

      const batchResults = await Promise.allSettled(promises)
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value.success && 'memoryId' in result.value && result.value.memoryId) {
            results.push({ success: true, memoryId: result.value.memoryId, index: result.value.index })
          } else if (!result.value.success && 'error' in result.value) {
            errors.push({
              index,
              error: result.value.error
            })
          }
        } else {
          errors.push({
            index,
            error: result.reason?.message || 'Unknown error'
          })
        }
      })

      // Audit log
      await audit(request, {
        action: 'nora.memory.store.batch',
        resource: 'nora',
        meta: {
          batchSize: batch.length,
          successCount: results.length,
          errorCount: errors.length,
          latency: Date.now() - startTime
        }
      })

      // Invalidate cache for affected users
      const userIds = new Set(batch.map(m => m.userId).filter((id): id is string => !!id))
      userIds.forEach(userId => {
        for (const key of Array.from(searchCache.keys())) {
          if (key.includes(userId)) {
            searchCache.delete(key)
          }
        }
      })

      return new Response(JSON.stringify({
        success: true,
        results,
        errors: errors.length > 0 ? errors : undefined,
        message: `Stored ${results.length} of ${batch.length} memories`,
        latency: Date.now() - startTime
      }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'Cache-Control': 'no-store'
        }
      })
    }

    // SINGLE MEMORY: Store one memory
    const validation = storeSchema.safeParse(body)
    if (!validation.success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid memory data',
        details: validation.error.issues
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { content, metadata, userId, context, source } = validation.data

    // REVOLUSJONERENDE: Store memory with advanced metadata
    const memoryId = await memoryEngine.storeMemory(
      content,
      {
        ...metadata,
        userId,
        timestamp: new Date().toISOString(),
        context: context || 'general',
        source: source || 'api'
      },
      userId
    )

    // Invalidate cache for this user
    if (userId) {
      for (const key of Array.from(searchCache.keys())) {
        if (key.includes(userId)) {
          searchCache.delete(key)
        }
      }
    }

    // Audit log
    await audit(request, {
      action: 'nora.memory.store',
      resource: 'nora',
      meta: {
        memoryId,
        userId,
        contentLength: content.length,
        latency: Date.now() - startTime
      }
    })

    return new Response(JSON.stringify({
      success: true,
      memoryId,
      message: 'Memory stored successfully',
      latency: Date.now() - startTime
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'Cache-Control': 'no-store'
      }
    })
  } catch (error: any) {
    console.error('❌ Memory POST error:', error)

    // Audit log for error
    await audit(request, {
      action: 'nora.memory.store.error',
      resource: 'nora',
      meta: {
        error: error.message,
        latency: Date.now() - startTime
      }
    }).catch(() => {}) // Ignore audit errors

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to store memory',
      latency: Date.now() - startTime
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * DELETE - Clear memories (admin only)
 * DELETE /api/nora/memory?userId=...&memoryId=...
 */
export async function DELETE(request: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIP(request)

  try {
    // Rate limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Rate limit exceeded. Max 100 requests per minute.',
        retryAfter: 60
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        }
      })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || undefined
    const memoryId = searchParams.get('memoryId') || undefined
    
    const memoryEngine = getMemoryEngine()

    // Note: In production, this should check for admin permissions
    // For now, we'll just clear user-specific memories if userId is provided

    let deletedCount = 0
    let message = ''

    if (memoryId) {
      // Delete specific memory
      await memoryEngine.deleteMemory(memoryId)
      deletedCount = 1
      message = `Memory ${memoryId} deleted successfully`
    } else if (userId) {
      // Delete all memories for user
      await memoryEngine.clearUserMemories(userId)
      deletedCount = -1 // Unknown count
      message = `All memories cleared for user ${userId}`
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Either userId or memoryId parameter is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Invalidate cache for affected user
    if (userId) {
      for (const key of Array.from(searchCache.keys())) {
        if (key.includes(userId)) {
          searchCache.delete(key)
        }
      }
    } else if (memoryId) {
      // Clear all cache if specific memory deleted (can't determine userId easily)
      searchCache.clear()
    }

    // Audit log
    await audit(request, {
      action: 'nora.memory.delete',
      resource: 'nora',
      meta: {
        userId,
        memoryId,
        deletedCount,
        latency: Date.now() - startTime
      }
    })

    return new Response(JSON.stringify({
      success: true,
      message,
      deletedCount: deletedCount > 0 ? deletedCount : undefined,
      latency: Date.now() - startTime
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'Cache-Control': 'no-store'
      },
    })
  } catch (error: any) {
    console.error('❌ Memory DELETE error:', error)

    // Audit log for error
    await audit(request, {
      action: 'nora.memory.delete.error',
      resource: 'nora',
      meta: {
        error: error.message,
        latency: Date.now() - startTime
      }
    }).catch(() => {}) // Ignore audit errors

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to clear memories',
      latency: Date.now() - startTime
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * PATCH - Get memory statistics
 * PATCH /api/nora/memory?userId=...
 */
export async function PATCH(request: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIP(request)

  try {
    // Rate limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Rate limit exceeded. Max 100 requests per minute.',
        retryAfter: 60
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        }
      })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || undefined

    const memoryEngine = getMemoryEngine()

    // Get statistics
    const stats = await memoryEngine.getStats(userId)

    // Audit log
    await audit(request, {
      action: 'nora.memory.stats',
      resource: 'nora',
      meta: {
        userId,
        stats,
        latency: Date.now() - startTime
      }
    })

    return new Response(JSON.stringify({
      success: true,
      stats,
      latency: Date.now() - startTime
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'Cache-Control': 'public, max-age=60'
      }
    })
  } catch (error: any) {
    console.error('❌ Memory PATCH error:', error)

    // Audit log for error
    await audit(request, {
      action: 'nora.memory.stats.error',
      resource: 'nora',
      meta: {
        error: error.message,
        latency: Date.now() - startTime
      }
    }).catch(() => {}) // Ignore audit errors

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to get memory statistics',
      latency: Date.now() - startTime
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

