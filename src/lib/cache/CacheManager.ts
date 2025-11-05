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
 * Cache Manager
 * Multi-layer caching strategy
 * 
 * Features:
 * - In-memory cache (fast)
 * - TTL support
 * - Cache invalidation
 * - Cache statistics
 */

export interface CacheEntry<T = any> {
  data: T
  expires: number
  createdAt: number
  hits: number
  lastAccess: number
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  hitRate: number
}

export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map()
  private maxSize = 10000
  private stats = {
    hits: 0,
    misses: 0
  }

  /**
   * Get value from cache
   */
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      this.stats.misses++
      return null
    }

    // Check if expired
    if (entry.expires < Date.now()) {
      this.cache.delete(key)
      this.stats.misses++
      return null
    }

    // Update access stats
    entry.hits++
    entry.lastAccess = Date.now()
    this.stats.hits++

    return entry.data as T
  }

  /**
   * Set value in cache
   */
  set<T = any>(key: string, value: T, ttl: number = 60 * 1000): void {
    // Remove oldest entries if at max size
    if (this.cache.size >= this.maxSize) {
      const oldest = Array.from(this.cache.entries())
        .sort((a, b) => a[1].lastAccess - b[1].lastAccess)[0]
      this.cache.delete(oldest[0])
    }

    this.cache.set(key, {
      data: value,
      expires: Date.now() + ttl,
      createdAt: Date.now(),
      hits: 0,
      lastAccess: Date.now()
    })
  }

  /**
   * Delete from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear()
    this.stats.hits = 0
    this.stats.misses = 0
  }

  /**
   * Invalidate by pattern
   */
  invalidatePattern(pattern: RegExp): number {
    let count = 0
    for (const key of Array.from(this.cache.keys())) {
      if (pattern.test(key)) {
        this.cache.delete(key)
        count++
      }
    }
    return count
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    const now = Date.now()
    let count = 0
    
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (entry.expires < now) {
        this.cache.delete(key)
        count++
      }
    }

    return count
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0
    }
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    return entry !== undefined && entry.expires > Date.now()
  }
}

// Default cache manager instance
export const cacheManager = new CacheManager()

// Clean expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanExpired()
  }, 5 * 60 * 1000)
}

