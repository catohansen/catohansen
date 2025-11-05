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
 * ClientAgent - AI Agent for Client Management Automation
 * 
 * Capabilities:
 * - Auto-respond to new leads
 * - Follow-up reminders
 * - Lead qualification scoring
 * - Email drafting
 * - Meeting scheduling suggestions
 */

import { getSystemOrchestrator } from '@/modules/nora/core/system-orchestrator'
import { prisma } from '@/lib/db/prisma'
import { audit } from '@/lib/audit/audit'

export interface AutoResponseResult {
  subject: string
  body: string
  tone: 'professional' | 'friendly' | 'enthusiastic'
  shouldSend: boolean
  confidence: number
}

export interface LeadScoringResult {
  score: number // 0-100
  qualification: 'cold' | 'warm' | 'hot'
  reasons: string[]
  nextActions: string[]
}

export class ClientAgent {
  private orchestrator = getSystemOrchestrator()

  /**
   * Generate auto-response for new lead
   */
  async generateAutoResponse(lead: {
    name?: string
    email?: string
    company?: string
    message?: string
    source?: string
  }): Promise<AutoResponseResult> {
    try {
      const prompt = `Generer profesjonell auto-respons for denne lead:

Navn: ${lead.name || 'Ikke oppgitt'}
E-post: ${lead.email || 'Ikke oppgitt'}
Firma: ${lead.company || 'Ikke oppgitt'}
Melding: ${lead.message || 'Ingen melding'}
Kilde: ${lead.source || 'Website'}

Opprett:
1. Subject-linje (profesjonell og engasjerende)
2. E-post body (varm, personlig, actionable)
3. Avslutt med konkret next step (møte-invitasjon)

Tone: Profesjonell men vennlig
Språk: Norsk bokmål`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['client-management', 'crm']
      })

      const parsed = this.parseEmailResponse(response.content)

      // Log action
      await audit({} as any, {
        action: 'ai-agent.client.auto-response',
        resource: 'lead',
        meta: {
          leadEmail: lead.email,
          source: lead.source,
          confidence: parsed.confidence
        }
      })

