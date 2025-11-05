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
 * Reporting Engine
 * Advanced reporting and analytics engine (vår egen)
 * Charts, dashboards, scheduled reports, export (PDF, CSV, Excel)
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { ClientManager } from './ClientManager'
import { PipelineManager } from './PipelineManager'
import { LeadManager } from './LeadManager'
import { TaskManager } from './TaskManager'

export interface ReportConfig {
  type: 'sales' | 'pipeline' | 'client' | 'lead' | 'revenue' | 'activity' | 'custom'
  filters?: Record<string, any>
  groupBy?: string[]
  aggregations?: {
    field: string
    function: 'sum' | 'avg' | 'count' | 'min' | 'max'
  }[]
  dateRange?: {
    from: Date
    to: Date
  }
  columns?: string[]
  chartType?: 'bar' | 'line' | 'pie' | 'table'
}

export interface ReportResult {
  data: any[]
  summary: Record<string, any>
  charts?: {
    type: string
    data: any
  }[]
  total: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
  }[]
}

export class ReportingEngine {
  private clientManager: ClientManager
  private pipelineManager: PipelineManager
  private leadManager: LeadManager
  private taskManager: TaskManager

  constructor() {
    this.clientManager = new ClientManager()
    this.pipelineManager = new PipelineManager()
    this.leadManager = new LeadManager()
    this.taskManager = new TaskManager()
  }

  /**
   * Generate report
   */
  async generateReport(config: ReportConfig): Promise<ReportResult> {
    switch (config.type) {
      case 'sales':
        return this.generateSalesReport(config)
      case 'pipeline':
        return this.generatePipelineReport(config)
      case 'client':
        return this.generateClientReport(config)
      case 'lead':
        return this.generateLeadReport(config)
      case 'revenue':
        return this.generateRevenueReport(config)
      case 'activity':
        return this.generateActivityReport(config)
      default:
        throw new Error(`Unknown report type: ${config.type}`)
    }
  }

