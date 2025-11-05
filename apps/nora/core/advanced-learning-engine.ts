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
 * Advanced Learning Engine
 * Nora lærer fra ALT som skjer i systemet
 * Mye mer avansert enn Siri, Alexa, Google Assistant
 * Programmert av Cato Hansen
 */

import { prisma } from '@/lib/db/prisma'

export interface LearningEvent {
  type: 'interaction' | 'error' | 'success' | 'feedback' | 'system' | 'user-behavior'
  data: any
  timestamp: Date
  userId?: string
  context?: any
}

export interface LearningPattern {
  pattern: string
  frequency: number
  outcome: 'positive' | 'negative' | 'neutral'
  confidence: number
  lastSeen: Date
}

export interface UserProfile {
  userId: string
  preferences: {
    communicationStyle: 'detailed' | 'brief' | 'visual' | 'step-by-step'
    favoriteTopics: string[]
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    timeOfDay: Record<string, 'active' | 'quiet'>
  }
  behavior: {
    commonQuestions: string[]
    preferredSolutions: string[]
    averageSessionLength: number
    peakHours: string[]
  }
  mastery: {
    topics: Record<string, {
      level: number
      lastPracticed: Date
      progress: number
    }>
    achievements: string[]
    streak: number
  }
}

export class AdvancedLearningEngine {
  private learningEvents: LearningEvent[] = []
  private patterns: Map<string, LearningPattern> = new Map()
  private userProfiles: Map<string, UserProfile> = new Map()

  /**
   * Lær fra event
   */
  async learnFromEvent(event: LearningEvent): Promise<void> {
    // Lagre event
    this.learningEvents.push(event)
    
    // Hold kun siste 10000 events
    if (this.learningEvents.length > 10000) {
      this.learningEvents.shift()
    }

    // Analyser event og ekstraher patterns
    const pattern = this.extractPattern(event)
    if (pattern) {
      this.updatePattern(pattern)
    }

    // Oppdater brukerprofil hvis relevant
    if (event.userId) {
      await this.updateUserProfile(event.userId, event)
    }

    // Lagre i database for persistens
    try {
      await this.saveLearningToDatabase(event)
    } catch (error) {
      console.error('Failed to save learning to database:', error)
    }
  }

  /**
   * Ekstraher pattern fra event
   */
  private extractPattern(event: LearningEvent): LearningPattern | null {
    let pattern = ''
    let outcome: 'positive' | 'negative' | 'neutral' = 'neutral'

    switch (event.type) {
      case 'error':
        pattern = `error:${JSON.stringify(event.data).substring(0, 100)}`
        outcome = 'negative'
        break

      case 'success':
        pattern = `success:${JSON.stringify(event.data).substring(0, 100)}`
        outcome = 'positive'
        break

      case 'feedback':
        const feedback = event.data as any
        pattern = `feedback:${feedback.type}:${feedback.rating || 'neutral'}`
        outcome = feedback.rating > 3 ? 'positive' : 'negative'
        break

      case 'interaction':
        const interaction = event.data as any
        pattern = `interaction:${interaction.intent || 'general'}`
        outcome = interaction.satisfied ? 'positive' : 'neutral'
        break

      default:
        return null
    }

    const existing = this.patterns.get(pattern)
    if (existing) {
      return {
        ...existing,
        frequency: existing.frequency + 1,
        outcome,
        lastSeen: new Date()
      }
    }

    return {
      pattern,
      frequency: 1,
      outcome,
      confidence: 0.5,
      lastSeen: new Date()
    }
  }

  /**
   * Oppdater pattern
   */
  private updatePattern(pattern: LearningPattern): void {
    // Øk confidence basert på frequency
    const confidenceIncrease = Math.min(pattern.frequency / 100, 0.5)
    pattern.confidence = Math.min(0.5 + confidenceIncrease, 1.0)

    this.patterns.set(pattern.pattern, pattern)
  }

