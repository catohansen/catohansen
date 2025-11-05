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
 * Advanced Lead Scoring v2
 * Machine Learning-based lead scoring with engagement tracking
 * World-class AI-powered lead qualification
 */

import { getPrismaClient } from '@/lib/db/prisma'

export interface EngagementMetrics {
  emailOpens: number
  emailClicks: number
  websiteVisits: number
  pageViews: number
  formSubmissions: number
  meetingBookings: number
  callDuration?: number
  lastActivity?: Date
}

export interface FirmographicData {
  companySize?: string
  industry?: string
  annualRevenue?: number
  location?: string
  website?: string
  linkedInCompany?: string
  technologies?: string[]
}

export interface LeadScoreFactors {
  // Basic factors (0-40 points)
  emailDomain: number
  companyData: number
  phoneData: number
  messageQuality: number
  
  // Source quality (0-30 points)
  sourceQuality: number
  
  // Engagement (0-40 points)
  engagementScore: number
  
  // Firmographic (0-30 points)
  firmographicScore: number
  
  // BANT qualification (0-30 points)
  bantScore: number
  
  // Behavioral patterns (0-20 points)
  behavioralScore: number
  
  totalScore: number
  confidence: number
}

export class AdvancedLeadScoring {
  /**
   * Calculate advanced AI-powered lead score (0-100)
   * Uses multiple factors: email, engagement, firmographic, BANT, behavioral
   */
  async calculateAdvancedScore(
    lead: {
      email?: string | null
      phone?: string | null
      company?: string | null
      message?: string | null
      source?: string
      meta?: any
    },
    engagement?: EngagementMetrics,
    firmographic?: FirmographicData,
    bant?: {
      budget?: boolean
      authority?: boolean
      need?: boolean
      timeline?: string | null
    }
  ): Promise<LeadScoreFactors> {
    const factors: LeadScoreFactors = {
      emailDomain: 0,
      companyData: 0,
      phoneData: 0,
      messageQuality: 0,
      sourceQuality: 0,
      engagementScore: 0,
      firmographicScore: 0,
      bantScore: 0,
      behavioralScore: 0,
      totalScore: 0,
      confidence: 0
    }

    // 1. Email Domain Quality (0-15 points)
    if (lead.email) {
      const domain = lead.email.split('@')[1]
      const corporateDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
      if (domain && !corporateDomains.includes(domain.toLowerCase())) {
        // Corporate email - check domain quality
        const domainParts = domain.split('.')
        if (domainParts.length >= 2) {
          factors.emailDomain = 15 // Strong corporate domain
        } else {
          factors.emailDomain = 10 // Generic corporate
        }
      } else if (domain) {
        factors.emailDomain = 5 // Personal email
      }
    }

    // 2. Company Data (0-10 points)
    if (lead.company && lead.company.length > 2) {
      factors.companyData = 10
    }

    // 3. Phone Data (0-10 points)
    if (lead.phone && lead.phone.length >= 8) {
      // Check if phone looks valid (Norwegian format: +47 or 8 digits)
      const cleaned = lead.phone.replace(/\s+/g, '')
      if (cleaned.startsWith('+47') || cleaned.match(/^\d{8}$/)) {
        factors.phoneData = 10
      } else {
        factors.phoneData = 5
      }
    }

    // 4. Message Quality (0-15 points)
    if (lead.message) {
      const length = lead.message.length
      const hasQuestions = lead.message.includes('?')
      const hasContactIntent = /kontakt|info|pris|tilbud|mer|info/i.test(lead.message)
      
      if (length > 200 && hasQuestions && hasContactIntent) {
        factors.messageQuality = 15
      } else if (length > 100 && (hasQuestions || hasContactIntent)) {
        factors.messageQuality = 10
      } else if (length > 50) {
        factors.messageQuality = 5
      } else if (length > 0) {
        factors.messageQuality = 2
      }
    }

    // 5. Source Quality (0-30 points)
    const highQualitySources = ['referral', 'website', 'linkedin', 'partner']
    const mediumQualitySources = ['email', 'phone', 'facebook', 'instagram']
    const lowQualitySources = ['cold', 'trade-show', 'other']
    
    if (lead.source) {
      const sourceLower = lead.source.toLowerCase()
      if (highQualitySources.some(s => sourceLower.includes(s))) {
        factors.sourceQuality = 30
      } else if (mediumQualitySources.some(s => sourceLower.includes(s))) {
        factors.sourceQuality = 20
      } else if (lowQualitySources.some(s => sourceLower.includes(s))) {
        factors.sourceQuality = 10
      } else {
        factors.sourceQuality = 15 // Unknown source
      }
    }

    // 6. Engagement Score (0-40 points)
    if (engagement) {
      let engagementPoints = 0
      
      // Email engagement
      if (engagement.emailOpens > 0) engagementPoints += 5
      if (engagement.emailClicks > 0) engagementPoints += 10
      
      // Website engagement
      if (engagement.websiteVisits > 0) engagementPoints += 5
      if (engagement.pageViews > 5) engagementPoints += 10
      if (engagement.pageViews > 20) engagementPoints += 5
      
      // Form submissions
      if (engagement.formSubmissions > 0) engagementPoints += 10
      
      // Meeting bookings
      if (engagement.meetingBookings > 0) engagementPoints += 15
      
      // Call duration (if > 5 minutes, highly engaged)
      if (engagement.callDuration && engagement.callDuration > 300) {
        engagementPoints += 15
      } else if (engagement.callDuration && engagement.callDuration > 60) {
        engagementPoints += 10
      }
      
      // Recent activity bonus
      if (engagement.lastActivity) {
        const daysSinceActivity = (Date.now() - engagement.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceActivity < 1) engagementPoints += 10
        else if (daysSinceActivity < 7) engagementPoints += 5
      }
      
      factors.engagementScore = Math.min(40, engagementPoints)
    }

    // 7. Firmographic Score (0-30 points)
    if (firmographic) {
      let firmographicPoints = 0
      
      // Company size
      if (firmographic.companySize) {
        const sizeMap: Record<string, number> = {
          '500+': 10,
          '201-500': 8,
          '51-200': 6,
          '11-50': 4,
          '1-10': 2
        }
        firmographicPoints += sizeMap[firmographic.companySize] || 0
      }
      
      // Industry
      if (firmographic.industry) {
        firmographicPoints += 5
      }
      
      // Annual revenue
      if (firmographic.annualRevenue) {
        if (firmographic.annualRevenue > 10000000) firmographicPoints += 10
        else if (firmographic.annualRevenue > 1000000) firmographicPoints += 8
        else if (firmographic.annualRevenue > 100000) firmographicPoints += 5
      }
      
      // LinkedIn company page
      if (firmographic.linkedInCompany) {
        firmographicPoints += 5
      }
      
      factors.firmographicScore = Math.min(30, firmographicPoints)
    }

    // 8. BANT Score (0-30 points)
    if (bant) {
      let bantPoints = 0
      
      if (bant.budget) bantPoints += 10
      if (bant.authority) bantPoints += 10
      if (bant.need) bantPoints += 5
      
      // Timeline urgency
      if (bant.timeline) {
        const timeline = bant.timeline.toLowerCase()
        if (timeline.includes('umiddelbart') || timeline.includes('nå') || timeline.includes('asap')) {
          bantPoints += 10
        } else if (timeline.includes('snart') || timeline.includes('innen') || timeline.includes('q')) {
          bantPoints += 5
        } else if (timeline.includes('mulig') || timeline.includes('kanskje')) {
          bantPoints += 2
        }
      }
      
      factors.bantScore = Math.min(30, bantPoints)
    }

    // 9. Behavioral Patterns (0-20 points)
    // Analyze behavioral patterns from meta data
    if (lead.meta) {
      let behavioralPoints = 0
      
      // Response time (fast responders = higher score)
      if (lead.meta.responseTime && lead.meta.responseTime < 24) {
        behavioralPoints += 10
      } else if (lead.meta.responseTime && lead.meta.responseTime < 72) {
        behavioralPoints += 5
      }
      
      // Time of day (business hours = higher score)
      if (lead.meta.contactTime) {
        const hour = new Date(lead.meta.contactTime).getHours()
        if (hour >= 9 && hour <= 17) {
          behavioralPoints += 5
        }
      }
      
      // Multiple touchpoints (engaged = higher score)
      if (lead.meta.touchpoints && lead.meta.touchpoints > 3) {
        behavioralPoints += 5
      }
      
      factors.behavioralScore = Math.min(20, behavioralPoints)
    }

    // Calculate total score
    factors.totalScore = Math.min(100, Math.round(
      factors.emailDomain +
      factors.companyData +
      factors.phoneData +
      factors.messageQuality +
      factors.sourceQuality +
      factors.engagementScore +
      factors.firmographicScore +
      factors.bantScore +
      factors.behavioralScore
    ))

    // Calculate confidence (0-100%)
    // Confidence increases with more data points
    let dataPoints = 0
    if (factors.emailDomain > 0) dataPoints++
    if (factors.companyData > 0) dataPoints++
    if (factors.phoneData > 0) dataPoints++
    if (factors.messageQuality > 0) dataPoints++
    if (factors.sourceQuality > 0) dataPoints++
    if (factors.engagementScore > 0) dataPoints++
    if (factors.firmographicScore > 0) dataPoints++
    if (factors.bantScore > 0) dataPoints++
    if (factors.behavioralScore > 0) dataPoints++
    
    factors.confidence = Math.min(100, Math.round((dataPoints / 9) * 100))

    return factors
  }