  /**
   * Generate Sales Report
   */
  private async generateSalesReport(config: ReportConfig): Promise<ReportResult> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      return { data: [], summary: {}, total: 0 }
    }

    const where: any = {}
    if (config.dateRange) {
      where.createdAt = {
        gte: config.dateRange.from,
        lte: config.dateRange.to
      }
    }

    const pipelines = await prisma.pipeline.findMany({
      where: {
        ...where,
        won: true
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true
          }
        }
      }
    })

    // Calculate totals
    let totalRevenue = 0
    let totalDeals = pipelines.length

    pipelines.forEach((p: any) => {
      const value = p.value ? parseFloat(p.value.toString()) : 0
      totalRevenue += value
    })

    // Group by stage (if needed)
    const grouped: Record<string, any[]> = {}
    pipelines.forEach((p: any) => {
      const stage = p.stage || 'unknown'
      if (!grouped[stage]) grouped[stage] = []
      grouped[stage].push(p)
    })

    // Generate chart data
    const chartData: ChartData = {
      labels: Object.keys(grouped),
      datasets: [{
        label: 'Revenue',
        data: Object.values(grouped).map(deals => 
          deals.reduce((sum: number, d: any) => sum + (d.value ? parseFloat(d.value.toString()) : 0), 0)
        ),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
      }]
    }

    return {
      data: pipelines.map((p: any) => ({
        id: p.id,
        name: p.name,
        client: p.client.name,
        company: p.client.company,
        value: p.value ? parseFloat(p.value.toString()) : 0,
        currency: p.currency || 'NOK',
        stage: p.stage,
        actualClose: p.actualClose
      })),
      summary: {
        totalRevenue,
        totalDeals,
        averageDealValue: totalDeals > 0 ? totalRevenue / totalDeals : 0
      },
      charts: config.chartType ? [{
        type: config.chartType,
        data: chartData
      }] : undefined,
      total: totalDeals
    }
  }

  /**
   * Generate Pipeline Report
   */
  private async generatePipelineReport(config: ReportConfig): Promise<ReportResult> {
    const forecast = await this.pipelineManager.getPipelineForecast()
    const pipelines = await this.pipelineManager.getPipelines()

    // Generate chart data by stage
    const stages = ['DISCOVERY', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']
    const chartData: ChartData = {
      labels: stages,
      datasets: [{
        label: 'Pipeline Value',
        data: stages.map(stage => forecast.byStage[stage]?.value || 0),
        backgroundColor: ['#6b7280', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444']
      }]
    }

    return {
      data: pipelines.data,
      summary: {
        totalValue: forecast.totalValue,
        weightedValue: forecast.weightedValue,
        winRate: forecast.winRate,
        byStage: forecast.byStage
      },
      charts: config.chartType ? [{
        type: config.chartType,
        data: chartData
      }] : undefined,
      total: pipelines.total
    }
  }

  /**
   * Generate Client Report
   */
  private async generateClientReport(config: ReportConfig): Promise<ReportResult> {
    const clients = await this.clientManager.getClients()
    const stats = await this.clientManager.getClientStats()

    // Group by lifecycle stage
    const grouped: Record<string, any[]> = {}
    clients.data.forEach((client: any) => {
      const stage = client.lifecycleStage || 'unknown'
      if (!grouped[stage]) grouped[stage] = []
      grouped[stage].push(client)
    })

    const chartData: ChartData = {
      labels: Object.keys(grouped),
      datasets: [{
        label: 'Clients',
        data: Object.values(grouped).map(clients => clients.length),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      }]
    }

    return {
      data: clients.data,
      summary: {
        total: stats.total,
        active: stats.active,
        leads: stats.leads,
        churned: stats.churned,
        byStage: grouped
      },
      charts: config.chartType ? [{
        type: config.chartType,
        data: chartData
      }] : undefined,
      total: clients.total
    }
  }

  /**
   * Generate Lead Report
   */
  private async generateLeadReport(config: ReportConfig): Promise<ReportResult> {
    const leads = await this.leadManager.getLeads()
    const stats = await this.leadManager.getLeadStats()

    // Group by source
    const grouped: Record<string, any[]> = {}
    leads.data.forEach((lead: any) => {
      const source = lead.source || 'unknown'
      if (!grouped[source]) grouped[source] = []
      grouped[source].push(lead)
    })

    const chartData: ChartData = {
      labels: Object.keys(grouped),
      datasets: [{
        label: 'Leads',
        data: Object.values(grouped).map((leads: any[]) => leads.length),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'] as string[]
      }]
    }

    return {
      data: leads.data,
      summary: {
        total: stats.total,
        new: stats.new,
        qualified: stats.qualified,
        converted: stats.converted,
        conversionRate: stats.total > 0 ? (stats.converted / stats.total) * 100 : 0,
        bySource: grouped
      },
      charts: config.chartType ? [{
        type: config.chartType,
        data: chartData
      }] : undefined,
      total: leads.total
    }
  }

  /**
   * Generate Revenue Report
   */
  private async generateRevenueReport(config: ReportConfig): Promise<ReportResult> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.pipeline === 'undefined') {
      return { data: [], summary: {}, total: 0 }
    }

    const where: any = { won: true }
    if (config.dateRange) {
      where.actualClose = {
        gte: config.dateRange.from,
        lte: config.dateRange.to
      }
    }

    const pipelines = await prisma.pipeline.findMany({ where })

    // Group by month
    const monthly: Record<string, number> = {}
    pipelines.forEach((p: any) => {
      if (p.actualClose) {
        const month = new Date(p.actualClose).toISOString().substring(0, 7) // YYYY-MM
        const value = p.value ? parseFloat(p.value.toString()) : 0
        monthly[month] = (monthly[month] || 0) + value
      }
    })

    const chartData: ChartData = {
      labels: Object.keys(monthly).sort(),
      datasets: [{
        label: 'Revenue',
        data: Object.keys(monthly).sort().map(month => monthly[month]),
        backgroundColor: '#10b981' as string,
        borderColor: '#059669' as string
      }]
    }

    const totalRevenue = Object.values(monthly).reduce((sum, val) => sum + val, 0)

    return {
      data: Object.entries(monthly).map(([month, revenue]) => ({ month, revenue })),
      summary: {
        totalRevenue,
        averageMonthly: Object.keys(monthly).length > 0 ? totalRevenue / Object.keys(monthly).length : 0,
        months: Object.keys(monthly).length
      },
      charts: config.chartType ? [{
        type: config.chartType,
        data: chartData
      }] : undefined,
      total: pipelines.length
    }
  }

  /**
   * Generate Activity Report
   */
  private async generateActivityReport(config: ReportConfig): Promise<ReportResult> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return { data: [], summary: {}, total: 0 }
    }

    const where: any = {}
    if (config.dateRange) {
      where.createdAt = {
        gte: config.dateRange.from,
        lte: config.dateRange.to
      }
    }

    const communications = await prisma.communication.findMany({ where })

    // Group by type
    const grouped: Record<string, number> = {}
    communications.forEach((c: any) => {
      grouped[c.type] = (grouped[c.type] || 0) + 1
    })

    const chartData: ChartData = {
      labels: Object.keys(grouped),
      datasets: [{
        label: 'Communications',
        data: Object.values(grouped) as number[],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'] as string[]
      }]
    }

    return {
      data: communications.map((c: any) => ({
        id: c.id,
        type: c.type,
        client: c.client?.name,
        direction: c.direction,
        createdAt: c.createdAt
      })),
      summary: {
        total: communications.length,
        byType: grouped
      },
      charts: config.chartType ? [{
        type: config.chartType,
        data: chartData
      }] : undefined,
      total: communications.length
    }
  }

  /**
   * Export report to CSV
   */
  async exportToCSV(report: ReportResult): Promise<string> {
    if (report.data.length === 0) {
      return ''
    }

    // Get headers from first data item
    const headers = Object.keys(report.data[0])
    
    // Generate CSV
    const csvRows = [
      headers.join(','),
      ...report.data.map(row => 
        headers.map(header => {
          const value = (row as any)[header]
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ''
        }).join(',')
      )
    ]

    return csvRows.join('\n')
  }

  /**
   * Export report to JSON
   */
  async exportToJSON(report: ReportResult): Promise<string> {
    return JSON.stringify(report, null, 2)
  }
}

