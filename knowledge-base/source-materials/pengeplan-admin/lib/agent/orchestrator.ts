/**
 * Agent Orchestrator - LangGraph-style workflow coordination
 * Manages the execution flow of multiple AI agents for financial planning
 */

import { prisma } from '@/lib/prisma';
// Mock audit functions
const auditLogger = {
  log: (data) => console.log('Audit:', data)
};
import { BudgetAgent } from './nodes/BudgetAgent';
import { DebtAgent } from './nodes/DebtAgent';
import { MotivationAgent } from './nodes/MotivationAgent';
import { CashFlowPlanner } from './nodes/CashFlowPlanner';
import { GoalAllocator } from './nodes/GoalAllocator';
import { Reasoning } from './nodes/Reasoning';
import { Guardrails } from './nodes/Guardrails';
import { Impact } from './nodes/Impact';
import { StructuredDataNode } from './nodes/StructuredDataNode';
import { UnstructuredDataNode } from './nodes/UnstructuredDataNode';
import { APIRetrievalNode } from './nodes/APIRetrievalNode';

export interface AgentContext {
  userId: string;
  entry: 'user_assist' | 'guardian_assist' | 'admin_trigger';
  now: Date;
  // Snapshots loaded in sensing
  budget: any;
  cashflow: any;
  bills: any[];
  debts: any[];
  goals: any[];
  policies: any[];
  // Runtime state
  suggestions: any[];
  confidence: number;
  impactScore: number;
}

export interface AgentNode {
  name: string;
  execute: (context: AgentContext) => Promise<AgentContext>;
}

export class AgentOrchestrator {
  private nodes: AgentNode[] = [];
  private agentVersion = '1.0.0';

  constructor() {
    this.initializeNodes();
  }

  private initializeNodes() {
    this.nodes = [
      // Data gathering nodes (Sprint U-9)
      { name: 'StructuredDataNode', execute: StructuredDataNode.execute },
      { name: 'UnstructuredDataNode', execute: UnstructuredDataNode.execute },
      { name: 'APIRetrievalNode', execute: APIRetrievalNode.execute },
      // Analysis nodes (Sprint U-8)
      { name: 'BudgetAgent', execute: BudgetAgent.execute },
      { name: 'CashFlowPlanner', execute: CashFlowPlanner.execute },
      { name: 'DebtAgent', execute: DebtAgent.execute },
      { name: 'GoalAllocator', execute: GoalAllocator.execute },
      // Processing nodes
      { name: 'Reasoning', execute: Reasoning.execute },
      { name: 'Guardrails', execute: Guardrails.execute },
      { name: 'Impact', execute: Impact.execute }
    ];
  }