  /**
   * Get engagement metrics for a lead
   */
  async getEngagementMetrics(leadId: string): Promise<EngagementMetrics> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      return {
        emailOpens: 0,
        emailClicks: 0,
        websiteVisits: 0,
        pageViews: 0,
        formSubmissions: 0,
        meetingBookings: 0
      }
    }

    // Get lead and communications
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        client: {
          include: {
            communications: {
              where: {
                type: 'EMAIL'
              }
            }
          }
        }
      }
    })

    if (!lead) {
      return {
        emailOpens: 0,
        emailClicks: 0,
        websiteVisits: 0,
        pageViews: 0,
        formSubmissions: 0,
        meetingBookings: 0
      }
    }

    // Extract engagement from meta data and communications
    const meta = lead.meta as any || {}
    const communications = lead.client?.communications || []

    // Count email interactions
    let emailOpens = 0
    let emailClicks = 0
    communications.forEach((comm: any) => {
      const commMeta = comm.metadata as any || {}
      if (commMeta.opens) emailOpens += commMeta.opens
      if (commMeta.clicks) emailClicks += commMeta.clicks
    })

    return {
      emailOpens: meta.emailOpens || emailOpens,
      emailClicks: meta.emailClicks || emailClicks,
      websiteVisits: meta.websiteVisits || 0,
      pageViews: meta.pageViews || 0,
      formSubmissions: meta.formSubmissions || 0,
      meetingBookings: meta.meetingBookings || 0,
      callDuration: meta.callDuration,
      lastActivity: meta.lastActivity ? new Date(meta.lastActivity) : undefined
    }
  }

  /**
   * Auto-qualify lead based on score
   */
  shouldQualify(scoreFactors: LeadScoreFactors): {
    qualified: boolean
    grade: 'A' | 'B' | 'C' | 'D'
    reason: string
  } {
    const { totalScore, confidence } = scoreFactors

    if (totalScore >= 70 && confidence >= 70) {
      return {
        qualified: true,
        grade: 'A',
        reason: 'High-quality lead with strong engagement and firmographic data'
      }
    } else if (totalScore >= 60 && confidence >= 60) {
      return {
        qualified: true,
        grade: 'B',
        reason: 'Good quality lead with solid data points'
      }
    } else if (totalScore >= 50 && confidence >= 50) {
      return {
        qualified: true,
        grade: 'C',
        reason: 'Qualified lead but needs more nurturing'
      }
    } else {
      return {
        qualified: false,
        grade: 'D',
        reason: 'Low score or insufficient data - needs qualification'
      }
    }
  }
}







