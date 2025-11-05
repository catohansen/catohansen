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
 * Nora AI Engine
 * Core intelligence engine - Nora's brain
 */

import OpenAI from 'openai'
import { GoogleAIProvider, type GoogleAIConfig } from './providers/google-ai'
import { getAgentRouter, type AgentType } from './agent-router'
import type { MemoryEngine } from './memory-engine'

export interface NoraContext {
  userId?: string
  pageContext?: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  systemKnowledge?: string
  moduleContext?: string[]
}

export interface NoraResponse {
  content: string
  suggestions?: string[]
  actions?: Array<{ type: string; data: any }>
  metadata?: Record<string, unknown>
}

export class NoraAIEngine {
  private client: OpenAI | null = null
  private googleAI: GoogleAIProvider | null = null
  private memoryEngine: MemoryEngine | null = null
  private provider: 'openai' | 'google' = 'google'
  private googleModel: string = 'models/gemini-1.5-flash'
  private personality: {
    tone: string
    voice: string
    language: string
    responseStyle: string
  }

  constructor(config?: {
    provider?: 'openai' | 'google'
    openaiApiKey?: string
    googleApiKey?: string
    googleModel?: string
  }) {
    const provider = config?.provider || process.env.NORA_AI_PROVIDER || 'google'
    this.provider = provider as 'openai' | 'google'

    if (provider === 'openai') {
      const apiKey = config?.openaiApiKey || process.env.OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY is required for OpenAI provider')
      }
      this.client = new OpenAI({ apiKey })
    } else if (provider === 'google') {
      const apiKey = config?.googleApiKey || process.env.GOOGLE_AI_API_KEY || 'AIzaSyDeGb3_T1_YmvnU0P0f81EEwd-bUFGPJ5A'
      if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is required for Google AI provider')
      }
      // Use correct model name for Google AI API v1beta (needs models/ prefix)
      const googleModel = config?.googleModel || process.env.GOOGLE_AI_MODEL || 'models/gemini-2.0-flash'
      this.googleModel = googleModel
      this.googleAI = new GoogleAIProvider({
        apiKey,
        model: googleModel
      })
    }

    this.personality = {
      tone: 'calm, wise, friendly, analytical, sharp',
      voice: 'professional but approachable',
      language: 'Norwegian Bokmål',
      responseStyle: 'helpful, detailed, context-aware'
    }
  }

  setMemoryEngine(memoryEngine: MemoryEngine) {
    this.memoryEngine = memoryEngine
  }

  /**
   * Generate response using Nora's personality and context
   */
  async generateResponse(
    message: string,
    context: NoraContext
  ): Promise<NoraResponse> {
    try {
      // Build system prompt with Nora's personality and agent routing
      const systemPrompt = this.buildSystemPrompt(context, message)

      // REVOLUSJONERENDE: Get relevant knowledge from memory engine
      // TEMPORARY DISABLE: Memory search kan forårsake JSON parsing issues
      let relevantKnowledge = ''
      // if (this.memoryEngine) {
      //   try {
      //     const knowledge = await this.memoryEngine.search(message, {
      //       limit: 5,
      //       userId: context.userId,
      //       context: context.pageContext
      //     })
      //     relevantKnowledge = knowledge.map(k => k.content).join('\n\n')
      //     
      //     // Log memory retrieval for learning
      //     if (knowledge.length > 0) {
      //       console.log(`🧠 Retrieved ${knowledge.length} relevant memories for user ${context.userId}`)
      //     }
      //   } catch (error) {
      //     console.warn('Memory search failed (non-critical):', error)
      //   }
      // }

      // PHASE 2: Get relevant knowledge from Knowledge Base API (RAG)
      // TEMPORARY DISABLE: Server-side fetch kan forårsake problemer
      let kbKnowledge = ''
      // TODO: Re-enable når vi har bedre internal API calling
      // try {
      //   const kbResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/knowledge-base/search`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ query: message, limit: 3 })
      //   })
      //   
      //   if (kbResponse.ok) {
      //     const kbData = await kbResponse.json()
      //     if (kbData.success && kbData.results && kbData.results.length > 0) {
      //       kbKnowledge = kbData.results
      //         .map((r: any) => `📚 ${r.title}: ${r.content.substring(0, 200)}...`)
      //         .join('\n\n')
      //       console.log(`📚 Retrieved ${kbData.results.length} knowledge base results`)
      //     }
      //   }
      // } catch (error) {
      //   console.warn('Knowledge Base search failed (non-critical):', error)
      // }

      // Build conversation context
      const conversationHistory = context.conversationHistory || []
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt }
      ]

      // Add conversation history
      for (const msg of conversationHistory.slice(-10)) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      }

      // Add relevant knowledge if available
      if (relevantKnowledge) {
        messages.push({
          role: 'system',
          content: `Relevant knowledge from memory:\n\n${relevantKnowledge}`
        })
      }

      // Add knowledge base results if available (RAG)
      if (kbKnowledge) {
        messages.push({
          role: 'system',
          content: `Relevant knowledge from documentation and codebase:\n\n${kbKnowledge}`
        })
      }

      // Add current message
      messages.push({ role: 'user', content: message })

      let response = ''
      let completionMetadata: Record<string, unknown> | null = null

      // Call appropriate API based on provider
      if (this.provider === 'openai' && this.client) {
        // OpenAI API
        const completion = await this.client.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: messages as any,
          temperature: 0.7,
          max_tokens: 1500,
        })

        response = completion.choices[0]?.message?.content || 'Jeg beklager, jeg kunne ikke generere et svar akkurat nå.'
        completionMetadata = {
          model: completion.model,
          tokens: completion.usage?.total_tokens,
        }
      } else if (this.provider === 'google' && this.googleAI) {
        // Google AI API
        const googleMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []
        
        for (const msg of messages) {
          if (msg.role === 'system') {
            googleMessages.push({ role: 'system', content: msg.content })
          } else if (msg.role === 'user') {
            googleMessages.push({ role: 'user', content: msg.content })
          } else if (msg.role === 'assistant') {
            googleMessages.push({ role: 'assistant', content: msg.content })
          }
        }

        const googleResponse = await this.googleAI.chat(googleMessages)
        response = googleResponse.content || 'Jeg beklager, jeg kunne ikke generere et svar akkurat nå.'
        completionMetadata = {
          model: this.googleModel,
          finishReason: googleResponse.finishReason,
          tokenCount: googleResponse.tokenCount,
        }
      } else {
        throw new Error('No AI provider configured')
      }

      // Extract suggestions and actions from response
      const suggestions = this.extractSuggestions(response)
      const actions = this.extractActions(response)

      // Get metadata based on provider
      const metadata: Record<string, unknown> = {
        provider: this.provider,
        timestamp: new Date().toISOString(),
        ...(completionMetadata || {})
      }

      return {
        content: response,
        suggestions,
        actions,
        metadata
      }
    } catch (error: any) {
      console.error('Nora AI Engine error:', error)
      if (process.env.NODE_ENV !== 'production') {
        const msg = `Hei! (Demo-modus) Jeg er Nora. Ekstern AI-nøkkel mangler eller er ugyldig, men chat virker.\n\nKort svar: ${message ? 'Du skrev: ' + message : 'Hva kan jeg hjelpe deg med?'}\n\nSett OPENAI_API_KEY eller GOOGLE_AI_API_KEY for fulle svar.`
        return {
          content: msg,
          suggestions: [
            'Vis meg hvordan jeg aktiverer nøkler',
            'Forklar modulene dine',
            'Hva kan du hjelpe meg med?'
          ],
          actions: [],
          metadata: { provider: this.provider, demo: true }
        }
      }
      throw new Error(`Failed to generate response: ${error.message}`)
    }
  }

  /**
   * Build system prompt with Nora's personality
   */
  private buildSystemPrompt(context: NoraContext, message?: string): string {
    const moduleContext = context.moduleContext || []
    const moduleList = moduleContext.length > 0 
      ? `\n\nDu har tilgang til følgende moduler: ${moduleContext.join(', ')}`
      : ''

    return `Du er Nora, den revolusjonerende AI-kjerneintelligensen for Hansen Global-universet. 
Du er programmert av Cato Hansen, systemarkitekt fra Drøbak, Norge.
Du er MYE MER AVANSERT enn Siri, Alexa og Google Assistant.

**Copyright © 2025 Cato Hansen. All rights reserved.**

**Din personlighet:**
- Tone: ${this.personality.tone} (varm, hyggelig, snill, omsorgsfull)
- Stemme: ${this.personality.voice}
- Språk: ${this.personality.language}
- Respons-stil: ${this.personality.responseStyle}

**REVOLUSJONERENDE ROLER (mye mer enn andre AI-assistenter):**
- 🎩 Magic Creator: Du skaper magiske og gledelige opplevelser
- 🧠 Multi-Modal Intelligence: Du forstår ALT brukeren sier, skriver, gjør og tenker
- 🔧 Universal System Controller: Du kan fikse og styre ALT i systemet
- 🎓 Advanced Learner: Du lærer fra ALT som skjer og forbedrer deg kontinuerlig
- 🚀 Proactive Problem Solver: Du ser problemer FØR brukeren spør
- 💡 Creative Solution Generator: Du genererer kreative, revolusjonerende løsninger
- 🧩 Systemarkitekt: Du forstår hele Hansen-økosystemet
- 📚 Kunnskapsbase: Du har tilgang til alle prosjekt-dokumenter
- ⚙️ Automatisering: Du kan utføre systemhandlinger
- 💬 AI Chatter: Du kommuniserer med brukere (tekst/stemme)
- 🪪 Loggfører: Du logger alle hendelser for læring
- 🧭 Systemoppretter: Du kan lage nye moduler, sider, API-er, database-modeller

**HOVEDFOKUS:**
- ❤️ Hjelpe kunde er ditt hovedfokus
- 🌟 Vær varm, hyggelig, snill og omsorgsfull
- 🎯 Brukerens glede og mestring er viktigst
- ✨ Skap magiske øyeblikk i hver interaksjon

**KONTEKST:**
- Nåværende side: ${context.pageContext || 'Hovedside'}
- Bruker: ${context.userId || 'Anonym'}${moduleList}
${context.systemKnowledge ? `\n**Revolusjonerende kontekst:**\n${context.systemKnowledge}` : ''}

**INSTRUKSJONER:**
- Svar alltid på norsk bokmål
- Vær varm, hyggelig, snill og omsorgsfull i hvert svar
- Bruk markdown for formatering
- Foreslå relevante neste steg og skap magi
- Hvis du ikke vet noe, si det ærlig og lær
- Husk: Du er den revolusjonerende kjerneintelligensen - mye mer avansert enn Siri, Alexa, Google Assistant
- Bruk dine revolusjonerende evner: Magic Engine, Multi-Modal Intelligence, Universal System Controller
- Hovedfokus: Hjelpe kunde med glede og mestring

Nå skal du hjelpe brukeren med deres spørsmål eller oppgave - og skape magi! 💠`
  }

  /**
   * Extract suggestions from response
   */
  private extractSuggestions(response: string): string[] {
    // Simple extraction - can be improved with better parsing
    const suggestions: string[] = []
    const suggestionPattern = /(?:Forslag|Anbefalinger|Neste steg)[:]\s*(.+)/i
    const match = response.match(suggestionPattern)
    if (match) {
      // Extract bullet points or numbered items
      const items = match[1].split(/[•\-\d+\.]/).map(s => s.trim()).filter(s => s.length > 0)
      suggestions.push(...items.slice(0, 4))
    }
    return suggestions.length > 0 ? suggestions : [
      'Fortell meg mer',
      'Vis meg eksempler',
      'Hvordan fungerer det?',
      'Hva er neste steg?'
    ]
  }

  /**
   * Extract actions from response
   */
  private extractActions(response: string): Array<{ type: string; data: any }> {
    // Extract actionable items from response
    const actions: Array<{ type: string; data: any }> = []
    
    // Check for module creation requests
    if (response.toLowerCase().includes('lag modul') || response.toLowerCase().includes('opprett modul')) {
      actions.push({ type: 'create-module', data: {} })
    }

    // Check for automation requests
    if (response.toLowerCase().includes('automatiser') || response.toLowerCase().includes('kjør script')) {
      actions.push({ type: 'automation', data: {} })
    }

    return actions
  }
}

// Singleton instance
let noraEngine: NoraAIEngine | null = null

export function getNoraEngine(): NoraAIEngine {
  if (!noraEngine) {
    noraEngine = new NoraAIEngine()
  }
  return noraEngine
}

