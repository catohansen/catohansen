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
 * Policies API Route
 * CRUD operations for policies
 * 
 * GET /api/modules/hansen-security/policies - List policies
 * POST /api/modules/hansen-security/policies - Create policy
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/db/prisma'
import { policyValidator } from '@/modules/security2/core/PolicyValidator'
import { policyCompiler } from '@/modules/security2/core/PolicyCompiler'
import { withLogging } from '@/lib/observability/withLogging'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import type { PolicyRule } from '@/modules/security2/core/PolicyEngine'

async function getPolicies(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get tenant from query or default
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || 'default'
    const resource = searchParams.get('resource')

    const prisma = await getPrismaClient()

    // Build query
    const where: any = {
      tenantId: tenantId === 'default' ? null : tenantId,
      active: true
    }

    if (resource) {
      where.resource = resource
    }

    // Fetch policies from database
    const policies = await prisma.policy.findMany({
      where,
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    }).catch(() => [])

    return NextResponse.json({
      success: true,
      data: policies.map((p: any) => ({
        id: p.id,
        name: p.name,
        resource: p.resource,
        version: p.version,
        rules: p.rules,
        active: p.active,
        metadata: p.metadata,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
    })
  } catch (error) {
    console.error('Get policies error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createPolicy(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, resource, rules, tenantId = 'default', metadata } = body

    // Validate input
    if (!name || !resource || !rules) {
      return NextResponse.json(
        { error: 'Missing required fields: name, resource, rules' },
        { status: 400 }
      )
    }

    // Validate rules
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

    // Check for conflicts
    const conflictCheck = policyValidator.validatePolicySet(rulesArray)
    if (conflictCheck.warnings.length > 0) {
      // Warn but allow
      console.warn('Policy conflicts detected:', conflictCheck.warnings)
    }

    const prisma = await getPrismaClient()

    // Create policy in database
    const policy = await prisma.policy.create({
      data: {
        name,
        resource,
        version: 1,
        rules: rulesArray,
        compiled: false,
        active: true,
        tenantId: tenantId === 'default' ? null : tenantId,
        metadata: metadata || {}
      }
    }).catch(() => {
      throw new Error('Failed to create policy in database')
    })

    // Compile policy
    const compiled = policyCompiler.compilePolicies(tenantId, rulesArray)

    // Update policy as compiled
    await prisma.policy.update({
      where: { id: policy.id },
      data: { compiled: true }
    }).catch(() => {
      // Continue even if update fails
    })

    // Reload policies in engine (optional, for hot reload)
    // await policyEngine.loadPolicies(rulesArray)

    return NextResponse.json({
      success: true,
      data: {
        id: policy.id,
        name: policy.name,
        resource: policy.resource,
        version: policy.version,
        rules: policy.rules,
        compiled: true,
        active: policy.active,
        createdAt: policy.createdAt
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create policy error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getPolicies)
export const POST = withLogging(createPolicy)

