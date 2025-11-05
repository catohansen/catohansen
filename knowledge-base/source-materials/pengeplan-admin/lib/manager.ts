/**
 * Multi-Agent Orchestration Manager
 * Koordinerer spesialistagenter for deployment pipeline
 */

import { PrecheckAgent } from './precheck'
import { FixAgent } from './fix'
import { SecurityAgent } from './security'
import { PerfAgent } from './performance'
import { OpsAgent } from './ops'
import { PolicyEngine } from '../policy/engine'

export interface AgentContext {
  deploymentId: string
  commitSha: string
  branch: string
  environment: 'staging' | 'production'
  userId: string
  policyId?: string
  autopilot: boolean
}

export interface AgentResult {
  agent: string
  status: 'success' | 'warning' | 'error' | 'blocking'
  message: string
  data?: any
  recommendations?: string[]
  requiresHumanApproval?: boolean
}

export interface PipelineStep {
  id: string
  name: string
  agent: string
  parallel: boolean
  blocking: boolean
  retryable: boolean
  maxRetries: number
}

export class AgentManager {
  private agents: Map<string, any> = new Map()
  private policyEngine: PolicyEngine

  constructor() {
    this.policyEngine = new PolicyEngine()
    this.initializeAgents()
  }

  private initializeAgents() {
    this.agents.set('precheck', new PrecheckAgent())
    this.agents.set('fix', new FixAgent())
    this.agents.set('security', new SecurityAgent())
    this.agents.set('performance', new PerfAgent())
    this.agents.set('ops', new OpsAgent())
  }

  /**
   * Kjører deployment pipeline med multi-agent orkestrering
   */
  async runPipeline(context: AgentContext, steps: PipelineStep[]): Promise<{
    success: boolean
    results: AgentResult[]
    requiresApproval: boolean
    nextAction?: string
  }> {
    const results: AgentResult[] = []
    let requiresApproval = false

    console.log(`[AgentManager] Starting pipeline for deployment ${context.deploymentId}`)

    // Policy evaluation først
    if (context.policyId) {
      const policyResult = await this.policyEngine.evaluateDeployment(context, context.policyId)
      if (!policyResult.allow) {
        return {
          success: false,
          results: [{
            agent: 'policy',
            status: 'blocking',
            message: `Policy violation: ${policyResult.reasons.join(', ')}`,
            requiresHumanApproval: true
          }],
          requiresApproval: true
        }
      }
    }

    // Kjør steg sekvensielt eller parallelt
    for (const step of steps) {
      try {
        console.log(`[AgentManager] Running step: ${step.name} (${step.agent})`)
        
        const agent = this.agents.get(step.agent)
        if (!agent) {
          results.push({
            agent: step.agent,
            status: 'error',
            message: `Agent ${step.agent} not found`
          })
          continue
        }

        const result = await agent.execute(context, step)
        results.push(result)

        // Hvis blocking feil, stopp pipeline
        if (result.status === 'blocking' || result.status === 'error') {
          console.log(`[AgentManager] Blocking error in ${step.agent}: ${result.message}`)
          break
        }

        // Sjekk om menneskelig godkjenning kreves
        if (result.requiresHumanApproval) {
          requiresApproval = true
        }

      } catch (error) {
        console.error(`[AgentManager] Error in step ${step.name}:`, error)
        results.push({
          agent: step.agent,
          status: 'error',
          message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
        break
      }
    }

    const success = results.every(r => r.status === 'success' || r.status === 'warning')
    
    return {
      success,
      results,
      requiresApproval,
      nextAction: this.determineNextAction(results, context)
    }
  }

  /**
   * Bestemmer neste aksjon basert på resultater
   */
  private determineNextAction(results: AgentResult[], context: AgentContext): string {
    const hasBlocking = results.some(r => r.status === 'blocking')
    const hasErrors = results.some(r => r.status === 'error')
    const needsApproval = results.some(r => r.requiresHumanApproval)

    if (hasBlocking) {
      return 'STOP_PIPELINE'
    }
    
    if (hasErrors) {
      return 'RETRY_OR_MANUAL_FIX'
    }
    
    if (needsApproval) {
      return 'AWAIT_HUMAN_APPROVAL'
    }
    
    if (context.environment === 'staging') {
      return 'PROMOTE_TO_PRODUCTION'
    }
    
    return 'COMPLETE'
  }

  /**
   * Kjører enkelt agent for testing/debugging
   */
  async runSingleAgent(agentType: string, context: AgentContext): Promise<AgentResult> {
    const agent = this.agents.get(agentType)
    if (!agent) {
      return {
        agent: agentType,
        status: 'error',
        message: `Agent ${agentType} not found`
      }
    }

    return await agent.execute(context, { id: 'single', name: 'Single Run', agent: agentType, parallel: false, blocking: false, retryable: true, maxRetries: 1 })
  }

  /**
   * Henter status for alle agenter
   */
  getAgentStatus(): Record<string, { available: boolean; lastRun?: Date; status?: string }> {
    const status: Record<string, any> = {}
    
    for (const [name, agent] of this.agents) {
      status[name] = {
        available: !!agent,
        lastRun: agent?.lastRun,
        status: agent?.status
      }
    }
    
    return status
  }
}

// Predefinerte pipeline templates
export const PIPELINE_TEMPLATES = {
  QUICK_DEPLOY: [
    { id: 'precheck', name: 'Pre-deployment Check', agent: 'precheck', parallel: false, blocking: true, retryable: true, maxRetries: 2 },
    { id: 'security', name: 'Security Scan', agent: 'security', parallel: true, blocking: false, retryable: true, maxRetries: 1 }
  ],
  
  SAFE_DEPLOY: [
    { id: 'precheck', name: 'Pre-deployment Check', agent: 'precheck', parallel: false, blocking: true, retryable: true, maxRetries: 2 },
    { id: 'security', name: 'Security Scan', agent: 'security', parallel: true, blocking: true, retryable: true, maxRetries: 1 },
    { id: 'performance', name: 'Performance Check', agent: 'performance', parallel: true, blocking: false, retryable: true, maxRetries: 1 },
    { id: 'ops', name: 'Operations Check', agent: 'ops', parallel: false, blocking: false, retryable: true, maxRetries: 1 }
  ],
  
  EMERGENCY_ROLLBACK: [
    { id: 'ops', name: 'Emergency Assessment', agent: 'ops', parallel: false, blocking: false, retryable: false, maxRetries: 0 }
  ]
}



















