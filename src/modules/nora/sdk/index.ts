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
 * Nora SDK v2.0 - REVOLUSJONERENDE
 * 
 * Client SDK for external use - Installérbar NPM-pakke
 * 
 * Usage:
 *   npm install @hansenglobal/nora
 *   import { Nora } from '@hansenglobal/nora'
 *   const nora = new Nora({ apiKey: '...' })
 *   const response = await nora.chat('Hei Nora!')
 * 
 * Mye mer avansert enn Siri, Alexa, Google Assistant!
 * Programmert av Cato Hansen
 */

export interface NoraConfig {
  apiKey: string
  baseUrl?: string
  userId?: string
  pageContext?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ChatResponse {
  content: string
  suggestions?: string[]
  actions?: Array<{ type: string; payload: unknown }>
  metadata?: Record<string, unknown>
  latency?: number
}

export interface MemorySearchResult {
  id: number
  user_id: string
  content: string
  similarity: number
  context?: string
  source?: string
  timestamp?: string
}

export interface MemoryStats {
  totalMemories: number
  recentMemories: number
  averageRelevance: number
  topContexts: Array<{ context: string; count: number }>
}

/**
 * Nora Client SDK
 * Main client for interacting with Nora API
 */
export class NoraClient {
  private config: Required<Pick<NoraConfig, 'apiKey' | 'baseUrl'>> & Pick<NoraConfig, 'userId' | 'pageContext'>
  private conversationHistory: ChatMessage[] = []

  constructor(config: NoraConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://api.catohansen.no/nora',
      userId: config.userId,
      pageContext: config.pageContext
    }
  }

  /**
   * Chat with Nora (with streaming support)
   */
  async chat(
    message: string,
    options?: {
      stream?: boolean
      persona?: 'coach' | 'dev' | 'marketing' | 'system-architect' | 'general'
      conversationHistory?: ChatMessage[]
    }
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          message,
          userId: this.config.userId,
          pageContext: this.config.pageContext,
          conversationHistory: options?.conversationHistory || this.conversationHistory,
          persona: options?.persona,
          stream: options?.stream || false
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Update conversation history
      this.conversationHistory.push({ role: 'user', content: message })
      this.conversationHistory.push({ role: 'assistant', content: data.response || data.content })

      return {
        content: data.response || data.content,
        suggestions: data.suggestions,
        actions: data.actions,
        metadata: data.metadata,
        latency: data.latency
      }
    } catch (error: any) {
      console.error('Nora chat error:', error)
      throw new Error(`Failed to chat with Nora: ${error.message}`)
    }
  }

  /**
   * Chat with streaming (Server-Sent Events)
   */
  async *chatStream(
    message: string,
    options?: {
      persona?: 'coach' | 'dev' | 'marketing' | 'system-architect' | 'general'
    }
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          message,
          userId: this.config.userId,
          pageContext: this.config.pageContext,
          conversationHistory: this.conversationHistory,
          persona: options?.persona,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body reader')
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim()) {
            yield line
          }
        }
      }

      // Update conversation history
      this.conversationHistory.push({ role: 'user', content: message })
    } catch (error: any) {
      console.error('Nora chat stream error:', error)
      throw new Error(`Failed to stream chat with Nora: ${error.message}`)
    }
  }

  /**
   * Search memories
   */
  async searchMemories(
    query: string,
    options?: {
      limit?: number
      threshold?: number
      context?: string
    }
  ): Promise<MemorySearchResult[]> {
    try {
      const params = new URLSearchParams({
        query,
        ...(this.config.userId && { userId: this.config.userId }),
        ...(options?.limit && { limit: options.limit.toString() }),
        ...(options?.threshold && { threshold: options.threshold.toString() }),
        ...(options?.context && { context: options.context })
      })

      const response = await fetch(`${this.config.baseUrl}/api/memory?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.memories || []
    } catch (error: any) {
      console.error('Nora memory search error:', error)
      throw new Error(`Failed to search memories: ${error.message}`)
    }
  }

  /**
   * Store a memory
   */
  async storeMemory(
    content: string,
    metadata?: {
      context?: string
      source?: string
      [key: string]: unknown
    }
  ): Promise<{ memoryId: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          content,
          userId: this.config.userId,
          metadata
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { memoryId: data.memoryId }
    } catch (error: any) {
      console.error('Nora store memory error:', error)
      throw new Error(`Failed to store memory: ${error.message}`)
    }
  }

  /**
   * Get memory statistics
   */
  async getMemoryStats(): Promise<MemoryStats> {
    try {
      const params = new URLSearchParams(
        this.config.userId ? { userId: this.config.userId } : {}
      )

      const response = await fetch(`${this.config.baseUrl}/api/memory?${params}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.stats
    } catch (error: any) {
      console.error('Nora memory stats error:', error)
      throw new Error(`Failed to get memory stats: ${error.message}`)
    }
  }

  /**
   * Get system status
   */
  async getStatus(): Promise<{
    system: string
    version: string
    environment: string
    active_persona: string
    health: string
    heartbeat: string
    features: Record<string, boolean>
  }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Nora status error:', error)
      throw new Error(`Failed to get status: ${error.message}`)
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = []
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory]
  }
}

// Export singleton instance helper
let defaultClient: NoraClient | null = null

export function createNoraClient(config: NoraConfig): NoraClient {
  return new NoraClient(config)
}

export function getNoraClient(config?: NoraConfig): NoraClient {
  if (!defaultClient && config) {
    defaultClient = new NoraClient(config)
  }
  if (!defaultClient) {
    throw new Error('Nora client not initialized. Call createNoraClient() first.')
  }
  return defaultClient
}

// Export default client
export const Nora = NoraClient
export default NoraClient

