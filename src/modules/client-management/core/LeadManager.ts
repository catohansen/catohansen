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
 * Lead Manager
 * Lead qualification, scoring, and conversion management
 * AI-powered lead scoring built into Hansen CRM
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { ClientManager } from './ClientManager'
import { AdvancedLeadScoring, EngagementMetrics, FirmographicData } from './AdvancedLeadScoring'
import { automationEngine } from './AutomationEngine'

export interface LeadData {
  id: string
  source: string
  name?: string | null
  email?: string | null
  phone?: string | null
  company?: string | null
  message?: string | null
  score: number
  status: string
  qualified: boolean
  converted: boolean
  clientId?: string | null
  meta?: any
  createdAt: Date
  updatedAt: Date
}

export interface CreateLeadInput {
  source: string
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  meta?: any
}

export interface UpdateLeadInput {
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  score?: number
  status?: string
  qualified?: boolean
  meta?: any
}

export interface LeadFilters {
  status?: string
  source?: string
  qualified?: boolean
  converted?: boolean
  minScore?: number
  search?: string
  limit?: number
  offset?: number
}

export class LeadManager {
  private clientManager: ClientManager
  private advancedScoring: AdvancedLeadScoring

  constructor() {
    this.clientManager = new ClientManager()
    this.advancedScoring = new AdvancedLeadScoring()
  }

  /**
   * Calculate AI-powered lead score (0-100) - Legacy method
   * @deprecated Use calculateAdvancedScore instead
   */
  private calculateLeadScore(lead: Partial<LeadData>): number {
    let score = 0

    // Email domain quality (0-20 points)
    if (lead.email) {
      const domain = lead.email.split('@')[1]
      const corporateDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
      if (domain && !corporateDomains.includes(domain.toLowerCase())) {
        score += 20 // Corporate email
      } else if (domain) {
        score += 10 // Personal email
      }
    }

    // Company name (0-15 points)
    if (lead.company && lead.company.length > 2) {
      score += 15
    }

    // Phone number (0-15 points)
    if (lead.phone && lead.phone.length >= 8) {
      score += 15
    }

    // Message quality (0-20 points)
    if (lead.message) {
      if (lead.message.length > 100) score += 20
      else if (lead.message.length > 50) score += 10
      else if (lead.message.length > 0) score += 5
    }

    // Source quality (0-30 points)
    const highQualitySources = ['referral', 'website', 'linkedin']
    const mediumQualitySources = ['email', 'phone']
    if (lead.source) {
      if (highQualitySources.includes(lead.source.toLowerCase())) {
        score += 30
      } else if (mediumQualitySources.includes(lead.source.toLowerCase())) {
        score += 20
      } else {
        score += 10
      }
    }

    return Math.min(100, Math.max(0, score))
  }

  /**
   * Calculate advanced AI-powered lead score with ML-based factors
   */
  async calculateAdvancedLeadScore(leadId: string): Promise<{
    score: number
    factors: any
    qualified: boolean
    grade: string
    confidence: number
  }> {
    const lead = await this.getLeadById(leadId)
    if (!lead) {
      throw new Error('Lead not found')
    }

    // Get engagement metrics
    const engagement = await this.advancedScoring.getEngagementMetrics(leadId)

    // Extract firmographic data
    const meta = lead.meta as any || {}
    const firmographic: FirmographicData = {
      companySize: meta.companySize || undefined,
      industry: meta.industry || lead.company ? 'Unknown' : undefined,
      annualRevenue: meta.annualRevenue || undefined,
      location: meta.location || undefined,
      website: meta.website || undefined,
      linkedInCompany: meta.linkedInCompany || undefined,
      technologies: meta.technologies || undefined
    }

    // Calculate advanced score
    const scoreFactors = await this.advancedScoring.calculateAdvancedScore(
      {
        email: lead.email || undefined,
        phone: lead.phone || undefined,
        company: lead.company || undefined,
        message: lead.message || undefined,
        source: lead.source,
        meta: lead.meta
      },
      engagement,
      firmographic
    )

    // Determine qualification
    const qualification = this.advancedScoring.shouldQualify(scoreFactors)

    return {
      score: scoreFactors.totalScore,
      factors: scoreFactors,
      qualified: qualification.qualified,
      grade: qualification.grade,
      confidence: scoreFactors.confidence
    }
  }

