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
 * ContentAgent - AI Agent for Content Optimization
 * 
 * Capabilities:
 * - SEO optimization (title, description, keywords)
 * - Alt-text generation for images
 * - Content improvement suggestions
 * - Meta tags optimization
 * - Readability analysis
 */

import { getSystemOrchestrator } from '@/modules/nora/core/system-orchestrator'
import { prisma } from '@/lib/db/prisma'
import { audit } from '@/lib/audit/audit'

export interface SEOOptimization {
  title: string
  description: string
  keywords: string[]
  suggestions: string[]
  score: number // 0-100
}

export interface AltTextResult {
  altText: string
  confidence: number
  suggestions: string[]
}

export class ContentAgent {
  private orchestrator = getSystemOrchestrator()

  /**
   * Optimize SEO for content
   */
  async optimizeSEO(content: string, currentUrl: string): Promise<SEOOptimization> {
    try {
      const prompt = `Analyser dette innholdet og gi SEO-forbedringer:

URL: ${currentUrl}
Innhold: ${content.substring(0, 1000)}...

Gi meg:
1. Optimalisert tittel (max 60 tegn)
2. Meta description (max 160 tegn)
3. 5-10 keywords på norsk
4. 3-5 konkrete forbedringsforslag

Svar på norsk bokmål.`

      const response = await this.orchestrator.processMessage(prompt, {
        pageContext: currentUrl,
        moduleContext: ['content-management', 'seo']
      })

      // Parse AI response
      const parsed = this.parseSEOResponse(response.content)

      // Log action for learning
      await audit({} as any, {
        action: 'ai-agent.content.seo-optimize',
        resource: 'content',
        meta: {
          url: currentUrl,
          score: parsed.score,
          suggestionsCount: parsed.suggestions.length
        }
      })

      return parsed
    } catch (error: any) {
      console.error('ContentAgent SEO error:', error)
      throw new Error(`Failed to optimize SEO: ${error.message}`)
    }
  }

  /**
   * Generate alt-text for image
   */
  async generateAltText(imagePath: string, context?: string): Promise<AltTextResult> {
    try {
      const prompt = `Generer norsk alt-tekst for dette bildet:

Filnavn: ${imagePath}
Kontekst: ${context || 'Generell webside'}

Gi meg:
1. Beskrivende alt-tekst (max 125 tegn)
2. Alternativ lang beskrivelse
3. Relevante keywords

Svar på norsk bokmål.`

      const response = await this.orchestrator.processMessage(prompt, {
        pageContext: imagePath,
        moduleContext: ['content-management', 'media']
      })

      const result = this.parseAltTextResponse(response.content)

      // Log action
      await audit({} as any, {
        action: 'ai-agent.content.generate-alt-text',
        resource: 'media',
        meta: {
          imagePath,
          confidence: result.confidence
        }
      })

      return result
    } catch (error: any) {
      console.error('ContentAgent alt-text error:', error)
      // Fallback: Generate basic alt-text from filename
      const filename = imagePath.split('/').pop() || 'image'
      const basicAlt = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      
      return {
        altText: basicAlt,
        confidence: 0.3,
        suggestions: ['Legg til manuell beskrivelse for bedre SEO']
      }
    }
  }

  /**
   * Improve content readability
   */
  async improveReadability(content: string): Promise<{
    improvedContent: string
    changes: string[]
    readabilityScore: number
  }> {
    try {
      const prompt = `Forbedre lesbarheten av denne teksten:

${content}

Gjør:
1. Enklere setninger (max 20 ord per setning)
2. Aktiv stemme
3. Tydeligere overskrifter
4. Bedre formatering

Svar kun med forbedret tekst + liste over endringer.`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['content-management']
      })

      return {
        improvedContent: response.content,
        changes: response.suggestions || [],
        readabilityScore: 75 // Placeholder - kan beregnes med faktisk algoritme
      }
    } catch (error: any) {
      console.error('ContentAgent readability error:', error)
      return {
        improvedContent: content,
        changes: [],
        readabilityScore: 50
      }
    }
  }

  /**
   * Parse SEO response from AI
   */
  private parseSEOResponse(response: string): SEOOptimization {
    // Simple parsing - can be improved with structured output
    const lines = response.split('\n')
    
    let title = ''
    let description = ''
    const keywords: string[] = []
    const suggestions: string[] = []

    lines.forEach(line => {
      if (line.toLowerCase().includes('tittel:')) {
        title = line.split(':')[1]?.trim() || ''
      } else if (line.toLowerCase().includes('description:') || line.toLowerCase().includes('beskrivelse:')) {
        description = line.split(':')[1]?.trim() || ''
      } else if (line.toLowerCase().includes('keyword')) {
        const kw = line.split(':')[1]?.trim()
        if (kw) keywords.push(...kw.split(',').map(k => k.trim()))
      } else if (line.match(/^\d+\./)) {
        suggestions.push(line.replace(/^\d+\.\s*/, ''))
      }
    })

    // Calculate score based on completeness
    let score = 0
    if (title && title.length > 10) score += 30
    if (description && description.length > 50) score += 30
    if (keywords.length >= 5) score += 20
    if (suggestions.length >= 3) score += 20

    return {
      title: title || 'Mangler tittel',
      description: description || 'Mangler beskrivelse',
      keywords: keywords.length > 0 ? keywords : ['mangler', 'keywords'],
      suggestions: suggestions.length > 0 ? suggestions : ['Be AI om flere forslag'],
      score
    }
  }

  /**
   * Parse alt-text response from AI
   */
  private parseAltTextResponse(response: string): AltTextResult {
    const lines = response.split('\n').filter(l => l.trim())
    const altText = lines[0] || 'Bilde'
    
    return {
      altText: altText.substring(0, 125),
      confidence: 0.8,
      suggestions: lines.slice(1, 4)
    }
  }
}

// Singleton instance
let contentAgent: ContentAgent | null = null

export function getContentAgent(): ContentAgent {
  if (!contentAgent) {
    contentAgent = new ContentAgent()
  }
  return contentAgent
}

