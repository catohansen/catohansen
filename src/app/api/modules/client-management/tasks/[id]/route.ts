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
 * Task API Route
 * GET /api/modules/client-management/tasks/[id]
 * PATCH /api/modules/client-management/tasks/[id]
 * DELETE /api/modules/client-management/tasks/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { TaskManager } from '@/modules/client-management/core/TaskManager'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { withLogging } from '@/lib/observability/withLogging'

const taskManager = new TaskManager()

async function getTask(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const hasAccess = await policyEngine.evaluate({
      id: userId,
      roles: ['OWNER'],
      attributes: {}
    }, {
      kind: 'task',
      id: params.id,
      attributes: {}
    }, 'read')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const task = await taskManager.getTaskById(params.id)

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: task
    })
  } catch (error: any) {
    console.error('Get task error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateTask(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const hasAccess = await policyEngine.evaluate({
      id: userId,
      roles: ['OWNER'],
      attributes: {}
    }, {
      kind: 'task',
      id: params.id,
      attributes: {}
    }, 'update')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const task = await taskManager.updateTask(params.id, body)

    return NextResponse.json({
      success: true,
      data: task
    })
  } catch (error: any) {
    console.error('Update task error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function deleteTask(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const hasAccess = await policyEngine.evaluate({
      id: userId,
      roles: ['OWNER'],
      attributes: {}
    }, {
      kind: 'task',
      id: params.id,
      attributes: {}
    }, 'delete')

    if (!hasAccess.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await taskManager.deleteTask(params.id)

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete task error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withLogging(getTask)
export const PATCH = withLogging(updateTask)
export const DELETE = withLogging(deleteTask)







