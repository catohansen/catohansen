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
 * Embedding Provider Interface
 * Abstract interface for embedding providers (OpenAI, HuggingFace, Local, etc.)
 */

export type EmbeddingInput = { 
  texts: string[]
  model?: string
}

export type EmbeddingResult = { 
  vectors: number[][]
  dims: number
}

export interface EmbeddingProvider {
  embed(input: EmbeddingInput): Promise<EmbeddingResult>
}



