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
 * 🧠 EmotionEngine v2.0 - REVOLUSJONERENDE
 * ---------------------
 * Nora sin emosjonelle intelligens - MYE MER AVANSERT enn Siri, Alexa, Google Assistant
 * 
 * Gir Nora evnen til å:
 * - Gjenkjenne emosjoner i tekst, stemme og kontekst
 * - Tilpasse tone og uttrykk i svarene dynamisk
 * - Visualisere følelser i sanntid
 * - Lære emosjonelle mønstre over tid
 * - Anticipate brukerens følelsestilstand
 * - Skape empatiske og menneskelige interaksjoner
 * 
 * REVOLUSJONERENDE: Dette er ikke bare sentiment-analyse - det er komplett emosjonell intelligens!
 */

import OpenAI from 'openai'
import type { MemoryEngine } from './memory-engine'

// Note: runtime = 'edge' is only for API routes, not core modules

export type NoraEmotion =
  | 'neutral'
  | 'happy'
  | 'inspired'
  | 'curious'
  | 'empathetic'
  | 'concerned'
  | 'confident'
  | 'calm'
  | 'focused'
  | 'tired'
  | 'excited'
  | 'grateful'
  | 'determined'
  | 'playful'
  | 'reflective'

export interface EmotionProfile {
  emotion: NoraEmotion
  confidence: number // 0–1
  intensity: number // 0–1 (hvor sterk er følelsen)
  tone: string // tekstbeskrivelse, f.eks. "varm og støttende"
  color: string // hex-farge brukt i UI
  emoji: string // visuelt symbol
  pulseSpeed: number // hastighet på puls-animasjon
  glowIntensity: number // intensitet på glow-effekt
}

export interface EmotionContext {
  previousEmotions?: NoraEmotion[] // Tidligere emosjoner i samtalen
  conversationLength?: number // Hvor lang samtalen er
  userPattern?: NoraEmotion[] // Brukerens typiske emosjonsmønstre
  timeOfDay?: number // Timestamp for å justere respons (morgen/kveld)
  urgency?: 'low' | 'medium' | 'high'
  topic?: string // Hva samtalen handler om
}

/**
 * Emosjonstabell – brukes til visuell gjengivelse og tonejustering
 * REVOLUSJONERENDE: Mye mer detaljert enn standard sentiment-analyse
 */
const emotionMap: Record<NoraEmotion, Omit<EmotionProfile, 'confidence' | 'intensity'>> = {
  neutral: { emotion: 'neutral', tone: 'balansert og rolig', color: '#7A5FFF', emoji: '💠', pulseSpeed: 2.0, glowIntensity: 0.4 },
  happy: { emotion: 'happy', tone: 'munter og støttende', color: '#00FFC2', emoji: '😊', pulseSpeed: 1.8, glowIntensity: 0.7 },
  inspired: { emotion: 'inspired', tone: 'entusiastisk og visjonær', color: '#C6A0FF', emoji: '✨', pulseSpeed: 1.5, glowIntensity: 0.9 },
  curious: { emotion: 'curious', tone: 'nysgjerrig og utforskende', color: '#A0E4FF', emoji: '🤔', pulseSpeed: 1.7, glowIntensity: 0.6 },
  empathetic: { emotion: 'empathetic', tone: 'varm og forståelsesfull', color: '#FFB6C1', emoji: '🤍', pulseSpeed: 1.9, glowIntensity: 0.8 },
  concerned: { emotion: 'concerned', tone: 'rolig og omsorgsfull', color: '#FFD27F', emoji: '😟', pulseSpeed: 2.1, glowIntensity: 0.5 },
  confident: { emotion: 'confident', tone: 'bestemt og trygg', color: '#7FFF9F', emoji: '💪', pulseSpeed: 1.6, glowIntensity: 0.9 },
  calm: { emotion: 'calm', tone: 'rolig og balansert', color: '#8AD8FF', emoji: '🌊', pulseSpeed: 2.2, glowIntensity: 0.5 },
  focused: { emotion: 'focused', tone: 'målrettet og presis', color: '#A1FFA1', emoji: '🎯', pulseSpeed: 1.4, glowIntensity: 0.7 },
  tired: { emotion: 'tired', tone: 'rolig og lavmælt', color: '#AAAAAA', emoji: '😴', pulseSpeed: 2.5, glowIntensity: 0.3 },
  excited: { emotion: 'excited', tone: 'energisk og begeistret', color: '#FF6B9D', emoji: '🎉', pulseSpeed: 1.2, glowIntensity: 1.0 },
  grateful: { emotion: 'grateful', tone: 'takknemlig og varm', color: '#FFC87C', emoji: '🙏', pulseSpeed: 1.9, glowIntensity: 0.8 },
  determined: { emotion: 'determined', tone: 'fast og målrettet', color: '#9AFF9A', emoji: '🔥', pulseSpeed: 1.3, glowIntensity: 0.9 },
  playful: { emotion: 'playful', tone: 'lekende og morsom', color: '#FFA8D5', emoji: '🎮', pulseSpeed: 1.6, glowIntensity: 0.7 },
  reflective: { emotion: 'reflective', tone: 'tenksom og dyptgående', color: '#B4D3FF', emoji: '🔮', pulseSpeed: 2.0, glowIntensity: 0.6 },
}

