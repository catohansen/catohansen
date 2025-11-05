/**
 * DebtAgent - Analyzes debt structure and suggests payoff strategies
 */

import { AgentContext } from '../orchestrator';

export class DebtAgent {
  static async execute(context: AgentContext): Promise<AgentContext> {
    console.log('🔍 [DebtAgent] Analyzing debt structure...');
    
    const suggestions = [];
    const { debts, cashflow } = context;
    
    if (!debts || debts.length === 0) {
      console.log('⚠️ [DebtAgent] No debt data available');
      return context;
    }

    // Calculate debt metrics
    const totalDebt = debts.reduce((sum, debt) => sum + debt.principal, 0);
    const highInterestDebts = debts.filter(debt => debt.annualRate > 15);
    const smallDebts = debts.filter(debt => debt.principal < 10000);
    const monthlyNetFlow = cashflow?.netFlow || 0;

    // Suggest debt payoff strategy
    if (monthlyNetFlow > 0) {
      const extraPayment = Math.min(monthlyNetFlow * 0.3, 5000); // 30% of net flow, max 5000 kr
      
      if (extraPayment > 1000) {
        // Calculate snowball vs avalanche strategies
        const snowballStrategy = this.calculateSnowballStrategy(debts, extraPayment);
        const avalancheStrategy = this.calculateAvalancheStrategy(debts, extraPayment);
        
        // Choose strategy based on debt profile
        const recommendedStrategy = smallDebts.length > 2 ? snowballStrategy : avalancheStrategy;
        
        suggestions.push({
          kind: 'debt_replan',
          reasoning: `Ekstra betaling på ${extraPayment.toFixed(0)} kr/mnd tilgjengelig. Foreslår ${recommendedStrategy.name.toLowerCase()}-strategi.`,
          confidence: 85,
          targetJson: {
            type: 'debt_payoff_strategy',
            strategy: recommendedStrategy.name,
            extraPayment,
            payoffPlan: recommendedStrategy.payoffPlan,
            totalInterestSaved: recommendedStrategy.totalInterestSaved,
            payoffTimeMonths: recommendedStrategy.payoffTimeMonths
          },
          impactJson: {
            before: {
              totalDebt,
              monthlyPayments: debts.reduce((sum, debt) => sum + debt.minimumPayment, 0),
              estimatedPayoffTime: this.calculateMinimumPayoffTime(debts)
            },
            after: {
              totalDebt,
              monthlyPayments: debts.reduce((sum, debt) => sum + debt.minimumPayment, 0) + extraPayment,
              estimatedPayoffTime: recommendedStrategy.payoffTimeMonths,
              interestSaved: recommendedStrategy.totalInterestSaved
            },
            timeSaved: this.calculateMinimumPayoffTime(debts) - recommendedStrategy.payoffTimeMonths
          }
        });
      }
    }

    // Suggest debt consolidation for high-interest debts
    if (highInterestDebts.length > 1) {
      const totalHighInterestDebt = highInterestDebts.reduce((sum, debt) => sum + debt.principal, 0);
      const averageRate = highInterestDebts.reduce((sum, debt) => sum + debt.annualRate, 0) / highInterestDebts.length;
      
      suggestions.push({
        kind: 'debt_consolidate',
        reasoning: `${highInterestDebts.length} gjeld med høy rente (${averageRate.toFixed(1)}%). Foreslår konsolidering.`,
        confidence: 75,
        targetJson: {
          type: 'debt_consolidation',
          highInterestDebts: highInterestDebts.map(debt => ({
            debtId: debt.id,
            name: debt.name,
            principal: debt.principal,
            rate: debt.annualRate
          })),
          totalAmount: totalHighInterestDebt,
          currentAverageRate: averageRate,
          suggestedConsolidationRate: Math.max(8, averageRate - 5), // 5% reduction, min 8%
          potentialSavings: this.calculateConsolidationSavings(highInterestDebts, averageRate - 5)
        },
        impactJson: {
          before: {
            highInterestDebts: highInterestDebts.length,
            averageRate,
            monthlyInterest: highInterestDebts.reduce((sum, debt) => sum + (debt.principal * debt.annualRate / 100 / 12), 0)
          },
          after: {
            consolidatedDebts: 1,
            newRate: Math.max(8, averageRate - 5),
            monthlyInterest: totalHighInterestDebt * (Math.max(8, averageRate - 5) / 100 / 12)
          },
          monthlySavings: this.calculateConsolidationSavings(highInterestDebts, averageRate - 5) / 12
        }
      });
    }

    // Suggest emergency fund before aggressive debt payoff
    if (totalDebt > 50000 && monthlyNetFlow > 2000) {
      suggestions.push({
        kind: 'debt_emergency_fund',
        reasoning: 'Stor gjeld og positiv kontantstrøm. Foreslår nødfond før aggressiv gjeldsnedbetaling.',
        confidence: 80,
        targetJson: {
          type: 'emergency_fund_priority',
          suggestedEmergencyFund: Math.min(monthlyNetFlow * 3, 50000), // 3 months expenses, max 50k
          debtPayoffAfterFund: totalDebt,
          timeline: '6-12 months'
        },
        impactJson: {
          before: {
            totalDebt,
            emergencyFund: 0,
            riskLevel: 'high'
          },
          after: {
            totalDebt,
            emergencyFund: Math.min(monthlyNetFlow * 3, 50000),
            riskLevel: 'medium'
          },
          riskReduction: 'significant'
        }
      });
    }

    console.log(`✅ [DebtAgent] Generated ${suggestions.length} debt suggestions`);
    
    return {
      ...context,
      suggestions: [...context.suggestions, ...suggestions],
      confidence: Math.max(context.confidence, suggestions.length > 0 ? 80 : 0)
    };
  }

