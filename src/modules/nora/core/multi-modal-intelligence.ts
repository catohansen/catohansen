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
 * Multi-Modal Intelligence Engine
 * Nora forstår ALT brukeren sier, skriver, gjør og tenker
 * Mye mer avansert enn Siri, Alexa, Google Assistant
 * Programmert av Cato Hansen
 */

export interface MultiModalInput {
  text?: string
  voice?: {
    audio: Buffer
    transcript?: string
    emotion?: string
    tone?: string
  }
  visual?: {
    screenshot?: Buffer
    action?: string
    context?: string
  }
  behavior?: {
    clicks?: number
    scrolls?: number
    timeOnPage?: number
    mouseMovement?: Array<{ x: number; y: number; time: number }>
  }
  system?: {
    errors?: any[]
    logs?: any[]
    performance?: any
  }
}

export interface ComprehensiveContext {
  user: {
    id?: string
    name?: string
    history: any[]
    preferences: any
    currentState: 'working' | 'exploring' | 'stuck' | 'happy' | 'frustrated'
  }
  environment: {
    page: string
    module?: string
    time: string
    dayOfWeek: string
    device: string
  }
  interaction: {
    mode: 'chat' | 'voice' | 'gesture' | 'automation'
    intent: string
    confidence: number
    urgency: 'low' | 'medium' | 'high'
  }
  system: {
    health: 'excellent' | 'good' | 'warning' | 'critical'
    recentErrors: number
    performance: number
  }
}

export class MultiModalIntelligence {
  /**
   * Analyser alt input
   */
  async analyzeAllInput(input: MultiModalInput): Promise<ComprehensiveContext> {
    // Kombiner all input
    const textIntent = input.text ? await this.analyzeText(input.text) : null
    const voiceIntent = input.voice ? await this.analyzeVoice(input.voice) : null
    const visualIntent = input.visual ? await this.analyzeVisual(input.visual) : null
    const behaviorIntent = input.behavior ? await this.analyzeBehavior(input.behavior) : null
    const systemIntent = input.system ? await this.analyzeSystem(input.system) : null

    // Kombiner alle intents
    const combinedIntent = this.combineIntents([
      textIntent,
      voiceIntent,
      visualIntent,
      behaviorIntent,
      systemIntent
    ].filter(Boolean) as any[])

    // Bygg omfattende kontekst
    return this.buildComprehensiveContext(combinedIntent, input)
  }

  /**
   * Analyser tekst
   */
  private async analyzeText(text: string): Promise<{
    intent: string
    emotion: string
    urgency: 'low' | 'medium' | 'high'
    keywords: string[]
    entities: any[]
  }> {
    const lowerText = text.toLowerCase()
    
    // Detekter emosjon
    let emotion = 'neutral'
    if (lowerText.includes('takk') || lowerText.includes('perfekt') || lowerText.includes('fantastisk')) {
      emotion = 'positive'
    } else if (lowerText.includes('feil') || lowerText.includes('problem') || lowerText.includes('ikke fungerer')) {
      emotion = 'frustrated'
    } else if (lowerText.includes('hjelp') || lowerText.includes('hvordan')) {
      emotion = 'curious'
    }

    // Detekter intent
    let intent = 'general'
    if (lowerText.includes('lag') || lowerText.includes('opprett') || lowerText.includes('create')) {
      intent = 'create'
    } else if (lowerText.includes('fi') || lowerText.includes('repair') || lowerText.includes('fix')) {
      intent = 'fix'
    } else if (lowerText.includes('hvordan') || lowerText.includes('how') || lowerText.includes('forklar')) {
      intent = 'learn'
    } else if (lowerText.includes('automatis') || lowerText.includes('gjør automatisk')) {
      intent = 'automate'
    }

    // Detekter urgency
    let urgency: 'low' | 'medium' | 'high' = 'medium'
    if (lowerText.includes('nå') || lowerText.includes('umiddelbart') || lowerText.includes('asap')) {
      urgency = 'high'
    } else if (lowerText.includes('når som helst') || lowerText.includes('ikke travelt')) {
      urgency = 'low'
    }

    // Extract keywords
    const keywords = text.split(/\s+/).filter(word => word.length > 3)

    return {
      intent,
      emotion,
      urgency,
      keywords,
      entities: []
    }
  }

  /**
   * Analyser stemme
   */
  private async analyzeVoice(voice: { audio?: Buffer; transcript?: string; emotion?: string; tone?: string }): Promise<{
    intent: string
    emotion: string
    urgency: 'low' | 'medium' | 'high'
    confidence: number
  }> {
    // Bruk transcript hvis tilgjengelig
    if (voice.transcript) {
      const textAnalysis = await this.analyzeText(voice.transcript)
      return {
        ...textAnalysis,
        confidence: 0.9
      }
    }

    // Fallback til emotion/tone hvis tilgjengelig
    return {
      intent: 'voice-command',
      emotion: voice.emotion || 'neutral',
      urgency: 'medium',
      confidence: 0.7
    }
  }

