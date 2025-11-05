import { AgentNode, AgentState, AgentCtx, AgentOutput } from '../types';

export class StructuredDataNode implements AgentNode {
  name: string = "StructuredDataNode";
  failFast: boolean = false;

  async execute(state: AgentState, context: AgentCtx): Promise<AgentOutput> {
    console.log(`[${this.name}] Executing for user: ${context.userId}`);

    try {
      // Gather structured data from various sources
      const structuredData = {
        budget: await this.getBudgetData(context.userId),
        bills: await this.getBillsData(context.userId),
        transactions: await this.getTransactionsData(context.userId),
        debts: await this.getDebtsData(context.userId),
        savingsGoals: await this.getSavingsGoalsData(context.userId)
      };

      // Analyze data quality and completeness
      const dataQuality = this.analyzeDataQuality(structuredData);
      
      // Identify data gaps and inconsistencies
      const dataGaps = this.identifyDataGaps(structuredData);
      
      // Generate data insights
      const insights = this.generateDataInsights(structuredData);

      return {
        newState: {
          ...state,
          structuredData,
          dataQuality,
          dataGaps,
          insights
        },
        suggestions: [],
        decision: {
          dataSources: Object.keys(structuredData),
          qualityScore: dataQuality.overallScore,
          gapsCount: dataGaps.length,
          insightsCount: insights.length
        }
      };

    } catch (error: any) {
      console.error(`[${this.name}] Error:`, error);
      return {
        newState: {
          ...state,
          structuredDataError: error.message
        },
        suggestions: [],
        decision: { error: error.message }
      };
    }
  }

  private async getBudgetData(userId: string): Promise<any> {
    // Mock implementation - in real scenario, this would query the database
    return {
      categories: [
        { name: 'Mat', planned: 5000, actual: 4200, variance: -800 },
        { name: 'Transport', planned: 2000, actual: 1800, variance: -200 },
        { name: 'Husholdning', planned: 3000, actual: 3200, variance: 200 }
      ],
      totalPlanned: 10000,
      totalActual: 9200,
      overallVariance: -800,
      lastUpdated: new Date().toISOString()
    };
  }

  private async getBillsData(userId: string): Promise<any> {
    // Mock implementation
    return {
      upcoming: [
        { id: '1', title: 'Strømregning', amount: 1200, dueDate: '2024-10-15', status: 'NEW' },
        { id: '2', title: 'Husleie', amount: 8000, dueDate: '2024-10-01', status: 'NEW' }
      ],
      overdue: [
        { id: '3', title: 'Telefon', amount: 500, dueDate: '2024-09-15', status: 'OVERDUE' }
      ],
      totalUpcoming: 9200,
      totalOverdue: 500
    };
  }

  private async getTransactionsData(userId: string): Promise<any> {
    // Mock implementation
    return {
      recent: [
        { id: '1', description: 'ICA Supermarket', amount: -450, date: '2024-09-20', category: 'Mat' },
        { id: '2', description: 'Ruter Billett', amount: -80, date: '2024-09-19', category: 'Transport' }
      ],
      monthlyTotal: -530,
      averageDaily: -17.7
    };
  }

  private async getDebtsData(userId: string): Promise<any> {
    // Mock implementation
    return {
      debts: [
        { id: '1', name: 'Kredittkort', amount: 15000, interestRate: 18.5, minimumPayment: 300 },
        { id: '2', name: 'Billån', amount: 120000, interestRate: 4.2, minimumPayment: 2500 }
      ],
      totalDebt: 135000,
      totalMonthlyPayments: 2800
    };
  }

  private async getSavingsGoalsData(userId: string): Promise<any> {
    // Mock implementation
    return {
      goals: [
        { id: '1', name: 'Ferietur', target: 25000, current: 8000, targetDate: '2024-12-31' },
        { id: '2', name: 'Nødsparekonto', target: 50000, current: 12000, targetDate: '2025-06-30' }
      ],
      totalTarget: 75000,
      totalCurrent: 20000,
      totalRemaining: 55000
    };
  }

  private analyzeDataQuality(data: any): any {
    const quality = {
      budget: this.assessBudgetQuality(data.budget),
      bills: this.assessBillsQuality(data.bills),
      transactions: this.assessTransactionsQuality(data.transactions),
      debts: this.assessDebtsQuality(data.debts),
      savingsGoals: this.assessSavingsGoalsQuality(data.savingsGoals)
    };

    const overallScore = Object.values(quality).reduce((sum: number, score: any) => sum + score.score, 0) / Object.keys(quality).length;

    return {
      ...quality,
      overallScore: Math.round(overallScore)
    };
  }

