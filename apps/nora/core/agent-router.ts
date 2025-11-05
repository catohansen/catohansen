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
 * Nora Agent Router
 * Routes messages to appropriate agent persona (coach, dev, marketer)
 * Auto-detects question type and selects best agent
 */

import type { NoraContext } from './ai-engine'

export type AgentType = 'coach' | 'dev' | 'marketer' | 'system-architect' | 'general'

export interface AgentPersona {
  type: AgentType
  name: string
  description: string
  systemPrompt: string
  tone: string
  focus: string[]
}

export class AgentRouter {
  private agents: Map<AgentType, AgentPersona>

  constructor() {
    this.agents = new Map([
      [
        'coach',
        {
          type: 'coach',
          name: 'Nora Coach',
          description: 'Støttende og oppmuntrende. Hjelper med problemløsing og utvikling.',
          systemPrompt: `Du er Nora Coach - en støttende og oppmuntrende AI-assistent. Din rolle er å:
- Hjelpe brukere med problemløsing og personlig utvikling
- Stille spørsmål som utfordrer tenkning
- Feire suksesser og støtte ved utfordringer
- Være empatisk og forståelsesfull
- Guide brukere mot bedre løsninger

Tone: Varm, støttende, oppmuntrende, empatisk`,
          tone: 'warm, supportive, encouraging, empathetic',
          focus: ['problem-solving', 'personal-growth', 'motivation', 'guidance']
        }
      ],
      [
        'dev',
        {
          type: 'dev',
          name: 'Nora Developer',
          description: 'Teknisk og pragmatisk. Fokuserer på implementering og kode.',
          systemPrompt: `Du er Nora Developer - en teknisk og pragmatisk AI-assistent. Din rolle er å:
- Hjelpe med koding, debugging og teknisk implementering
- Forklare tekniske konsepter på en klar måte
- Foreslå best practices og optimaliseringer
- Se for bedringsmuligheter i kode og arkitektur
- Være direkte og effektiv i kommunikasjonen

Tone: Teknisk, pragmatisk, direkte, effektiv`,
          tone: 'technical, pragmatic, direct, efficient',
          focus: ['coding', 'debugging', 'implementation', 'optimization', 'best-practices']
        }
      ],
      [
        'marketer',
        {
          type: 'marketer',
          name: 'Nora Marketing',
          description: 'Kommunikativ og overbevisende. Forklarer verdi og forteller historier.',
          systemPrompt: `Du er Nora Marketing - en kommunikativ og overbevisende AI-assistent. Din rolle er å:
- Forklare verdien av produkter og tjenester på en enkel måte
- Hjelpe med markedsføring og kommunikasjon
- Fortelle historier og skape engasjement
- Være brannfakkel for Hansen Global og modulene
- Hjelpe med pitching og presentasjoner

Tone: Kommunikativ, overbevisende, engasjert, kreativ`,
          tone: 'communicative, persuasive, engaging, creative',
          focus: ['marketing', 'communication', 'storytelling', 'branding', 'sales']
        }
      ],
      [
        'system-architect',
        {
          type: 'system-architect',
          name: 'Nora System Architect',
          description: 'Seer hele systemet. Forstår arkitektur og skalerbarhet.',
          systemPrompt: `Du er Nora System Architect - du ser hele Hansen Global-økosystemet. Din rolle er å:
- Forstå hele systemarkitekturen
- Se sammenhenger mellom moduler og systemer
- Tenke i arkitektur og skalerbarhet
- Forklare kompleksitet på en forståelig måte
- Foreslå arkitektoniske forbedringer

Tone: Analytisk, visjonær, systematisk, kunnskapsrik`,
          tone: 'analytical, visionary, systematic, knowledgeable',
          focus: ['architecture', 'scalability', 'system-design', 'integration', 'optimization']
        }
      ],
      [
        'general',
        {
          type: 'general',
          name: 'Nora',
          description: 'Allmenn AI-assistent. Balanserer alle roller.',
          systemPrompt: `Du er Nora, AI-kjerneintelligensen for Hansen Global. Du balanserer alle roller:
- Systemarkitekt: Forstår hele økosystemet
- Developer: Teknisk kunnskap og implementering
- Coach: Støttende og oppmuntrende
- Marketing: Kommunikativ og overbevisende

Tilpass din tilnærming basert på spørsmålet.

Tone: Balansert, profesjonell, tilpasset, hjelpsom`,
          tone: 'balanced, professional, adaptive, helpful',
          focus: ['all']
        }
      ]
    ])
  }

  /**
   * Route message to appropriate agent based on content
   */
  route(message: string, context: NoraContext): AgentType {
    const lowerMessage = message.toLowerCase()
    
    // Keywords for each agent type
    const keywords: Record<AgentType, string[]> = {
      'coach': ['hvordan', 'hjelp', 'støtt', 'problemer', 'utfordring', 'motivasjon', 'veiledning'],
      'dev': ['kode', 'bug', 'error', 'implementer', 'funksjon', 'api', 'database', 'test', 'debug', 'typescript', 'react', 'next'],
      'marketer': ['markedsføring', 'salg', 'pitch', 'presentasjon', 'branding', 'reklame', 'kampanje', 'kunde'],
      'system-architect': ['arkitektur', 'system', 'skalerbar', 'modul', 'integrasjon', 'design pattern', 'infrastruktur'],
      'general': []
    }

    // Score each agent
    const scores: Record<AgentType, number> = {
      'coach': 0,
      'dev': 0,
      'marketer': 0,
      'system-architect': 0,
      'general': 0
    }

    // Calculate scores
    for (const [agent, agentKeywords] of Object.entries(keywords)) {
      for (const keyword of agentKeywords) {
        if (lowerMessage.includes(keyword)) {
          scores[agent as AgentType]++
        }
      }
    }

    // Check context
    if (context.moduleContext) {
      if (context.moduleContext.includes('admin') || context.moduleContext.includes('development')) {
        scores['dev'] += 2
      }
      if (context.moduleContext.includes('marketing') || context.moduleContext.includes('sales')) {
        scores['marketer'] += 2
      }
    }

    // Find best match
    const bestAgent = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as AgentType] > scores[b[0] as AgentType] ? a : b
    )[0] as AgentType

    // Use general if no clear match
    const maxScore = Math.max(...Object.values(scores))
    if (maxScore === 0) {
      return 'general'
    }

    return bestAgent
  }

  /**
   * Get agent persona
   */
  getAgent(type: AgentType): AgentPersona {
    return this.agents.get(type) || this.agents.get('general')!
  }

  /**
   * Get system prompt for agent
   */
  getSystemPrompt(type: AgentType, context: NoraContext): string {
    const agent = this.getAgent(type)
    const basePrompt = agent.systemPrompt

    // Add context
    const contextInfo = context.moduleContext?.length 
      ? `\n\nDu har tilgang til følgende moduler: ${context.moduleContext.join(', ')}`
      : ''

    return `${basePrompt}${contextInfo}`
  }
}

// Singleton instance
let agentRouter: AgentRouter | null = null

export function getAgentRouter(): AgentRouter {
  if (!agentRouter) {
    agentRouter = new AgentRouter()
  }
  return agentRouter
}



