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
 * Pipeline Manager
 * Sales pipeline and deal management
 * Kanban-style pipeline tracking with forecasting
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { automationEngine } from './AutomationEngine'

export interface PipelineData {
  id: string
  clientId: string
  name: string
  stage: string
  value?: number | null
  currency?: string | null
  probability?: number | null
  expectedClose?: Date | null
  actualClose?: Date | null
  won?: boolean | null
  lost?: boolean | null
  lostReason?: string | null
  notes?: string | null
  metadata?: any
  createdAt: Date
  updatedAt: Date
  client?: {
    id: string
    name: string
    email?: string | null
    company?: string | null
  }
  createdBy?: {
    id: string
    name?: string | null
    email?: string | null
  }
}

export interface CreatePipelineInput {
  clientId: string
  name: string
  stage?: string
  value?: number
  currency?: string
  probability?: number
  expectedClose?: Date
  notes?: string
  metadata?: any
}

export interface UpdatePipelineInput {
  name?: string
  stage?: string
  value?: number
  currency?: string
  probability?: number
  expectedClose?: Date
  actualClose?: Date
  won?: boolean
  lost?: boolean
  lostReason?: string
  notes?: string
  metadata?: any
}

export interface PipelineFilters {
  clientId?: string
  stage?: string
  won?: boolean
  lost?: boolean
  search?: string
  limit?: number
  offset?: number
}

