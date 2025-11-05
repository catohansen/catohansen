/**
 * Smart Automation Engine - Intelligent Financial Automation
 * 
 * Automatiserer økonomiske prosesser basert på:
 * - Brukerens atferdsmønstre
 * - AI-anbefalinger
 * - Økonomiske triggers
 * - Sikkerhetsregler
 */

import { prisma } from '@/lib/prisma'

export interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: AutomationTrigger
  condition: AutomationCondition
  action: AutomationAction
  isActive: boolean
  priority: number
  aiRecommended: boolean
  createdAt: Date
  lastExecuted?: Date
  executionCount: number
}

export interface AutomationTrigger {
  type: 'BILL_DUE' | 'LOW_BALANCE' | 'SPENDING_EXCEEDED' | 'SAVINGS_GOAL' | 'DEBT_PAYMENT' | 'INCOME_RECEIVED' | 'SCHEDULED'
  parameters: Record<string, any>
  schedule?: string // Cron expression for scheduled triggers
}

export interface AutomationCondition {
  field: string
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'NOT_EQUALS'
  value: any
  logicalOperator?: 'AND' | 'OR'
  additionalConditions?: AutomationCondition[]
}

export interface AutomationAction {
  type: 'NOTIFY' | 'TRANSFER' | 'PAUSE_SPENDING' | 'AUTO_PAY' | 'SAVE_MONEY' | 'INVEST' | 'ALERT'
  parameters: Record<string, any>
  delay?: number // seconds
  retryCount?: number
}

export interface AutomationExecution {
  id: string
  ruleId: string
  userId: string
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  result?: any
  error?: string
  executedAt: Date
  duration?: number // milliseconds
}

export class SmartAutomationEngine {
  /**
   * Hovedmetode for å kjøre automasjon
   */
  async runAutomation(userId: string, triggerType?: string): Promise<AutomationExecution[]> {
    try {
      // Hent aktive regler for brukeren
      const rules = await this.getActiveRules(userId, triggerType)
      
      const executions: AutomationExecution[] = []
      
      // Kjør hver regel
      for (const rule of rules) {
        try {
          const execution = await this.executeRule(rule, userId)
          executions.push(execution)
        } catch (error) {
          console.error(`Error executing rule ${rule.id}:`, error)
          // Fortsett med neste regel
        }
      }
      
      return executions
      
    } catch (error) {
      console.error('Error running automation:', error)
      throw new Error('Kunne ikke kjøre automasjon')
    }
  }
  
  /**
   * Opprett ny automasjonsregel
   */
  async createRule(userId: string, rule: Omit<AutomationRule, 'id' | 'createdAt' | 'executionCount'>): Promise<AutomationRule> {
    try {
      const newRule = await prisma.automationRule.create({
        data: {
          userId,
          name: rule.name,
          description: rule.description,
          trigger: rule.trigger,
          condition: rule.condition,
          action: rule.action,
          isActive: rule.isActive,
          priority: rule.priority,
          aiRecommended: rule.aiRecommended
        }
      })
      
      return {
        id: newRule.id,
        name: newRule.name,
        description: newRule.description,
        trigger: newRule.trigger as AutomationTrigger,
        condition: newRule.condition as AutomationCondition,
        action: newRule.action as AutomationAction,
        isActive: newRule.isActive,
        priority: newRule.priority,
        aiRecommended: newRule.aiRecommended,
        createdAt: newRule.createdAt,
        executionCount: 0
      }
      
    } catch (error) {
      console.error('Error creating rule:', error)
      throw new Error('Kunne ikke opprette automasjonsregel')
    }
  }
  