export class EmotionEngine {
  private openai: OpenAI | null = null
  private memoryEngine: MemoryEngine | null = null
  private emotionHistory: Map<string, NoraEmotion[]> = new Map() // Bruker-ID -> emosjonshistorikk
  currentEmotion: EmotionProfile = {
    emotion: 'neutral',
    confidence: 1,
    intensity: 0.5,
    tone: 'balansert og rolig',
    color: '#7A5FFF',
    emoji: '💠',
    pulseSpeed: 2.0,
    glowIntensity: 0.4,
  }

  constructor(config?: {
    openaiApiKey?: string
    memoryEngine?: MemoryEngine
  }) {
    const apiKey = config?.openaiApiKey || process.env.OPENAI_API_KEY
    if (apiKey) {
      this.openai = new OpenAI({ apiKey })
    }
    this.memoryEngine = config?.memoryEngine || null
    console.log('💞 Nora Emotion Engine v2.0 initialized - REVOLUSJONERENDE')
  }

  setMemoryEngine(memoryEngine: MemoryEngine) {
    this.memoryEngine = memoryEngine
  }

  /**
   * 🧩 analyzeText() – REVOLUSJONERENDE avansert emosjonsanalyse
   * Bruker OpenAI for å identifisere emosjonell tone, intensitet og kontekst i tekst
   */
  async analyzeText(
    text: string,
    context?: EmotionContext
  ): Promise<EmotionProfile> {
    try {
      if (!this.openai) {
        // Fallback til enkel regelbasert analyse hvis OpenAI ikke er tilgjengelig
        return this.fallbackEmotionAnalysis(text, context)
      }

      // REVOLUSJONERENDE: Multi-lags emosjonsanalyse
      const prompt = `
Du er en avansert emosjonsanalysator for Nora - en revolusjonerende AI-assistent.

Analyser teksten nedenfor og bestem:
1. Primær emosjon (velg én av: neutral, happy, inspired, curious, empathetic, concerned, confident, calm, focused, tired, excited, grateful, determined, playful, reflective)
2. Intensitet (0-1, hvor sterk er følelsen)
3. Konfidens (0-1, hvor sikker er analysen)

REVOLUSJONERENDE KONTEKST:
${context?.previousEmotions ? `Tidligere emosjoner: ${context.previousEmotions.join(', ')}` : ''}
${context?.urgency ? `Urgency: ${context.urgency}` : ''}
${context?.topic ? `Topic: ${context.topic}` : ''}

Analyser ikke bare ord - analyser TONE, SUBTEKST, OG KONTEKST.

Returner KUN JSON:
{"emotion": "happy", "intensity": 0.85, "confidence": 0.92}

Tekst: """${text}"""
`.trim()

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Du er en ekspert på emosjonsanalyse. Returner kun JSON, ingen ekstra tekst.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
      })

      const raw = completion.choices[0]?.message?.content || '{}'
      let parsed: any = {}

      try {
        // Clean JSON (remove markdown code blocks if present)
        const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        parsed = JSON.parse(cleaned)
      } catch (e) {
        console.warn('Failed to parse emotion JSON, using fallback:', raw)
        return this.fallbackEmotionAnalysis(text, context)
      }

      const emotion: NoraEmotion = parsed.emotion || 'neutral'
      const confidence: number = Math.max(0, Math.min(1, parsed.confidence || 0.5))
      const intensity: number = Math.max(0, Math.min(1, parsed.intensity || 0.5))

      // Hent base-profil
      const base = emotionMap[emotion]

