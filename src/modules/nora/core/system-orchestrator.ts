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
 * Nora System Orchestrator
 * Main brain that coordinates all Nora systems
 */

import { NoraAIEngine } from './ai-engine'
import { MemoryEngine } from './memory-engine'
import { VoiceEngine } from './voice-engine'
import { AutomationEngine } from './automation-engine'
import { NoraLogger } from './logger'
import type { NoraContext, NoraResponse } from './ai-engine'
import { getMagicEngine } from './magic-engine'
import { getMultiModalIntelligence } from './multi-modal-intelligence'
import { getUniversalSystemController } from './universal-system-controller'
import { getAdvancedLearningEngine } from './advanced-learning-engine'
import { getEmotionEngine, type EmotionContext } from './emotion-engine'

export class SystemOrchestrator {
  private aiEngine: NoraAIEngine
  private memoryEngine: MemoryEngine
  private voiceEngine: VoiceEngine | null
  private automationEngine: AutomationEngine
  private logger: NoraLogger
  private emotionEngine = getEmotionEngine()

  constructor(config?: {
    provider?: 'openai' | 'google'
    openaiApiKey?: string
    googleApiKey?: string
    googleModel?: string
  }) {
    this.aiEngine = new NoraAIEngine(config)
    this.memoryEngine = new MemoryEngine()
    // Initialize voice engine only if available (avoid hard dependency in dev)
    try {
      this.voiceEngine = new VoiceEngine()
    } catch (e) {
      this.voiceEngine = null
    }
    this.automationEngine = new AutomationEngine()
    this.logger = new NoraLogger()

    // Connect AI engine to memory
    this.aiEngine.setMemoryEngine(this.memoryEngine)

    // REVOLUSJONERENDE: Connect emotion engine to memory
    this.emotionEngine.setMemoryEngine(this.memoryEngine)
  }

  /**
   * Process a message (text or voice) - REVOLUSJONERENDE VERSJON
   * Nora forstår ALT og kan fikse ALT
   */
  async processMessage(
    message: string,
    context: NoraContext,
    options?: {
      voice?: boolean
      userId?: string
    }
  ): Promise<NoraResponse> {
    try {
      // SIMPLIFIED VERSION: Skip revolusjonerende features for stability
      // Direct AI response for now

      // Generer AI response direkte
      const aiResponse = await this.aiEngine.generateResponse(message, context)

      // Return response directly (simplified for stability)
      const response = aiResponse

      // Process actions if any (simplified)
      if (response.actions && response.actions.length > 0) {
        for (const action of response.actions) {
          try {
            await this.executeAction(action, context)
          } catch (error) {
            console.error('Action execution failed:', error)
          }
        }
      }

      // Log response (simplified)
      await this.logger.log({
        type: 'message',
        action: 'outgoing',
        data: {
          message: response.content.substring(0, 100),
          userId: context.userId,
          actions: response.actions?.length || 0
        }
      }).catch(console.error)

      return response
    } catch (error: any) {
      console.error('System orchestrator error:', error)
      
      // Log error
      await this.logger.log({
        type: 'error',
        action: 'processing',
        data: {
          error: error.message,
          userId: context.userId
        }
      })

      throw error
    }
  }

  /**
   * Execute an action
   */
  private async executeAction(
    action: { type: string; data: any },
    context: NoraContext
  ): Promise<void> {
    try {
      switch (action.type) {
        case 'create-module':
          await this.automationEngine.createModule(action.data, context)
          break
        case 'automation':
          await this.automationEngine.executeAutomation(action.data, context)
          break
        case 'log':
          await this.logger.log(action.data)
          break
        default:
          console.warn('Unknown action type:', action.type)
      }
    } catch (error: any) {
      console.error('Action execution error:', error)
      throw error
    }
  }

  /**
   * Get Nora's memory
   */
  async getMemory(query: string, options?: { limit?: number }): Promise<any[]> {
    return this.memoryEngine.search(query, options)
  }

  /**
   * Store a memory
   */
  async storeMemory(content: string, metadata?: Record<string, unknown>): Promise<string> {
    return this.memoryEngine.storeMemory(content, metadata)
  }

  /**
   * Check voice permission
   */
  async checkVoicePermission(userId: string, action: 'speak' | 'listen'): Promise<boolean> {
    if (!this.voiceEngine) {
      throw new Error('Voice engine not available. Set OPENAI_API_KEY to enable voice features.')
    }
    return this.voiceEngine.checkPermission(userId, action)
  }

  /**
   * Request voice permission
   */
  async requestVoicePermission(userId: string, action: 'speak' | 'listen') {
    if (!this.voiceEngine) {
      throw new Error('Voice engine not available. Set OPENAI_API_KEY to enable voice features.')
    }
    return this.voiceEngine.requestPermission(userId, action)
  }

  /**
   * Process voice input
   */
  async processVoiceInput(
    audioBuffer: Buffer,
    userId: string
  ): Promise<string> {
    if (!this.voiceEngine) {
      throw new Error('Voice engine not available. Set OPENAI_API_KEY to enable voice features.')
    }
    return this.voiceEngine.speechToText(audioBuffer, userId)
  }

  /**
   * Process voice output
   */
  async processVoiceOutput(
    text: string,
    userId: string
  ): Promise<Buffer> {
    if (!this.voiceEngine) {
      throw new Error('Voice engine not available. Set OPENAI_API_KEY to enable voice features.')
    }
    return this.voiceEngine.textToSpeech(text, userId)
  }
}

// Singleton instance with config support
let orchestrator: SystemOrchestrator | null = null

export function getSystemOrchestrator(config?: {
  provider?: 'openai' | 'google'
  openaiApiKey?: string
  googleApiKey?: string
  googleModel?: string
}): SystemOrchestrator {
  // If config provided, create new instance (for admin config changes)
  if (config) {
    return new SystemOrchestrator(config)
  }

  // Otherwise use singleton
  if (!orchestrator) {
    orchestrator = new SystemOrchestrator()
  }
  return orchestrator
}

export function resetSystemOrchestrator() {
  orchestrator = null
}

