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
 * API Route: /api/modules/onboarding/setup
 * Complete module registration from onboarding wizard
 */

import { NextRequest, NextResponse } from 'next/server'
import { moduleManager } from '@/modules/module-management/core/ModuleManager'
import { moduleValidator } from '@/modules/module-management/core/ModuleValidator'
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

export const POST = withLogging(async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Module registration requires OWNER or ADMIN role' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { moduleInfo, moduleName } = body

    // Final validation
    const validation = await moduleValidator.validateModule(moduleInfo, moduleName)
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          validation,
        },
        { status: 400 }
      )
    }

    // Extract module name
    const name = moduleInfo.id || moduleInfo.name || moduleName
    if (!name) {
      return NextResponse.json(
        { error: 'Module name is required' },
        { status: 400 }
      )
    }

    // Register module
    const registerResult = await moduleManager.registerModule(name)

    if (!registerResult.success || !registerResult.moduleId) {
      return NextResponse.json(
        { error: registerResult.error || 'Failed to register module' },
        { status: 500 }
      )
    }

    // Setup webhook if GitHub repo is provided
    let webhookId: string | undefined
    if (moduleInfo.repository?.url) {
      const module = await prisma.module.findUnique({
        where: { id: registerResult.moduleId },
      })

      if (module?.githubRepo) {
        // Build webhook URL
        const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/api/webhooks/github`
        
        const webhookResult = await githubWebhookManager.setupWebhook(
          registerResult.moduleId,
          module.githubRepo,
          {
            url: webhookUrl,
            active: true,
            events: ['push', 'release', 'pull_request'],
          }
        )

        if (webhookResult.success) {
          webhookId = webhookResult.webhookId
        }
      }
    }

    // Trigger initial sync if autoSync is enabled
    if (moduleInfo.autoSync !== false) {
      // Queue sync job
      await prisma.job.create({
        data: {
          type: 'module-sync',
          payload: {
            moduleId: registerResult.moduleId,
            direction: 'to-github',
            reason: 'onboarding-initial-sync',
          },
          status: 'PENDING',
          maxAttempts: 3,
        },
      })
    }

    return NextResponse.json({
      success: true,
      moduleId: registerResult.moduleId,
      webhookId,
      message: 'Module registered successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to setup module' },
      { status: 500 }
    )
  }
})

