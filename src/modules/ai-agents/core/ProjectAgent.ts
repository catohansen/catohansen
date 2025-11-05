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
 * ProjectAgent - AI Agent for Project Management Automation
 * 
 * Capabilities:
 * - Auto-update project status
 * - Deadline tracking and alerts
 * - Progress estimation
 * - Risk assessment
 * - Status report generation
 */

import { getSystemOrchestrator } from '@/modules/nora/core/system-orchestrator'
import { prisma } from '@/lib/db/prisma'
import { audit } from '@/lib/audit/audit'

export interface ProjectStatusUpdate {
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed'
  progress: number // 0-100
  summary: string
  risks: string[]
  nextMilestones: string[]
  recommendedActions: string[]
}

export interface DeadlineAlert {
  urgency: 'low' | 'medium' | 'high' | 'critical'
  daysUntilDeadline: number
  message: string
  suggestedActions: string[]
}

export class ProjectAgent {
  private orchestrator = getSystemOrchestrator()

  /**
   * Analyze project and update status
   */
  async analyzeProjectStatus(project: {
    id: string
    title: string
    status?: string
    createdAt: Date
    deadline?: Date
    tasks?: Array<{ status: string; title: string }>
  }): Promise<ProjectStatusUpdate> {
    try {
      const daysElapsed = Math.floor((Date.now() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      const daysUntilDeadline = project.deadline
        ? Math.floor((project.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null

      const tasksInfo = project.tasks
        ? `Tasks: ${project.tasks.length} total, ${project.tasks.filter(t => t.status === 'DONE').length} completed`
        : 'No task data'

      const prompt = `Analyser prosjektstatus:

Prosjekt: ${project.title}
Status: ${project.status || 'ACTIVE'}
Dager i gang: ${daysElapsed}
Dager til deadline: ${daysUntilDeadline || 'Ingen deadline'}
${tasksInfo}

Gi:
1. Status (on-track/at-risk/delayed/completed)
2. Progres estimate (0-100%)
3. Kort sammendrag (2-3 setninger)
4. Risikoer (hvis noen)
5. Neste milestones
6. Anbefalte handlinger

Vær realistisk og handlingsorientert.`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['project-management']
      })

      const result = this.parseStatusResponse(response.content, project)

      // Update project in database
      if (result.status === 'completed' && project.status !== 'ARCHIVED') {
        await prisma.project.update({
          where: { id: project.id },
          data: { status: 'ARCHIVED' }
        }).catch(console.error)
      }

      // Log analysis
      await audit({} as any, {
        action: 'ai-agent.project.analyze-status',
        resource: 'project',
        target: project.id,
        meta: {
          status: result.status,
          progress: result.progress,
          risksCount: result.risks.length
        }
      })

      return result
    } catch (error: any) {
      console.error('ProjectAgent status error:', error)
      return {
        status: 'on-track',
        progress: 50,
        summary: 'AI analysis unavailable - review manually',
        risks: [],
        nextMilestones: [],
        recommendedActions: ['Review project manually']
      }
    }
  }

  /**
   * Generate deadline alert
   */
  async generateDeadlineAlert(project: {
    title: string
    deadline: Date
    status?: string
  }): Promise<DeadlineAlert> {
    const daysUntil = Math.floor((project.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (daysUntil < 0) urgency = 'critical'
    else if (daysUntil < 3) urgency = 'high'
    else if (daysUntil < 7) urgency = 'medium'

    try {
      const prompt = `Generer deadline-varsel:

Prosjekt: ${project.title}
Dager til deadline: ${daysUntil} ${daysUntil < 0 ? '(FORSINKET!)' : ''}
Status: ${project.status || 'ACTIVE'}

Opprett:
1. Kort, tydelig melding
2. 2-3 foreslåtte handlinger
3. Prioritering

Tone: ${urgency === 'critical' ? 'Urgent men konstruktiv' : urgency === 'high' ? 'Viktig heads-up' : 'Vennlig påminnelse'}`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['project-management']
      })

      return {
        urgency,
        daysUntilDeadline: daysUntil,
        message: response.content,
        suggestedActions: response.suggestions || []
      }
    } catch (error: any) {
      return {
        urgency,
        daysUntilDeadline: daysUntil,
        message: `Prosjekt "${project.title}" har deadline ${daysUntil < 0 ? 'forsinket med' : 'om'} ${Math.abs(daysUntil)} dager.`,
        suggestedActions: ['Review project status', 'Contact client', 'Adjust timeline']
      }
    }
  }

  /**
   * Generate status report for client
   */
  async generateStatusReport(project: {
    id: string
    title: string
    status?: string
    tasks?: Array<{ status: string; title: string }>
  }): Promise<{
    subject: string
    body: string
    attachments?: string[]
  }> {
    try {
      const completedTasks = project.tasks?.filter(t => t.status === 'DONE').length || 0
      const totalTasks = project.tasks?.length || 0
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      const prompt = `Generer status-rapport til kunde:

Prosjekt: ${project.title}
Fremdrift: ${progress}% (${completedTasks}/${totalTasks} tasks)
Status: ${project.status || 'ACTIVE'}

Opprett profesjonell statusrapport:
1. Subject-linje
2. Executive summary (2-3 setninger)
3. Progress update (hva er gjort)
4. Neste steg (hva kommer)
5. Estimert ferdigstillelse

Tone: Profesjonell, positiv, transparent
Språk: Norsk bokmål`

      const response = await this.orchestrator.processMessage(prompt, {
        moduleContext: ['project-management', 'client-communication']
      })

      const parsed = this.parseReportResponse(response.content)

      return parsed
    } catch (error: any) {
      console.error('ProjectAgent report error:', error)
      return {
        subject: `Statusrapport: ${project.title}`,
        body: `Prosjektet går som planlagt. Vil gi deg full update snart.\n\nMvh,\nCato Hansen`
      }
    }
  }

  /**
   * Parse status response from AI
   */
  private parseStatusResponse(response: string, project: any): ProjectStatusUpdate {
    const lines = response.split('\n')
    
    let status: 'on-track' | 'at-risk' | 'delayed' | 'completed' = 'on-track'
    let progress = 50
    const risks: string[] = []
    const nextMilestones: string[] = []
    const recommendedActions: string[] = []

    lines.forEach(line => {
      const lower = line.toLowerCase()
      
      if (lower.includes('completed') || lower.includes('ferdig')) status = 'completed'
      else if (lower.includes('delayed') || lower.includes('forsinket')) status = 'delayed'
      else if (lower.includes('at-risk') || lower.includes('risiko')) status = 'at-risk'

      const progressMatch = line.match(/(\d+)%/)
      if (progressMatch) progress = parseInt(progressMatch[1])

      if (line.match(/^[-•*]/)) {
        const item = line.replace(/^[-•*]\s/, '').trim()
        if (lower.includes('risk') || lower.includes('risiko')) {
          risks.push(item)
        } else if (lower.includes('milestone') || lower.includes('neste')) {
          nextMilestones.push(item)
        } else if (lower.includes('action') || lower.includes('anbefal')) {
          recommendedActions.push(item)
        }
      }
    })

    return {
      status,
      progress: Math.min(100, Math.max(0, progress)),
      summary: response.substring(0, 300),
      risks,
      nextMilestones,
      recommendedActions
    }
  }

  /**
   * Parse report response from AI
   */
  private parseReportResponse(response: string): { subject: string; body: string } {
    const lines = response.split('\n')
    const subject = lines[0]?.replace(/subject:/i, '').trim() || 'Statusrapport'
    const body = lines.slice(1).join('\n').trim() || response

    return { subject, body }
  }
}

// Singleton
let projectAgent: ProjectAgent | null = null

export function getProjectAgent(): ProjectAgent {
  if (!projectAgent) {
    projectAgent = new ProjectAgent()
  }
  return projectAgent
}

