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
 * API Route: /api/modules/public
 * Public Module API
 * Returns modules for public display (Hansen Hub)
 * No authentication required - public info only
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  try {
    // Fetch all modules (public info only)
    const modules = await prisma.module.findMany({
      select: {
        id: true,
        name: true,
        displayName: true,
        description: true,
        version: true,
        category: true,
        status: true,
        githubUrl: true,
        npmPackage: true,
        githubStats: true,
        npmStats: true,
        // Don't expose sensitive info like tokens, secrets, etc.
      },
      where: {
        // Only show published/non-archived modules
        OR: [
          { status: { not: 'ARCHIVED' } },
          { status: null }, // Include modules without status
        ],
      },
      orderBy: {
        displayName: 'asc',
      },
    })

    // Map to icon names based on module name/category
    const iconMap: Record<string, string> = {
      'hansen-security': 'Shield',
      'hansen-auth': 'Lock',
      'user-management': 'Users',
      'ai-agents': 'Brain',
      'content-management': 'FileText',
      'client-management': 'Briefcase',
      'project-management': 'FolderKanban',
      'billing-system': 'CreditCard',
      analytics: 'BarChart3',
      'module-management': 'Package',
    }

    // Map to color based on category
    const colorMap: Record<string, string> = {
      Security: 'from-red-500 to-orange-500',
      'AI & Automation': 'from-purple-500 to-pink-500',
      Content: 'from-green-500 to-emerald-500',
      Business: 'from-indigo-500 to-purple-500',
      Analytics: 'from-teal-500 to-cyan-500',
      Other: 'from-gray-500 to-gray-600',
    }

    // Transform to Hansen Hub format
    const transformedModules = modules.map((module) => {
      const status =
        module.status === 'PRODUCTION'
          ? 'Production Ready'
          : module.status === 'IN_DEVELOPMENT'
            ? 'In Development'
            : module.status === 'DEPRECATED'
              ? 'Deprecated'
              : 'In Development'

      return {
        id: module.id,
        name: module.displayName || module.name,
        description: module.description || '',
        icon: iconMap[module.name] || 'Package',
        color:
          colorMap[module.category || ''] ||
          colorMap['Other'] ||
          'from-gray-500 to-gray-600',
        status,
        features: [], // Empty array - can be populated from MODULE_INFO.json later
        link: `/${module.name}`,
        category: module.category || 'Other',
        badge:
          module.status === 'PRODUCTION' ? 'Featured' : undefined,
        version: module.version,
        githubUrl: module.githubUrl,
        npmPackage: module.npmPackage,
        githubStats: module.githubStats,
        npmStats: module.npmStats,
      }
    })

    // Cache for 5 minutes
    return NextResponse.json(
      {
        success: true,
        modules: transformedModules,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error: any) {
    console.error('Public modules API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch modules', modules: [] },
      { status: 500 }
    )
  }
}

