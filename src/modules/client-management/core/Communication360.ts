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
 * Communication 360° View
 * Complete customer interaction timeline with sentiment analysis
 * World-class communication tracking
 */

import { getPrismaClient } from '@/lib/db/prisma'

export interface CommunicationTimeline {
  id: string
  type: string
  subject?: string | null
  content?: string | null
  direction: string
  participants: string[]
  duration?: number | null
  sentiment?: 'positive' | 'neutral' | 'negative'
  sentimentScore?: number
  metadata?: any
  createdAt: Date
  createdBy?: {
    id: string
    name?: string | null
    email?: string | null
  }
}

export interface CommunicationStats {
  total: number
  byType: Record<string, number>
  byDirection: Record<string, number>
  bySentiment: Record<string, number>
  avgResponseTime: number
  totalDuration: number
  recentActivity: CommunicationTimeline[]
}

export class Communication360 {
  /**
   * Get complete communication timeline for a client
   */
  async getClientTimeline(clientId: string): Promise<CommunicationTimeline[]> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return []
    }

    const communications = await prisma.communication.findMany({
      where: { clientId },
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
    })

    return communications.map((comm: any) => {
      const sentiment = this.analyzeSentiment(comm.content || comm.subject || '')
      
      return {
        id: comm.id,
        type: comm.type,
        subject: comm.subject,
        content: comm.content,
        direction: comm.direction,
        participants: comm.participants || [],
        duration: comm.duration,
        sentiment: sentiment.sentiment,
        sentimentScore: sentiment.score,
        metadata: comm.metadata,
        createdAt: comm.createdAt,
        createdBy: comm.createdBy || undefined
      }
    })
  }

  /**
   * Analyze sentiment of communication
   * Simple rule-based sentiment analysis (can be upgraded to ML-based)
   */
  private analyzeSentiment(text: string): {
    sentiment: 'positive' | 'neutral' | 'negative'
    score: number
  } {
    if (!text || text.length === 0) {
      return { sentiment: 'neutral', score: 0 }
    }

    const lowerText = text.toLowerCase()
    
    // Positive keywords
    const positiveKeywords = [
      'takk', 'thank', 'bra', 'good', 'great', 'excellent', 'fantastic', 'wonderful',
      'happy', 'glad', 'pleased', 'satisfied', 'success', 'perfect', 'amazing',
      'love', 'like', 'enjoy', 'appreciate', 'helpful', 'supportive'
    ]
    
    // Negative keywords
    const negativeKeywords = [
      'problem', 'issue', 'error', 'wrong', 'bad', 'poor', 'terrible', 'awful',
      'disappointed', 'angry', 'frustrated', 'upset', 'unhappy', 'dissatisfied',
      'hate', 'dislike', 'complaint', 'refund', 'cancel', 'broken', 'failed'
    ]

    let positiveCount = 0
    let negativeCount = 0

    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) positiveCount++
    })

    negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) negativeCount++
    })

    const score = ((positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount)) * 100

    let sentiment: 'positive' | 'neutral' | 'negative'
    if (score > 20) {
      sentiment = 'positive'
    } else if (score < -20) {
      sentiment = 'negative'
    } else {
      sentiment = 'neutral'
    }

    return { sentiment, score: Math.round(score) }
  }

  /**
   * Get communication statistics for a client
   */
  async getClientStats(clientId: string): Promise<CommunicationStats> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return {
        total: 0,
        byType: {},
        byDirection: {},
        bySentiment: {},
        avgResponseTime: 0,
        totalDuration: 0,
        recentActivity: []
      }
    }

    const communications = await prisma.communication.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    })

    const byType: Record<string, number> = {}
    const byDirection: Record<string, number> = {}
    const bySentiment: Record<string, number> = {}
    let totalDuration = 0
    let totalResponseTime = 0
    let responseCount = 0

    communications.forEach((comm: any) => {
      // Count by type
      byType[comm.type] = (byType[comm.type] || 0) + 1
      
      // Count by direction
      byDirection[comm.direction] = (byDirection[comm.direction] || 0) + 1
      
      // Analyze sentiment
      const sentiment = this.analyzeSentiment(comm.content || comm.subject || '')
      bySentiment[sentiment.sentiment] = (bySentiment[sentiment.sentiment] || 0) + 1
      
      // Sum duration
      if (comm.duration) {
        totalDuration += comm.duration
      }

      // Calculate response time (simplified - would need to track actual response times)
      if (comm.type === 'EMAIL' && comm.direction === 'INBOUND') {
        responseCount++
        // This would need actual response time tracking
      }
    })

    const recentActivity: CommunicationTimeline[] = communications.slice(0, 10).map((comm: any) => {
      const sentiment = this.analyzeSentiment(comm.content || comm.subject || '')
      return {
        id: comm.id,
        type: comm.type,
        subject: comm.subject,
        content: comm.content,
        direction: comm.direction,
        participants: comm.participants || [],
        duration: comm.duration,
        sentiment: sentiment.sentiment,
        sentimentScore: sentiment.score,
        metadata: comm.metadata,
        createdAt: comm.createdAt
      }
    })

    return {
      total: communications.length,
      byType,
      byDirection,
      bySentiment,
      avgResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0,
      totalDuration,
      recentActivity
    }
  }

  /**
   * Get response time metrics
   */
  async getResponseTimeMetrics(clientId: string): Promise<{
    avgResponseTime: number
    medianResponseTime: number
    fastestResponse: number
    slowestResponse: number
  }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.communication === 'undefined') {
      return {
        avgResponseTime: 0,
        medianResponseTime: 0,
        fastestResponse: 0,
        slowestResponse: 0
      }
    }

    // This would require tracking actual response times
    // For now, return placeholder
    return {
      avgResponseTime: 0,
      medianResponseTime: 0,
      fastestResponse: 0,
      slowestResponse: 0
    }
  }
}

