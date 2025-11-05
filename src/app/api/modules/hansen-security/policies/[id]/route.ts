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
 * Policy by ID API Route
 * 
 * GET /api/modules/hansen-security/policies/[id] - Get policy
 * PUT /api/modules/hansen-security/policies/[id] - Update policy
 * DELETE /api/modules/hansen-security/policies/[id] - Delete policy
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/db/prisma'
import { policyValidator } from '@/modules/security2/core/PolicyValidator'
import { policyCompiler } from '@/modules/security2/core/PolicyCompiler'
import { withLogging } from '@/lib/observability/withLogging'

async function getPolicy(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = await getPrismaClient()
    const policy = await prisma.policy.findUnique({
      where: { id: params.id },
      include: {
        versions: {
          orderBy: { version: 'desc' }
        }
      }
    }).catch(() => null)

    if (!policy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: policy.id,
        name: policy.name,
        resource: policy.resource,
        version: policy.version,
        rules: policy.rules,
        compiled: policy.compiled,
        active: policy.active,
        metadata: policy.metadata,
        versions: policy.versions,
        createdAt: policy.createdAt,
        updatedAt: policy.updatedAt
      }
    })
  } catch (error) {
    console.error('Get policy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updatePolicy(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rules, name, active, metadata } = body

    const prisma = await getPrismaClient()

    // Get existing policy
    const existing = await prisma.policy.findUnique({
      where: { id: params.id }
    }).catch(() => null)

    if (!existing) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      )
    }

    // Validate rules if provided
    if (rules) {
      const rulesArray = Array.isArray(rules) ? rules : [rules]
      const validation = policyValidator.validateMany(rulesArray)

      if (!validation.valid) {
        return NextResponse.json(
          {
            error: 'Policy validation failed',
            details: validation.errors
          },
          { status: 400 }
        )
      }
    }

    // Update policy
    const updated = await prisma.policy.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(rules && { rules: Array.isArray(rules) ? rules : [rules], compiled: false }),
        ...(active !== undefined && { active }),
        ...(metadata && { metadata })
      }
    }).catch(() => {
      throw new Error('Failed to update policy')
    })

    // Recompile if rules changed
    if (rules) {
      const tenantId = updated.tenantId || 'default'
      const rulesArray = Array.isArray(rules) ? rules : [rules]
      policyCompiler.compilePolicies(tenantId, rulesArray)

      // Mark as compiled
      await prisma.policy.update({
        where: { id: params.id },
        data: { compiled: true }
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        resource: updated.resource,
        version: updated.version,
        rules: updated.rules,
        compiled: updated.compiled,
        active: updated.active,
        updatedAt: updated.updatedAt
      }
    })
  } catch (error: any) {
    console.error('Update policy error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function deletePolicy(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = await getPrismaClient()

    // Delete policy (cascade will delete versions)
    await prisma.policy.delete({
      where: { id: params.id }
    }).catch(() => {
      throw new Error('Failed to delete policy')
    })

    // Clear cache
    const existing = await prisma.policy.findUnique({
      where: { id: params.id }
    }).catch(() => null)

    if (existing) {
      policyCompiler.clearCache(existing.tenantId || 'default', existing.resource)
    }

    return NextResponse.json({
      success: true,
      message: 'Policy deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete policy error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getPolicy)
export const PUT = withLogging(updatePolicy)
export const DELETE = withLogging(deletePolicy)







