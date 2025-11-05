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
 * Communication Logger
 * Logs all client interactions (email, calls, meetings, notes)
 * Complete communication history tracking
 */

import { getPrismaClient } from '@/lib/db/prisma'

export interface CommunicationData {
  id: string
  clientId: string
  type: string
  subject?: string | null
  content?: string | null
  direction: string
  participants: string[]
  duration?: number | null
  metadata?: any
  createdAt: Date
  createdBy?: {
    id: string
    name?: string | null
    email?: string | null
  }
  client?: {
    id: string
    name: string
    email?: string | null
    company?: string | null
  }
}

export interface CreateCommunicationInput {
  clientId?: string | null
  pipelineId?: string | null
  type: string
  subject?: string
  content?: string
  direction?: string
  participants?: string[]
  duration?: number
  metadata?: any
}

export interface UpdateCommunicationInput {
  subject?: string
  content?: string
  participants?: string[]
  duration?: number
  metadata?: any
}

export interface CommunicationFilters {
  clientId?: string
  type?: string
  direction?: string
  search?: string
  limit?: number
  offset?: number
}

export class CommunicationLogger {
  async getCommunicationById(communicationId: string): Promise<CommunicationData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return null
    }

    const communication = await prisma.communication.findUnique({
      where: { id: communicationId },
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

    if (!communication) return null

    return this.mapToCommunicationData(communication)
  }

  async getCommunications(filters?: CommunicationFilters): Promise<{ data: CommunicationData[], total: number }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return { data: [], total: 0 }
    }
    
    const where: any = {}
    if (filters?.clientId) where.clientId = filters.clientId
    if (filters?.type) where.type = filters.type
    if (filters?.direction) where.direction = filters.direction
    if (filters?.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { client: { name: { contains: filters.search, mode: 'insensitive' } } }
      ]
    }

    const [communications, total] = await Promise.all([
      prisma.communication.findMany({
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
      prisma.communication.count({ where })
    ])

    return {
      data: communications.map((c: any) => this.mapToCommunicationData(c)),
      total
    }
  }

  async createCommunication(input: CreateCommunicationInput, createdById?: string): Promise<CommunicationData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      throw new Error('Database not available')
    }
    
    // clientId is required in Communication model
    if (!input.clientId) {
      throw new Error('clientId is required for Communication')
    }
    
    const communication = await prisma.communication.create({
      data: {
        clientId: input.clientId,
        // pipelineId not in Communication model schema - removed
        type: input.type as any,
        subject: input.subject,
        content: input.content,
        direction: (input.direction || 'OUTBOUND') as any,
        participants: input.participants || [],
        duration: input.duration,
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

    return this.mapToCommunicationData(communication)
  }

  async updateCommunication(communicationId: string, input: UpdateCommunicationInput): Promise<CommunicationData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      throw new Error('Database not available')
    }
    
    const communication = await prisma.communication.update({
      where: { id: communicationId },
      data: {
        ...(input.subject !== undefined && { subject: input.subject }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.participants !== undefined && { participants: input.participants }),
        ...(input.duration !== undefined && { duration: input.duration }),
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

    return this.mapToCommunicationData(communication)
  }

  async deleteCommunication(communicationId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      throw new Error('Database not available')
    }
    
    await prisma.communication.delete({ where: { id: communicationId } })
  }

  async getCommunicationStats(clientId?: string): Promise<{
    total: number
    byType: Record<string, number>
    byDirection: Record<string, number>
    avgDuration: number
    totalDuration: number
  }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return {
        total: 0,
        byType: {},
        byDirection: {},
        avgDuration: 0,
        totalDuration: 0
      }
    }

    const where: any = {}
    if (clientId) where.clientId = clientId

    const [total, communications] = await Promise.all([
      prisma.communication.count({ where }),
      prisma.communication.findMany({
        where,
        select: {
          type: true,
          direction: true,
          duration: true
        }
      })
    ])

    const byType: Record<string, number> = {}
    const byDirection: Record<string, number> = {}
    let totalDuration = 0

    communications.forEach((comm: { type: string; direction: string; duration?: number | null }) => {
      byType[comm.type] = (byType[comm.type] || 0) + 1
      byDirection[comm.direction] = (byDirection[comm.direction] || 0) + 1
      if (comm.duration) {
        totalDuration += comm.duration
      }
    })

    const avgDuration = total > 0 ? totalDuration / total : 0

    return {
      total,
      byType,
      byDirection,
      avgDuration: Math.round(avgDuration * 100) / 100,
      totalDuration
    }
  }

  private mapToCommunicationData(communication: any): CommunicationData {
    return {
      id: communication.id,
      clientId: communication.clientId,
      type: communication.type,
      subject: communication.subject,
      content: communication.content,
      direction: communication.direction,
      participants: communication.participants || [],
      duration: communication.duration,
      metadata: communication.metadata,
      createdAt: communication.createdAt,
      createdBy: communication.createdBy,
      client: communication.client
    }
  }
}

