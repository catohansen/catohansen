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
 * Response Compression Utilities
 * 
 * Provides compression helpers for API responses to improve performance
 */

import { NextResponse } from 'next/server'

/**
 * Compress JSON response if size exceeds threshold
 * Note: Next.js handles compression automatically via middleware,
 * but this provides utilities for manual compression when needed
 */
export function shouldCompress(content: string, threshold: number = 1024): boolean {
  // Compress if content is larger than threshold (default 1KB)
  return Buffer.byteLength(content, 'utf8') > threshold
}

/**
 * Add compression headers to response
 */
export function addCompressionHeaders(response: NextResponse): NextResponse {
  // Next.js automatically handles compression via middleware
  // But we can add headers to indicate compression is supported
  response.headers.set('Accept-Encoding', 'gzip, deflate, br')
  return response
}

/**
 * Get response size in bytes
 */
export function getResponseSize(content: string | object): number {
  const contentString = typeof content === 'string' 
    ? content 
    : JSON.stringify(content)
  return Buffer.byteLength(contentString, 'utf8')
}



