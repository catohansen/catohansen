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
 * Text Chunking Utilities
 * Splits text into semantically meaningful chunks for embedding
 */

/**
 * Chunk text into smaller pieces for embedding
 * @param raw - Raw text to chunk
 * @param maxChars - Maximum characters per chunk (default: 2000)
 * @returns Object with chunks array and approximate token counts
 */
export function chunkText(
  raw: string, 
  maxChars: number = 2000
): { chunks: string[]; tokensApprox: number[] } {
  const clean = raw.replace(/\r/g, '').trim()
  const parts: string[] = []
  let buf = ''

  const push = () => {
    if (buf.trim().length) {
      parts.push(buf.trim())
    }
    buf = ''
  }

  // Split by double newlines (paragraphs)
  for (const para of clean.split(/\n{2,}/)) {
    if ((buf + '\n\n' + para).length > maxChars) {
      push()
      buf = para
    } else {
      buf = buf ? `${buf}\n\n${para}` : para
    }
  }

  push()

  // Rough token estimate: ~1 token per 4 characters
  const tokensApprox = parts.map(p => Math.ceil(p.length / 4))

  return { chunks: parts, tokensApprox }
}



