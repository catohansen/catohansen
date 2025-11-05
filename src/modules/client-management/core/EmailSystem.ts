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
 * Email System
 * Complete email management system for CRM
 * Send, receive, track, and manage emails
 * 100% vårt eget system - ingen ekstern avhengighet
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { CommunicationLogger } from './CommunicationLogger'
import { automationEngine } from './AutomationEngine'

export interface EmailData {
  id: string
  from: string
  to: string
  cc?: string | null
  bcc?: string | null
  subject: string
  body: string
  htmlBody?: string | null
  status: 'draft' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
  sentAt?: Date | null
  deliveredAt?: Date | null
  openedAt?: Date | null
  clickedAt?: Date | null
  bouncedAt?: Date | null
  clientId?: string | null
  pipelineId?: string | null
  templateId?: string | null
  metadata?: any
  attachments?: EmailAttachment[]
  createdAt: Date
  updatedAt: Date
}

export interface EmailAttachment {
  filename: string
  contentType: string
  size: number
  url?: string
}

export interface CreateEmailInput {
  from: string
  to: string
  cc?: string
  bcc?: string
  subject: string
  body: string
  htmlBody?: string
  clientId?: string
  pipelineId?: string
  templateId?: string
  attachments?: EmailAttachment[]
  metadata?: any
}

export interface EmailFilters {
  clientId?: string
  pipelineId?: string
  status?: string
  from?: string
  to?: string
  search?: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  htmlBody?: string
  variables: string[]
}

export class EmailSystem {
  private communicationLogger: CommunicationLogger

  constructor() {
    this.communicationLogger = new CommunicationLogger()
  }