  /**
   * Generer AI-anbefalte regler
   */
  async generateAIRules(userId: string): Promise<AutomationRule[]> {
    try {
      // Analyser brukerens økonomiske data
      const userData = await this.analyzeUserData(userId)
      
      const aiRules: Omit<AutomationRule, 'id' | 'createdAt' | 'executionCount'>[] = []
      
      // Regel 1: Automatisk sparing ved inntekt
      if (userData.monthlyIncome > 0 && userData.savingsRate < 10) {
        aiRules.push({
          name: 'Automatisk sparing ved inntekt',
          description: 'Sett av 10% av inntekt til sparing når lønn kommer inn',
          trigger: {
            type: 'INCOME_RECEIVED',
            parameters: { amount: userData.monthlyIncome * 0.1 }
          },
          condition: {
            field: 'amount',
            operator: 'GREATER_THAN',
            value: userData.monthlyIncome * 0.1
          },
          action: {
            type: 'SAVE_MONEY',
            parameters: { 
              amount: userData.monthlyIncome * 0.1,
              account: 'SAVINGS'
            }
          },
          isActive: true,
          priority: 1,
          aiRecommended: true
        })
      }
      
      // Regel 2: Varsle ved lav saldo
      if (userData.averageBalance < 5000) {
        aiRules.push({
          name: 'Varsle ved lav saldo',
          description: 'Send varsel når saldo går under 5000 kr',
          trigger: {
            type: 'LOW_BALANCE',
            parameters: { threshold: 5000 }
          },
          condition: {
            field: 'balance',
            operator: 'LESS_THAN',
            value: 5000
          },
          action: {
            type: 'NOTIFY',
            parameters: { 
              message: 'Saldo er lav! Vurder å redusere utgifter eller overføre penger.',
              urgency: 'HIGH'
            }
          },
          isActive: true,
          priority: 2,
          aiRecommended: true
        })
      }
      
      // Regel 3: Automatisk regningsbetaling
      if (userData.averageBillAmount > 0) {
        aiRules.push({
          name: 'Automatisk regningsbetaling',
          description: 'Betal regninger automatisk 3 dager før forfall',
          trigger: {
            type: 'BILL_DUE',
            parameters: { daysBeforeDue: 3 }
          },
          condition: {
            field: 'amount',
            operator: 'LESS_THAN',
            value: userData.averageBillAmount * 2
          },
          action: {
            type: 'AUTO_PAY',
            parameters: { 
              method: 'AUTOMATIC',
              confirmation: true
            }
          },
          isActive: true,
          priority: 3,
          aiRecommended: true
        })
      }
      
      return aiRules as AutomationRule[]
      
    } catch (error) {
      console.error('Error generating AI rules:', error)
      throw new Error('Kunne ikke generere AI-anbefalte regler')
    }
  }
  
  /**
   * Hent aktive regler
   */
  private async getActiveRules(userId: string, triggerType?: string): Promise<AutomationRule[]> {
    const rules = await prisma.automationRule.findMany({
      where: {
        userId,
        isActive: true,
        ...(triggerType && { trigger: { type: triggerType } })
      },
      orderBy: { priority: 'asc' }
    })
    
    return rules.map(rule => ({
      id: rule.id,
      name: rule.name,
      description: rule.description,
      trigger: rule.trigger as AutomationTrigger,
      condition: rule.condition as AutomationCondition,
      action: rule.action as AutomationAction,
      isActive: rule.isActive,
      priority: rule.priority,
      aiRecommended: rule.aiRecommended,
      createdAt: rule.createdAt,
      executionCount: rule.executionCount || 0
    }))
  }
  
  /**
   * Kjør en automasjonsregel
   */
  private async executeRule(rule: AutomationRule, userId: string): Promise<AutomationExecution> {
    const startTime = Date.now()
    
    try {
      // Sjekk om betingelsen er oppfylt
      const conditionMet = await this.checkCondition(rule.condition, userId)
      
      if (!conditionMet) {
        return {
          id: `exec_${Date.now()}_${rule.id}`,
          ruleId: rule.id,
          userId,
          status: 'CANCELLED',
          executedAt: new Date(),
          duration: Date.now() - startTime
        }
      }
      
      // Kjør handlingen
      const result = await this.executeAction(rule.action, userId)
      
      // Oppdater regel-statistikk
      await prisma.automationRule.update({
        where: { id: rule.id },
        data: { 
          executionCount: rule.executionCount + 1,
          lastExecuted: new Date()
        }
      })
      
      return {
        id: `exec_${Date.now()}_${rule.id}`,
        ruleId: rule.id,
        userId,
        status: 'COMPLETED',
        result,
        executedAt: new Date(),
        duration: Date.now() - startTime
      }
      
    } catch (error) {
      return {
        id: `exec_${Date.now()}_${rule.id}`,
        ruleId: rule.id,
        userId,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        executedAt: new Date(),
        duration: Date.now() - startTime
      }
    }
  }
  
  /**
   * Sjekk om betingelse er oppfylt
   */
  private async checkCondition(condition: AutomationCondition, userId: string): Promise<boolean> {
    // Hent relevant data basert på felt
    const userData = await this.getUserDataForCondition(condition.field, userId)
    
    // Sjekk betingelse
    switch (condition.operator) {
      case 'EQUALS':
        return userData === condition.value
      case 'GREATER_THAN':
        return userData > condition.value
      case 'LESS_THAN':
        return userData < condition.value
      case 'CONTAINS':
        return String(userData).includes(String(condition.value))
      case 'NOT_EQUALS':
        return userData !== condition.value
      default:
        return false
    }
  }
  
