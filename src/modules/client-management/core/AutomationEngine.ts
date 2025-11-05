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
 * Automation Engine
 * Vår egen avanserte workflow engine (ingen Zapier-avhengighet)
 * Event-driven automation med visual workflow builder support
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { EventEmitter } from 'events'

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'webhook' | 'manual'
  event?: string // e.g. 'lead.created', 'deal.won', 'client.churned'
  schedule?: string // Cron expression
  webhook?: string
  conditions?: Record<string, any> // Trigger conditions
}

export interface WorkflowAction {
  type: 'send_email' | 'create_task' | 'update_field' | 'notify' | 'delay' | 'condition' | 'create_lead' | 'update_deal'
  config: Record<string, any> // Action-specific configuration
  next?: string // ID of next action (for branching)
}

export interface WorkflowData {
  id: string
  name: string
  description?: string
  trigger: WorkflowTrigger
  actions: WorkflowAction[]
  isActive: boolean
  metadata?: any
}

export interface ExecutionContext {
  workflowId: string
  triggerEvent: string
  entityType: string // 'lead', 'client', 'deal', etc.
  entityId: string
  entityData: any
  userId?: string
  timestamp: Date
}

export class AutomationEngine extends EventEmitter {
  private workflows: Map<string, WorkflowData> = new Map()
  private executions: Map<string, ExecutionContext> = new Map()

  constructor() {
    super()
    this.loadWorkflows()
    this.setupEventListeners()
  }

  /**
   * Load all active workflows from database
   */
  private async loadWorkflows() {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.workflow === 'undefined') {
      return
    }

