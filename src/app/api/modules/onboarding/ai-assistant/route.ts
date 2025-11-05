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
 * API Route: /api/modules/onboarding/ai-assistant
 * AI Assistant for module onboarding wizard
 */

import { NextRequest, NextResponse } from 'next/server'
import { withLogging } from '@/lib/observability/withLogging'
import { prisma } from '@/lib/db/prisma'

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get('admin-token')?.value
  
  if (!token) {
    return null
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    })

    if (!user || user.status !== 'ACTIVE') {
      return null
    }

    return user
  } catch {
    return null
  }
}

export const POST = withLogging(async (req: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { message, currentStep, moduleInfo, conversationHistory } = body

    // Context-aware response based on step and question
    const response = generateContextualResponse(
      message,
      currentStep,
      moduleInfo,
      conversationHistory
    )

    return NextResponse.json({
      success: true,
      response: response.text,
      suggestions: response.suggestions,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'AI assistant failed' },
      { status: 500 }
    )
  }
})

interface ContextualResponse {
  text: string
  suggestions: string[]
}

function generateContextualResponse(
  message: string,
  currentStep: number,
  moduleInfo?: Record<string, any>,
  conversationHistory?: any[]
): ContextualResponse {
  const lowerMessage = message.toLowerCase()

  // Step-specific responses
  if (currentStep === 1) {
    if (lowerMessage.includes('module_info') || lowerMessage.includes('modul_info')) {
      return {
        text: `MODULE_INFO.json er en konfigurasjonsfil som beskriver din modul:

\`\`\`json
{
  "id": "module-id",
  "name": "Module Name",
  "version": "1.0.0",
  "description": "Module description",
  "repository": {
    "url": "https://github.com/owner/repo"
  }
}
\`\`\`

Systemet vil automatisk laste denne filen hvis den finnes i \`src/modules/[module-name]/MODULE_INFO.json\`. Den fyller ut alle felter automatisk!`,
        suggestions: [
          'Hvor plasserer jeg MODULE_INFO.json?',
          'Hva må være i MODULE_INFO.json?',
        ],
      }
    }
  }

  if (currentStep === 2) {
    if (lowerMessage.includes('semantic') || lowerMessage.includes('version')) {
      return {
        text: `Semantic versioning (SemVer) følger formatet: **MAJOR.MINOR.PATCH**

• **1.0.0** = Første release
• **1.0.1** = Bug fix (patch)
• **1.1.0** = Ny feature (minor)
• **2.0.0** = Breaking change (major)

**Regler:**
- Start alltid med 1.0.0 for ny modul
- Øk PATCH for bug fixes
- Øk MINOR for nye features
- Øk MAJOR for breaking changes

**Eksempel:**
Hvis du lager en ny modul, bruk **1.0.0**. Hvis du fikser en bug senere, blir det **1.0.1**.`,
        suggestions: [
          'Når skal jeg øke major versjon?',
          'Kan jeg bruke pre-release versions?',
        ],
      }
    }
  }

  if (currentStep === 3) {
    if (
      lowerMessage.includes('webhook') ||
      lowerMessage.includes('sync') ||
      lowerMessage.includes('github')
    ) {
      return {
        text: `**Webhooks** lar GitHub automatisk varsle ditt system når noe skjer:

**Events vi lytter på:**
• **push**: Når kode pushes til repository
• **release**: Når en release lages
• **pull_request**: Når en PR åpnes/lukkes

**Automatisk oppsett:**
Når du registrerer modulen, setter vi automatisk opp webhook for deg. Du trenger ikke gjøre noe!

**Hva skjer deretter:**
1. GitHub sender varsler til ditt system
2. Systemet synkroniserer automatisk
3. Versjoner oppdateres
4. Tester kjøres

Alt skjer automatisk i bakgrunnen! 🚀`,
        suggestions: [
          'Hva hvis webhook feiler?',
          'Kan jeg deaktivere webhooks?',
        ],
      }
    }
  }

  // Generic intelligent response
  if (lowerMessage.includes('hjelp') || lowerMessage.includes('help')) {
    return {
      text: `Jeg kan hjelpe deg med:

📋 **Steg ${currentStep}:**
${getStepHelpText(currentStep)}

💡 **Generelt:**
• Forklare konsepter
• Feilsøke problemer
• Gi eksempler
• Guide deg gjennom prosessen

Hva vil du vite mer om?`,
      suggestions: getStepSuggestions(currentStep),
    }
  }

  // Default response with context
  return {
    text: `Basert på spørsmålet ditt om "${message}" i steg ${currentStep}, her er informasjon som kan hjelpe deg. Vil du at jeg skal forklare mer detaljert, eller har du andre spørsmål?`,
    suggestions: getStepSuggestions(currentStep),
  }
}

function getStepHelpText(step: number): string {
  const help: Record<number, string> = {
    1: '• Oppdag modul fra MODULE_INFO.json\n• Auto-fill av informasjon\n• Validering av modulnavn',
    2: '• Fyll ut modulinformasjon\n• Semantic versioning\n• Beskrivelse og kategorisering',
    3: '• GitHub repository tilkobling\n• Webhook oppsett\n• Sync-strategi konfigurasjon',
    4: '• Gjennomgang av informasjon\n• Konflikt-analyse\n• Final godkjenning',
  }
  return help[step] || ''
}

function getStepSuggestions(step: number): string[] {
  const suggestions: Record<number, string[]> = {
    1: [
      'Hva er MODULE_INFO.json?',
      'Hvorfor må jeg oppgi modulnavn?',
      'Kan jeg endre navnet senere?',
    ],
    2: [
      'Hva er semantic versioning?',
      'Hvorfor må jeg ha en beskrivelse?',
      'Hva betyr kategorien?',
    ],
    3: [
      'Hva er en webhook?',
      'Hva er forskjellen mellom subtree og submodule?',
      'Hvilken branch skal jeg bruke?',
    ],
    4: [
      'Hva skjer etter registrering?',
      'Kan jeg publisere til NPM?',
      'Hvordan setter jeg opp CI/CD?',
    ],
  }
  return suggestions[step] || ['Hvordan kan jeg hjelpe deg?']
}





