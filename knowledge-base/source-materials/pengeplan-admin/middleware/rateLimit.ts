/**
 * Rate limiting middleware for analytics endpoints
 * Simple token bucket implementation for development
 * Use Redis/KV storage in production
 */

type Key = string;
type Bucket = {
  tokens: number;
  ts: number;
};

// In-memory storage for development
// TODO: Replace with Redis/KV in production
const buckets = new Map<Key, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
  remaining: number;
  resetTime: number;
}

/**
 * Rate limit implementation using token bucket algorithm
 * @param key - Unique identifier for the rate limit (e.g., IP, user ID)
 * @param limit - Maximum number of requests allowed
 * @param refillMs - Time window in milliseconds for refill
 * @returns Rate limit result
 */
export function rateLimit(
  key: string, 
  limit = 60, 
  refillMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: limit, ts: now };
  
  // Calculate elapsed time since last refill
  const elapsed = now - bucket.ts;
  
  // Refill tokens based on elapsed time
  const refill = Math.floor((elapsed / refillMs) * limit);
  bucket.tokens = Math.min(limit, bucket.tokens + (refill > 0 ? refill : 0));
  bucket.ts = refill > 0 ? now : bucket.ts;
  
  // Check if request is allowed
  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return {
      allowed: false,
      retryAfterMs: Math.max(0, refillMs - elapsed),
      remaining: 0,
      resetTime: bucket.ts + refillMs
    };
  }
  
  // Consume one token
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  
  return {
    allowed: true,
    retryAfterMs: 0,
    remaining: bucket.tokens,
    resetTime: bucket.ts + refillMs
  };
}

/**
 * Get rate limit status without consuming tokens
 * @param key - Unique identifier
 * @param limit - Maximum number of requests
 * @param refillMs - Time window for refill
 * @returns Current rate limit status
 */
export function getRateLimitStatus(
  key: string,
  limit = 60,
  refillMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: limit, ts: now };
  
  const elapsed = now - bucket.ts;
  const refill = Math.floor((elapsed / refillMs) * limit);
  const currentTokens = Math.min(limit, bucket.tokens + (refill > 0 ? refill : 0));
  
  return {
    allowed: currentTokens > 0,
    retryAfterMs: currentTokens > 0 ? 0 : Math.max(0, refillMs - elapsed),
    remaining: currentTokens,
    resetTime: bucket.ts + refillMs
  };
}

/**
 * Clear rate limit for a specific key (useful for testing)
 * @param key - Key to clear
 */
export function clearRateLimit(key: string): void {
  buckets.delete(key);
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  buckets.clear();
}

/**
 * Get current rate limit statistics
 * @returns Map of keys and their current status
 */
export function getRateLimitStats(): Map<string, Bucket> {
  return new Map(buckets);
}
