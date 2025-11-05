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
 * Rate Limiting Plugin
 * Example plugin for Hansen Auth
 * Prevents brute force attacks by limiting login attempts
 */

import type { AuthPlugin } from '../core/Plugin'
import type { SignInInput } from '../core/AuthEngine'

interface RateLimitStore {
  [key: string]: {
    attempts: number
    lastAttempt: number
  }
}

export interface RateLimitingPluginOptions {
  maxAttempts?: number // Default: 5
  windowMs?: number // Default: 15 minutes
  blockDurationMs?: number // Default: 30 minutes
}

/**
 * Rate Limiting Plugin
 */
export function createRateLimitingPlugin(
  options: RateLimitingPluginOptions = {}
): AuthPlugin {
  const {
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000, // 15 minutes
    blockDurationMs = 30 * 60 * 1000, // 30 minutes
  } = options

  const store: RateLimitStore = {}

  const getKey = (input: SignInInput): string => {
    // Use IP or email as key
    return `rate-limit:${input.email.toLowerCase()}`
  }

  const checkRateLimit = (key: string): { allowed: boolean; remaining?: number } => {
    const now = Date.now()
    const record = store[key]

    if (!record) {
      store[key] = {
        attempts: 1,
        lastAttempt: now,
      }
      return { allowed: true, remaining: maxAttempts - 1 }
    }

    // Check if blocked
    const timeSinceBlock = now - record.lastAttempt
    if (record.attempts >= maxAttempts && timeSinceBlock < blockDurationMs) {
      return { allowed: false }
    }

    // Reset if window expired
    if (timeSinceBlock > windowMs) {
      store[key] = {
        attempts: 1,
        lastAttempt: now,
      }
      return { allowed: true, remaining: maxAttempts - 1 }
    }

    // Increment attempts
    record.attempts++
    record.lastAttempt = now

    if (record.attempts >= maxAttempts) {
      return { allowed: false }
    }

    return { allowed: true, remaining: maxAttempts - record.attempts }
  }

  return {
    name: 'rate-limiting',
    version: '1.0.0',
    description: 'Rate limiting plugin to prevent brute force attacks',
    hooks: {
      beforeSignIn: async (input: SignInInput) => {
        const key = getKey(input)
        const rateLimit = checkRateLimit(key)

        if (!rateLimit.allowed) {
          throw new Error(
            `Too many login attempts. Please wait ${Math.ceil(
              (blockDurationMs - (Date.now() - store[key]?.lastAttempt || 0)) / 60000
            )} minutes before trying again.`
          )
        }

        return input
      },
    },
  }
}





