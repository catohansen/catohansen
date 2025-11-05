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
 * Nora Configuration API Route
 * Get and update Nora configuration
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { prisma } from '@/lib/db/prisma'
import { audit } from '@/lib/audit/audit'
import { z } from 'zod'

const configSchema = z.object({
  enabled: z.boolean(),
  api: z.object({
    provider: z.enum(['openai', 'google']),
    googleApiKey: z.string(),
    googleModel: z.string(),
    openaiApiKey: z.string(),
    openaiModel: z.string(),
  }),
  services: z.object({
    chat: z.boolean(),
    voice: z.boolean(),
    automation: z.boolean(),
    logging: z.boolean(),
    systemCreation: z.boolean(),
  }),
  pages: z.object({
    landing: z.boolean(),
    admin: z.boolean(),
    modules: z.boolean(),
    knowledgeBase: z.boolean(),
    all: z.boolean(),
  }),
  chatBubbles: z.object({
    landing: z.boolean(),
    admin: z.boolean(),
    modules: z.boolean(),
    knowledgeBase: z.boolean(),
    crm: z.boolean(),
    security: z.boolean(),
    mindmap: z.boolean(),
    position: z.enum(['bottom-right', 'bottom-left']),
  }),
  integrations: z.object({
    hansenSecurity: z.boolean(),
    userManagement: z.boolean(),
    clientManagement: z.boolean(),
    aiAgents: z.boolean(),
    contentManagement: z.boolean(),
    projectManagement: z.boolean(),
    billingSystem: z.boolean(),
    analytics: z.boolean(),
  }),
  personality: z.object({
    tone: z.string(),
    language: z.string(),
    responseStyle: z.string(),
  }),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check permission
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'admin',
      id: 'nora-config',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')
    if (!hasAccess.allowed) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get config from database or use default
    const configData = await prisma.systemConfig.findFirst({
      where: { key: 'nora.config' }
    })

    let config: any = {
      enabled: true,
      api: {
        provider: 'google',
        googleApiKey: process.env.GOOGLE_AI_API_KEY || 'AIzaSyDeGb3_T1_YmvnU0P0f81EEwd-bUFGPJ5A',
        googleModel: 'models/gemini-1.5-flash',
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        openaiModel: 'gpt-4-turbo-preview',
      },
      services: {
        chat: true,
        voice: true,
        automation: true,
        logging: true,
        systemCreation: true,
      },
      pages: {
        landing: true,
        admin: true,
        modules: true,
        knowledgeBase: true,
        all: true,
      },
      chatBubbles: {
        landing: true,
        admin: true,
        modules: true,
        knowledgeBase: true,
        crm: true,
        security: true,
        mindmap: true,
        position: 'bottom-right',
      },
      integrations: {
        hansenSecurity: true,
        userManagement: true,
        clientManagement: true,
        aiAgents: true,
        contentManagement: true,
        projectManagement: true,
        billingSystem: true,
        analytics: true,
      },
      personality: {
        tone: 'calm, wise, friendly, analytical, sharp',
        language: 'Norwegian Bokmål',
        responseStyle: 'helpful, detailed, context-aware'
      }
    }

    if (configData && configData.value) {
      try {
        config = JSON.parse(configData.value as string)
      } catch (e) {
        console.error('Failed to parse config:', e)
      }
    }

    return NextResponse.json({
      success: true,
      config
    })
  } catch (error: any) {
    console.error('Get Nora config error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get config' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check permission
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'admin',
      id: 'nora-config',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'write')
    if (!hasAccess.allowed) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = configSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid config format' },
        { status: 400 }
      )
    }

    const config = parsed.data

    // Save to database
    await prisma.systemConfig.upsert({
      where: { key: 'nora.config' },
      update: {
        value: JSON.stringify(config),
        updatedAt: new Date()
      },
      create: {
        key: 'nora.config',
        value: JSON.stringify(config)
      }
    })

    await audit(request, {
      action: 'admin.nora.config.update',
      resource: 'nora',
      meta: {
        enabled: config.enabled,
        userId: user.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Config updated successfully'
    })
  } catch (error: any) {
    console.error('Update Nora config error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update config' },
      { status: 500 }
    )
  }
}