  /**
   * Main orchestration method - runs the complete agent workflow
   */
  async runOrchestration(
    userId: string,
    entry: 'user_assist' | 'guardian_assist' | 'admin_trigger',
    options: any = {}
  ): Promise<{ runId: string; suggestions: any[]; status: string }> {
    const startTime = Date.now();
    let runId: string;

    try {
      // Create AgentRun record
      const run = await prisma.agentRun.create({
        data: {
          userId,
          entryPoint: entry,
          status: 'running',
          inputContext: JSON.stringify(options),
          latencyMs: 0
        }
      });
      runId = run.id;

      // Load user context (sensing phase)
      const context = await this.loadUserContext(userId, entry, options);

      // Execute agent nodes sequentially
      let currentContext = context;
      for (const node of this.nodes) {
        const nodeStartTime = Date.now();
        
        try {
          // Execute node
          currentContext = await node.execute(currentContext);
          
          // Log node trace
          await this.logNodeTrace(runId, node.name, {
            stateIn: context,
            stateOut: currentContext,
            latencyMs: Date.now() - nodeStartTime
          });

          // Check if we should continue (guardrails can stop execution)
          if (currentContext.status === 'blocked') {
            break;
          }
        } catch (error) {
          console.error(`Error in node ${node.name}:`, error);
          await this.logNodeTrace(runId, node.name, {
            stateIn: context,
            stateOut: { error: error instanceof Error ? error.message : 'Unknown error' },
            latencyMs: Date.now() - nodeStartTime
          });
          throw error;
        }
      }

      // Persist suggestions
      const suggestions = await this.persistSuggestions(runId, userId, currentContext.suggestions);

      // Update run status
      const totalLatency = Date.now() - startTime;
      await prisma.agentRun.update({
        where: { id: runId },
        data: {
          status: 'succeeded',
          finishedAt: new Date(),
          resultSummary: JSON.stringify({
            suggestionsCount: suggestions.length,
            confidence: currentContext.confidence,
            impactScore: currentContext.impactScore
          }),
          latencyMs: totalLatency
        }
      });

      // Audit log
      await auditLogger.log({
        userId,
        userEmail: 'system', // Will be filled by audit logger
        action: 'AGENT_RUN_COMPLETED',
        category: 'agent_orchestration',
        setting: 'orchestration',
        newValue: {
          runId,
          entryPoint: entry,
          suggestionsCount: suggestions.length,
          latencyMs: totalLatency
        }
      });

      return {
        runId,
        suggestions,
        status: 'succeeded'
      };

    } catch (error) {
      console.error('Orchestration failed:', error);
      
      // Update run status to failed
      if (runId) {
        await prisma.agentRun.update({
          where: { id: runId },
          data: {
            status: 'failed',
            finishedAt: new Date(),
            latencyMs: Date.now() - startTime
          }
        });
      }

      // Audit log failure
      await auditLogger.log({
        userId,
        userEmail: 'system',
        action: 'AGENT_RUN_FAILED',
        category: 'agent_orchestration',
        setting: 'orchestration',
        newValue: {
          runId: runId || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }
  }

  /**
   * Load user context and financial data
   */
  private async loadUserContext(
    userId: string,
    entry: string,
    options: any
  ): Promise<AgentContext> {
    // Load user's financial data
    const [budgets, bills, debts, goals] = await Promise.all([
      prisma.budget.findMany({
        where: { userId },
        include: { categories: true },
        orderBy: { month: 'desc' },
        take: 3
      }),
      prisma.bill.findMany({
        where: { userId, status: { not: 'PAID' } },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.debt.findMany({
        where: { userId },
        orderBy: { annualRate: 'desc' }
      }),
      prisma.savingsGoal.findMany({
        where: { userId, isActive: true },
        orderBy: { priority: 'desc' }
      })
    ]);

    // Load active policies
    const policies = await prisma.agentPolicy.findMany({
      where: { status: 'ACTIVE' }
    });

    // Calculate cash flow (simplified)
    const cashflow = this.calculateCashFlow(budgets, bills);

    return {
      userId,
      entry: entry as any,
      now: new Date(),
      budget: budgets[0] || null,
      cashflow,
      bills,
      debts,
      goals,
      policies: policies.map(p => JSON.parse(p.json)),
      suggestions: [],
      confidence: 0,
      impactScore: 0
    };
  }

  /**
   * Calculate simplified cash flow
   */
  private calculateCashFlow(budgets: any[], bills: any[]): any {
    if (!budgets.length) return { monthlyIncome: 0, monthlyExpenses: 0, netFlow: 0 };

    const currentBudget = budgets[0];
    const monthlyIncome = currentBudget.incomeMonthly || 0;
    const monthlyExpenses = currentBudget.categories.reduce(
      (sum: number, cat: any) => sum + (cat.planned || 0), 0
    );
    const netFlow = monthlyIncome - monthlyExpenses;

    return {
      monthlyIncome,
      monthlyExpenses,
      netFlow,
      upcomingBills: bills.slice(0, 5) // Next 5 bills
    };
  }

  /**
   * Log node execution trace
   */
  private async logNodeTrace(
    runId: string,
    nodeName: string,
    trace: { stateIn: any; stateOut: any; latencyMs: number }
  ) {
    await prisma.agentNodeTrace.create({
      data: {
        runId,
        node: nodeName,
        step: this.nodes.findIndex(n => n.name === nodeName) + 1,
        stateIn: JSON.stringify(trace.stateIn),
        stateOut: JSON.stringify(trace.stateOut),
        latencyMs: trace.latencyMs
      }
    });
  }

  /**
   * Persist agent suggestions to database
   */
  private async persistSuggestions(
    runId: string,
    userId: string,
    suggestions: any[]
  ): Promise<any[]> {
    const persistedSuggestions = [];

    for (const suggestion of suggestions) {
      const persisted = await prisma.agentSuggestion.create({
        data: {
          runId,
          userId,
          kind: suggestion.kind,
          reasoning: suggestion.reasoning,
          confidence: suggestion.confidence || 0,
          targetJson: JSON.stringify(suggestion.targetJson),
          impactJson: JSON.stringify(suggestion.impactJson),
          status: 'pending'
        }
      });

      persistedSuggestions.push({
        ...persisted,
        targetJson: JSON.parse(persisted.targetJson),
        impactJson: JSON.parse(persisted.impactJson)
      });
    }

    return persistedSuggestions;
  }

  /**
   * Get orchestration metrics for admin dashboard
   */
  async getMetrics(): Promise<{
    totalRuns: number;
    successRate: number;
    avgLatency: number;
    nodeLatency: Record<string, number>;
    acceptRate: number;
  }> {
    const [runs, suggestions] = await Promise.all([
      prisma.agentRun.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      prisma.agentSuggestion.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    const totalRuns = runs.length;
    const successfulRuns = runs.filter(r => r.status === 'succeeded').length;
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;
    const avgLatency = runs.length > 0 
      ? runs.reduce((sum, r) => sum + (r.latencyMs || 0), 0) / runs.length 
      : 0;

    // Calculate node latency
    const nodeTraces = await prisma.agentNodeTrace.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const nodeLatency: Record<string, number> = {};
    const nodeGroups = nodeTraces.reduce((acc, trace) => {
      if (!acc[trace.node]) acc[trace.node] = [];
      acc[trace.node].push(trace.latencyMs || 0);
      return acc;
    }, {} as Record<string, number[]>);

    for (const [node, latencies] of Object.entries(nodeGroups)) {
      nodeLatency[node] = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
    }

    // Calculate accept rate
    const totalSuggestions = suggestions.length;
    const acceptedSuggestions = suggestions.filter(s => s.status === 'applied').length;
    const acceptRate = totalSuggestions > 0 ? (acceptedSuggestions / totalSuggestions) * 100 : 0;

    return {
      totalRuns,
      successRate,
      avgLatency,
      nodeLatency,
      acceptRate
    };
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator();