  /**
   * Send email
   */
  async sendEmail(input: CreateEmailInput, userId?: string): Promise<EmailData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      throw new Error('Database not available')
    }

    // Create communication log entry
    const communication = await this.communicationLogger.createCommunication({
      clientId: input.clientId,
      pipelineId: input.pipelineId,
      type: 'EMAIL',
      direction: 'OUTBOUND',
      subject: input.subject,
      content: input.htmlBody || input.body,
      metadata: {
        from: input.from,
        to: input.to,
        cc: input.cc,
        bcc: input.bcc,
        attachments: input.attachments,
        templateId: input.templateId,
        ...input.metadata
      }
    }, userId)

    // Simulate email sending (replace with actual SMTP implementation)
    const emailStatus: 'sent' | 'delivered' | 'failed' = await this.simulateEmailSend(input)

    // Update communication with status
    const updatedCommunication = await this.communicationLogger.updateCommunication(communication.id, {
      metadata: {
        ...communication.metadata,
        status: emailStatus,
        sentAt: new Date()
      }
    })

    // Trigger automation engine event
    automationEngine.triggerEvent('email.sent', {
      id: communication.id,
      to: input.to,
      subject: input.subject,
      status: emailStatus,
      from: input.from,
      clientId: input.clientId,
      pipelineId: input.pipelineId,
      templateId: input.templateId
    })

    return this.mapToEmailData(updatedCommunication, emailStatus)
  }

  /**
   * Simulate email sending (replace with actual SMTP)
   */
  private async simulateEmailSend(input: CreateEmailInput): Promise<'sent' | 'delivered' | 'failed'> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Simulate 95% success rate
    const success = Math.random() > 0.05

    if (!success) {
      return 'failed'
    }

    // Simulate delivery (50% chance of immediate delivery, 50% delayed)
    const immediate = Math.random() > 0.5
    return immediate ? 'delivered' : 'sent'
  }

  /**
   * Get emails with filters
   */
  async getEmails(filters?: EmailFilters): Promise<{ data: EmailData[], total: number }> {
    const where: any = {
      type: 'EMAIL'
    }

    if (filters?.clientId) where.clientId = filters.clientId
    if (filters?.pipelineId) where.pipelineId = filters.pipelineId
    if (filters?.from) where.metadata = { path: ['from'], equals: filters.from }
    if (filters?.to) where.metadata = { path: ['to'], equals: filters.to }
    if (filters?.status) where.metadata = { path: ['status'], equals: filters.status }
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom
      if (filters.dateTo) where.createdAt.lte = filters.dateTo
    }
    if (filters?.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const result = await this.communicationLogger.getCommunications({
      ...where,
      limit: filters?.limit || 100,
      offset: filters?.offset || 0
    })

    return {
      data: result.data.map((comm: any) => this.mapToEmailData(comm, comm.metadata?.status || 'sent')),
      total: result.total
    }
  }

  /**
   * Get email by ID
   */
  async getEmailById(emailId: string): Promise<EmailData | null> {
    const communication = await this.communicationLogger.getCommunicationById(emailId)
    if (!communication || communication.type !== 'EMAIL') {
      return null
    }

    return this.mapToEmailData(communication, communication.metadata?.status || 'sent')
  }

  /**
   * Track email open
   */
  async trackEmailOpen(emailId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return
    }

    const communication = await prisma.communication.findUnique({
      where: { id: emailId }
    })

    if (!communication || (communication.type as string) !== 'EMAIL') {
      return
    }

    const metadata = (communication.metadata as any) || {}
    if (!metadata.openedAt) {
      metadata.openedAt = new Date()
      metadata.status = 'opened'

      await prisma.communication.update({
        where: { id: emailId },
        data: { metadata }
      })

      // Trigger automation engine event
      automationEngine.triggerEvent('email.opened', {
        id: emailId,
        openedAt: metadata.openedAt
      })
    }
  }

  /**
   * Track email click
   */
  async trackEmailClick(emailId: string, link?: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return
    }

    const communication = await prisma.communication.findUnique({
      where: { id: emailId }
    })

    if (!communication || (communication.type as string) !== 'EMAIL') {
      return
    }

    const metadata = (communication.metadata as any) || {}
    if (!metadata.clickedAt) {
      metadata.clickedAt = new Date()
      metadata.status = 'clicked'
      if (link) {
        metadata.clickedLink = link
      }

      await prisma.communication.update({
        where: { id: emailId },
        data: { metadata }
      })

      // Trigger automation engine event
      automationEngine.triggerEvent('email.clicked', {
        id: emailId,
        clickedAt: metadata.clickedAt,
        link
      })
    }
  }

  /**
   * Mark email as bounced
   */
  async markEmailBounced(emailId: string, reason?: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return
    }

    const communication = await prisma.communication.findUnique({
      where: { id: emailId }
    })

    if (!communication || (communication.type as string) !== 'EMAIL') {
      return
    }

    const metadata = (communication.metadata as any) || {}
    metadata.bouncedAt = new Date()
    metadata.status = 'bounced'
    if (reason) {
      metadata.bounceReason = reason
    }

    await prisma.communication.update({
      where: { id: emailId },
      data: { metadata }
    })

    // Trigger automation engine event
    automationEngine.triggerEvent('email.bounced', {
      id: emailId,
      bouncedAt: metadata.bouncedAt,
      reason
    })
  }

  /**
   * Generate email from template
   */
  async generateEmailFromTemplate(
    templateId: string,
    variables: Record<string, any>,
    to: string,
    clientId?: string,
    pipelineId?: string,
    userId?: string
  ): Promise<EmailData> {
    const template = await this.getEmailTemplate(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    // Replace variables in template
    let subject = template.subject
    let body = template.body
    let htmlBody = template.htmlBody || template.body

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      subject = subject.replace(regex, String(value || ''))
      body = body.replace(regex, String(value || ''))
      htmlBody = htmlBody.replace(regex, String(value || ''))
    }

    // Send email
    return this.sendEmail({
      from: process.env.EMAIL_FROM || 'noreply@catohansen.no',
      to,
      subject,
      body,
      htmlBody,
      clientId,
      pipelineId,
      templateId,
      metadata: { variables }
    }, userId)
  }

  /**
   * Get email template
   */
  async getEmailTemplate(templateId: string): Promise<EmailTemplate | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.emailTemplate === 'undefined') {
      return null
    }

    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId }
    })

    if (!template) return null

    return {
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
      // htmlBody not in EmailTemplate schema - use body or metadata if needed
      htmlBody: undefined,
      variables: template.variables as string[] || []
    }
  }

  /**
   * Get email statistics
   */
  async getEmailStats(clientId?: string, pipelineId?: string): Promise<{
    total: number
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    failed: number
    openRate: number
    clickRate: number
    bounceRate: number
  }> {
    const emails = await this.getEmails({ clientId, pipelineId, limit: 10000 })

    const stats = {
      total: emails.data.length,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      failed: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0
    }

    emails.data.forEach((email: any) => {
      const status = email.status || 'sent'
      if (status === 'sent' || status === 'delivered' || status === 'opened' || status === 'clicked') stats.sent++
      if (status === 'delivered' || status === 'opened' || status === 'clicked') stats.delivered++
      if (status === 'opened' || status === 'clicked') stats.opened++
      if (status === 'clicked') stats.clicked++
      if (status === 'bounced') stats.bounced++
      if (status === 'failed') stats.failed++
    })

    if (stats.sent > 0) {
      stats.openRate = (stats.opened / stats.sent) * 100
      stats.clickRate = (stats.clicked / stats.sent) * 100
      stats.bounceRate = (stats.bounced / stats.sent) * 100
    }

    return stats
  }

  private mapToEmailData(communication: any, status: string): EmailData {
    const metadata = communication.metadata || {}
    
    return {
      id: communication.id,
      from: metadata.from || '',
      to: metadata.to || '',
      cc: metadata.cc || null,
      bcc: metadata.bcc || null,
      subject: communication.subject || '',
      body: communication.content || '',
      htmlBody: metadata.htmlBody || communication.content || null,
      status: status as any,
      sentAt: metadata.sentAt ? new Date(metadata.sentAt) : null,
      deliveredAt: metadata.deliveredAt ? new Date(metadata.deliveredAt) : null,
      openedAt: metadata.openedAt ? new Date(metadata.openedAt) : null,
      clickedAt: metadata.clickedAt ? new Date(metadata.clickedAt) : null,
      bouncedAt: metadata.bouncedAt ? new Date(metadata.bouncedAt) : null,
      clientId: communication.clientId || null,
      pipelineId: communication.pipelineId || null,
      templateId: metadata.templateId || null,
      metadata: communication.metadata,
      attachments: metadata.attachments || [],
      createdAt: communication.createdAt,
      updatedAt: communication.updatedAt
    }
  }
}