export class PipelineManager {
  async getPipelineById(pipelineId: string): Promise<PipelineData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      return null
    }

    const pipeline = await prisma.pipeline.findUnique({
      where: { id: pipelineId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
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

    if (!pipeline) return null

    return this.mapToPipelineData(pipeline)
  }

  async getPipelines(filters?: PipelineFilters): Promise<{ data: PipelineData[], total: number }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      return { data: [], total: 0 }
    }
    
    const where: any = {}
    if (filters?.clientId) where.clientId = filters.clientId
    if (filters?.stage) where.stage = filters.stage
    if (filters?.won !== undefined) where.won = filters.won
    if (filters?.lost !== undefined) where.lost = filters.lost
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { client: { name: { contains: filters.search, mode: 'insensitive' } } },
        { client: { company: { contains: filters.search, mode: 'insensitive' } } }
      ]
    }

    const [pipelines, total] = await Promise.all([
      prisma.pipeline.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 100,
        skip: filters?.offset || 0,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true
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
      }),
      prisma.pipeline.count({ where })
    ])

    return {
      data: pipelines.map((p: any) => this.mapToPipelineData(p)),
      total
    }
  }

  async getPipelinesByStage(): Promise<Record<string, PipelineData[]>> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      return {}
    }

    const pipelines = await prisma.pipeline.findMany({
      where: {
        won: false,
        lost: false
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
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
      orderBy: { createdAt: 'desc' }
    })

    const grouped: Record<string, PipelineData[]> = {}
    pipelines.forEach((pipeline: any) => {
      const stage = pipeline.stage
      if (!grouped[stage]) {
        grouped[stage] = []
      }
      grouped[stage].push(this.mapToPipelineData(pipeline))
    })

    return grouped
  }

  async createPipeline(input: CreatePipelineInput, createdById?: string): Promise<PipelineData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      throw new Error('Database not available')
    }
    
    const pipeline = await prisma.pipeline.create({
      data: {
        clientId: input.clientId,
        name: input.name,
        stage: (input.stage || 'DISCOVERY') as any, // Cast to enum
        value: input.value ? parseFloat(input.value.toString()) : null,
        currency: input.currency || 'NOK',
        probability: input.probability || 50,
        expectedClose: input.expectedClose,
        notes: input.notes,
        metadata: input.metadata,
        createdById
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
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

    return this.mapToPipelineData(pipeline)
  }

  async updatePipeline(pipelineId: string, input: UpdatePipelineInput): Promise<PipelineData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      throw new Error('Database not available')
    }
    
    // Get old pipeline BEFORE update to compare changes
    const oldPipeline = await prisma.pipeline.findUnique({ where: { id: pipelineId } })
    if (!oldPipeline) {
      throw new Error('Pipeline not found')
    }
    
    // If won or lost, set actualClose date
    let actualClose = input.actualClose
    if (input.won === true || input.lost === true) {
      actualClose = actualClose || new Date()
    }

    const pipeline = await prisma.pipeline.update({
      where: { id: pipelineId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.stage !== undefined && { stage: input.stage as any }), // Cast to enum
        ...(input.value !== undefined && { value: input.value ? parseFloat(input.value.toString()) : null }),
        ...(input.currency !== undefined && { currency: input.currency }),
        ...(input.probability !== undefined && { probability: input.probability }),
        ...(input.expectedClose !== undefined && { expectedClose: input.expectedClose }),
        ...(actualClose !== undefined && { actualClose }),
        ...(input.won !== undefined && { won: input.won }),
        ...(input.lost !== undefined && { lost: input.lost }),
        ...(input.lostReason !== undefined && { lostReason: input.lostReason }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.metadata !== undefined && { metadata: input.metadata })
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
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

    // Trigger automation engine events based on changes
    if (input.stage && oldPipeline.stage !== input.stage) {
      automationEngine.triggerEvent('deal.stage_changed', {
        ...pipeline,
        oldStage: oldPipeline.stage,
        newStage: input.stage,
        // id is already in pipeline object
      })
    }

    if (input.won === true && !oldPipeline.won) {
      automationEngine.triggerEvent('deal.won', {
        ...pipeline,
        // id is already in pipeline object
      })
    }

    if (input.lost === true && !oldPipeline.lost) {
      automationEngine.triggerEvent('deal.lost', {
        ...pipeline,
        // id is already in pipeline object
      })
    }

    return this.mapToPipelineData(pipeline)
  }

  async deletePipeline(pipelineId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      throw new Error('Database not available')
    }
    
    await prisma.pipeline.delete({ where: { id: pipelineId } })
  }

  async getPipelineForecast(): Promise<{
    totalValue: number
    weightedValue: number
    byStage: Record<string, { count: number; value: number; weightedValue: number }>
    winRate: number
  }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      return {
        totalValue: 0,
        weightedValue: 0,
        byStage: {},
        winRate: 0
      }
    }

    const pipelines = await prisma.pipeline.findMany({
      where: {
        won: false,
        lost: false
      }
    })

    let totalValue = 0
    let weightedValue = 0
    const byStage: Record<string, { count: number; value: number; weightedValue: number }> = {}

    pipelines.forEach((pipeline: { value?: any; probability?: number | null; stage: string }) => {
      const value = pipeline.value ? parseFloat(pipeline.value.toString()) : 0
      const probability = pipeline.probability || 0
      const stage = pipeline.stage

      totalValue += value
      weightedValue += value * (probability / 100)

      if (!byStage[stage]) {
        byStage[stage] = { count: 0, value: 0, weightedValue: 0 }
      }
      byStage[stage].count += 1
      byStage[stage].value += value
      byStage[stage].weightedValue += value * (probability / 100)
    })

    // Calculate win rate (won deals / total deals)
    const [wonCount, lostCount] = await Promise.all([
      prisma.pipeline.count({ where: { won: true } }),
      prisma.pipeline.count({ where: { lost: true } })
    ])

    const totalDeals = wonCount + lostCount
    const winRate = totalDeals > 0 ? (wonCount / totalDeals) * 100 : 0

    return {
      totalValue: Math.round(totalValue * 100) / 100,
      weightedValue: Math.round(weightedValue * 100) / 100,
      byStage,
      winRate: Math.round(winRate * 100) / 100
    }
  }

  private mapToPipelineData(pipeline: any): PipelineData {
    return {
      id: pipeline.id,
      clientId: pipeline.clientId,
      name: pipeline.name,
      stage: pipeline.stage,
      value: pipeline.value ? parseFloat(pipeline.value.toString()) : null,
      currency: pipeline.currency,
      probability: pipeline.probability,
      expectedClose: pipeline.expectedClose,
      actualClose: pipeline.actualClose,
      won: pipeline.won,
      lost: pipeline.lost,
      lostReason: pipeline.lostReason,
      notes: pipeline.notes,
      metadata: pipeline.metadata,
      createdAt: pipeline.createdAt,
      updatedAt: pipeline.updatedAt,
      client: pipeline.client,
      createdBy: pipeline.createdBy
    }
  }
}

