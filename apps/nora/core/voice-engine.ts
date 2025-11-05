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
 * Nora Voice Engine
 * Speech-to-text and text-to-speech with user permission system
 */

import OpenAI from 'openai'

export interface VoicePermission {
  userId: string
  allowed: boolean
  expiresAt?: Date
  permissions: {
    speak: boolean
    listen: boolean
  }
}

export class VoiceEngine {
  private client: OpenAI
  private permissions: Map<string, VoicePermission> = new Map()

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required for Nora Voice Engine')
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  /**
   * Check if user has voice permission
   */
  async checkPermission(
    userId: string,
    action: 'speak' | 'listen'
  ): Promise<boolean> {
    const permission = this.permissions.get(userId)
    
    if (!permission || !permission.allowed) {
      return false
    }

    // Check expiration
    if (permission.expiresAt && permission.expiresAt < new Date()) {
      this.permissions.delete(userId)
      return false
    }

    return permission.permissions[action] || false
  }

  /**
   * Request voice permission from user
   */
  async requestPermission(
    userId: string,
    action: 'speak' | 'listen'
  ): Promise<{ granted: boolean; reason?: string }> {
    // In production, this would trigger a UI confirmation
    // For now, return pending state
    return {
      granted: false,
      reason: 'Permission request pending user approval'
    }
  }

  /**
   * Grant voice permission
   */
  grantPermission(
    userId: string,
    permissions: { speak?: boolean; listen?: boolean },
    expiresAt?: Date
  ): void {
    const existing = this.permissions.get(userId)
    
    this.permissions.set(userId, {
      userId,
      allowed: true,
      expiresAt,
      permissions: {
        speak: permissions.speak ?? existing?.permissions.speak ?? false,
        listen: permissions.listen ?? existing?.permissions.listen ?? false
      }
    })
  }

  /**
   * Revoke voice permission
   */
  revokePermission(userId: string): void {
    this.permissions.delete(userId)
  }

  /**
   * Speech-to-text (STT) using OpenAI Whisper
   */
  async speechToText(
    audioBuffer: Buffer,
    userId: string
  ): Promise<string> {
    // Check permission
    if (!(await this.checkPermission(userId, 'listen'))) {
      throw new Error('Voice permission denied. Please grant microphone access.')
    }

    try {
      // Convert buffer to File
      const audioArray = new Uint8Array(audioBuffer)
      const audioFile = new File(
        [audioArray],
        'voice-input.webm',
        { type: 'audio/webm' }
      )

      // Call OpenAI Whisper API
      const transcription = await this.client.audio.transcriptions.create({
        file: audioFile as any,
        model: 'whisper-1',
        language: 'no' // Norwegian
      })

      return transcription.text
    } catch (error: any) {
      console.error('Speech-to-text error:', error)
      throw new Error(`Failed to transcribe audio: ${error.message}`)
    }
  }

  /**
   * Text-to-speech (TTS)
   */
  async textToSpeech(
    text: string,
    userId: string
  ): Promise<Buffer> {
    // Check permission
    if (!(await this.checkPermission(userId, 'speak'))) {
      throw new Error('Voice permission denied. Please grant audio output access.')
    }

    try {
      // For now, use ElevenLabs (would need API key)
      // Or use browser's SpeechSynthesis API on client side
      
      // TODO: Implement ElevenLabs or similar TTS provider
      // For now, return empty buffer (client will use browser TTS)
      return Buffer.from('')
    } catch (error: any) {
      console.error('Text-to-speech error:', error)
      throw new Error(`Failed to generate speech: ${error.message}`)
    }
  }
}

// Singleton instance
let voiceEngine: VoiceEngine | null = null

export function getVoiceEngine(): VoiceEngine {
  if (!voiceEngine) {
    voiceEngine = new VoiceEngine()
  }
  return voiceEngine
}

