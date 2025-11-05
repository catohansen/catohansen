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
 * Nora Voice API Route
 * Handles voice input/output with permission checks
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSystemOrchestrator } from '../../core/system-orchestrator'
import { audit } from '@/lib/audit/audit'

const schema = z.object({
  action: z.enum(['speech-to-text', 'text-to-speech', 'request-permission', 'check-permission']),
  userId: z.string(),
  audio: z.string().optional(), // Base64 encoded audio for STT
  text: z.string().optional(), // Text for TTS
  permissionType: z.enum(['speak', 'listen']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      )
    }

    const { action, userId, audio, text, permissionType } = parsed.data

    const orchestrator = getSystemOrchestrator()

    switch (action) {
      case 'speech-to-text':
        if (!audio) {
          return NextResponse.json(
            { success: false, error: 'Audio data required' },
            { status: 400 }
          )
        }

        // Check permission
        const hasListenPermission = await orchestrator.checkVoicePermission(userId, 'listen')
        if (!hasListenPermission) {
          return NextResponse.json(
            { success: false, error: 'Voice permission denied', needsPermission: true },
            { status: 403 }
          )
        }

        // Convert base64 to buffer
        const audioBuffer = Buffer.from(audio, 'base64')
        const transcribed = await orchestrator.processVoiceInput(audioBuffer, userId)

        await audit(request, {
          action: 'nora.voice.stt',
          resource: 'nora',
          meta: { userId }
        })

        return NextResponse.json({
          success: true,
          text: transcribed
        })

      case 'text-to-speech':
        if (!text) {
          return NextResponse.json(
            { success: false, error: 'Text required' },
            { status: 400 }
          )
        }

        // Check permission
        const hasSpeakPermission = await orchestrator.checkVoicePermission(userId, 'speak')
        if (!hasSpeakPermission) {
          return NextResponse.json(
            { success: false, error: 'Voice permission denied', needsPermission: true },
            { status: 403 }
          )
        }

        // For now, return text (client will use browser TTS)
        // TODO: Implement server-side TTS

        await audit(request, {
          action: 'nora.voice.tts',
          resource: 'nora',
          meta: { userId, textLength: text.length }
        })

        return NextResponse.json({
          success: true,
          // audio: base64 encoded audio would go here
          text // Client-side TTS for now
        })

      case 'request-permission':
        if (!permissionType) {
          return NextResponse.json(
            { success: false, error: 'Permission type required' },
            { status: 400 }
          )
        }

        const permissionRequest = await orchestrator.requestVoicePermission(userId, permissionType)

        return NextResponse.json({
          success: true,
          ...permissionRequest
        })

      case 'check-permission':
        if (!permissionType) {
          return NextResponse.json(
            { success: false, error: 'Permission type required' },
            { status: 400 }
          )
        }

        const hasPermission = await orchestrator.checkVoicePermission(userId, permissionType)

        return NextResponse.json({
          success: true,
          hasPermission
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Nora voice error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process voice request' },
      { status: 500 }
    )
  }
}