  /**
   * Oppdater brukerprofil
   */
  private async updateUserProfile(userId: string, event: LearningEvent): Promise<void> {
    let profile = this.userProfiles.get(userId)
    
    if (!profile) {
      profile = {
        userId,
        preferences: {
          communicationStyle: 'detailed',
          favoriteTopics: [],
          skillLevel: 'beginner',
          timeOfDay: {}
        },
        behavior: {
          commonQuestions: [],
          preferredSolutions: [],
          averageSessionLength: 0,
          peakHours: []
        },
        mastery: {
          topics: {},
          achievements: [],
          streak: 0
        }
      }
    }

    // Oppdater basert på event-type
    if (event.type === 'interaction') {
      const interaction = event.data as any
      
      // Track common questions
      if (interaction.question) {
        if (!profile.behavior.commonQuestions.includes(interaction.question)) {
          profile.behavior.commonQuestions.push(interaction.question)
        }
      }

      // Track preferred solutions
      if (interaction.solution && interaction.satisfied) {
        if (!profile.behavior.preferredSolutions.includes(interaction.solution)) {
          profile.behavior.preferredSolutions.push(interaction.solution)
        }
      }

      // Update skill level
      if (interaction.complexity && interaction.completed) {
        if (interaction.complexity === 'high' && profile.preferences.skillLevel === 'beginner') {
          profile.preferences.skillLevel = 'intermediate'
        } else if (interaction.complexity === 'very-high' && profile.preferences.skillLevel === 'intermediate') {
          profile.preferences.skillLevel = 'advanced'
        }
      }
    }

    if (event.type === 'feedback') {
      const feedback = event.data as any
      
      // Learn communication style preference
      if (feedback.preferredStyle) {
        profile.preferences.communicationStyle = feedback.preferredStyle as any
      }

      // Track topics of interest
      if (feedback.topics) {
        feedback.topics.forEach((topic: string) => {
          if (!profile.preferences.favoriteTopics.includes(topic)) {
            profile.preferences.favoriteTopics.push(topic)
          }
        })
      }
    }

    // Update mastery
    if (event.type === 'success' && event.data.topic) {
      const topic = event.data.topic
      if (!profile.mastery.topics[topic]) {
        profile.mastery.topics[topic] = {
          level: 1,
          lastPracticed: new Date(),
          progress: 10
        }
      } else {
        profile.mastery.topics[topic].level += 1
        profile.mastery.topics[topic].lastPracticed = new Date()
        profile.mastery.topics[topic].progress = Math.min(
          profile.mastery.topics[topic].progress + 10,
          100
        )
      }
    }

    // Update streak
    const today = new Date().toDateString()
    const lastInteraction = event.timestamp.toDateString()
    if (lastInteraction === today) {
      profile.mastery.streak += 1
    }

    this.userProfiles.set(userId, profile)

    // Lagre i database
    try {
      await this.saveUserProfileToDatabase(profile)
    } catch (error) {
      console.error('Failed to save user profile:', error)
    }
  }

  /**
   * Hent brukerprofil
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Sjekk cache først
    let profile = this.userProfiles.get(userId)
    
    if (!profile) {
      // Last fra database
      const dbProfile = await this.loadUserProfileFromDatabase(userId)
      if (dbProfile) {
        profile = dbProfile
        this.userProfiles.set(userId, profile)
      }
    }

    return profile || null
  }

  /**
   * Forutsi brukerens behov
   */
  async predictUserNeeds(userId: string, context: any): Promise<string[]> {
    const profile = await this.getUserProfile(userId)
    
    if (!profile) {
      return []
    }

    const predictions: string[] = []

    // Basert på historikk
    if (profile.behavior.commonQuestions.length > 0) {
      const lastQuestion = profile.behavior.commonQuestions[profile.behavior.commonQuestions.length - 1]
      if (lastQuestion.includes('hvordan')) {
        predictions.push('Brukeren vil sannsynligvis spørre om relaterte emner')
      }
    }

    // Basert på tid på døgnet
    const hour = new Date().getHours()
    if (hour >= 9 && hour <= 17) {
      predictions.push('Brukeren er i arbeidsmodus - foreslå produktivitetsverktøy')
    } else if (hour >= 18 && hour <= 22) {
      predictions.push('Brukeren er i utforskningsmodus - foreslå læringsressurser')
    }

    // Basert på mastery
    const lowMasteryTopics = Object.entries(profile.mastery.topics)
      .filter(([_, data]) => data.progress < 50)
      .map(([topic, _]) => topic)
    
    if (lowMasteryTopics.length > 0) {
      predictions.push(`Brukeren kan trenge hjelp med: ${lowMasteryTopics.join(', ')}`)
    }

    return predictions
  }

