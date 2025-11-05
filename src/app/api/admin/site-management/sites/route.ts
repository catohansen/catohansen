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
 * Site Management - Get All Sites
 * Returns all sites (landing pages, modules, projects) managed from admin
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
// import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { audit } from '@/lib/audit/audit'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check authorization (simplified - will use proper policy engine later)
    // For now, allow all authenticated users
    // TODO: Implement proper policy check when PolicyEngine is ready

    // Define all sites managed from admin
    const sites = [
      {
        id: 'main-landing',
        name: 'Hoved Landing Side',
        url: '/',
        type: 'landing',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        modules: ['hero', 'expertise', 'solutions', 'portfolio', 'pricing', 'expertise-showcase', 'onboarding', 'contact']
      },
      {
        id: 'hansen-security',
        name: 'Hansen Security',
        url: '/hansen-security',
        type: 'module',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        modules: ['hero', 'features', 'security', 'comparison', 'demo', 'docs']
      },
      {
        id: 'hansen-crm',
        name: 'CRM 2.0',
        url: '/hansen-crm',
        type: 'module',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        modules: ['hero', 'features', 'ai-powered', 'integrations', 'pricing']
      },
      {
        id: 'mindmap',
        name: 'MindMap 2.0',
        url: '/hansen-mindmap-2.0',
        type: 'module',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        modules: ['hero', 'features', 'examples']
      },
      {
        id: 'pengeplan',
        name: 'Pengeplan 2.0',
        url: '/pengeplan-2.0',
        type: 'module',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        modules: ['hero', 'features', 'spleis']
      },
      {
        id: 'hansen-hub',
        name: 'Hansen Hub',
        url: '/hansen-hub',
        type: 'module',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        modules: ['hero', 'modules']
      },
      {
        id: 'hansen-auth',
        name: 'Hansen Auth',
        url: '/hansen-auth',
        type: 'module',
        status: 'draft',
        lastUpdated: new Date().toISOString(),
        modules: ['hero', 'features']
      }
    ]

    // Audit log
    await audit(request, {
      action: 'site_management_list',
      resource: 'site-management',
      meta: {
        count: sites.length,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        sites,
        total: sites.length,
        byType: {
          landing: sites.filter(s => s.type === 'landing').length,
          module: sites.filter(s => s.type === 'module').length,
          project: sites.filter(s => s.type === 'project').length,
        }
      }
    })
  } catch (error: any) {
    console.error('Site management error:', error)
    return NextResponse.json(
      { success: false, error: 'Kunne ikke hente sider' },
      { status: 500 }
    )
  }
}

