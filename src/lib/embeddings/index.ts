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
 * Embedding Provider Factory
 * Returns the configured embedding provider
 */

import { OpenAIEmbeddingProvider } from './openai'
import type { EmbeddingProvider } from './provider'

let provider: EmbeddingProvider | null = null

export function getEmbeddingProvider(): EmbeddingProvider {
  if (!provider) {
    const providerType = process.env.EMBEDDING_PROVIDER || 'openai'
    
    switch (providerType) {
      case 'openai':
        // In development, fail soft if OpenAI key is missing by using a zero-vector provider
        if (process.env.NODE_ENV !== 'production' && !process.env.OPENAI_API_KEY) {
          class ZeroEmbeddingProvider implements EmbeddingProvider {
            async embed({ texts }: { texts: string[] }): Promise<{ vectors: number[][]; dims: number }> {
              const dims = 1536 // Match text-embedding-3-small default
              const zero = Array(dims).fill(0)
              return { vectors: texts.map(() => zero), dims }
            }
          }
          provider = new ZeroEmbeddingProvider()
        } else {
          provider = new OpenAIEmbeddingProvider()
        }
        break
      // TODO: Add HuggingFace provider later
      // case 'huggingface':
      //   provider = new HuggingFaceEmbeddingProvider()
      //   break
      default:
        throw new Error(`Unknown embedding provider: ${providerType}`)
    }
  }
  
  return provider
}



