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
 * AI Insights Engine
 * Predictive analytics, AI recommendations, content generation
 * World-class AI-powered insights for CRM
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { ClientManager } from './ClientManager'
import { PipelineManager } from './PipelineManager'
import { LeadManager } from './LeadManager'

export interface AIRecommendation {
  type: 'next_action' | 'follow_up' | 'upsell' | 'cross_sell' | 'risk_alert' | 'opportunity'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  description: string
  confidence: number // 0-100
  action?: {
    type: string
    data: any
  }
}

export interface PredictiveAnalysis {
  dealWinProbability?: number
  churnRisk?: number
  leadConversionProbability?: number
  revenueForecast?: number
  confidence: number
  factors: string[]
}

export interface ContentSuggestion {
  type: 'email' | 'meeting_notes' | 'proposal' | 'report'
  subject?: string
  content: string
  suggestions: string[]
}

export class AIInsightsEngine {
  private clientManager: ClientManager
  private pipelineManager: PipelineManager
  private leadManager: LeadManager

  constructor() {
    this.clientManager = new ClientManager()
    this.pipelineManager = new PipelineManager()
    this.leadManager = new LeadManager()
  }

  /**
   * Get AI recommendations for a client
   */
  async getClientRecommendations(clientId: string): Promise<AIRecommendation[]> {
    const client = await this.clientManager.getClientById(clientId, true)
    if (!client) {
      return []
    }

    const recommendations: AIRecommendation[] = []

    // Check for follow-up needed
    const lastCommunication = await this.getLastCommunication(clientId)
    if (lastCommunication) {
      const daysSinceLastContact = (Date.now() - new Date(lastCommunication.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceLastContact > 30) {
        recommendations.push({
          type: 'follow_up',
          priority: 'high',
          title: 'Follow-up Needed',
          description: `No contact with ${client.name} in ${Math.round(daysSinceLastContact)} days. Consider reaching out.`,
          confidence: 85,
          action: {
            type: 'create_task',
            data: {
              title: `Follow-up with ${client.name}`,
              clientId,
              priority: 'HIGH',
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
            }
          }
        })
      }
    }

    // Check for upsell opportunities
    const activePipelines = await this.pipelineManager.getPipelines({ clientId })
    if (activePipelines.data.length > 0) {
      const totalValue = activePipelines.data.reduce((sum: number, p: any) => 
        sum + (p.value ? parseFloat(p.value.toString()) : 0), 0
      )

      if (totalValue > 0 && totalValue < 100000) {
        recommendations.push({
          type: 'upsell',
          priority: 'medium',
          title: 'Upsell Opportunity',
          description: `Client has ${activePipelines.data.length} active deals. Consider additional services.`,
          confidence: 70
        })
      }
    }

    // Check for churn risk
    const churnRisk = await this.predictChurnRisk(clientId)
    if (churnRisk > 70) {
      recommendations.push({
        type: 'risk_alert',
        priority: 'urgent',
        title: 'High Churn Risk',
        description: `Client has high churn risk (${churnRisk}%). Immediate action recommended.`,
        confidence: churnRisk,
        action: {
          type: 'notify',
          data: {
            title: 'Churn Risk Alert',
            message: `${client.name} has high churn risk`
          }
        }
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  /**
   * Predict deal win probability
   */
  async predictDealWinProbability(dealId: string): Promise<PredictiveAnalysis> {
    const pipeline = await this.pipelineManager.getPipelineById(dealId)
    if (!pipeline) {
      return { confidence: 0, factors: [] }
    }

    const factors: string[] = []
    let probability = pipeline.probability || 50

    // Adjust based on stage
    const stageWeights: Record<string, number> = {
      'DISCOVERY': 0.3,
      'QUALIFICATION': 0.4,
      'PROPOSAL': 0.6,
      'NEGOTIATION': 0.8,
      'CLOSED_WON': 1.0,
      'CLOSED_LOST': 0.0
    }
    
    const stageWeight = stageWeights[pipeline.stage] || 0.5
    probability = probability * stageWeight

    if (pipeline.stage === 'NEGOTIATION') {
      factors.push('Deal is in negotiation phase')
      probability += 10
    }

    // Check client history
    if (pipeline.clientId) {
      const client = await this.clientManager.getClientById(pipeline.clientId)
      if (client) {
        if (client.status === 'ACTIVE') {
          factors.push('Client is active and engaged')
          probability += 5
        }
      }
    }

    // Check deal value
    const value = pipeline.value ? parseFloat(pipeline.value.toString()) : 0
    if (value > 100000) {
      factors.push('High-value deal')
      probability += 5
    }

    // Check expected close date
    if (pipeline.expectedClose) {
      const daysUntilClose = (new Date(pipeline.expectedClose).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      if (daysUntilClose < 30 && daysUntilClose > 0) {
        factors.push('Closing date is approaching')
        probability += 5
      } else if (daysUntilClose < 0) {
        factors.push('Expected close date has passed')
        probability -= 10
      }
    }

    probability = Math.max(0, Math.min(100, Math.round(probability)))

    return {
      dealWinProbability: probability,
      confidence: 75,
      factors
    }
  }

  /**
   * Predict churn risk for a client
   */
  async predictChurnRisk(clientId: string): Promise<number> {
    const client = await this.clientManager.getClientById(clientId, true)
    if (!client) {
      return 0
    }

    let risk = 0
    const factors: string[] = []

    // Check last communication
    const lastCommunication = await this.getLastCommunication(clientId)
    if (lastCommunication) {
      const daysSinceLastContact = (Date.now() - new Date(lastCommunication.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceLastContact > 90) {
        risk += 40
        factors.push('No contact in over 90 days')
      } else if (daysSinceLastContact > 60) {
        risk += 25
        factors.push('No contact in over 60 days')
      }
    } else {
      risk += 30
      factors.push('No communication history')
    }

    // Check status
    if (client.status === 'INACTIVE') {
      risk += 30
      factors.push('Client marked as inactive')
    }

    // Check active deals
    const pipelines = await this.pipelineManager.getPipelines({ clientId })
    if (pipelines.data.length === 0) {
      risk += 20
      factors.push('No active deals')
    }

    // Check lifecycle stage
    if (client.lifecycleStage === 'Churned') {
      risk = 100
    }

    return Math.max(0, Math.min(100, Math.round(risk)))
  }

  /**
   * Get next best action for a deal
   */
  async getNextBestAction(dealId: string): Promise<AIRecommendation | null> {
    const pipeline = await this.pipelineManager.getPipelineById(dealId)
    if (!pipeline) {
      return null
    }

    const stageActions: Record<string, AIRecommendation> = {
      'DISCOVERY': {
        type: 'next_action',
        priority: 'high',
        title: 'Schedule Discovery Call',
        description: 'Schedule a discovery call to understand client needs better.',
        confidence: 85,
        action: {
          type: 'create_task',
          data: {
            title: 'Schedule discovery call',
            pipelineId: dealId,
            priority: 'HIGH'
          }
        }
      },
      'QUALIFICATION': {
        type: 'next_action',
        priority: 'high',
        title: 'Send Qualification Questions',
        description: 'Send qualification questions to ensure deal fits your criteria.',
        confidence: 80,
        action: {
          type: 'send_email',
          data: {
            template: 'qualification',
            pipelineId: dealId
          }
        }
      },
      'PROPOSAL': {
        type: 'next_action',
        priority: 'urgent',
        title: 'Send Proposal',
        description: 'Create and send proposal to client.',
        confidence: 90,
        action: {
          type: 'create_task',
          data: {
            title: 'Send proposal',
            pipelineId: dealId,
            priority: 'URGENT'
          }
        }
      },
      'NEGOTIATION': {
        type: 'next_action',
        priority: 'high',
        title: 'Follow Up on Negotiation',
        description: 'Follow up on negotiation terms and address any concerns.',
        confidence: 85,
        action: {
          type: 'create_task',
          data: {
            title: 'Follow up on negotiation',
            pipelineId: dealId,
            priority: 'HIGH'
          }
        }
      }
    }

    return stageActions[pipeline.stage] || null
  }

  /**
   * Generate email content suggestion
   */
  async generateEmailContent(clientId: string, purpose: 'follow_up' | 'proposal' | 'meeting' | 'thank_you'): Promise<ContentSuggestion> {
    const client = await this.clientManager.getClientById(clientId)
    if (!client) {
      throw new Error('Client not found')
    }

    const templates: Record<string, ContentSuggestion> = {
      follow_up: {
        type: 'email',
        subject: `Following up with ${client.name}`,
        content: `Hi ${client.name},\n\nI wanted to follow up on our previous conversation. I hope everything is going well.\n\nPlease let me know if you have any questions or if there's anything I can help with.\n\nBest regards`,
        suggestions: [
          'Include specific details from last conversation',
          'Mention next steps if any',
          'Add a call-to-action'
        ]
      },
      proposal: {
        type: 'email',
        subject: `Proposal for ${client.name}`,
        content: `Hi ${client.name},\n\nThank you for your interest in our services. I've prepared a proposal that outlines how we can help you achieve your goals.\n\nPlease review the attached proposal and let me know if you have any questions.\n\nLooking forward to working with you.\n\nBest regards`,
        suggestions: [
          'Attach the proposal document',
          'Include key highlights from proposal',
          'Suggest a call to discuss'
        ]
      },
      meeting: {
        type: 'email',
        subject: `Meeting request - ${client.name}`,
        content: `Hi ${client.name},\n\nI'd like to schedule a meeting to discuss how we can help you with [topic].\n\nAre you available for a call this week? Please let me know what time works best for you.\n\nBest regards`,
        suggestions: [
          'Include meeting agenda',
          'Suggest specific times',
          'Provide calendar link'
        ]
      },
      thank_you: {
        type: 'email',
        subject: `Thank you - ${client.name}`,
        content: `Hi ${client.name},\n\nThank you for your business! I wanted to express my gratitude for choosing us.\n\nWe're excited to work with you and deliver exceptional results.\n\nPlease don't hesitate to reach out if you need anything.\n\nBest regards`,
        suggestions: [
          'Personalize with specific details',
          'Mention next steps',
          'Request feedback'
        ]
      }
    }

    return templates[purpose] || {
      type: 'email',
      subject: `Email to ${client.name}`,
      content: `Hi ${client.name},\n\n[Your message here]`,
      suggestions: ['Personalize the message', 'Include relevant details', 'Add clear call-to-action']
    }
  }

  /**
   * Get cross-sell/upsell suggestions
   */
  async getUpsellSuggestions(clientId: string): Promise<AIRecommendation[]> {
    const client = await this.clientManager.getClientById(clientId, true)
    if (!client) {
      return []
    }

    const suggestions: AIRecommendation[] = []

    // Check active deals
    const pipelines = await this.pipelineManager.getPipelines({ clientId })
    
    if (pipelines.data.length > 0) {
      suggestions.push({
        type: 'upsell',
        priority: 'medium',
        title: 'Additional Services',
        description: 'Client has active deals. Consider suggesting additional services or upgrades.',
        confidence: 70
      })
    }

    // Check client lifecycle stage
    if (client.lifecycleStage === 'Customer') {
      suggestions.push({
        type: 'cross_sell',
        priority: 'low',
        title: 'Cross-sell Opportunity',
        description: 'Existing customer - opportunity for cross-selling related services.',
        confidence: 60
      })
    }

    return suggestions
  }

  /**
   * Get last communication for a client
   */
  private async getLastCommunication(clientId: string): Promise<any | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return null
    }

    const communication = await prisma.communication.findFirst({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    })

    return communication
  }
}