    try {
      const workflows = await prisma.workflow.findMany({
        where: { isActive: true }
      })

      workflows.forEach((wf: any) => {
        const workflowData: WorkflowData = {
          id: wf.id,
          name: wf.name,
          description: wf.description || undefined,
          trigger: wf.trigger as WorkflowTrigger,
          actions: wf.actions as WorkflowAction[],
          isActive: wf.isActive,
          metadata: wf.metadata || undefined
        }
        this.workflows.set(wf.id, workflowData)
      })
    } catch (error) {
      console.error('Error loading workflows:', error)
    }
  }

  /**
   * Setup event listeners for workflow triggers
   */
  private setupEventListeners() {
    // Listen for CRM events
    this.on('lead.created', (data) => this.handleEvent('lead.created', 'lead', data))
    this.on('lead.qualified', (data) => this.handleEvent('lead.qualified', 'lead', data))
    this.on('lead.converted', (data) => this.handleEvent('lead.converted', 'lead', data))
    this.on('client.created', (data) => this.handleEvent('client.created', 'client', data))
    this.on('deal.created', (data) => this.handleEvent('deal.created', 'pipeline', data))
    this.on('deal.won', (data) => this.handleEvent('deal.won', 'pipeline', data))
    this.on('deal.lost', (data) => this.handleEvent('deal.lost', 'pipeline', data))
    this.on('deal.stage_changed', (data) => this.handleEvent('deal.stage_changed', 'pipeline', data))
    this.on('task.due', (data) => this.handleEvent('task.due', 'task', data))
    this.on('client.churned', (data) => this.handleEvent('client.churned', 'client', data))
  }

  /**
   * Handle event and execute matching workflows
   */
  private async handleEvent(event: string, entityType: string, data: any) {
    // Find workflows that match this event
    const matchingWorkflows = Array.from(this.workflows.values()).filter(
      (wf) => wf.trigger.type === 'event' && wf.trigger.event === event
    )

    for (const workflow of matchingWorkflows) {
      // Check trigger conditions
      if (this.evaluateConditions(workflow.trigger.conditions || {}, data)) {
        await this.executeWorkflow(workflow, {
          workflowId: workflow.id,
          triggerEvent: event,
          entityType,
          entityId: data.id,
          entityData: data,
          userId: data.userId || undefined,
          timestamp: new Date()
        })
      }
    }
  }

  /**
   * Evaluate trigger conditions
   */
  private evaluateConditions(conditions: Record<string, any>, data: any): boolean {
    if (!conditions || Object.keys(conditions).length === 0) {
      return true // No conditions = always match
    }

    // Simple condition evaluation (can be enhanced)
    for (const [key, expectedValue] of Object.entries(conditions)) {
      const actualValue = this.getNestedValue(data, key)
      if (actualValue !== expectedValue) {
        return false
      }
    }

    return true
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(workflow: WorkflowData, context: ExecutionContext): Promise<void> {
    const executionId = `${workflow.id}-${Date.now()}`
    this.executions.set(executionId, context)

    try {
      // Execute actions sequentially
      for (const action of workflow.actions) {
        await this.executeAction(action, context, workflow)
      }
    } catch (error) {
      console.error(`Workflow execution error [${executionId}]:`, error)
      this.emit('workflow.error', { executionId, error, context })
    }

    this.executions.delete(executionId)
  }

  /**
   * Execute individual action
   */
  private async executeAction(
    action: WorkflowAction,
    context: ExecutionContext,
    workflow: WorkflowData
  ): Promise<void> {
    switch (action.type) {
      case 'send_email':
        await this.actionSendEmail(action, context)
        break
      case 'create_task':
        await this.actionCreateTask(action, context)
        break
      case 'update_field':
        await this.actionUpdateField(action, context)
        break
      case 'notify':
        await this.actionNotify(action, context)
        break
      case 'delay':
        await this.actionDelay(action, context)
        break
      case 'condition':
        await this.actionCondition(action, context)
        break
      case 'create_lead':
        await this.actionCreateLead(action, context)
        break
      case 'update_deal':
        await this.actionUpdateDeal(action, context)
        break
      default:
        console.warn(`Unknown action type: ${action.type}`)
    }
  }

  /**
   * Action: Send Email
   */
  private async actionSendEmail(action: WorkflowAction, context: ExecutionContext): Promise<void> {
    // TODO: Integrate with EmailManager when implemented
    console.log('Action: Send Email', { action, context })
    // Placeholder - will integrate with EmailManager
  }

  /**
   * Action: Create Task
   */
  private async actionCreateTask(action: WorkflowAction, context: ExecutionContext): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.task === 'undefined') {
      return
    }

    try {
      const config = action.config
      await prisma.task.create({
        data: {
          title: this.interpolate(config.title || 'New Task', context),
          description: config.description ? this.interpolate(config.description, context) : null,
          status: (config.status || 'TODO') as any, // Cast to enum
          priority: (config.priority || 'MEDIUM') as any, // Cast to enum
          dueDate: config.dueDate ? new Date(config.dueDate) : null,
          assignedToId: config.assignedToId || context.userId || null,
          clientId: context.entityType === 'client' ? context.entityId : config.clientId || null,
          pipelineId: context.entityType === 'pipeline' ? context.entityId : config.pipelineId || null,
          isRecurring: config.isRecurring || false,
          recurringPattern: config.recurringPattern || null,
          createdById: context.userId || null
        }
      })
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  /**
   * Action: Update Field
   */
  private async actionUpdateField(action: WorkflowAction, context: ExecutionContext): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma) {
      return
    }

    try {
      const config = action.config
      const { entity, field, value } = config

      // Map entity types to Prisma models
      const modelMap: Record<string, any> = {
        lead: prisma.lead,
        client: prisma.client,
        pipeline: prisma.pipeline
      }

      const model = modelMap[entity]
      if (!model) {
        console.error(`Unknown entity type: ${entity}`)
        return
      }

      await model.update({
        where: { id: context.entityId },
        data: { [field]: this.interpolate(value, context) }
      })
    } catch (error) {
      console.error('Error updating field:', error)
    }
  }

  /**
   * Action: Notify
   */
  private async actionNotify(action: WorkflowAction, context: ExecutionContext): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.notification === 'undefined') {
      return
    }

    try {
      const config = action.config
      await prisma.notification.create({
        data: {
          userId: config.userId || context.userId || '',
          type: config.type || 'SYSTEM_ALERT',
          title: this.interpolate(config.title || 'Notification', context),
          message: this.interpolate(config.message || '', context),
          link: config.link ? this.interpolate(config.link, context) : null
        }
      })
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  /**
   * Action: Delay
   */
  private async actionDelay(action: WorkflowAction, context: ExecutionContext): Promise<void> {
    const delayMs = action.config.delay || 0
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }

  /**
   * Action: Condition (branching)
   */
  private async actionCondition(action: WorkflowAction, context: ExecutionContext): Promise<void> {
    const config = action.config
    const condition = config.condition || {}
    
    const matches = this.evaluateConditions(condition, context.entityData)
    
    if (matches && action.next) {
      // Find next action and execute it
      // This would require workflow action lookup
    }
  }

  /**
   * Action: Create Lead
   */
  private async actionCreateLead(action: WorkflowAction, context: ExecutionContext): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.lead === 'undefined') {
      return
    }

    try {
      const config = action.config
      await prisma.lead.create({
        data: {
          source: config.source || 'automation',
          name: this.interpolate(config.name || '', context),
          email: config.email ? this.interpolate(config.email, context) : null,
          phone: config.phone ? this.interpolate(config.phone, context) : null,
          company: config.company ? this.interpolate(config.company, context) : null,
          message: config.message ? this.interpolate(config.message, context) : null
        }
      })
    } catch (error) {
      console.error('Error creating lead:', error)
    }
  }

  /**
   * Action: Update Deal
   */
  private async actionUpdateDeal(action: WorkflowAction, context: ExecutionContext): Promise<void> {
    // Similar to update_field but for pipeline/deals
    await this.actionUpdateField({ ...action, config: { ...action.config, entity: 'pipeline' } }, context)
  }

  /**
   * Interpolate template strings with context variables
   */
  private interpolate(template: string, context: ExecutionContext): string {
    let result = template
    
    // Replace {{variable}} with actual values
    result = result.replace(/\{\{entity\.(\w+)\}\}/g, (_, key) => {
      return this.getNestedValue(context.entityData, key) || ''
    })
    
    result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return (context as any)[key] || ''
    })
    
    return result
  }

  /**
   * Create new workflow
   */
  async createWorkflow(input: {
    name: string
    description?: string
    trigger: WorkflowTrigger
    actions: WorkflowAction[]
    userId: string
  }): Promise<string> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.workflow === 'undefined') {
      throw new Error('Database not available')
    }

    const workflow = await prisma.workflow.create({
      data: {
        name: input.name,
        description: input.description || null,
        trigger: input.trigger as any,
        actions: input.actions as any,
        isActive: true,
        createdById: input.userId
      }
    })

    // Reload workflows
    await this.loadWorkflows()

    return workflow.id
  }

  /**
   * Trigger event manually (for testing or external triggers)
   */
  triggerEvent(event: string, data: any) {
    this.emit(event, data)
  }
}

// Singleton instance
export const automationEngine = new AutomationEngine()



