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
 * Rate Limiter
 * Global and per-tenant/per-action rate limiting
 * 
 * Features:
 * - Token bucket algorithm
 * - Per-tenant rate limits
 * - Per-action rate limits
 * - Redis support (optional, falls back to in-memory)
 */

export interface RateLimitConfig {
  limitPerMinute?: number
  limitPerHour?: number
  limitPerDay?: number
  burst?: number // Allow burst of requests
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  limit: number
}

export class RateLimiter {
  // Simple in-memory buckets (replace with Redis/Upstash in production)
  private buckets = new Map<string, { tokens: number; resetAt: number }>()
  private config: Required<RateLimitConfig>

  constructor(
    private defaultConfig: RateLimitConfig = {},
    private redisClient?: any // Optional Redis client
  ) {
    this.config = {
      limitPerMinute: defaultConfig.limitPerMinute || 60,
      limitPerHour: defaultConfig.limitPerHour || 3600,
      limitPerDay: defaultConfig.limitPerDay || 86400,
      burst: defaultConfig.burst || 10
    }
  }

  /**
   * Check if request is allowed
   */
  async allow(
    key: string,
    config?: RateLimitConfig
  ): Promise<RateLimitResult> {
    const effectiveConfig = config || this.defaultConfig || this.config
    const limit = effectiveConfig.limitPerMinute || this.config.limitPerMinute
    const windowMs = 60 * 1000 // 1 minute window
    const burst = effectiveConfig.burst || this.config.burst

    // Try Redis first if available
    if (this.redisClient) {
      return this.allowRedis(key, limit, windowMs, burst)
    }

    // Fallback to in-memory
    return this.allowInMemory(key, limit, windowMs, burst)
  }

  /**
   * In-memory rate limiting
   */
  private allowInMemory(
    key: string,
    limit: number,
    windowMs: number,
    burst: number
  ): RateLimitResult {
    const now = Date.now()
    const slot = Math.floor(now / windowMs)
    const bucketKey = `${key}:${slot}`

    const bucket = this.buckets.get(bucketKey) || {
      tokens: limit,
      resetAt: now + windowMs
    }

    // Reset if window expired
    if (now >= bucket.resetAt) {
      bucket.tokens = limit + burst // Refill with burst allowance
      bucket.resetAt = now + windowMs
    }

    // Check if allowed
    const allowed = bucket.tokens > 0

    if (allowed) {
      bucket.tokens -= 1
    }

    // Cleanup old buckets (keep only recent ones)
    if (this.buckets.size > 10000) {
      const keysToDelete: string[] = []
      for (const [k, v] of Array.from(this.buckets.entries())) {
        if (now >= v.resetAt) {
          keysToDelete.push(k)
        }
      }
      for (const k of keysToDelete) {
        this.buckets.delete(k)
      }
    }

    this.buckets.set(bucketKey, bucket)

    return {
      allowed,
      remaining: Math.max(0, bucket.tokens),
      resetAt: new Date(bucket.resetAt),
      limit: limit + burst
    }
  }

  /**
   * Redis-based rate limiting (when Redis available)
   */
  private async allowRedis(
    key: string,
    limit: number,
    windowMs: number,
    burst: number
  ): Promise<RateLimitResult> {
    // TODO: Implement Redis-based rate limiting
    // For now, fall back to in-memory
    return this.allowInMemory(key, limit, windowMs, burst)
  }

  /**
   * Check rate limit for tenant + action
   */
  async check(
    tenantId: string,
    action: string,
    config?: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `rate:${tenantId}:${action}`
    return this.allow(key, config)
  }

  /**
   * Check global rate limit
   */
  async checkGlobal(
    identifier: string, // IP, user ID, etc.
    config?: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `rate:global:${identifier}`
    return this.allow(key, config)
  }

  /**
   * Reset rate limit for key
   */
  async reset(key: string): Promise<void> {
    // Clear all slots for this key
    for (const bucketKey of Array.from(this.buckets.keys())) {
      if (bucketKey.startsWith(key + ':')) {
        this.buckets.delete(bucketKey)
      }
    }

    // TODO: Reset in Redis if available
  }

  /**
   * Get current rate limit status
   */
  async getStatus(
    key: string,
    config?: RateLimitConfig
  ): Promise<RateLimitResult> {
    const effectiveConfig = config || this.defaultConfig || this.config
    const limit = effectiveConfig.limitPerMinute || this.config.limitPerMinute
    const windowMs = 60 * 1000

    const slot = Math.floor(Date.now() / windowMs)
    const bucketKey = `${key}:${slot}`
    const bucket = this.buckets.get(bucketKey)

    if (!bucket) {
      return {
        allowed: true,
        remaining: limit,
        resetAt: new Date(Date.now() + windowMs),
        limit
      }
    }

    return {
      allowed: bucket.tokens > 0,
      remaining: Math.max(0, bucket.tokens),
      resetAt: new Date(bucket.resetAt),
      limit
    }
  }
}

// Default rate limiter instance
export const rateLimiter = new RateLimiter({
  limitPerMinute: 60,
  burst: 10
})

