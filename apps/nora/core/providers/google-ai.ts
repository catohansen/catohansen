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
 * Google AI Studio Provider
 * Integration with Google AI Studio API
 */

export interface GoogleAIConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface GoogleAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface GoogleAIResponse {
  content: string
  finishReason?: string
  tokenCount?: {
    promptTokens?: number
    candidatesTokens?: number
    totalTokens?: number
  }
}

export class GoogleAIProvider {
  private config: Required<GoogleAIConfig>
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(config: GoogleAIConfig) {
    this.config = {
      apiKey: config.apiKey,
      model: config.model || 'models/gemini-1.5-flash',
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2048
    }
  }

  /**
   * Generate chat completion using Google AI Studio API
   */
  async chat(messages: GoogleAIMessage[]): Promise<GoogleAIResponse> {
    try {
      // Convert messages to Google AI format
      const contents = messages
        .filter(msg => msg.role !== 'system') // System messages are handled separately
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))

      // Extract system instruction from system messages
      const systemInstruction = messages
        .filter(msg => msg.role === 'system')
        .map(msg => msg.content)
        .join('\n')

      // Prepare request body
      const requestBody: any = {
        contents,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
        }
      }

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        }
      }

      // Make API call
      const response = await fetch(
        `${this.baseUrl}/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Google AI API error: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()

      // Extract response
      const candidate = data.candidates?.[0]
      if (!candidate) {
        throw new Error('No response candidate from Google AI API')
      }

      const content = candidate.content?.parts?.[0]?.text || ''
      const finishReason = candidate.finishReason

      return {
        content,
        finishReason,
        tokenCount: data.usageMetadata
      }
    } catch (error: any) {
      console.error('Google AI Provider error:', error)
      throw new Error(`Failed to generate response: ${error.message}`)
    }
  }

  /**
   * Generate embeddings (if supported by Google AI)
   */
  async embed(texts: string[]): Promise<number[][]> {
    try {
      // Google AI Studio may have embedding models
      // For now, we'll use a placeholder or throw an error
      throw new Error('Embeddings not yet implemented for Google AI Studio')
    } catch (error: any) {
      console.error('Google AI Embedding error:', error)
      throw error
    }
  }
}



