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
 * Task Manager
 * Task management for clients and deals
 * World-class task tracking system
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { automationEngine } from './AutomationEngine'

export interface TaskData {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  dueDate?: Date | null
  completedAt?: Date | null
  assignedToId?: string | null
  assignedTo?: {
    id: string
    name?: string | null
    email?: string | null
  }
  clientId?: string | null
  client?: {
    id: string
    name: string
    email?: string | null
  }
  pipelineId?: string | null
  pipeline?: {
    id: string
    name: string
    stage: string
  }
  isRecurring: boolean
  recurringPattern?: string | null
  metadata?: any
  createdAt: Date
  updatedAt: Date
  createdBy?: {
    id: string
    name?: string | null
    email?: string | null
  }
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: string
  priority?: string
  dueDate?: Date
  assignedToId?: string
  clientId?: string
  pipelineId?: string
  isRecurring?: boolean
  recurringPattern?: string
  metadata?: any
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: string
  priority?: string
  dueDate?: Date
  assignedToId?: string
  clientId?: string
  pipelineId?: string
  isRecurring?: boolean
  recurringPattern?: string
  completedAt?: Date
  metadata?: any
}

export interface TaskFilters {
  status?: string
  priority?: string
  assignedToId?: string
  clientId?: string
  pipelineId?: string
  dueDateFrom?: Date
  dueDateTo?: Date
  overdue?: boolean
  search?: string
  limit?: number
  offset?: number
}

export class TaskManager {
  async getTaskById(taskId: string): Promise<TaskData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.task === 'undefined') {
      return null
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pipeline: {
          select: {
            id: true,
            name: true,
            stage: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!task) return null

    return this.mapToTaskData(task)
  }

  async getTasks(filters?: TaskFilters): Promise<{ data: TaskData[], total: number }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.task === 'undefined') {
      return { data: [], total: 0 }
    }

    const where: any = {}

    if (filters?.status) where.status = filters.status
    if (filters?.priority) where.priority = filters.priority
    if (filters?.assignedToId) where.assignedToId = filters.assignedToId
    if (filters?.clientId) where.clientId = filters.clientId
    if (filters?.pipelineId) where.pipelineId = filters.pipelineId

    if (filters?.overdue) {
      where.dueDate = {
        lt: new Date(),
        not: null
      }
      where.status = {
        not: 'DONE'
      }
    }

    if (filters?.dueDateFrom || filters?.dueDateTo) {
      where.dueDate = {}
      if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom
      if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          client: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          pipeline: {
            select: {
              id: true,
              name: true,
              stage: true
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: [
          { dueDate: 'asc' },
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        take: filters?.limit || 100,
        skip: filters?.offset || 0
      }),
      prisma.task.count({ where })
    ])

    return {
      data: tasks.map((t: any) => this.mapToTaskData(t)),
      total
    }
  }

  async createTask(input: CreateTaskInput, createdById?: string): Promise<TaskData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.task === 'undefined') {
      throw new Error('Database not available')
    }

    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description || null,
        status: (input.status || 'TODO') as any, // Cast to enum
        priority: (input.priority || 'MEDIUM') as any, // Cast to enum
        dueDate: input.dueDate || null,
        assignedToId: input.assignedToId || null,
        clientId: input.clientId || null,
        pipelineId: input.pipelineId || null,
        isRecurring: input.isRecurring || false,
        recurringPattern: input.recurringPattern || null,
        metadata: input.metadata,
        createdById
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pipeline: {
          select: {
            id: true,
            name: true,
            stage: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Trigger automation engine event
    automationEngine.triggerEvent('task.created', {
      ...task,
      // id is already in task object
    })

    return this.mapToTaskData(task)
  }

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<TaskData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.task === 'undefined') {
      throw new Error('Database not available')
    }

    // If status is DONE, set completedAt
    let completedAt: Date | undefined = input.completedAt
    if (input.status === 'DONE' && !completedAt) {
      completedAt = new Date()
    } else if (input.status !== 'DONE' && completedAt) {
      completedAt = undefined
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status !== undefined && { status: input.status as any }), // Cast to enum
        ...(input.priority !== undefined && { priority: input.priority as any }), // Cast to enum
        ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
        ...(input.assignedToId !== undefined && { assignedToId: input.assignedToId }),
        ...(input.clientId !== undefined && { clientId: input.clientId }),
        ...(input.pipelineId !== undefined && { pipelineId: input.pipelineId }),
        ...(input.isRecurring !== undefined && { isRecurring: input.isRecurring }),
        ...(input.recurringPattern !== undefined && { recurringPattern: input.recurringPattern }),
        ...(completedAt !== undefined && { completedAt }),
        ...(input.metadata !== undefined && { metadata: input.metadata })
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pipeline: {
          select: {
            id: true,
            name: true,
            stage: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Trigger automation engine events
    if (input.status === 'DONE') {
      automationEngine.triggerEvent('task.completed', {
        ...task,
        // id is already in task object
      })
    }

    // Check if task is due
    if (task.dueDate && task.dueDate < new Date() && task.status !== 'DONE') {
      automationEngine.triggerEvent('task.due', {
        ...task,
        // id is already in task object
      })
    }

    return this.mapToTaskData(task)
  }

  async deleteTask(taskId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.task === 'undefined') {
      throw new Error('Database not available')
    }

    await prisma.task.delete({ where: { id: taskId } })
  }

  async getTaskStats(clientId?: string, pipelineId?: string): Promise<{
    total: number
    byStatus: Record<string, number>
    byPriority: Record<string, number>
    overdue: number
    dueToday: number
    dueThisWeek: number
  }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.task === 'undefined') {
      return {
        total: 0,
        byStatus: {},
        byPriority: {},
        overdue: 0,
        dueToday: 0,
        dueThisWeek: 0
      }
    }

    const where: any = {}
    if (clientId) where.clientId = clientId
    if (pipelineId) where.pipelineId = pipelineId

    const tasks = await prisma.task.findMany({ where })

    const byStatus: Record<string, number> = {}
    const byPriority: Record<string, number> = {}
    let overdue = 0
    let dueToday = 0
    let dueThisWeek = 0

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    tasks.forEach((task: any) => {
      // Count by status
      byStatus[task.status] = (byStatus[task.status] || 0) + 1
      
      // Count by priority
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1
      
      // Check overdue
      if (task.dueDate && task.dueDate < now && task.status !== 'DONE') {
        overdue++
      }
      
      // Check due today
      if (task.dueDate && task.dueDate >= today && task.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000) && task.status !== 'DONE') {
        dueToday++
      }
      
      // Check due this week
      if (task.dueDate && task.dueDate >= today && task.dueDate < weekEnd && task.status !== 'DONE') {
        dueThisWeek++
      }
    })

    return {
      total: tasks.length,
      byStatus,
      byPriority,
      overdue,
      dueToday,
      dueThisWeek
    }
  }

  private mapToTaskData(task: any): TaskData {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      assignedToId: task.assignedToId,
      assignedTo: task.assignedTo || undefined,
      clientId: task.clientId,
      client: task.client || undefined,
      pipelineId: task.pipelineId,
      pipeline: task.pipeline || undefined,
      isRecurring: task.isRecurring,
      recurringPattern: task.recurringPattern,
      metadata: task.metadata,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      createdBy: task.createdBy || undefined
    }
  }
}

