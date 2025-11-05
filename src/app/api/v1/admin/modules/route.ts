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
 * Admin Modules API - v1
 * 
 * GET /api/v1/admin/modules - Get all modules
 * PATCH /api/v1/admin/modules - Toggle module active status
 * PUT /api/v1/admin/modules - Update module metadata
 */

import { NextRequest, NextResponse } from 'next/server'
import { getModules, toggleModule, updateModule } from '@/lib/modules/modules.service'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/logger'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { SecuritySettingsManager } from '@/modules/security2/core/SecuritySettings'

/**
 * Check if user is authenticated and has admin access
 */
async function checkAdminAccess(request: NextRequest) {
  try {
    // DEVELOPMENT MODE: Bypass if security is disabled
    const settings = await SecuritySettingsManager.getSettings()
    if (!settings.securityEnabled && process.env.NODE_ENV === 'development') {
      // Return mock admin user for development
      logger.info('Development mode: Bypassing admin access check')
      return {
        authorized: true,
        user: { id: 'dev-user', email: 'dev@local', role: 'OWNER' },
        error: null
      }
    }

    // Check authentication
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return { authorized: false, user: null, error: 'Unauthorized - No token' }
    }

    // Decode token (in production, verify JWT)
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userId] = decoded.split(':')

    // Get user from database - Only select needed fields for performance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return { authorized: false, user: null, error: 'Unauthorized - User not found' }
    }

    // Check authorization with Security 2.0
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'admin',
      id: 'modules',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'manage')

    if (!hasAccess.allowed) {
      // Audit log denied access
      await auditLogger.logDecision({
        principalId: user.id,
        principalRoles: [user.role],
        resource: 'admin',
        resourceId: 'modules',
        action: 'manage',
        decision: 'DENY',
        effect: 'DENY',
        reason: hasAccess.reason || 'Access denied by Security 2.0 policy',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      return { authorized: false, user, error: 'Forbidden - Access denied' }
    }

    return { authorized: true, user, error: null }
  } catch (error) {
    logger.error('Admin access check failed', { endpoint: '/api/v1/admin/modules' }, error as Error)
    return { authorized: false, user: null, error: 'Internal server error' }
  }
}

/**
 * GET - Get all modules
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await checkAdminAccess(req)
    
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: auth.error?.includes('Forbidden') ? 403 : 401 }
      )
    }

    const modules = await getModules()

    const response = NextResponse.json({
      success: true,
      modules,
      count: modules.length
    })
    
    // Cache headers for performance
    // Public cache for 1 minute, stale-while-revalidate for 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=300')
    
    return response
  } catch (error) {
    logger.error('Failed to get modules', { endpoint: '/api/v1/admin/modules' }, error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH - Toggle module active status
 */
export async function PATCH(req: NextRequest) {
  try {
    const auth = await checkAdminAccess(req)
    
    if (!auth.authorized || !auth.user) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: auth.error?.includes('Forbidden') ? 403 : 401 }
      )
    }

    const body = await req.json()
    const { id, active } = body

    if (!id || typeof active !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: id, active' },
        { status: 400 }
      )
    }

    let updated: any[]
    try {
      updated = await toggleModule(id, active)
    } catch (error: any) {
      logger.error('Failed to toggle module', { moduleId: id, active }, error as Error)
      return NextResponse.json(
        { error: error.message || 'Failed to toggle module' },
        { status: 500 }
      )
    }

    // Audit log
    await auditLogger.logDecision({
      principalId: auth.user.id,
      principalRoles: [auth.user.role],
      resource: 'module',
      resourceId: id,
      action: active ? 'activate' : 'deactivate',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: `Module ${id} ${active ? 'activated' : 'deactivated'}`,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    // Clear cache after update
    const { clearModulesCache } = await import('@/lib/modules/modules.service')
    clearModulesCache()
    
    const response = NextResponse.json({
      success: true,
      modules: updated,
      message: `Module ${id} ${active ? 'activated' : 'deactivated'}`
    })
    
    // No cache for write operations
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    
    return response
  } catch (error: any) {
    logger.error('Failed to toggle module', { endpoint: '/api/v1/admin/modules' }, error as Error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Update module metadata
 */
export async function PUT(req: NextRequest) {
  try {
    const auth = await checkAdminAccess(req)
    
    if (!auth.authorized || !auth.user) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: auth.error?.includes('Forbidden') ? 403 : 401 }
      )
    }

    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      )
    }

    let updated: any[]
    try {
      updated = await updateModule(id, updates)
    } catch (error: any) {
      logger.error('Failed to update module', { moduleId: id, updates }, error as Error)
      return NextResponse.json(
        { error: error.message || 'Failed to update module' },
        { status: 500 }
      )
    }

    // Audit log
    await auditLogger.logDecision({
      principalId: auth.user.id,
      principalRoles: [auth.user.role],
      resource: 'module',
      resourceId: id,
      action: 'update',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: `Module ${id} updated`,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    // Clear cache after update
    const { clearModulesCache } = await import('@/lib/modules/modules.service')
    clearModulesCache()
    
    const response = NextResponse.json({
      success: true,
      modules: updated,
      message: `Module ${id} updated`
    })
    
    // No cache for write operations
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    
    return response
  } catch (error: any) {
    logger.error('Failed to update module', { endpoint: '/api/v1/admin/modules' }, error as Error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