  /**
   * Kjør handling
   */
  private async executeAction(action: AutomationAction, userId: string): Promise<any> {
    switch (action.type) {
      case 'NOTIFY':
        return await this.sendNotification(userId, action.parameters)
      case 'TRANSFER':
        return await this.transferMoney(userId, action.parameters)
      case 'PAUSE_SPENDING':
        return await this.pauseSpending(userId, action.parameters)
      case 'AUTO_PAY':
        return await this.autoPayBill(userId, action.parameters)
      case 'SAVE_MONEY':
        return await this.saveMoney(userId, action.parameters)
      case 'INVEST':
        return await this.investMoney(userId, action.parameters)
      case 'ALERT':
        return await this.sendAlert(userId, action.parameters)
      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }
  
  /**
   * Analyser brukerdata for AI-anbefalinger
   */
  private async analyzeUserData(userId: string): Promise<{
    monthlyIncome: number
    savingsRate: number
    averageBalance: number
    averageBillAmount: number
  }> {
    const currentMonth = new Date().toISOString().slice(0, 7)
    
    const [budget, bills, accounts] = await Promise.all([
      prisma.budget.findFirst({
        where: { userId, month: currentMonth }
      }),
      prisma.bill.findMany({
        where: { userId },
        take: 10
      }),
      prisma.account.findMany({
        where: { userId }
      })
    ])
    
    const monthlyIncome = budget?.incomeMonthly || 0
    const savingsRate = budget?.savingsRate || 0
    const averageBalance = accounts.length > 0 ? 
      accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) / accounts.length : 0
    const averageBillAmount = bills.length > 0 ?
      bills.reduce((sum, bill) => sum + (bill.amountNok || 0), 0) / bills.length : 0
    
    return {
      monthlyIncome,
      savingsRate,
      averageBalance,
      averageBillAmount
    }
  }
  
  /**
   * Hent brukerdata for betingelse
   */
  private async getUserDataForCondition(field: string, userId: string): Promise<any> {
    // Forenklet implementering - kan utvides
    switch (field) {
      case 'balance':
        const account = await prisma.account.findFirst({ where: { userId } })
        return account?.balance || 0
      case 'amount':
        const bill = await prisma.bill.findFirst({ where: { userId } })
        return bill?.amountNok || 0
      default:
        return null
    }
  }
  
  /**
   * Send notifikasjon
   */
  private async sendNotification(userId: string, parameters: Record<string, any>): Promise<any> {
    // Implementer notifikasjonslogikk
    console.log(`Sending notification to user ${userId}:`, parameters)
    return { success: true, message: 'Notification sent' }
  }
  
  /**
   * Overfør penger
   */
  private async transferMoney(userId: string, parameters: Record<string, any>): Promise<any> {
    // Implementer overføringslogikk
    console.log(`Transferring money for user ${userId}:`, parameters)
    return { success: true, amount: parameters.amount }
  }
  
  /**
   * Pause utgifter
   */
  private async pauseSpending(userId: string, parameters: Record<string, any>): Promise<any> {
    // Implementer pause-logikk
    console.log(`Pausing spending for user ${userId}:`, parameters)
    return { success: true, paused: true }
  }
  
  /**
   * Automatisk regningsbetaling
   */
  private async autoPayBill(userId: string, parameters: Record<string, any>): Promise<any> {
    // Implementer automatisk betaling
    console.log(`Auto-paying bill for user ${userId}:`, parameters)
    return { success: true, paid: true }
  }
  
  /**
   * Spar penger
   */
  private async saveMoney(userId: string, parameters: Record<string, any>): Promise<any> {
    // Implementer sparing
    console.log(`Saving money for user ${userId}:`, parameters)
    return { success: true, saved: parameters.amount }
  }
  
  /**
   * Invester penger
   */
  private async investMoney(userId: string, parameters: Record<string, any>): Promise<any> {
    // Implementer investering
    console.log(`Investing money for user ${userId}:`, parameters)
    return { success: true, invested: parameters.amount }
  }
  
  /**
   * Send varsel
   */
  private async sendAlert(userId: string, parameters: Record<string, any>): Promise<any> {
    // Implementer varsel
    console.log(`Sending alert to user ${userId}:`, parameters)
    return { success: true, alert: parameters.message }
  }
}

















