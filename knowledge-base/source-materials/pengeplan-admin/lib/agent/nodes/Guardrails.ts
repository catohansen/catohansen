/**
 * Guardrails - Validates suggestions against policies and safety rules
 */

import { AgentContext } from '../orchestrator';

export class Guardrails {
  static async execute(context: AgentContext): Promise<AgentContext> {
    console.log('🔍 [Guardrails] Validating suggestions...');
    
    const validatedSuggestions = [];
    const blockedSuggestions = [];
    
    for (const suggestion of context.suggestions) {
      const validation = await this.validateSuggestion(suggestion, context);
      
      if (validation.allowed) {
        validatedSuggestions.push({
          ...suggestion,
          policyHints: validation.hints,
          riskLevel: validation.riskLevel
        });
      } else {
        blockedSuggestions.push({
          ...suggestion,
          blockReason: validation.reason,
          policyViolation: validation.policyViolation
        });
        
        console.log(`🚫 [Guardrails] Blocked suggestion: ${suggestion.kind} - ${validation.reason}`);
      }
    }

    // Log policy violations
    if (blockedSuggestions.length > 0) {
      console.log(`⚠️ [Guardrails] Blocked ${blockedSuggestions.length} suggestions due to policy violations`);
    }

    console.log(`✅ [Guardrails] Validated ${validatedSuggestions.length} suggestions`);
    
    return {
      ...context,
      suggestions: validatedSuggestions,
      blockedSuggestions,
      confidence: Math.max(context.confidence, validatedSuggestions.length > 0 ? 85 : 0)
    };
  }

  private async validateSuggestion(suggestion: any, context: AgentContext): Promise<{
    allowed: boolean;
    reason?: string;
    policyViolation?: string;
    hints?: string[];
    riskLevel?: 'low' | 'medium' | 'high';
  }> {
    const hints: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Apply policy rules
    for (const policy of context.policies) {
      const policyResult = this.applyPolicy(policy, suggestion, context);
      
      if (!policyResult.allowed) {
        return {
          allowed: false,
          reason: policyResult.reason,
          policyViolation: policy.name
        };
      }
      
      if (policyResult.hints) {
        hints.push(...policyResult.hints);
      }
      
      if (policyResult.riskLevel && this.getRiskLevelScore(policyResult.riskLevel) > this.getRiskLevelScore(riskLevel)) {
        riskLevel = policyResult.riskLevel;
      }
    }

    // Apply safety rules
    const safetyResult = this.applySafetyRules(suggestion, context);
    
    if (!safetyResult.allowed) {
      return {
        allowed: false,
        reason: safetyResult.reason,
        policyViolation: 'safety_rule'
      };
    }

    if (safetyResult.hints) {
      hints.push(...safetyResult.hints);
    }

    if (safetyResult.riskLevel && this.getRiskLevelScore(safetyResult.riskLevel) > this.getRiskLevelScore(riskLevel)) {
      riskLevel = safetyResult.riskLevel;
    }

    return {
      allowed: true,
      hints,
      riskLevel
    };
  }

  private applyPolicy(policy: any, suggestion: any, context: AgentContext): {
    allowed: boolean;
    reason?: string;
    hints?: string[];
    riskLevel?: 'low' | 'medium' | 'high';
  } {
    // Example policy implementations
    switch (policy.name) {
      case 'No Large Budget Cuts':
        if (suggestion.kind === 'budget_realloc' && suggestion.targetJson?.reduction > 5000) {
          return {
            allowed: false,
            reason: 'Budget reduction exceeds policy limit of 5000 kr'
          };
        }
        break;

      case 'Maximum Partial Payments':
        if (suggestion.kind === 'bill_partpay' && suggestion.targetJson?.suggestedPartialAmount < 1000) {
          return {
            allowed: false,
            reason: 'Partial payment below minimum threshold of 1000 kr'
          };
        }
        break;

      case 'Debt Consolidation Limits':
        if (suggestion.kind === 'debt_consolidate' && suggestion.targetJson?.totalAmount > 200000) {
          return {
            allowed: false,
            reason: 'Debt consolidation amount exceeds policy limit of 200,000 kr'
          };
        }
        break;

      case 'Emergency Fund Priority':
        if (suggestion.kind === 'goal_pause' && context.goals?.some((g: any) => g.category === 'emergency')) {
          return {
            allowed: false,
            reason: 'Cannot pause emergency fund goals'
          };
        }
        break;

      case 'High Risk Warning':
        if (suggestion.kind === 'bill_defer' && suggestion.targetJson?.monthlyDeficit > 10000) {
          return {
            allowed: true,
            hints: ['High cash flow deficit - monitor closely'],
            riskLevel: 'high'
          };
        }
        break;
    }

    return { allowed: true };
  }

  private applySafetyRules(suggestion: any, context: AgentContext): {
    allowed: boolean;
    reason?: string;
    hints?: string[];
    riskLevel?: 'low' | 'medium' | 'high';
  } {
    const hints: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Safety rule: Don't suggest actions that would make cash flow worse
    if (suggestion.kind === 'budget_realloc' && context.cashflow?.netFlow < 0) {
      const reduction = suggestion.targetJson?.reduction || 0;
      if (reduction > Math.abs(context.cashflow.netFlow) * 0.5) {
        return {
          allowed: false,
          reason: 'Budget reduction would worsen already negative cash flow'
        };
      }
    }

    // Safety rule: Don't suggest debt consolidation if it increases total payments
    if (suggestion.kind === 'debt_consolidate') {
      const currentPayments = context.debts?.reduce((sum: number, debt: any) => sum + (debt.minimumPayment || 0), 0) || 0;
      const newPayment = suggestion.targetJson?.suggestedConsolidationRate || 0;
      
      if (newPayment > currentPayments * 1.2) {
        return {
          allowed: false,
          reason: 'Debt consolidation would increase monthly payments by more than 20%'
        };
      }
    }

    // Safety rule: Don't suggest goal pausing if user has no emergency fund
    if (suggestion.kind === 'goal_pause') {
      const hasEmergencyFund = context.goals?.some((g: any) => g.category === 'emergency' && g.currentAmount > 10000);
      
      if (!hasEmergencyFund && context.cashflow?.netFlow > 0) {
        hints.push('Consider building emergency fund before pausing other goals');
        riskLevel = 'medium';
      }
    }

    // Safety rule: Warn about high debt-to-income ratio
    if (suggestion.kind === 'debt_replan' && context.debts?.length > 0) {
      const totalDebt = context.debts.reduce((sum: number, debt: any) => sum + debt.principal, 0);
      const monthlyIncome = context.cashflow?.monthlyIncome || 0;
      
      if (monthlyIncome > 0 && totalDebt > monthlyIncome * 12) {
        hints.push('High debt-to-income ratio - consider debt counseling');
        riskLevel = 'high';
      }
    }

    // Safety rule: Don't suggest bill deferral for essential services
    if (suggestion.kind === 'bill_defer') {
      const essentialBills = suggestion.targetJson?.suggestedDeferrals?.filter((bill: any) => 
        bill.billTitle.toLowerCase().includes('strøm') ||
        bill.billTitle.toLowerCase().includes('vann') ||
        bill.billTitle.toLowerCase().includes('husleie')
      );
      
      if (essentialBills?.length > 0) {
        return {
          allowed: false,
          reason: 'Cannot defer essential utility bills'
        };
      }
    }

    return {
      allowed: true,
      hints,
      riskLevel
    };
  }

  private getRiskLevelScore(riskLevel: 'low' | 'medium' | 'high'): number {
    switch (riskLevel) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 0;
    }
  }
}
