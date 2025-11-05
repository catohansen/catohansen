/**
 * Cache middleware for analytics endpoints
 * Provides intelligent caching with appropriate headers
 */

import { NextResponse } from "next/server";

export interface CacheOptions {
  maxAge?: number;           // Cache duration in seconds
  sMaxAge?: number;          // Shared cache duration in seconds
  staleWhileRevalidate?: number; // Stale-while-revalidate in seconds
  mustRevalidate?: boolean;  // Force revalidation
  noStore?: boolean;         // Disable caching
  private?: boolean;         // Private cache only
}

/**
 * Create a cached response with appropriate headers
 * @param body - Response body
 * @param options - Cache configuration
 * @returns NextResponse with cache headers
 */
export function withAnalyticsCache(
  body: BodyInit, 
  options: CacheOptions = {}
): NextResponse {
  const {
    maxAge = 30,
    sMaxAge = 30,
    staleWhileRevalidate = 30,
    mustRevalidate = false,
    noStore = false,
    private: isPrivate = false
  } = options;

  // Build cache control header
  const cacheControlParts: string[] = [];
  
  if (noStore) {
    cacheControlParts.push('no-store');
  } else {
    if (isPrivate) {
      cacheControlParts.push('private');
    } else {
      cacheControlParts.push('public');
    }
    
    cacheControlParts.push(`max-age=${maxAge}`);
    cacheControlParts.push(`s-maxage=${sMaxAge}`);
    cacheControlParts.push(`stale-while-revalidate=${staleWhileRevalidate}`);
    
    if (mustRevalidate) {
      cacheControlParts.push('must-revalidate');
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': cacheControlParts.join(', '),
    'X-Cache-Status': 'MISS' // Will be updated by CDN/proxy
  };

  return new NextResponse(body, {
    status: 200,
    headers
  });
}

/**
 * Create a response with no caching
 * @param body - Response body
 * @returns NextResponse with no-cache headers
 */
export function withNoCache(body: BodyInit): NextResponse {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

/**
 * Create a response with long-term caching
 * @param body - Response body
 * @param maxAge - Cache duration in seconds (default: 1 hour)
 * @returns NextResponse with long-term cache headers
 */
export function withLongTermCache(
  body: BodyInit, 
  maxAge = 3600
): NextResponse {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, immutable`,
      'X-Cache-Status': 'HIT'
    }
  });
}

/**
 * Create a response with conditional caching based on data freshness
 * @param body - Response body
 * @param lastModified - Last modified timestamp
 * @param maxAge - Maximum cache age in seconds
 * @returns NextResponse with conditional cache headers
 */
export function withConditionalCache(
  body: BodyInit,
  lastModified: Date,
  maxAge = 300
): NextResponse {
  const now = new Date();
  const age = Math.floor((now.getTime() - lastModified.getTime()) / 1000);
  
  // If data is fresh, use longer cache
  if (age < maxAge) {
    return withLongTermCache(body, maxAge - age);
  }
  
  // If data is stale, use shorter cache
  return withAnalyticsCache(body, { maxAge: 30 });
}

/**
 * Create a response with ETag for conditional requests
 * @param body - Response body
 * @param etag - ETag value
 * @param maxAge - Cache duration in seconds
 * @returns NextResponse with ETag headers
 */
export function withETagCache(
  body: BodyInit,
  etag: string,
  maxAge = 300
): NextResponse {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}`,
      'ETag': etag,
      'X-Cache-Status': 'HIT'
    }
  });
}

/**
 * Generate ETag for content
 * @param content - Content to generate ETag for
 * @returns ETag string
 */
export function generateETag(content: string): string {
  // Simple hash-based ETag
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `"${Math.abs(hash).toString(16)}"`;
}

/**
 * Check if request has matching ETag
 * @param request - Incoming request
 * @param etag - Current ETag
 * @returns True if ETag matches (304 response needed)
 */
export function isETagMatch(request: Request, etag: string): boolean {
  const ifNoneMatch = request.headers.get('If-None-Match');
  return ifNoneMatch === etag || ifNoneMatch === '*';
}

/**
 * Create 304 Not Modified response
 * @returns NextResponse with 304 status
 */
export function notModified(): NextResponse {
  return new NextResponse(null, {
    status: 304,
    headers: {
      'Cache-Control': 'public, max-age=300'
    }
  });
}
