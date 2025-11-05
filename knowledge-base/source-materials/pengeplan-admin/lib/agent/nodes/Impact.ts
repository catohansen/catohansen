/**
 * Impact - Calculates and visualizes the impact of suggestions
 */

import { AgentContext } from '../orchestrator';

export class Impact {
  static async execute(context: AgentContext): Promise<AgentContext> {
    console.log('🔍 [Impact] Calculating suggestion impacts...');
    
    const enhancedSuggestions = context.suggestions.map(suggestion => {
      const impact = this.calculateImpact(suggestion, context);
      
      return {
        ...suggestion,
        impactJson: {
          ...suggestion.impactJson,
          ...impact,
          summary: this.generateImpactSummary(impact),
          kpis: this.calculateKPIs(impact, context)
        }
      };
    });

    // Calculate overall impact score
    const overallImpactScore = this.calculateOverallImpactScore(enhancedSuggestions, context);

    console.log(`✅ [Impact] Calculated impacts for ${enhancedSuggestions.length} suggestions`);
    
    return {
      ...context,
      suggestions: enhancedSuggestions,
      impactScore: overallImpactScore,
      confidence: Math.max(context.confidence, overallImpactScore > 0 ? 90 : 0)
    };
  }

  private calculateImpact(suggestion: any, context: AgentContext): any {
    const baseImpact = suggestion.impactJson || {};
    
    switch (suggestion.kind) {
      case 'budget_realloc':
        return this.calculateBudgetImpact(suggestion, context, baseImpact);
        
      case 'bill_defer':
        return this.calculateBillDeferralImpact(suggestion, context, baseImpact);
        
      case 'bill_partpay':
        return this.calculatePartialPaymentImpact(suggestion, context, baseImpact);
        
      case 'debt_replan':
        return this.calculateDebtImpact(suggestion, context, baseImpact);
        
      case 'goal_pause':
        return this.calculateGoalPauseImpact(suggestion, context, baseImpact);
        
      case 'goal_prioritize':
        return this.calculateGoalPrioritizationImpact(suggestion, context, baseImpact);
        
      default:
        return baseImpact;
    }
  }

  private calculateBudgetImpact(suggestion: any, context: AgentContext, baseImpact: any): any {
    const reduction = suggestion.targetJson?.reduction || 0;
    const currentNetFlow = context.cashflow?.netFlow || 0;
    const newNetFlow = currentNetFlow + reduction;
    
    return {
      ...baseImpact,
      cashFlow: {
        before: currentNetFlow,
        after: newNetFlow,
        improvement: reduction
      },
      monthlySavings: reduction,
      annualSavings: reduction * 12,
      riskReduction: newNetFlow > 0 ? 'high' : newNetFlow > currentNetFlow ? 'medium' : 'low'
    };
  }

  private calculateBillDeferralImpact(suggestion: any, context: AgentContext, baseImpact: any): any {
    const deferredAmount = suggestion.targetJson?.immediateRelief || 0;
    const currentNetFlow = context.cashflow?.netFlow || 0;
    const newNetFlow = currentNetFlow + deferredAmount;
    
    return {
      ...baseImpact,
      cashFlow: {
        before: currentNetFlow,
        after: newNetFlow,
        improvement: deferredAmount
      },
      immediateRelief: deferredAmount,
      riskLevel: newNetFlow > 0 ? 'low' : 'medium',
      timeline: '30 days'
    };
  }

  private calculatePartialPaymentImpact(suggestion: any, context: AgentContext, baseImpact: any): any {
    const partialAmount = suggestion.targetJson?.suggestedPartialAmount || 0;
    const totalAmount = suggestion.targetJson?.totalAmount || 0;
    const immediateRelief = totalAmount - partialAmount;
    
    return {
      ...baseImpact,
      paymentRelief: {
        immediatePayment: partialAmount,
        deferredPayment: immediateRelief,
        reliefPercentage: (immediateRelief / totalAmount) * 100
      },
      cashFlow: {
        immediateRelief,
        nextPaymentDate: suggestion.targetJson?.paymentSchedule?.[1]?.date
      },
      riskLevel: 'low'
    };
  }

  private calculateDebtImpact(suggestion: any, context: AgentContext, baseImpact: any): any {
    const interestSaved = suggestion.targetJson?.totalInterestSaved || 0;
    const timeSaved = suggestion.targetJson?.payoffTimeMonths || 0;
    const extraPayment = suggestion.targetJson?.extraPayment || 0;
    
    return {
      ...baseImpact,
      debtOptimization: {
        interestSaved,
        timeSavedMonths: timeSaved,
        timeSavedYears: Math.floor(timeSaved / 12),
        extraMonthlyPayment: extraPayment
      },
      longTermBenefit: {
        totalSavings: interestSaved,
        payoffAcceleration: timeSaved,
        roi: interestSaved / (extraPayment * 12) // Return on extra payments
      },
      riskLevel: 'low'
    };
  }

  private calculateGoalPauseImpact(suggestion: any, context: AgentContext, baseImpact: any): any {
    const pausedGoals = suggestion.targetJson?.pausedGoals || [];
    const monthlyRelief = pausedGoals.reduce((sum: number, goal: any) => sum + (goal.monthlyContribution || 0), 0);
    const pauseDuration = suggestion.targetJson?.pauseDuration || '3-6 months';
    
    return {
      ...baseImpact,
      goalManagement: {
        pausedGoals: pausedGoals.length,
        monthlyRelief,
        pauseDuration,
        reviewDate: suggestion.targetJson?.reviewDate
      },
      cashFlow: {
        immediateRelief: monthlyRelief,
        annualRelief: monthlyRelief * 12
      },
      riskLevel: 'medium'
    };
  }