  private assessBudgetQuality(budget: any): any {
    if (!budget || !budget.categories || budget.categories.length === 0) {
      return { score: 0, issues: ['No budget data available'] };
    }

    const issues = [];
    let score = 100;

    if (budget.categories.length < 3) {
      issues.push('Limited budget categories');
      score -= 20;
    }

    if (budget.overallVariance > 1000 || budget.overallVariance < -1000) {
      issues.push('Large budget variance');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  private assessBillsQuality(bills: any): any {
    if (!bills || !bills.upcoming) {
      return { score: 0, issues: ['No bills data available'] };
    }

    const issues = [];
    let score = 100;

    if (bills.overdue && bills.overdue.length > 0) {
      issues.push('Overdue bills present');
      score -= 30;
    }

    if (bills.upcoming.length === 0) {
      issues.push('No upcoming bills');
      score -= 20;
    }

    return { score: Math.max(0, score), issues };
  }

  private assessTransactionsQuality(transactions: any): any {
    if (!transactions || !transactions.recent || transactions.recent.length === 0) {
      return { score: 0, issues: ['No transaction data available'] };
    }

    const issues = [];
    let score = 100;

    if (transactions.recent.length < 10) {
      issues.push('Limited transaction history');
      score -= 25;
    }

    return { score: Math.max(0, score), issues };
  }

  private assessDebtsQuality(debts: any): any {
    if (!debts || !debts.debts || debts.debts.length === 0) {
      return { score: 100, issues: [] }; // No debt is good
    }

    const issues = [];
    let score = 100;

    if (debts.totalDebt > 100000) {
      issues.push('High total debt');
      score -= 20;
    }

    if (debts.debts.some((debt: any) => debt.interestRate > 15)) {
      issues.push('High interest rates');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  private assessSavingsGoalsQuality(goals: any): any {
    if (!goals || !goals.goals || goals.goals.length === 0) {
      return { score: 50, issues: ['No savings goals defined'] };
    }

    const issues = [];
    let score = 100;

    if (goals.goals.length < 2) {
      issues.push('Limited savings goals');
      score -= 20;
    }

    if (goals.totalCurrent / goals.totalTarget < 0.1) {
      issues.push('Low progress on savings goals');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  private identifyDataGaps(data: any): any[] {
    const gaps = [];

    if (!data.budget || data.budget.categories.length === 0) {
      gaps.push({ type: 'BUDGET', severity: 'HIGH', description: 'No budget data available' });
    }

    if (!data.transactions || data.transactions.recent.length < 10) {
      gaps.push({ type: 'TRANSACTIONS', severity: 'MEDIUM', description: 'Limited transaction history' });
    }

    if (!data.bills || data.bills.upcoming.length === 0) {
      gaps.push({ type: 'BILLS', severity: 'MEDIUM', description: 'No upcoming bills tracked' });
    }

    if (!data.savingsGoals || data.savingsGoals.goals.length === 0) {
      gaps.push({ type: 'SAVINGS_GOALS', severity: 'LOW', description: 'No savings goals defined' });
    }

    return gaps;
  }

  private generateDataInsights(data: any): any[] {
    const insights = [];

    // Budget insights
    if (data.budget && data.budget.overallVariance < -500) {
      insights.push({
        type: 'BUDGET',
        severity: 'WARNING',
        message: 'You are spending significantly less than budgeted this month',
        action: 'Consider reallocating unused budget to savings or debt repayment'
      });
    }

    // Bills insights
    if (data.bills && data.bills.overdue && data.bills.overdue.length > 0) {
      insights.push({
        type: 'BILLS',
        severity: 'CRITICAL',
        message: 'You have overdue bills that need immediate attention',
        action: 'Contact service providers to arrange payment plans'
      });
    }

    // Debt insights
    if (data.debts && data.debts.totalDebt > 100000) {
      insights.push({
        type: 'DEBT',
        severity: 'WARNING',
        message: 'High total debt level detected',
        action: 'Consider debt consolidation or accelerated repayment strategies'
      });
    }

    // Savings insights
    if (data.savingsGoals && data.savingsGoals.totalCurrent / data.savingsGoals.totalTarget < 0.2) {
      insights.push({
        type: 'SAVINGS',
        severity: 'INFO',
        message: 'Low progress on savings goals',
        action: 'Consider increasing monthly savings contributions'
      });
    }

    return insights;
  }
}
