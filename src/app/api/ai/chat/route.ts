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
 * AI Chat API Route
 * Handles chat requests with page context and RAG
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { audit } from '@/lib/audit/audit'

const schema = z.object({
  message: z.string().min(1).max(2000),
  pageContext: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
})

// Page-specific knowledge bases
const pageKnowledge: Record<string, string> = {
  '/': 'Cato Hansen er AI ekspert og systemarkitekt fra Drøbak, Norge. Han bygger enterprise-grade moduler som Hansen Security, Hansen Auth, CRM 2.0, og MindMap 2.0.',
  '/hansen-security': 'Hansen Security er et enterprise-grade fine-grained authorization system. Det er en production-ready authorization engine med zero-trust architecture, policy-based authorization, RBAC & ABAC support, complete audit trail, anomaly detection, og høy performance.',
  '/hansen-crm': 'CRM 2.0 er et avansert client management system med AI-powered insights, automation rules, og integrasjoner.',
  '/hansen-mindmap-2.0': 'MindMap 2.0 er et visuelt kunnskapsorganiseringsverktøy laget av Cato Hansen. Det hjelper deg med å organisere og visualisere informasjon.',
  '/pengeplan-2.0': 'Pengeplan 2.0 er et personlig økonomi- og budsjetteringsverktøy med Spleis integrasjon.',
  '/hansen-hub': 'Hansen Hub er sentrumet for alle Cato Hansens moduler og tjenester. Her finner du Hansen Security, CRM 2.0, MindMap 2.0, og mer.',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      )
    }

    const { message, pageContext, conversationHistory } = parsed.data

    // Get page-specific knowledge
    const pageKnowledgeBase = pageContext ? pageKnowledge[pageContext] || '' : ''
    
    // Build context for AI
    const context = `
Page Context: ${pageContext || 'Landing page'}
Page Knowledge: ${pageKnowledgeBase}
Conversation History: ${conversationHistory ? conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n') : 'None'}
User Question: ${message}
`

    // TODO: Replace with actual AI/RAG implementation
    // For now, return contextual responses based on page and question
    let response = ''
    let suggestions: string[] = []

    // Simple keyword-based responses (will be replaced with RAG)
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('hansen security') || lowerMessage.includes('sikkerhet')) {
      response = `Hansen Security er vårt enterprise-grade fine-grained authorization system! 🛡️

**Hovedfunksjoner:**
• Zero-trust architecture - never trust, always verify
• Policy-based authorization med full RBAC & ABAC support
• Complete audit trail for alle autorisasjonsbeslutninger
• Anomaly detection for å oppdage mistenkelige mønstre
• Høy performance - autorisasjonsbeslutninger på under 1ms

Hansen Security kan selges som en egen modul, likt som Cerbos gjør. Det er production-ready og klar til bruk i enterprise-miljøer.

Vil du vite mer om spesifikke funksjoner, priser, eller hvordan du implementerer det?`
      suggestions = ['Hvordan implementerer jeg Hansen Security?', 'Hva koster det?', 'Vis meg eksempler']
    } else if (lowerMessage.includes('crm') || lowerMessage.includes('client')) {
      response = `CRM 2.0 er vårt avanserte client management system! 📊

**Hovedfunksjoner:**
• AI-powered insights for bedre forståelse av kunder
• Automation rules for å automatisere arbeidsflyter
• Integrasjoner med Hansen Security og andre moduler
• Client tracking og project management
• Revenue analytics og reporting

CRM 2.0 hjelper deg med å organisere og forvalte alle dine kunder og prosjekter effektivt.

Vil du vite mer om spesifikke funksjoner eller hvordan du setter det opp?`
      suggestions = ['Hvordan setter jeg opp CRM 2.0?', 'Vis meg dashboard', 'Hva kan AI gjøre?']
    } else if (lowerMessage.includes('mindmap') || lowerMessage.includes('mind map')) {
      response = `MindMap 2.0 er et kraftig verktøy for å organisere kunnskap visuelt! 🧠

**Hovedfunksjoner:**
• Visuell organisering av informasjon
• Interaktive mind maps
• Kunnskapsorganisering
• Laget av Cato Hansen

MindMap 2.0 hjelper deg med å visualisere og organisere komplekse ideer og informasjon på en intuitiv måte.

Vil du vite mer om hvordan det fungerer eller hvordan du bruker det?`
      suggestions = ['Hvordan bruker jeg MindMap 2.0?', 'Vis meg eksempler', 'Hva er det?']
    } else if (lowerMessage.includes('cato') || lowerMessage.includes('hvem') || lowerMessage.includes('hva er dette')) {
      response = `Hei! Dette er Cato Hansen's portefølje og modul-plattform! 👋

**Cato Hansen** er:
• AI ekspert og systemarkitekt fra Drøbak, Norge
• Bygger enterprise-grade moduler og systemer
• Leverer production-ready løsninger

**Våre moduler:**
• 🛡️ Hansen Security - Authorization system
• 📊 CRM 2.0 - Client management
• 🧠 MindMap 2.0 - Kunnskapsorganisering
• 💰 Pengeplan 2.0 - Personlig økonomi
• 🔐 Hansen Auth - Authentication system

Alle modulene er designet for å være modular, standalone, og salgbare som separate produkter.

Hva vil du vite mer om?`
      suggestions = ['Hansen Security', 'CRM 2.0', 'MindMap 2.0', 'Hvordan starter jeg?']
    } else {
      response = `Jeg kan hjelpe deg med spørsmål om:
• Hansen Security - Authorization system
• CRM 2.0 - Client management
• MindMap 2.0 - Kunnskapsorganisering
• Pengeplan 2.0 - Personlig økonomi
• Hansen Auth - Authentication system
• Implementering og oppsett
• Priser og pakker

${pageKnowledgeBase ? `Basert på siden du er på (${pageContext}), her er relevant informasjon: ${pageKnowledgeBase}` : ''}

Hva vil du vite mer om?`
      suggestions = ['Hansen Security', 'CRM 2.0', 'MindMap 2.0', 'Hvordan starter jeg?']
    }

    // Audit log
    await audit(request, {
      action: 'ai_chat_request',
      resource: 'ai_chat',
      meta: {
        message: message.substring(0, 100),
        pageContext,
        responseLength: response.length,
      },
    })

    return NextResponse.json({
      success: true,
      response,
      suggestions,
      pageContext,
    })
  } catch (error: any) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Kunne ikke behandle forespørselen. Prøv igjen senere.' },
      { status: 500 }
    )
  }
}