  private calculateSnowballStrategy(debts: any[], extraPayment: number) {
    const sortedDebts = [...debts].sort((a, b) => a.principal - b.principal);
    let totalInterest = 0;
    let payoffTime = 0;
    const payoffPlan = [];

    for (const debt of sortedDebts) {
      const availablePayment = debt.minimumPayment + extraPayment;
      const months = this.calculatePayoffTime(debt.principal, debt.annualRate, availablePayment);
      const interest = this.calculateTotalInterest(debt.principal, debt.annualRate, availablePayment, months);
      
      totalInterest += interest;
      payoffTime += months;
      payoffPlan.push({
        debtId: debt.id,
        name: debt.name,
        payoffOrder: payoffPlan.length + 1,
        monthsToPayoff: months,
        totalInterest: interest
      });
    }

    return {
      name: 'Snowball',
      payoffPlan,
      totalInterestSaved: this.calculateMinimumInterest(debts) - totalInterest,
      payoffTimeMonths: payoffTime
    };
  }

  private calculateAvalancheStrategy(debts: any[], extraPayment: number) {
    const sortedDebts = [...debts].sort((a, b) => b.annualRate - a.annualRate);
    let totalInterest = 0;
    let payoffTime = 0;
    const payoffPlan = [];

    for (const debt of sortedDebts) {
      const availablePayment = debt.minimumPayment + extraPayment;
      const months = this.calculatePayoffTime(debt.principal, debt.annualRate, availablePayment);
      const interest = this.calculateTotalInterest(debt.principal, debt.annualRate, availablePayment, months);
      
      totalInterest += interest;
      payoffTime += months;
      payoffPlan.push({
        debtId: debt.id,
        name: debt.name,
        payoffOrder: payoffPlan.length + 1,
        monthsToPayoff: months,
        totalInterest: interest
      });
    }

    return {
      name: 'Avalanche',
      payoffPlan,
      totalInterestSaved: this.calculateMinimumInterest(debts) - totalInterest,
      payoffTimeMonths: payoffTime
    };
  }

  private calculatePayoffTime(principal: number, annualRate: number, monthlyPayment: number): number {
    if (monthlyPayment <= 0) return 999;
    
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) {
      return Math.ceil(principal / monthlyPayment);
    }
    
    const months = -Math.log(1 - (principal * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  }

  private calculateTotalInterest(principal: number, annualRate: number, monthlyPayment: number, months: number): number {
    const totalPayments = monthlyPayment * months;
    return Math.max(0, totalPayments - principal);
  }

  private calculateMinimumPayoffTime(debts: any[]): number {
    return Math.max(...debts.map(debt => this.calculatePayoffTime(debt.principal, debt.annualRate, debt.minimumPayment)));
  }

  private calculateMinimumInterest(debts: any[]): number {
    return debts.reduce((sum, debt) => {
      const months = this.calculatePayoffTime(debt.principal, debt.annualRate, debt.minimumPayment);
      return sum + this.calculateTotalInterest(debt.principal, debt.annualRate, debt.minimumPayment, months);
    }, 0);
  }

  private calculateConsolidationSavings(debts: any[], newRate: number): number {
    const currentInterest = debts.reduce((sum, debt) => {
      const months = this.calculatePayoffTime(debt.principal, debt.annualRate, debt.minimumPayment);
      return sum + this.calculateTotalInterest(debt.principal, debt.annualRate, debt.minimumPayment, months);
    }, 0);

    const totalPrincipal = debts.reduce((sum, debt) => sum + debt.principal, 0);
    const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const newMonths = this.calculatePayoffTime(totalPrincipal, newRate, totalMinPayment);
    const newInterest = this.calculateTotalInterest(totalPrincipal, newRate, totalMinPayment, newMonths);

    return currentInterest - newInterest;
  }
}
