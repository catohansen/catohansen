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
 * Client Manager
 * Core CRM functionality for client management
 * World-class CRM system built by Cato Hansen Agency
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { automationEngine } from './AutomationEngine'

export interface ClientData {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  industry?: string | null
  website?: string | null
  companySize?: string | null
  annualRevenue?: number | null
  lifecycleStage?: string | null
  leadSource?: string | null
  leadScore?: number | null
  status: string
  tags: string[]
  customFields?: any
  metadata?: any
  createdAt: Date
  updatedAt: Date
  _count?: {
    communications?: number
    pipelines?: number
    projects?: number
  }
}

export interface CreateClientInput {
  name: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  website?: string
  companySize?: string
  annualRevenue?: number
  lifecycleStage?: string
  leadSource?: string
  leadScore?: number
  tags?: string[]
  customFields?: any
  tenantId?: string
}

export interface UpdateClientInput {
  name?: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  website?: string
  companySize?: string
  annualRevenue?: number
  lifecycleStage?: string
  leadSource?: string
  leadScore?: number
  tags?: string[]
  status?: string
  customFields?: any
  metadata?: any
}

export interface ClientFilters {
  status?: string
  lifecycleStage?: string
  industry?: string
  search?: string
  tenantId?: string
  tags?: string[]
  limit?: number
  offset?: number
}

export class ClientManager {
  async getClientById(clientId: string, includeRelations = false): Promise<ClientData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.client === 'undefined') {
      return null
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: includeRelations ? {
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        pipelines: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        projects: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            communications: true,
            pipelines: true,
            projects: true
          }
        }
      } : {
        _count: {
          select: {
            communications: true,
            pipelines: true,
            projects: true
          }
        }
      }
    })

    if (!client) return null

    return this.mapToClientData(client)
  }

  async getClients(filters?: ClientFilters): Promise<{ data: ClientData[], total: number }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.client === 'undefined') {
      return { data: [], total: 0 }
    }
    
    const where: any = {}
    if (filters?.status) where.status = filters.status
    if (filters?.lifecycleStage) where.lifecycleStage = filters.lifecycleStage
    if (filters?.industry) where.industry = filters.industry
    if (filters?.tenantId) where.tenantId = filters.tenantId
    if (filters?.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags }
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 100,
        skip: filters?.offset || 0,
        include: {
          _count: {
            select: {
              communications: true,
              pipelines: true,
              projects: true
            }
          }
        }
      }),
      prisma.client.count({ where })
    ])

    return {
      data: clients.map((c: any) => this.mapToClientData(c)),
      total
    }
  }

  async createClient(input: CreateClientInput, createdById?: string): Promise<ClientData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.client === 'undefined') {
      throw new Error('Database not available')
    }
    
    const client = await prisma.client.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        industry: input.industry,
        website: input.website,
        companySize: input.companySize,
        annualRevenue: input.annualRevenue ? parseFloat(input.annualRevenue.toString()) : null,
        lifecycleStage: input.lifecycleStage || 'Lead',
        leadSource: input.leadSource,
        leadScore: input.leadScore || 0,
        tags: input.tags || [],
        customFields: input.customFields,
        tenantId: input.tenantId,
        createdById,
        status: input.lifecycleStage === 'Customer' ? 'ACTIVE' : 'LEAD'
      },
      include: {
        _count: {
          select: {
            communications: true,
            pipelines: true,
            projects: true
          }
        }
      }
    })

    // Trigger automation engine event
    const { id, ...clientData } = client
    automationEngine.triggerEvent('client.created', {
      ...clientData,
      id
    })

    return this.mapToClientData(client)
  }

  async updateClient(clientId: string, input: UpdateClientInput): Promise<ClientData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.client === 'undefined') {
      throw new Error('Database not available')
    }
    
    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.company !== undefined && { company: input.company }),
        ...(input.industry !== undefined && { industry: input.industry }),
        ...(input.website !== undefined && { website: input.website }),
        ...(input.companySize !== undefined && { companySize: input.companySize }),
        ...(input.annualRevenue !== undefined && { annualRevenue: input.annualRevenue ? parseFloat(input.annualRevenue.toString()) : null }),
        ...(input.lifecycleStage !== undefined && { lifecycleStage: input.lifecycleStage }),
        ...(input.leadSource !== undefined && { leadSource: input.leadSource }),
        ...(input.leadScore !== undefined && { leadScore: input.leadScore }),
        ...(input.tags !== undefined && { tags: input.tags }),
        ...(input.status !== undefined && { status: input.status as any }),
        ...(input.customFields !== undefined && { customFields: input.customFields }),
        ...(input.metadata !== undefined && { metadata: input.metadata })
      },
      include: {
        _count: {
          select: {
            communications: true,
            pipelines: true,
            projects: true
          }
        }
      }
    })

    return this.mapToClientData(client)
  }

  async deleteClient(clientId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.client === 'undefined') {
      throw new Error('Database not available')
    }
    
    await prisma.client.delete({ where: { id: clientId } })
  }

  async getClientStats(tenantId?: string): Promise<{
    total: number
    active: number
    leads: number
    churned: number
    byLifecycleStage: Record<string, number>
    byIndustry: Record<string, number>
  }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.client === 'undefined') {
      return {
        total: 0,
        active: 0,
        leads: 0,
        churned: 0,
        byLifecycleStage: {},
        byIndustry: {}
      }
    }

    const where: any = {}
    if (tenantId) where.tenantId = tenantId

    const [total, active, leads, churned, allClients] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.client.count({ where: { ...where, status: 'LEAD' } }),
      prisma.client.count({ where: { ...where, status: 'CHURNED' } }),
      prisma.client.findMany({
        where,
        select: {
          lifecycleStage: true,
          industry: true
        }
      })
    ])

    const byLifecycleStage: Record<string, number> = {}
    const byIndustry: Record<string, number> = {}

    allClients.forEach((client: { lifecycleStage?: string | null; industry?: string | null }) => {
      if (client.lifecycleStage) {
        const stage = String(client.lifecycleStage)
        byLifecycleStage[stage] = (byLifecycleStage[stage] || 0) + 1
      }
      if (client.industry) {
        const ind = String(client.industry)
        byIndustry[ind] = (byIndustry[ind] || 0) + 1
      }
    })

    return {
      total,
      active,
      leads,
      churned,
      byLifecycleStage,
      byIndustry
    }
  }

  private mapToClientData(client: any): ClientData {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      industry: client.industry,
      website: client.website,
      companySize: client.companySize,
      annualRevenue: client.annualRevenue ? parseFloat(client.annualRevenue.toString()) : null,
      lifecycleStage: client.lifecycleStage,
      leadSource: client.leadSource,
      leadScore: client.leadScore,
      status: client.status,
      tags: client.tags || [],
      customFields: client.customFields,
      metadata: client.metadata,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      _count: client._count
    }
  }
}

