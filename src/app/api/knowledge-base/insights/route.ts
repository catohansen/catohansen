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
 * Knowledge Base Insights API Route
 * Generate system insights based on analysis
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'
import { audit } from '@/lib/audit/audit'

async function insightsHandler(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userId] = decoded.split(':')

    // Get user from database
    const prisma = await getPrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization
    const principal = {
      id: user.id,
      roles: [user.role],
      attributes: { email: user.email }
    }

    const resource = {
      kind: 'knowledge-base',
      id: 'insights',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Analyze system and generate insights
    // This is a simplified version - can be enhanced with AI analysis later
    const [totalProjects, activeProjects, totalClients, totalDocuments, auditLogsCount] = await Promise.all([
      prisma.project.count().catch(() => 0),
      prisma.project.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
      prisma.client.count().catch(() => 0),
      prisma.knowledgeDocument.count().catch(() => 0),
      prisma.auditLog.count().catch(() => 0)
    ])

    // Generate insights based on system analysis
    const insights = []

    // Performance insights
    if (totalProjects > 50 && activeProjects < totalProjects * 0.3) {
      insights.push({
        id: '1',
        category: 'performance',
        title: 'Project Management Optimization',
        description: `${totalProjects - activeProjects} prosjekter er arkivert eller på hold. Vurder å rydde opp i arkiverte prosjekter for bedre oversikt.`,
        impact: 'medium',
        priority: 6,
        suggestions: [
          'Arkiver gamle prosjekter systematisk',
          'Bruk tags for bedre organisering',
          'Implementer automatisk arkivering etter inaktivitet'
        ],
        status: 'pending'
      })
    }

    // Security insights
    if (auditLogsCount > 1000) {
      insights.push({
        id: '2',
        category: 'security',
        title: 'Audit Log Management',
        description: 'Systemet har generert mange audit logs. Vurder å implementere log rotation og arkivering.',
        impact: 'high',
        priority: 7,
        suggestions: [
          'Implementer log rotation policy',
          'Arkiver gamle logs til kald lagring',
          'Monitorer log volum for anomalier'
        ],
        status: 'pending'
      })
    }

    // Code quality insights
    insights.push({
      id: '3',
      category: 'code-quality',
      title: 'TypeScript Strict Mode',
      description: 'Prosjektet bruker ikke TypeScript strict mode. Anbefaler å aktivere for bedre type-sikkerhet.',
      impact: 'medium',
      priority: 7,
      suggestions: [
        'Aktiver strict mode i tsconfig.json',
        'Fikse alle type errors',
        'Legg til støtte for noUncheckedIndexedAccess'
      ],
      status: 'pending'
    })

    // Best practices insights
    if (totalDocuments === 0) {
      insights.push({
        id: '4',
        category: 'best-practice',
        title: 'Knowledge Base Setup',
        description: 'Knowledge Base er tom. Start med å importere dokumentasjon og kode-eksempler.',
        impact: 'high',
        priority: 8,
        suggestions: [
          'Importer eksisterende dokumentasjon',
          'Legg til kode-eksempler',
          'Sett opp automatisk ingestion'
        ],
        status: 'pending'
      })
    }

    // Audit log
    await audit(request, {
      action: 'kb.insights.generate',
      resource: 'knowledge-base',
      meta: {
        insightsCount: insights.length
      }
    })

    return NextResponse.json({
      success: true,
      insights
    })
  } catch (error) {
    console.error('Knowledge Base insights error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(insightsHandler)