  /**
   * Generer personlig tilpasset respons
   */
  async personalizeResponse(
    userId: string,
    baseResponse: string,
    context: any
  ): Promise<string> {
    const profile = await this.getUserProfile(userId)
    
    if (!profile) {
      return baseResponse
    }

    // Tilpass etter kommunikasjonsstil
    if (profile.preferences.communicationStyle === 'brief') {
      // Forkort respons
      const sentences = baseResponse.split('.').filter(s => s.trim())
      return sentences.slice(0, 2).join('. ') + '.'
    }

    if (profile.preferences.communicationStyle === 'step-by-step') {
      // Legg til nummererte steg
      const steps = baseResponse.split('\n').filter(s => s.trim())
      return steps.map((step, i) => `${i + 1}. ${step}`).join('\n')
    }

    if (profile.preferences.communicationStyle === 'visual') {
      // Legg til visuelle hints
      return `${baseResponse}\n\n💡 Vil du se dette visuelt? Jeg kan lage et diagram!`
    }

    return baseResponse
  }

  /**
   * Lagre learning til database
   */
  private async saveLearningToDatabase(event: LearningEvent): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: `nora.learn.${event.type}`,
          resource: 'nora-learning',
          meta: {
            ...event.data,
            timestamp: event.timestamp.toISOString(),
            userId: event.userId,
            context: event.context
          }
        }
      })
    } catch (error) {
      // Silent fail - logging shouldn't break learning
      console.error('Failed to save learning event:', error)
    }
  }

  /**
   * Lagre brukerprofil til database
   */
  private async saveUserProfileToDatabase(profile: UserProfile): Promise<void> {
    try {
      // Bruk SystemConfig for å lagre brukerprofiler
      await prisma.systemConfig.upsert({
        where: {
          key: `nora.user-profile.${profile.userId}`
        },
        update: {
          value: JSON.stringify(profile),
          updatedAt: new Date()
        },
        create: {
          key: `nora.user-profile.${profile.userId}`,
          value: JSON.stringify(profile)
        }
      })
    } catch (error) {
      console.error('Failed to save user profile:', error)
    }
  }

  /**
   * Last brukerprofil fra database
   */
  private async loadUserProfileFromDatabase(userId: string): Promise<UserProfile | null> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: {
          key: `nora.user-profile.${userId}`
        }
      })

      if (config && config.value) {
        return JSON.parse(config.value as string) as UserProfile
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }

    return null
  }

  /**
   * Hent lærings-statistikk
   */
  getLearningStats(): {
    totalEvents: number
    patterns: number
    users: number
    topPatterns: LearningPattern[]
  } {
    const topPatterns = Array.from(this.patterns.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)

    return {
      totalEvents: this.learningEvents.length,
      patterns: this.patterns.size,
      users: this.userProfiles.size,
      topPatterns
    }
  }
}

let advancedLearningEngine: AdvancedLearningEngine | null = null

export function getAdvancedLearningEngine(): AdvancedLearningEngine {
  if (!advancedLearningEngine) {
    advancedLearningEngine = new AdvancedLearningEngine()
  }
  return advancedLearningEngine
}