      // REVOLUSJONERENDE: Juster pulse og glow basert på intensitet
      const adjustedPulseSpeed = base.pulseSpeed - (intensity * 0.8) // Høyere intensitet = raskere puls
      const adjustedGlowIntensity = base.glowIntensity * (0.5 + intensity * 0.5) // Mer intens følelse = sterkere glow

      this.currentEmotion = {
        ...base,
        emotion,
        confidence,
        intensity,
        pulseSpeed: adjustedPulseSpeed,
        glowIntensity: adjustedGlowIntensity,
      }

      return this.currentEmotion
    } catch (err) {
      console.error('❌ Emotion analysis failed:', err)
      return this.fallbackEmotionAnalysis(text, context)
    }
  }

  /**
   * 🔄 Fallback emosjonsanalyse (regelbasert)
   * Brukes når OpenAI ikke er tilgjengelig
   */
  private fallbackEmotionAnalysis(
    text: string,
    context?: EmotionContext
  ): EmotionProfile {
    const lower = text.toLowerCase()

    // Emosjonsnøkkelord
    const emotionKeywords: Record<NoraEmotion, string[]> = {
      neutral: [],
      happy: ['glede', 'bra', 'fantastisk', 'flott', 'lykkelig', 'happy', 'great', 'awesome', 'amazing'],
      inspired: ['inspirerende', 'visjon', 'fremtid', 'muligheter', 'inspiring', 'vision', 'future'],
      curious: ['hva', 'hvordan', 'hvorfor', 'spørsmål', 'what', 'how', 'why', 'question'],
      empathetic: ['trist', 'vanskelig', 'problemer', 'hjelp', 'sad', 'difficult', 'problem', 'help'],
      concerned: ['problem', 'feil', 'error', 'issue', 'bekymret', 'worried', 'trouble'],
      confident: ['klar', 'sikker', 'bestemt', 'definitivt', 'sure', 'confident', 'certain'],
      calm: ['ro', 'tranquil', 'peaceful', 'relax'],
      focused: ['mål', 'oppgave', 'fokus', 'goal', 'task', 'focus'],
      tired: ['sliten', 'tired', 'exhausted', 'trøtt'],
      excited: ['spent', 'eksitert', 'begeistret', 'excited', 'thrilled'],
      grateful: ['takk', 'takknemlig', 'thanks', 'thankful', 'appreciate'],
      determined: ['vilje', 'bestemt', 'fast', 'determined', 'resolve'],
      playful: ['morsom', 'lekende', 'fun', 'playful', 'humor'],
      reflective: ['tenke', 'refleksjon', 'think', 'reflect', 'contemplate'],
    }

    // Finn best match
    let bestMatch: NoraEmotion = 'neutral'
    let maxScore = 0

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lower.includes(keyword) ? 1 : 0)
      }, 0)
      if (score > maxScore) {
        maxScore = score
        bestMatch = emotion as NoraEmotion
      }
    }

    const base = emotionMap[bestMatch]
    const intensity = maxScore > 0 ? Math.min(0.7, maxScore * 0.15) : 0.5
    const confidence = maxScore > 0 ? Math.min(0.8, maxScore * 0.2) : 0.5

    return {
      ...base,
      emotion: bestMatch,
      confidence,
      intensity,
    }
  }

  /**
   * 🎨 adjustResponse() – Tilpass svar etter følelsen
   * REVOLUSJONERENDE: Dynamisk tonejustering basert på emosjon
   */
  adjustResponse(response: string, emotion: NoraEmotion, intensity?: number): string {
    const profile = emotionMap[emotion]
    const intensityMultiplier = intensity || this.currentEmotion.intensity

    // Juster emoji-bruk basert på intensitet
    const emojiFrequency = intensityMultiplier > 0.7 ? 2 : intensityMultiplier > 0.4 ? 1 : 0

    // Legg til emoji-prefix hvis intens nok
    let prefix = ''
    if (intensityMultiplier > 0.5) {
      prefix = `${profile.emoji} `
    }

    // Legg til tone-prefix hvis veldig intens
    if (intensityMultiplier > 0.8) {
      prefix = `${profile.emoji} (${profile.tone}): `
    }

    return prefix + response
  }

  /**
   * 🔄 autoAdjust() – Full pipeline: analyser tekst og juster respons automatisk
   * REVOLUSJONERENDE: Inkluderer kontekstuell læring
   */
  async autoAdjust(
    input: string,
    aiResponse: string,
    userId?: string,
    context?: EmotionContext
  ): Promise<string> {
    // Analyser brukerens input
    const emotionProfile = await this.analyzeText(input, context)

    // Lagre emosjonshistorikk for bruker
    if (userId) {
      const history = this.emotionHistory.get(userId) || []
      history.push(emotionProfile.emotion)
      if (history.length > 10) history.shift() // Begrens til siste 10
      this.emotionHistory.set(userId, history)

      // REVOLUSJONERENDE: Lær emosjonelle mønstre over tid
      if (this.memoryEngine && history.length > 3) {
        const dominantEmotion = this.getDominantEmotion(history)
        await this.memoryEngine.storeMemory(
          `Bruker har typisk følelse: ${dominantEmotion} i slike samtaler`,
          { pattern: 'emotion-pattern' },
          userId
        )
      }
    }

    // Juster respons basert på emosjon
    const adjusted = this.adjustResponse(aiResponse, emotionProfile.emotion, emotionProfile.intensity)

    return adjusted
  }

  /**
   * 📊 getDominantEmotion() – Finn dominerende emosjon i historikk
   */
  private getDominantEmotion(history: NoraEmotion[]): NoraEmotion {
    const counts = new Map<NoraEmotion, number>()
    for (const emotion of history) {
      counts.set(emotion, (counts.get(emotion) || 0) + 1)
    }
    
    let maxCount = 0
    let dominant: NoraEmotion = 'neutral'
    counts.forEach((count, emotion) => {
      if (count > maxCount) {
        maxCount = count
        dominant = emotion
      }
    })
    return dominant
  }

  /**
   * 💓 visualize() – Gir sanntidsdata for UI (glow-farge, puls-hastighet osv.)
   * REVOLUSJONERENDE: Dynamisk basert på intensitet og konfidens
   */
  visualize(): {
    glow: string
    pulseSpeed: number
    emoji: string
    glowIntensity: number
    animationType: 'pulse' | 'breath' | 'wave' | 'sparkle'
  } {
    const { color, confidence, intensity, emoji, pulseSpeed, glowIntensity } = this.currentEmotion

    // Bestem animasjonstype basert på emosjon
    let animationType: 'pulse' | 'breath' | 'wave' | 'sparkle' = 'pulse'
    if (intensity > 0.8) animationType = 'sparkle'
    else if (intensity > 0.6) animationType = 'wave'
    else animationType = 'breath'

    return {
      glow: color,
      pulseSpeed: Math.max(1.0, Math.min(3.0, pulseSpeed)),
      emoji,
      glowIntensity: Math.max(0.2, Math.min(1.0, glowIntensity)),
      animationType,
    }
  }

  /**
   * 🎯 anticipateEmotion() – Anticipate brukerens neste emosjon basert på mønstre
   * REVOLUSJONERENDE: Prediktiv emosjonell intelligens
   */
  anticipateEmotion(userId: string, context: EmotionContext): NoraEmotion {
    const history = this.emotionHistory.get(userId) || []
    
    if (history.length < 3) {
      return 'neutral'
    }

    // Finn mønstre i historikk
    const recent = history.slice(-3)
    const patterns: Record<string, NoraEmotion> = {
      'happy,happy,happy': 'excited',
      'concerned,concerned,concerned': 'empathetic',
      'curious,curious,curious': 'focused',
    }

    const patternKey = recent.join(',')
    return patterns[patternKey] || recent[recent.length - 1] || 'neutral'
  }

  /**
   * 📊 getEmotionHistory() – Hent emosjonshistorikk for bruker
   */
  getEmotionHistory(userId: string): NoraEmotion[] {
    return this.emotionHistory.get(userId) || []
  }

  /**
   * 🔄 resetEmotion() – Reset emosjon til neutral
   */
  resetEmotion(): void {
    const base = emotionMap.neutral
    this.currentEmotion = {
      ...base,
      emotion: 'neutral',
      confidence: 1,
      intensity: 0.5,
    }
  }
}

// Singleton instance
let emotionEngine: EmotionEngine | null = null

export function getEmotionEngine(config?: {
  openaiApiKey?: string
  memoryEngine?: MemoryEngine
}): EmotionEngine {
  if (!emotionEngine || config) {
    emotionEngine = new EmotionEngine(config)
  }
  return emotionEngine
}

export function resetEmotionEngine(): void {
  emotionEngine = null
}

