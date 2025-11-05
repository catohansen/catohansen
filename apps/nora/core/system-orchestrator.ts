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
  private voiceEngine: VoiceEngine
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
    this.voiceEngine = new VoiceEngine()
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
      // Log incoming message
      await this.logger.log({
        type: 'message',
        action: 'incoming',
        data: {
          message: message.substring(0, 100),
          userId: context.userId,
          pageContext: context.pageContext,
          voice: options?.voice || false
        }
      })

      // REVOLUSJONERENDE: Multi-Modal Intelligence - forstå ALT
      const multiModal = getMultiModalIntelligence()
      const comprehensiveContext = await multiModal.analyzeAllInput({
        text: message,
        voice: options?.voice ? { audio: Buffer.from([]), transcript: message } : undefined,
        behavior: context as any,
        system: context as any
      })

      // REVOLUSJONERENDE: Magic Engine - skap magiske øyeblikk
      const magicEngine = getMagicEngine()
      const magicMoment = await magicEngine.detectMagicOpportunity({
        message,
        userId: context.userId,
        pageContext: context.pageContext,
        conversationHistory: context.conversationHistory,
        systemState: comprehensiveContext.system
      })

      // REVOLUSJONERENDE: Advanced Learning - lær fra alt
      const learningEngine = getAdvancedLearningEngine()
      if (context.userId) {
        await learningEngine.learnFromEvent({
          type: 'interaction',
          data: {
            message,
            intent: comprehensiveContext.interaction.intent,
            satisfied: false // Will update after response
          },
          timestamp: new Date(),
          userId: context.userId,
          context: comprehensiveContext
        })
      }

      // REVOLUSJONERENDE: Universal System Controller - kan fikse ALT
      const systemController = getUniversalSystemController()
      
      // Detekter om brukeren spør om å fikse noe
      const lowerMessage = message.toLowerCase()
      let systemFix: any = null
      if (lowerMessage.includes('fi') || lowerMessage.includes('problem') || lowerMessage.includes('feil')) {
        systemFix = await systemController.diagnoseProblem(message)
      }

      // REVOLUSJONERENDE: Emotion Engine - analyser og tilpass respons
      const emotionContext: EmotionContext = {
        previousEmotions: context.userId ? this.emotionEngine.getEmotionHistory(context.userId).slice(-3) : undefined,
        conversationLength: context.conversationHistory?.length || 0,
        urgency: comprehensiveContext.interaction.urgency === 'high' ? 'high' : 
                comprehensiveContext.interaction.urgency === 'medium' ? 'medium' : 'low',
        topic: comprehensiveContext.interaction.intent
      }

      const emotionProfile = await this.emotionEngine.analyzeText(message, emotionContext)

      // Generer AI response med all denne intelligensen
      const aiResponse = await this.aiEngine.generateResponse(message, {
        ...context,
        // Inkluder all revolusjonerende kontekst
        systemKnowledge: `
${context.systemKnowledge || ''}

REVOLUSJONERENDE NORA KONTEKST:
- Magic Moment: ${magicMoment ? magicMoment.type : 'none'}
- User State: ${comprehensiveContext.user.currentState}
- System Health: ${comprehensiveContext.system.health}
- Intent: ${comprehensiveContext.interaction.intent} (${comprehensiveContext.interaction.confidence * 100}% confidence)
- Urgency: ${comprehensiveContext.interaction.urgency}
- Emotion: ${emotionProfile.emotion} (${(emotionProfile.confidence * 100).toFixed(0)}% confidence, ${(emotionProfile.intensity * 100).toFixed(0)}% intensity)
${systemFix ? `- System Fix Available: ${systemFix.solution}` : ''}
        `.trim()
      })

      // REVOLUSJONERENDE: Juster respons basert på emosjon
      const response = {
        ...aiResponse,
        content: await this.emotionEngine.autoAdjust(
          message,
          aiResponse.content,
          context.userId,
          emotionContext
        ),
        metadata: {
          ...(aiResponse.metadata || {}),
          emotion: {
            type: emotionProfile.emotion,
            confidence: emotionProfile.confidence,
            intensity: emotionProfile.intensity,
            color: emotionProfile.color,
            emoji: emotionProfile.emoji,
            visualization: this.emotionEngine.visualize()
          }
        } as Record<string, unknown>
      }

      // Process actions if any
      if (response.actions && response.actions.length > 0) {
        for (const action of response.actions) {
          await this.executeAction(action, context)
        }
      }

      // REVOLUSJONERENDE: Legg til magi i responsen
      if (magicMoment) {
        magicEngine.recordMagicMoment(magicMoment)
        response.content = `${magicMoment.message || ''}\n\n${response.content}`
        if (!response.metadata) {
          response.metadata = {}
        }
        (response.metadata as Record<string, unknown>).magicMoment = {
          type: magicMoment.type,
          visualization: magicEngine.createMagicVisualization(magicMoment)
        }
      }

      // REVOLUSJONERENDE: Legg til system-fix hvis tilgjengelig
      if (systemFix) {
        response.suggestions = response.suggestions || []
        response.suggestions.unshift(`🔧 ${systemFix.solution}`)
        if (systemFix.canAutoFix) {
          response.suggestions.push('✨ Auto-fiks dette problemet?')
          response.actions = response.actions || []
          response.actions.push({
            type: 'auto-fix',
            data: systemFix
          })
        }
      }

      // REVOLUSJONERENDE: Lær fra samtalen
      if (context.userId && context.conversationHistory) {
        // Lagre minne fra samtale
        await this.memoryEngine.learnFromChat(
          context.userId,
          context.conversationHistory,
          context.pageContext || 'general'
        )
      }

      // REVOLUSJONERENDE: Personlig tilpass respons hvis brukerprofil eksisterer
      if (context.userId) {
        const userProfile = await learningEngine.getUserProfile(context.userId)
        if (userProfile) {
          response.content = await learningEngine.personalizeResponse(
            context.userId,
            response.content,
            comprehensiveContext
          )
        }

        // REVOLUSJONERENDE: Bruk minne for å forbedre responsen
        const relevantMemories = await this.memoryEngine.search(message, {
          userId: context.userId,
          limit: 3,
          threshold: 0.7
        })

        if (relevantMemories.length > 0) {
          const memoryContext = relevantMemories
            .map(m => `- Tidligere samtale: ${m.content.substring(0, 100)}...`)
            .join('\n')

          response.content = `${response.content}\n\n💡 Basert på tidligere samtaler med deg, husker jeg:${memoryContext}`
        }
      }

      // Log response med all revolusjonerende data
      await this.logger.log({
        type: 'message',
        action: 'outgoing',
        data: {
          message: response.content.substring(0, 100),
          userId: context.userId,
          actions: response.actions?.length || 0,
          magic: magicMoment ? magicMoment.type : null,
          systemFix: systemFix ? systemFix.issue : null,
          comprehensiveContext
        }
      })

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
    return this.voiceEngine.checkPermission(userId, action)
  }

  /**
   * Request voice permission
   */
  async requestVoicePermission(userId: string, action: 'speak' | 'listen') {
    return this.voiceEngine.requestPermission(userId, action)
  }

  /**
   * Process voice input
   */
  async processVoiceInput(
    audioBuffer: Buffer,
    userId: string
  ): Promise<string> {
    return this.voiceEngine.speechToText(audioBuffer, userId)
  }

  /**
   * Process voice output
   */
  async processVoiceOutput(
    text: string,
    userId: string
  ): Promise<Buffer> {
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

