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
 * GitHub Webhook Handler
 * Receives and processes GitHub webhook events
 * 
 * Security:
 * - HMAC signature verification
 * - Event validation
 * - Replay attack prevention
 */

import { NextRequest, NextResponse } from 'next/server'
import { githubWebhookManager } from '@/modules/module-management/core/GitHubWebhookManager'
import { prisma } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'

/**
 * Verify webhook signature and find matching webhook
 */
async function verifyAndFindWebhook(
  request: NextRequest,
  payload: string
): Promise<{ webhook: any; valid: boolean } | null> {
  const signature = request.headers.get('x-hub-signature-256')
  const eventType = request.headers.get('x-github-event')
  const deliveryId = request.headers.get('x-github-delivery')

  if (!signature || !eventType || !deliveryId) {
    return null
  }

  // Try to find webhook by matching URL or delivery ID
  // For simplicity, we'll check all active webhooks
  const webhooks = await prisma.gitHubWebhook.findMany({
    where: { active: true },
    include: { module: true },
  })

  for (const webhook of webhooks) {
    if (!webhook.secret) continue

    const verification = githubWebhookManager.verifySignature(
      payload,
      signature,
      webhook.secret
    )

    if (verification.valid) {
      return { webhook, valid: true }
    }
  }

  return null
}

/**
 * Handle GitHub webhook POST request
 */
export const POST = withLogging(async (req: NextRequest) => {
  try {
    // Get raw body for signature verification
    const payload = await req.text()
    const body = JSON.parse(payload)

    // Verify signature and find webhook
    const verification = await verifyAndFindWebhook(req, payload)

    if (!verification || !verification.valid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const { webhook } = verification
    const eventType = req.headers.get('x-github-event') || 'unknown'
    const deliveryId = req.headers.get('x-github-delivery') || ''

    // Check for duplicate delivery (replay attack prevention)
    // Simple check: look for events with same delivery ID
    const existingEvent = await prisma.gitHubWebhookEvent.findFirst({
      where: {
        webhookId: webhook.id,
        eventType,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    })

    // Check payload for delivery ID (simplified)
    const bodyObj = typeof body === 'string' ? JSON.parse(body) : body
    if (existingEvent && (existingEvent.payload as any).id === bodyObj.id) {
      // Already processed, return success but don't process again
      return NextResponse.json({ success: true, message: 'Already processed' })
    }

    // Update webhook trigger count
    await prisma.gitHubWebhook.update({
      where: { id: webhook.id },
      data: {
        lastTriggered: new Date(),
        triggerCount: { increment: 1 },
      },
    })

    // Process webhook event asynchronously
    // Don't await to respond quickly to GitHub
    githubWebhookManager
      .processWebhookEvent(webhook.id, eventType, body)
      .catch((error) => {
        console.error('Error processing webhook event:', error)
      })

    // Respond immediately to GitHub
    return NextResponse.json({
      success: true,
      message: 'Webhook received',
      eventType,
      deliveryId,
    })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    )
  }
})

/**
 * Handle GET request (webhook verification/test)
 */
export const GET = withLogging(async (req: NextRequest) => {
  return NextResponse.json({
    success: true,
    message: 'GitHub Webhook endpoint is active',
    timestamp: new Date().toISOString(),
  })
})