      return parsed
    } catch (error: any) {
      console.error('ClientAgent auto-response error:', error)
      // Fallback response
      return {
        subject: 'Takk for din henvendelse',
        body: `Hei${lead.name ? ' ' + lead.name : ''}!\n\nTakk for at du tok kontakt. Jeg vil svare deg personlig innen 24 timer.\n\nMvh,\nCato Hansen`,
        tone: 'professional',
        shouldSend: false, // Manual approval recommended
        confidence: 0.5
      }
    }
  }

  /**
   * Score and qualify lead using AI
   */
  async scoreLead(lead: {
    name?: string
    email?: string
    company?: string
    message?: string
    source?: string
    website?: string
    phone?: string
  }): Promise<LeadScoringResult> {
    try {
      const prompt = `Analyser og score denne lead (0-100):

Navn: ${lead.name || 'Ukjent'}
E-post: ${lead.email || 'Ukjent'}
Firma: ${lead.company || 'Ukjent'}
Nettside: ${lead.website || 'Ukjent'}
Telefon: ${lead.phone || 'Ukjent'}
Melding: ${lead.message || 'Ingen melding'}
Kilde: ${lead.source || 'Website'}

Vurder:
1. Budget-potensial (basert på firma/nettside)
2. Intent (basert på melding)
3. Timeline urgency
4. Decision-maker likelihood

Gi:
- Score (0-100)
- Qualification (Cold/Warm/Hot)
- 3-5 reasons for score
- 3 recommended next actions`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['client-management', 'leads']
      })

      const result = this.parseLeadScoreResponse(response.content)

      // Save score to database
      if (lead.email) {
        await prisma.lead.updateMany({
          where: { email: lead.email },
          data: {
            score: result.score,
            qualified: result.score >= 60
          }
        }).catch(console.error)
      }

      // Log action
      await audit({} as any, {
        action: 'ai-agent.client.score-lead',
        resource: 'lead',
        meta: {
          leadEmail: lead.email,
          score: result.score,
          qualification: result.qualification
        }
      })

      return result
    } catch (error: any) {
      console.error('ClientAgent lead scoring error:', error)
      // Fallback: Medium score
      return {
        score: 50,
        qualification: 'warm',
        reasons: ['AI scoring unavailable - manual review recommended'],
        nextActions: ['Review manually', 'Respond within 24h']
      }
    }
  }

  /**
   * Generate follow-up email
   */
  async generateFollowUp(lead: {
    name?: string
    email?: string
    lastContact?: Date
    stage?: string
  }): Promise<AutoResponseResult> {
    try {
      const daysSince = lead.lastContact 
        ? Math.floor((Date.now() - lead.lastContact.getTime()) / (1000 * 60 * 60 * 24))
        : 0

      const prompt = `Generer follow-up e-post:

Navn: ${lead.name || 'Lead'}
Stage: ${lead.stage || 'Ny lead'}
Dager siden siste kontakt: ${daysSince}

Opprett:
1. Subject (personlig, refererer til tidligere kontakt)
2. Body (kort, verdifull, med klar CTA)
3. Timing: Best tid å sende

Tone: Vennlig men respektfull (ikke pushy)
Språk: Norsk bokmål`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['client-management', 'follow-up']
      })

      return this.parseEmailResponse(response.content)
    } catch (error: any) {
      console.error('ClientAgent follow-up error:', error)
      return {
        subject: 'Følger opp vår samtale',
        body: `Hei${lead.name ? ' ' + lead.name : ''}!\n\nJeg følger opp vår tidligere samtale. Har du tid for en kort prat?\n\nMvh,\nCato Hansen`,
        tone: 'friendly',
        shouldSend: false,
        confidence: 0.5
      }
    }
  }

  /**
   * Parse email response from AI
   */
  private parseEmailResponse(response: string): AutoResponseResult {
    const lines = response.split('\n').filter(l => l.trim())
    
    let subject = ''
    let body = ''
    
    lines.forEach((line, i) => {
      if (line.toLowerCase().includes('subject:') || line.toLowerCase().includes('emne:')) {
        subject = line.split(':')[1]?.trim() || lines[i + 1] || ''
      } else if (line.toLowerCase().includes('body:') || line.toLowerCase().includes('innhold:')) {
        body = lines.slice(i + 1).join('\n').trim()
      }
    })

    if (!subject && lines.length > 0) subject = lines[0]
    if (!body && lines.length > 1) body = lines.slice(1).join('\n')

    return {
      subject: subject || 'Takk for din henvendelse',
      body: body || response,
      tone: 'professional',
      shouldSend: false, // Always require manual approval
      confidence: subject && body ? 0.8 : 0.5
    }
  }

  /**
   * Parse lead scoring response from AI
   */
  private parseLeadScoreResponse(response: string): LeadScoringResult {
    const lines = response.split('\n')
    
    let score = 50
    let qualification: 'cold' | 'warm' | 'hot' = 'warm'
    const reasons: string[] = []
    const nextActions: string[] = []

    lines.forEach(line => {
      const lowerLine = line.toLowerCase()
      
      // Extract score
      const scoreMatch = line.match(/score[:\s]+(\d+)/i) || line.match(/(\d+)\s*\/\s*100/)
      if (scoreMatch) {
        score = parseInt(scoreMatch[1])
      }

      // Extract qualification
      if (lowerLine.includes('cold')) qualification = 'cold'
      if (lowerLine.includes('warm')) qualification = 'warm'
      if (lowerLine.includes('hot')) qualification = 'hot'

      // Extract reasons and actions
      if (line.match(/^[-•*]\s/)) {
        const item = line.replace(/^[-•*]\s/, '').trim()
        if (lowerLine.includes('action') || lowerLine.includes('next')) {
          nextActions.push(item)
        } else {
          reasons.push(item)
        }
      }
    })

    // Determine qualification from score if not explicit
    if (score < 40) qualification = 'cold'
    else if (score < 70) qualification = 'warm'
    else qualification = 'hot'

    return {
      score: Math.min(100, Math.max(0, score)),
      qualification,
      reasons: reasons.length > 0 ? reasons : ['AI analysis unavailable'],
      nextActions: nextActions.length > 0 ? nextActions : ['Review manually']
    }
  }
}

// Singleton instance
let clientAgent: ClientAgent | null = null

export function getClientAgent(): ClientAgent {
  if (!clientAgent) {
    clientAgent = new ClientAgent()
  }
  return clientAgent
}

