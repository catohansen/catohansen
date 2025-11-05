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
 * InvoiceAgent - AI Agent for Invoice & Payment Automation
 * 
 * Capabilities:
 * - Auto-generate invoices from completed projects
 * - Payment reminders (7, 14, 30 days overdue)
 * - Revenue forecasting
 * - Payment term optimization
 * - Invoice description generation
 */

import { getSystemOrchestrator } from '@/modules/nora/core/system-orchestrator'
import { prisma } from '@/lib/db/prisma'
import { audit } from '@/lib/audit/audit'

export interface InvoiceGenerationResult {
  invoiceNumber: string
  description: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  dueDate: Date
  notes?: string
}

export interface PaymentReminderResult {
  subject: string
  body: string
  urgency: 'low' | 'medium' | 'high'
  shouldSend: boolean
}

export class InvoiceAgent {
  private orchestrator = getSystemOrchestrator()

  /**
   * Generate invoice from project data
   */
  async generateInvoice(project: {
    id: string
    title: string
    clientId?: string
    estimatedValue?: number
    hoursWorked?: number
    hourlyRate?: number
  }): Promise<InvoiceGenerationResult> {
    try {
      const client = project.clientId
        ? await prisma.client.findUnique({ where: { id: project.clientId } })
        : null

      const prompt = `Generer fakturainnhold for dette prosjektet:

Prosjekt: ${project.title}
Kunde: ${client?.name || 'Ukjent'}
Estimert verdi: ${project.estimatedValue || 'Ikke oppgitt'} kr
Timer arbeidet: ${project.hoursWorked || 'Ikke oppgitt'}
Timepris: ${project.hourlyRate || 850} kr

Opprett:
1. Profesjonell fakturabeskrivelse
2. Line items (detaljert oppstilling)
3. Passende betalingsvilkår
4. Notater til kunde (valgfritt)

Format: Norsk standard`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['billing-system', 'invoicing']
      })

      const invoice = this.parseInvoiceResponse(response.content, project)

      // Log action
      await audit({} as any, {
        action: 'ai-agent.invoice.generate',
        resource: 'project',
        target: project.id,
        meta: {
          clientId: project.clientId,
          total: invoice.total
        }
      })

      return invoice
    } catch (error: any) {
      console.error('InvoiceAgent generate error:', error)
      // Fallback: Basic invoice
      const subtotal = project.estimatedValue || (project.hoursWorked || 0) * (project.hourlyRate || 850)
      const tax = subtotal * 0.25
      
      return {
        invoiceNumber: `INV-${Date.now()}`,
        description: `Fakturafor ${project.title}`,
        items: [{
          description: project.title,
          quantity: 1,
          unitPrice: subtotal,
          total: subtotal
        }],
        subtotal,
        tax,
        total: subtotal + tax,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
      }
    }
  }

  /**
   * Generate payment reminder
   */
  async generatePaymentReminder(invoice: {
    invoiceNumber: string
    clientName: string
    amount: number
    dueDate: Date
    daysOverdue: number
  }): Promise<PaymentReminderResult> {
    try {
      const urgency = invoice.daysOverdue > 30 ? 'high' : invoice.daysOverdue > 14 ? 'medium' : 'low'

      const prompt = `Generer betalingspåminnelse:

Faktura: ${invoice.invoiceNumber}
Kunde: ${invoice.clientName}
Beløp: ${invoice.amount} kr
Forfallsdato: ${invoice.dueDate.toLocaleDateString('no-NO')}
Dager forsinket: ${invoice.daysOverdue}

Opprett:
1. Subject-linje (profesjonell, ikke aggressiv)
2. E-post body (høflig men tydelig)
3. Betalingsalternativer
4. Kontaktinfo for spørsmål

Tone: ${urgency === 'high' ? 'Bestemt men profesjonell' : urgency === 'medium' ? 'Vennlig påminnelse' : 'Høflig heads-up'}
Språk: Norsk bokmål`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['billing-system', 'reminders']
      })

      const result = this.parseEmailResponse(response.content)

      // Log action
      await audit({} as any, {
        action: 'ai-agent.invoice.payment-reminder',
        resource: 'invoice',
        meta: {
          invoiceNumber: invoice.invoiceNumber,
          daysOverdue: invoice.daysOverdue,
          urgency
        }
      })

      return {
        ...result,
        urgency,
        shouldSend: invoice.daysOverdue >= 7 // Auto-send after 7 days
      }
    } catch (error: any) {
      console.error('InvoiceAgent reminder error:', error)
      return {
        subject: `Påminnelse: Faktura ${invoice.invoiceNumber}`,
        body: `Hei ${invoice.clientName}!\n\nJeg minner om faktura ${invoice.invoiceNumber} på ${invoice.amount} kr som forfalt ${invoice.dueDate.toLocaleDateString('no-NO')}.\n\nVennligst betal snarest.\n\nMvh,\nCato Hansen`,
        urgency: 'medium',
        shouldSend: false
      }
    }
  }

  /**
   * Parse invoice response from AI
   */
  private parseInvoiceResponse(response: string, project: any): InvoiceGenerationResult {
    // Simple parsing - extract key info
    const subtotal = project.estimatedValue || (project.hoursWorked || 0) * (project.hourlyRate || 850)
    const tax = subtotal * 0.25
    
    return {
      invoiceNumber: `INV-${Date.now()}`,
      description: `Konsulentarbeid: ${project.title}`,
      items: [{
        description: project.title,
        quantity: project.hoursWorked || 1,
        unitPrice: project.hourlyRate || subtotal,
        total: subtotal
      }],
      subtotal,
      tax,
      total: subtotal + tax,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes: response.substring(0, 200)
    }
  }

  /**
   * Parse email response
   */
  private parseEmailResponse(response: string): { subject: string; body: string } {
    const lines = response.split('\n')
    let subject = lines[0] || 'Påminnelse'
    let body = lines.slice(1).join('\n') || response
    
    return { subject, body }
  }
}

// Singleton
let invoiceAgent: InvoiceAgent | null = null

export function getInvoiceAgent(): InvoiceAgent {
  if (!invoiceAgent) {
    invoiceAgent = new InvoiceAgent()
  }
  return invoiceAgent
}

