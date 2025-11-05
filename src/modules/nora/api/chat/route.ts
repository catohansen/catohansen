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
 * Nora Chat Streaming API
 * Edge Runtime optimized - chunked text streaming (SSE-compatible)
 * Supports persona switching and real-time streaming
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSystemOrchestrator } from '../../core/system-orchestrator'
import { audit } from '@/lib/audit/audit'
import { prisma } from '@/lib/db/prisma'
import { getAgentRouter } from '../../core/agent-router'

// Note: Cannot use Edge Runtime due to Prisma usage
// Edge Runtime does not support Node.js APIs like Prisma
export const dynamic = 'force-dynamic'

const schema = z.object({
  message: z.string().min(1).max(2000),
  pageContext: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
  userId: z.string().optional(),
  moduleContext: z.array(z.string()).optional(),
  persona: z.enum(['coach', 'dev', 'marketer', 'system-architect', 'general']).optional(),
  stream: z.boolean().optional().default(true),
})

const NORA_SYSTEM_PROMPT = `Du er Nora — systemets maskot og kjerneintelligens for Hansen Global.

Snakk kort, konkret og vennlig. Svar på norsk når brukeren er norsk.

Du kan skifte persona (coach/dev/marketing/system-architect) ved behov.

Når du forklarer kode/arkitektur, vær presis og handlingsorientert.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return new Response('Invalid input', { status: 400 })
    }

    const { 
      message, 
      pageContext, 
      conversationHistory, 
      userId, 
      moduleContext,
      persona,
      stream: shouldStream
    } = parsed.data

    // Get Nora config from database
    let noraConfig: any = null
    try {
      const configData = await prisma.systemConfig.findFirst({
        where: { key: 'nora.config' }
      })
      if (configData && configData.value) {
        noraConfig = JSON.parse(configData.value as string)
      }
    } catch (e) {
      console.error('Failed to load Nora config:', e)
    }

    // Get API keys from config or environment
    const apiConfig = noraConfig?.api || {}
    const provider = apiConfig.provider || process.env.NORA_AI_PROVIDER || 'google'
    const googleApiKey = apiConfig.googleApiKey || process.env.GOOGLE_AI_API_KEY || 'AIzaSyDeGb3_T1_YmvnU0P0f81EEwd-bUFGPJ5A'
    const openaiApiKey = apiConfig.openaiApiKey || process.env.OPENAI_API_KEY
    const googleModel = apiConfig.googleModel || process.env.GOOGLE_AI_MODEL || 'models/gemini-2.0-flash'

    // Determine active persona
    const router = getAgentRouter()
    const activePersona = persona || router.route(message, { pageContext, moduleContext })
    const agent = router.getAgent(activePersona)

    // Build context
    const context = {
      userId,
      pageContext,
      conversationHistory,
      moduleContext,
      systemKnowledge: `Aktiv persona: ${agent.name} — ${agent.description}`
    }

    // Reinitialize orchestrator with config
    const orchestrator = getSystemOrchestrator({
      provider: provider as 'openai' | 'google',
      openaiApiKey,
      googleApiKey,
      googleModel
    })

    const encoder = new TextEncoder()

    // Streaming response
    if (shouldStream) {
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Process message
            const response = await orchestrator.processMessage(message, context)

            // Stream content word by word for smooth UX
            const words = response.content.split(' ')
            for (let i = 0; i < words.length; i++) {
              const chunk = (i > 0 ? ' ' : '') + words[i]
              controller.enqueue(encoder.encode(chunk))
              // Small delay for streaming effect (30ms per word)
              await new Promise(resolve => setTimeout(resolve, 30))
            }

            // Close stream
            controller.close()

            // Audit log (async, non-blocking)
            audit(request, {
              action: 'nora.chat',
              resource: 'nora',
              meta: {
                message: message.substring(0, 100),
                pageContext,
                userId,
                responseLength: response.content.length,
                persona: activePersona,
                streamed: true
              }
            }).catch(console.error)
          } catch (error: any) {
            const errorMsg = `⚠️ En feil oppstod i Nora chat. Prøv igjen om litt.\n\nDetaljer: ${error.message || 'Ukjent feil'}`
            const errorChunks = errorMsg.split('')
            for (const chunk of errorChunks) {
              controller.enqueue(encoder.encode(chunk))
              await new Promise(resolve => setTimeout(resolve, 20))
            }
            controller.close()
          }
        }
      })

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        },
      })
    }

    // Non-streaming response (fallback)
    const response = await orchestrator.processMessage(message, context)

    // Audit log
    await audit(request, {
      action: 'nora.chat',
      resource: 'nora',
      meta: {
        message: message.substring(0, 100),
        pageContext,
        userId,
        responseLength: response.content.length,
        persona: activePersona
      }
    })

    return new Response(JSON.stringify({
      success: true,
      response: response.content,
      suggestions: response.suggestions,
      actions: response.actions,
      metadata: { ...response.metadata, persona: activePersona }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('Nora chat error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to process message'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
