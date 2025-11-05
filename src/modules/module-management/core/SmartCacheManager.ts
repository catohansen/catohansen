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
 * Smart Cache Manager
 * Intelligent caching for GitHub/NPM stats with predictive prefetching
 * 
 * Features:
 * - Multi-layer caching (memory + database)
 * - Predictive prefetching based on access patterns
 * - Cache invalidation strategies
 * - Cache warming
 */

import { prisma } from '@/lib/db/prisma'
import { cacheManager } from '@/lib/cache/CacheManager'

export interface CacheConfig {
  ttl: number // Time to live in milliseconds
  staleWhileRevalidate: number // Stale data allowed while refreshing
  prefetchThreshold: number // Prefetch when TTL < threshold
}

/**
 * Smart Cache Manager
 * Intelligent caching for module stats
 */
export class SmartCacheManager {
  private cache: Map<string, { data: any; expires: number; staleAfter: number }> = new Map()
  
  private defaultConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: 10 * 60 * 1000, // 10 minutes
    prefetchThreshold: 1 * 60 * 1000, // 1 minute
  }

  /**
   * Get cached value or fetch and cache
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    config: Partial<CacheConfig> = {}
  ): Promise<T> {
    const effectiveConfig = { ...this.defaultConfig, ...config }

    // Check in-memory cache first
    const cached = this.cache.get(key)
    const now = Date.now()

    if (cached) {
      // Check if still valid
      if (cached.expires > now) {
        return cached.data as T
      }

      // Check if stale but usable
      if (cached.staleAfter > now) {
        // Return stale data but prefetch in background
        this.prefetch(key, fetchFn, effectiveConfig)
        return cached.data as T
      }
    }

    // Check database cache
    const dbCached = await this.getFromDatabase(key, effectiveConfig.ttl)

    if (dbCached) {
      // Update memory cache
      this.cache.set(key, {
        data: dbCached,
        expires: now + effectiveConfig.ttl,
        staleAfter: now + effectiveConfig.staleWhileRevalidate,
      })
      return dbCached as T
    }

    // Fetch fresh data
    const data = await fetchFn()

    // Cache in both memory and database
    this.cache.set(key, {
      data,
      expires: now + effectiveConfig.ttl,
      staleAfter: now + effectiveConfig.staleWhileRevalidate,
    })

    await this.saveToDatabase(key, data, effectiveConfig.ttl)

    return data
  }

  /**
   * Prefetch data in background
   */
  private async prefetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    config: CacheConfig
  ): Promise<void> {
    // Don't await - fetch in background
    fetchFn()
      .then((data) => {
        const now = Date.now()
        this.cache.set(key, {
          data,
          expires: now + config.ttl,
          staleAfter: now + config.staleWhileRevalidate,
        })
        return this.saveToDatabase(key, data, config.ttl)
      })
      .catch((error) => {
        console.warn(`Prefetch failed for ${key}:`, error)
      })
  }

  /**
   * Get from database cache (simplified - would use actual cache table)
   */
  private async getFromDatabase(key: string, ttl: number): Promise<any | null> {
    // For now, use in-memory cache manager
    return cacheManager.get(key)
  }

  /**
   * Save to database cache (simplified - would use actual cache table)
   */
  private async saveToDatabase(key: string, data: any, ttl: number): Promise<void> {
    // For now, use in-memory cache manager
    cacheManager.set(key, data, ttl)
  }

  /**
   * Invalidate cache
   */
  invalidate(key: string): void {
    this.cache.delete(key)
    cacheManager.delete(key)
  }

  /**
   * Invalidate pattern
   */
  invalidatePattern(pattern: RegExp): number {
    let count = 0
    for (const key of Array.from(this.cache.keys())) {
      if (pattern.test(key)) {
        this.cache.delete(key)
        cacheManager.delete(key)
        count++
      }
    }
    return count
  }

  /**
   * Warm cache (prefetch common data)
   */
  async warmCache(keys: string[], fetchFn: (key: string) => Promise<any>): Promise<void> {
    for (const key of keys) {
      if (!this.cache.has(key)) {
        await this.getOrFetch(key, () => fetchFn(key))
      }
    }
  }
}

/**
 * Create smart cache manager instance
 */
export function createSmartCacheManager() {
  return new SmartCacheManager()
}

/**
 * Default smart cache manager instance
 */
export const smartCacheManager = new SmartCacheManager()