  /**
   * Analyser visuell input
   */
  private async analyzeVisual(visual: { screenshot?: Buffer; action?: string; context?: string }): Promise<{
    intent: string
    context: string
    action?: string
  }> {
    // Analyser skjermbilde hvis tilgjengelig
    // Dette kan senere bruke vision AI
    
    return {
      intent: visual.action || 'observe',
      context: visual.context || 'visual-context',
      action: visual.action
    }
  }

  /**
   * Analyser atferd
   */
  private async analyzeBehavior(behavior: {
    clicks?: number
    scrolls?: number
    timeOnPage?: number
    mouseMovement?: Array<{ x: number; y: number; time: number }>
  }): Promise<{
    intent: string
    state: 'exploring' | 'focused' | 'lost' | 'frustrated'
    confidence: number
  }> {
    let state: 'exploring' | 'focused' | 'lost' | 'frustrated' = 'exploring'
    
    // Mange klikk = leter etter noe
    if (behavior.clicks && behavior.clicks > 20) {
      state = 'lost'
    }
    
    // Mye scrolling = utforsker
    if (behavior.scrolls && behavior.scrolls > 50) {
      state = 'exploring'
    }
    
    // Liten tid på side = frustrert eller ikke funnet
    if (behavior.timeOnPage && behavior.timeOnPage < 5000) {
      state = 'frustrated'
    }
    
    // Mye tid på side = fokusert
    if (behavior.timeOnPage && behavior.timeOnPage > 60000) {
      state = 'focused'
    }

    return {
      intent: `behavior-${state}`,
      state,
      confidence: 0.8
    }
  }

  /**
   * Analyser system
   */
  private async analyzeSystem(system: { errors?: any[]; logs?: any[]; performance?: any }): Promise<{
    intent: string
    issues: string[]
    health: 'excellent' | 'good' | 'warning' | 'critical'
  }> {
    const issues: string[] = []
    let health: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent'

    if (system.errors && system.errors.length > 0) {
      issues.push(`${system.errors.length} errors detected`)
      if (system.errors.length > 10) {
        health = 'critical'
      } else if (system.errors.length > 5) {
        health = 'warning'
      }
    }

    if (system.performance && system.performance.responseTime > 2000) {
      issues.push('Slow performance detected')
      health = health === 'excellent' ? 'warning' : health
    }

    return {
      intent: issues.length > 0 ? 'system-issues' : 'system-ok',
      issues,
      health
    }
  }

  /**
   * Kombiner alle intents
   */
  private combineIntents(intents: any[]): {
    primaryIntent: string
    confidence: number
    urgency: 'low' | 'medium' | 'high'
    emotion: string
    allContext: any
  } {
    if (intents.length === 0) {
      return {
        primaryIntent: 'general',
        confidence: 0.5,
        urgency: 'medium',
        emotion: 'neutral',
        allContext: {}
      }
    }

    // Velg primær intent (høyest confidence eller mest urgent)
    const sortedIntents = intents.sort((a, b) => {
      if (a.urgency === 'high' && b.urgency !== 'high') return -1
      if (b.urgency === 'high' && a.urgency !== 'high') return 1
      return (b.confidence || 0.8) - (a.confidence || 0.8)
    })

    const primary = sortedIntents[0]

    return {
      primaryIntent: primary.intent || 'general',
      confidence: primary.confidence || 0.8,
      urgency: primary.urgency || 'medium',
      emotion: primary.emotion || 'neutral',
      allContext: {
        intents,
        count: intents.length,
        sources: intents.map(i => i.intent || 'unknown')
      }
    }
  }

  /**
   * Bygg omfattende kontekst
   */
  private buildComprehensiveContext(
    combinedIntent: any,
    input: MultiModalInput
  ): ComprehensiveContext {
    return {
      user: {
        currentState: this.determineUserState(combinedIntent),
        history: [],
        preferences: {}
      },
      environment: {
        page: input.visual?.context || 'unknown',
        time: new Date().toISOString(),
        dayOfWeek: new Date().toLocaleDateString('no-NO', { weekday: 'long' }),
        device: 'browser'
      },
      interaction: {
        mode: input.voice ? 'voice' : input.text ? 'chat' : 'automation',
        intent: combinedIntent.primaryIntent,
        confidence: combinedIntent.confidence,
        urgency: combinedIntent.urgency
      },
      system: {
        health: input.system?.errors && input.system.errors.length > 5 ? 'warning' : 'good',
        recentErrors: input.system?.errors?.length || 0,
        performance: input.system?.performance?.responseTime || 0
      }
    }
  }

  /**
   * Bestem brukerens tilstand
   */
  private determineUserState(intent: any): 'working' | 'exploring' | 'stuck' | 'happy' | 'frustrated' {
    if (intent.emotion === 'frustrated' || intent.intent?.includes('problem')) {
      return 'stuck'
    }
    if (intent.emotion === 'positive') {
      return 'happy'
    }
    if (intent.intent === 'learn' || intent.intent === 'explore') {
      return 'exploring'
    }
    return 'working'
  }
}

let multiModalIntelligence: MultiModalIntelligence | null = null

export function getMultiModalIntelligence(): MultiModalIntelligence {
  if (!multiModalIntelligence) {
    multiModalIntelligence = new MultiModalIntelligence()
  }
  return multiModalIntelligence
}