  private calculateGoalPrioritizationImpact(suggestion: any, context: AgentContext, baseImpact: any): any {
    const urgentGoals = suggestion.targetJson?.urgentGoals || [];
    const monthlyAllocation = suggestion.targetJson?.suggestedMonthlyAllocation || 0;
    const completionTime = suggestion.targetJson?.estimatedCompletionTime || 'unknown';
    
    return {
      ...baseImpact,
      goalOptimization: {
        urgentGoals: urgentGoals.length,
        monthlyAllocation,
        estimatedCompletion: completionTime,
        priorityStrategy: 'time_based'
      },
      efficiency: {
        focusedAllocation: monthlyAllocation,
        goalAcceleration: 'high',
        managementSimplification: 'medium'
      },
      riskLevel: 'low'
    };
  }

  private generateImpactSummary(impact: any): string {
    const summaries = [];
    
    if (impact.cashFlow?.improvement) {
      summaries.push(`Kontantstrøm forbedres med ${impact.cashFlow.improvement.toFixed(0)} kr/mnd`);
    }
    
    if (impact.monthlySavings) {
      summaries.push(`Månedlige besparelser: ${impact.monthlySavings.toFixed(0)} kr`);
    }
    
    if (impact.annualSavings) {
      summaries.push(`Årlige besparelser: ${impact.annualSavings.toFixed(0)} kr`);
    }
    
    if (impact.debtOptimization?.interestSaved) {
      summaries.push(`Rente besparelse: ${impact.debtOptimization.interestSaved.toFixed(0)} kr`);
    }
    
    if (impact.debtOptimization?.timeSavedMonths) {
      summaries.push(`Tid spart: ${impact.debtOptimization.timeSavedMonths} måneder`);
    }
    
    if (impact.immediateRelief) {
      summaries.push(`Umiddelbar lettelse: ${impact.immediateRelief.toFixed(0)} kr`);
    }
    
    return summaries.join('. ') || 'Ingen kvantifiserbar påvirkning';
  }

  private calculateKPIs(impact: any, context: AgentContext): any {
    const currentNetFlow = context.cashflow?.netFlow || 0;
    const totalDebt = context.debts?.reduce((sum: number, debt: any) => sum + debt.principal, 0) || 0;
    const monthlyIncome = context.cashflow?.monthlyIncome || 0;
    
    return {
      cashFlowHealth: {
        before: this.getCashFlowHealthScore(currentNetFlow, monthlyIncome),
        after: this.getCashFlowHealthScore(
          currentNetFlow + (impact.cashFlow?.improvement || 0), 
          monthlyIncome
        )
      },
      debtToIncomeRatio: {
        before: monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) * 100 : 0,
        after: monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) * 100 : 0 // Debt ratio doesn't change immediately
      },
      emergencyFundReadiness: {
        before: this.getEmergencyFundScore(context.goals),
        after: this.getEmergencyFundScore(context.goals, impact)
      }
    };
  }

  private getCashFlowHealthScore(netFlow: number, monthlyIncome: number): 'poor' | 'fair' | 'good' | 'excellent' {
    if (monthlyIncome <= 0) return 'poor';
    
    const ratio = netFlow / monthlyIncome;
    
    if (ratio >= 0.2) return 'excellent';
    if (ratio >= 0.1) return 'good';
    if (ratio >= 0) return 'fair';
    return 'poor';
  }

  private getEmergencyFundScore(goals: any[], impact?: any): 'none' | 'insufficient' | 'adequate' | 'excellent' {
    const emergencyGoal = goals?.find((g: any) => g.category === 'emergency');
    
    if (!emergencyGoal) return 'none';
    
    const currentAmount = emergencyGoal.currentAmount || 0;
    const targetAmount = emergencyGoal.targetAmount || 0;
    
    if (currentAmount >= targetAmount) return 'excellent';
    if (currentAmount >= targetAmount * 0.75) return 'adequate';
    if (currentAmount >= targetAmount * 0.25) return 'insufficient';
    return 'none';
  }

  private calculateOverallImpactScore(suggestions: any[], context: AgentContext): number {
    if (suggestions.length === 0) return 0;
    
    const scores = suggestions.map(suggestion => {
      let score = 0;
      
      // Cash flow improvement
      if (suggestion.impactJson?.cashFlow?.improvement) {
        score += Math.min(suggestion.impactJson.cashFlow.improvement / 1000, 20); // Max 20 points
      }
      
      // Debt optimization
      if (suggestion.impactJson?.debtOptimization?.interestSaved) {
        score += Math.min(suggestion.impactJson.debtOptimization.interestSaved / 10000, 15); // Max 15 points
      }
      
      // Time savings
      if (suggestion.impactJson?.debtOptimization?.timeSavedMonths) {
        score += Math.min(suggestion.impactJson.debtOptimization.timeSavedMonths / 12, 10); // Max 10 points
      }
      
      // Risk reduction
      if (suggestion.impactJson?.riskLevel) {
        switch (suggestion.impactJson.riskLevel) {
          case 'high': score += 15; break;
          case 'medium': score += 10; break;
          case 'low': score += 5; break;
        }
      }
      
      return score;
    });
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }
}
