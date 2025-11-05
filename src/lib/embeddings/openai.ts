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
 * OpenAI Embedding Provider
 * Uses OpenAI's text-embedding models for semantic embeddings
 */

import OpenAI from 'openai'
import type { EmbeddingProvider, EmbeddingInput, EmbeddingResult } from './provider'

const DEFAULT_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private client: OpenAI

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set. Please configure your OpenAI API key in .env')
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  async embed({ texts, model }: EmbeddingInput): Promise<EmbeddingResult> {
    const m = model || DEFAULT_MODEL

    try {
      const res = await this.client.embeddings.create({ 
        model: m, 
        input: texts 
      })

      const vectors = res.data.map(d => d.embedding)
      const dims = vectors[0]?.length ?? 0

      return { vectors, dims }
    } catch (error: any) {
      console.error('OpenAI embedding error:', error)
      throw new Error(`Failed to generate embeddings: ${error.message}`)
    }
  }
}



