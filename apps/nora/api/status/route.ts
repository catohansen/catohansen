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
 * Nora System Status API
 * Returns system health, version, heartbeat, and active persona
 */

// Note: Cannot use Edge Runtime due to self-fetch and potential Prisma usage
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const heartbeat = new Date().toISOString()
    
    // Get Nora config if available
    let activePersona = 'General Nora'
    let systemHealth = 'healthy'
    
    try {
      // Try to get active persona from database directly
      // Use Prisma instead of self-fetch to avoid Edge Runtime issues
      const { prisma } = await import('@/lib/db/prisma')
      // @ts-ignore - SystemConfig exists in schema but TypeScript may not have updated
      const configData = await prisma.systemConfig.findFirst({
        where: { key: 'nora.config' }
      })
      if (configData && configData.value) {
        const noraConfig = JSON.parse(configData.value as string)
        activePersona = noraConfig.personality?.tone || noraConfig.persona || 'General Nora'
      }
    } catch (e) {
      // Silent fail - use defaults (don't log in production to avoid noise)
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load Nora config:', e)
      }
    }

    const status = {
      system: 'Nora Core',
      version: '2.0.1',
      environment: process.env.NODE_ENV || 'development',
      active_persona: activePersona,
      health: systemHealth,
      heartbeat: heartbeat,
      timestamp: heartbeat,
      features: {
        magicEngine: true,
        multiModalIntelligence: true,
        universalSystemController: true,
        advancedLearning: true,
        proactiveProblemSolver: true,
        creativeSolutions: true
      },
      uptime: 'edge-runtime', // Edge Runtime doesn't support process.uptime()
      copyright: '© 2025 Cato Hansen. All rights reserved.',
      programmer: 'Cato Hansen',
      website: 'www.catohansen.no'
    }

    return new Response(JSON.stringify(status, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Nora-Version': '2.0.1',
        'X-Nora-Status': systemHealth
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({
      error: 'Failed to get system status',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  }
}

