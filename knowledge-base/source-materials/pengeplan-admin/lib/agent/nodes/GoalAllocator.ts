/**
 * GoalAllocator - Analyzes savings goals and suggests allocation strategies
 */

import { AgentContext } from '../orchestrator';

export class GoalAllocator {
  static async execute(context: AgentContext): Promise<AgentContext> {
    console.log('🔍 [GoalAllocator] Analyzing savings goals...');
    
    const suggestions = [];
    const { goals, cashflow } = context;
    
    if (!goals || goals.length === 0) {
      console.log('⚠️ [GoalAllocator] No savings goals available');
      return context;
    }

    const monthlyNetFlow = cashflow?.netFlow || 0;
    const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalRemaining = totalGoalAmount - totalCurrentAmount;

    // Analyze goal priorities and timelines
    const urgentGoals = goals.filter(goal => {
      if (!goal.targetDate) return false;
      const monthsToTarget = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
      return monthsToTarget <= 12 && goal.currentAmount < goal.targetAmount;
    });

    const longTermGoals = goals.filter(goal => {
      if (!goal.targetDate) return true;
      const monthsToTarget = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
      return monthsToTarget > 12;
    });

    // Suggest goal prioritization
    if (urgentGoals.length > 0 && monthlyNetFlow > 0) {
      const availableForGoals = Math.min(monthlyNetFlow * 0.2, 3000); // 20% of net flow, max 3000 kr
      
      suggestions.push({
        kind: 'goal_prioritize',
        reasoning: `${urgentGoals.length} mål med kort tidsramme. Foreslår prioritert sparing.`,
        confidence: 85,
        targetJson: {
          type: 'goal_prioritization',
          urgentGoals: urgentGoals.map(goal => ({
            goalId: goal.id,
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            remaining: goal.targetAmount - goal.currentAmount,
            targetDate: goal.targetDate,
            priority: goal.priority
          })),
          suggestedMonthlyAllocation: availableForGoals,
          allocationStrategy: 'priority_based'
        },
        impactJson: {
          before: {
            urgentGoals: urgentGoals.length,
            totalUrgentRemaining: urgentGoals.reduce((sum, goal) => sum + (goal.targetAmount - goal.currentAmount), 0),
            monthlyAllocation: 0
          },
          after: {
            urgentGoals: urgentGoals.length,
            monthlyAllocation: availableForGoals,
            estimatedCompletionTime: this.calculateGoalCompletionTime(urgentGoals, availableForGoals)
          },
          completionAcceleration: 'significant'
        }
      });
    }

    // Suggest goal pausing for financial stress
    if (monthlyNetFlow < 0 && goals.length > 0) {
      const nonEssentialGoals = goals.filter(goal => 
        goal.priority !== 'HIGH' && goal.category !== 'emergency'
      );

      if (nonEssentialGoals.length > 0) {
        suggestions.push({
          kind: 'goal_pause',
          reasoning: `Negativ kontantstrøm. Foreslår midlertidig pause på ${nonEssentialGoals.length} ikke-kritiske mål.`,
          confidence: 90,
          targetJson: {
            type: 'goal_pause',
            pausedGoals: nonEssentialGoals.map(goal => ({
              goalId: goal.id,
              name: goal.name,
              currentAmount: goal.currentAmount,
              targetAmount: goal.targetAmount,
              pauseDuration: '3-6 months',
              reason: 'cash_flow_negative'
            })),
            pauseDuration: '3-6 months',
            reviewDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000)
          },
          impactJson: {
            before: {
              activeGoals: goals.length,
              monthlyGoalAllocation: goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0),
              cashFlow: monthlyNetFlow
            },
            after: {
              activeGoals: goals.length - nonEssentialGoals.length,
              pausedGoals: nonEssentialGoals.length,
              monthlyGoalAllocation: goals
                .filter(goal => !nonEssentialGoals.includes(goal))
                .reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0),
              cashFlowImprovement: nonEssentialGoals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0)
            },
            immediateRelief: nonEssentialGoals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0)
          }
        });
      }
    }

    // Suggest goal consolidation
    if (goals.length > 5) {
      const similarGoals = this.findSimilarGoals(goals);
      
      if (similarGoals.length > 0) {
        suggestions.push({
          kind: 'goal_consolidate',
          reasoning: `${goals.length} sparemål kan være for mange. Foreslår konsolidering av lignende mål.`,
          confidence: 70,
          targetJson: {
            type: 'goal_consolidation',
            similarGoals: similarGoals.map(group => ({
              category: group.category,
              goals: group.goals.map(goal => ({
                goalId: goal.id,
                name: goal.name,
                amount: goal.targetAmount
              })),
              suggestedConsolidatedAmount: group.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
            })),
            consolidationBenefit: 'simplified_management'
          },
          impactJson: {
            before: {
              totalGoals: goals.length,
              managementComplexity: 'high',
              trackingOverhead: 'significant'
            },
            after: {
              totalGoals: goals.length - similarGoals.reduce((sum, group) => sum + group.goals.length - 1, 0),
              managementComplexity: 'medium',
              trackingOverhead: 'reduced'
            },
            simplification: 'significant'
          }
        });
      }
    }

    // Suggest emergency fund goal
    const hasEmergencyFund = goals.some(goal => 
      goal.category === 'emergency' || goal.name.toLowerCase().includes('nødfond')
    );
    
    if (!hasEmergencyFund && monthlyNetFlow > 1000) {
      const suggestedEmergencyAmount = Math.min(monthlyNetFlow * 6, 100000); // 6 months expenses, max 100k
      
      suggestions.push({
        kind: 'goal_create_emergency',
        reasoning: 'Ingen nødfond identifisert. Foreslår opprettelse av nødfond som prioritet.',
        confidence: 95,
        targetJson: {
          type: 'create_emergency_fund',
          suggestedAmount: suggestedEmergencyAmount,
          suggestedMonthlyContribution: Math.min(monthlyNetFlow * 0.3, 5000),
          estimatedCompletionTime: Math.ceil(suggestedEmergencyAmount / (monthlyNetFlow * 0.3)),
          priority: 'HIGH'
        },
        impactJson: {
          before: {
            emergencyFund: 0,
            financialSecurity: 'low',
            riskLevel: 'high'
          },
          after: {
            emergencyFund: suggestedEmergencyAmount,
            financialSecurity: 'medium',
            riskLevel: 'medium'
          },
          riskReduction: 'significant'
        }
      });
    }

    console.log(`✅ [GoalAllocator] Generated ${suggestions.length} goal suggestions`);
    
    return {
      ...context,
      suggestions: [...context.suggestions, ...suggestions],
      confidence: Math.max(context.confidence, suggestions.length > 0 ? 80 : 0)
    };
  }

  private calculateGoalCompletionTime(goals: any[], monthlyAllocation: number): string {
    const totalRemaining = goals.reduce((sum, goal) => sum + (goal.targetAmount - goal.currentAmount), 0);
    const months = Math.ceil(totalRemaining / monthlyAllocation);
    
    if (months <= 12) {
      return `${months} måneder`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} år${remainingMonths > 0 ? ` og ${remainingMonths} måneder` : ''}`;
    }
  }

  private findSimilarGoals(goals: any[]): Array<{ category: string; goals: any[] }> {
    const categoryGroups = goals.reduce((groups, goal) => {
      const category = goal.category || 'general';
      if (!groups[category]) groups[category] = [];
      groups[category].push(goal);
      return groups;
    }, {} as Record<string, any[]>);

    return Object.entries(categoryGroups)
      .filter(([_, goals]) => goals.length > 1)
      .map(([category, goals]) => ({ category, goals }));
  }
}
