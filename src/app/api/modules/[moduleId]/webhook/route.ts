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
 * API Route: /api/modules/[moduleId]/webhook
 * Setup, update, or delete webhook for module
 */

import { NextRequest, NextResponse } from 'next/server'
import { githubWebhookManager } from '@/modules/module-management/core/GitHubWebhookManager'
import { withLogging } from '@/lib/observability/withLogging'
import { prisma } from '@/lib/db/prisma'

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get('admin-token')?.value
  
  if (!token) {
    return null
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    })

    if (!user || user.status !== 'ACTIVE') {
      return null
    }

    return user
  } catch {
    return null
  }
}

export const POST = withLogging(async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Webhook setup requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    const module = await prisma.module.findUnique({
      where: { id: params.moduleId },
    })

    if (!module || !module.githubRepo) {
      return NextResponse.json(
        { error: 'Module not found or GitHub repo not configured' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const result = await githubWebhookManager.setupWebhook(
      params.moduleId,
      module.githubRepo,
      body
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to setup webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, webhookId: result.webhookId })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to setup webhook' },
      { status: 500 }
    )
  }
})

export const DELETE = withLogging(async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Forbidden - Only OWNER can delete webhooks' },
        { status: 403 }
      )
    }

    const webhook = await prisma.gitHubWebhook.findFirst({
      where: { moduleId: params.moduleId },
    })

    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      )
    }

    const result = await githubWebhookManager.deleteWebhook(webhook.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete webhook' },
      { status: 500 }
    )
  }
})