  async getLeadById(leadId: string): Promise<LeadData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      return null
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        client: true
      }
    })

    if (!lead) return null

    return this.mapToLeadData(lead)
  }

  async getLeads(filters?: LeadFilters): Promise<{ data: LeadData[], total: number }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      return { data: [], total: 0 }
    }
    
    const where: any = {}
    if (filters?.status) where.status = filters.status
    if (filters?.source) where.source = filters.source
    if (filters?.qualified !== undefined) where.qualified = filters.qualified
    if (filters?.converted !== undefined) where.converted = filters.converted
    if (filters?.minScore !== undefined) where.score = { gte: filters.minScore }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { score: 'desc' },
        take: filters?.limit || 100,
        skip: filters?.offset || 0
      }),
      prisma.lead.count({ where })
    ])

    return {
      data: leads.map((l: any) => this.mapToLeadData(l)),
      total
    }
  }

  async createLead(input: CreateLeadInput): Promise<LeadData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      throw new Error('Database not available')
    }
    
    // Calculate AI lead score (legacy - will be upgraded to advanced after creation)
    const score = this.calculateLeadScore({
      email: input.email,
      company: input.company,
      phone: input.phone,
      message: input.message,
      source: input.source
    })

    // Auto-qualify if score >= 60 (legacy threshold)
    const qualified = score >= 60

    const lead = await prisma.lead.create({
      data: {
        source: input.source,
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        message: input.message,
        score,
        qualified,
        meta: input.meta,
        status: qualified ? 'QUALIFIED' : 'NEW'
      }
    })

    // Trigger automation engine event
    automationEngine.triggerEvent('lead.created', {
      ...lead,
      // id is already in lead object
    })

    // If qualified, trigger qualified event
    if (qualified) {
      automationEngine.triggerEvent('lead.qualified', {
        ...lead,
        // id is already in lead object
      })
    }

    return this.mapToLeadData(lead)
  }

  async updateLead(leadId: string, input: UpdateLeadInput): Promise<LeadData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      throw new Error('Database not available')
    }

    const existingLead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!existingLead) {
      throw new Error('Lead not found')
    }

    // Recalculate score if relevant fields changed
    let score = input.score ?? existingLead.score
    if (input.email || input.company || input.phone || input.message) {
      score = this.calculateLeadScore({
        email: input.email ?? existingLead.email ?? undefined,
        company: input.company ?? existingLead.company ?? undefined,
        phone: input.phone ?? existingLead.phone ?? undefined,
        message: input.message ?? existingLead.message ?? undefined,
        source: existingLead.source
      })
    }

    // Auto-qualify if score >= 60
    const qualified = input.qualified !== undefined ? input.qualified : (score >= 60)

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.company !== undefined && { company: input.company }),
        ...(input.message !== undefined && { message: input.message }),
        ...(input.status !== undefined && { status: input.status as any }), // Cast to enum
        score,
        qualified,
        ...(input.meta !== undefined && { meta: input.meta })
      }
    })

    return this.mapToLeadData(lead)
  }

  /**
   * Convert lead to client
   */
  async convertLeadToClient(leadId: string, createdById?: string): Promise<LeadData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      throw new Error('Database not available')
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) {
      throw new Error('Lead not found')
    }

    if (lead.converted && lead.clientId) {
      return this.mapToLeadData(lead)
    }

    // Create client from lead
    const client = await this.clientManager.createClient({
      name: lead.name || lead.email || 'Unknown Client',
      email: lead.email ?? undefined,
      phone: lead.phone ?? undefined,
      company: lead.company ?? undefined,
      lifecycleStage: 'Customer',
      leadSource: lead.source,
      leadScore: lead.score
    }, createdById)

    // Update lead with client reference
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        converted: true,
        clientId: client.id,
        status: 'WON'
      }
    })

    // Trigger automation engine event
    automationEngine.triggerEvent('lead.converted', {
      ...updatedLead,
      clientId: client.id,
      // id is already in updatedLead object
    })

    return this.mapToLeadData(updatedLead)
  }

  async deleteLead(leadId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      throw new Error('Database not available')
    }
    
    await prisma.lead.delete({ where: { id: leadId } })
  }

  async getLeadStats(): Promise<{
    total: number
    new: number
    qualified: number
    converted: number
    avgScore: number
    bySource: Record<string, number>
  }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      return {
        total: 0,
        new: 0,
        qualified: 0,
        converted: 0,
        avgScore: 0,
        bySource: {}
      }
    }

    const [total, newLeads, qualified, converted, allLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { qualified: true } }),
      prisma.lead.count({ where: { converted: true } }),
      prisma.lead.findMany({
        select: {
          score: true,
          source: true
        }
      })
    ])

    const avgScore = allLeads.length > 0
      ? allLeads.reduce((sum: number, l: { score: number }) => sum + l.score, 0) / allLeads.length
      : 0

    const bySource: Record<string, number> = {}
    allLeads.forEach((lead: { source: string }) => {
      bySource[lead.source] = (bySource[lead.source] || 0) + 1
    })

    return {
      total,
      new: newLeads,
      qualified,
      converted,
      avgScore: Math.round(avgScore * 100) / 100,
      bySource
    }
  }

  private mapToLeadData(lead: any): LeadData {
    return {
      id: lead.id,
      source: lead.source,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      message: lead.message,
      score: lead.score,
      status: lead.status,
      qualified: lead.qualified,
      converted: lead.converted,
      clientId: lead.clientId,
      meta: lead.meta,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt
    }
  }
}

