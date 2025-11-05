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
 * Knowledge Base Code API Route
 * Read code files from repository (readonly)
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { getPrismaClient } from '@/lib/db/prisma'
import { withLogging } from '@/lib/observability/withLogging'
import { audit } from '@/lib/audit/audit'
import { z } from 'zod'
import { readFile } from 'fs/promises'
import { join } from 'path'

const codeSchema = z.object({
  path: z.string().min(1)
})

async function codeHandler(request: NextRequest) {
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
      id: 'code',
      attributes: {}
    }

    const hasAccess = await policyEngine.evaluate(principal, resource, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    const parsed = codeSchema.safeParse({ path })
    if (!parsed.success || !path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      )
    }

    // Security: Only allow paths within project root
    const safePath = parsed.data.path.replace(/\.\./g, '').replace(/^\//, '')
    const projectRoot = process.cwd()
    const filePath = join(projectRoot, safePath)

    // Verify path is within project root
    if (!filePath.startsWith(projectRoot)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 400 }
      )
    }

    try {
      // Read file
      const content = await readFile(filePath, 'utf-8')
      
      // Determine language from extension
      const ext = safePath.split('.').pop()?.toLowerCase() || 'text'
      const languageMap: Record<string, string> = {
        'ts': 'typescript',
        'tsx': 'typescript',
        'js': 'javascript',
        'jsx': 'javascript',
        'json': 'json',
        'md': 'markdown',
        'mdx': 'markdown',
        'css': 'css',
        'html': 'html',
        'py': 'python',
        'rs': 'rust',
        'go': 'go'
      }
      const language = languageMap[ext] || 'text'

      // Get file stats
      const stats = await import('fs/promises').then(m => m.stat(filePath))

      // Audit log
      await audit(request, {
        action: 'kb.code.read',
        resource: 'knowledge-base',
        meta: {
          path: safePath,
          size: stats.size
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          path: safePath,
          language,
          content,
          size: stats.size
        }
      })
    } catch (fileError) {
      // File not found or cannot be read
      return NextResponse.json(
        { error: 'File not found or cannot be read' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Knowledge Base code error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(codeHandler)



