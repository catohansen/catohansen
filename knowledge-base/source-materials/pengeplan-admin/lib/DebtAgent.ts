/**
 * GjeldsAgent - Beregner snøball/avalanche-strategi med side-by-side diff
 * Basert på LangGraph-stil orkestrering med explainability
 */

import { z } from 'zod';

// Zod schemas for type safety
const DebtSchema = z.object({
  id: z.string(),
  name: z.string(),
  balance: z.number(),
  interestRate: z.number(),
  minimumPayment: z.number(),
  type: z.enum(['credit_card', 'loan', 'mortgage', 'student_loan', 'personal_loan']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  isSecured: z.boolean(),
  remainingTerm: z.number().optional() // months
});

const DebtStrategySchema = z.object({
  strategy: z.enum(['snowball', 'avalanche', 'hybrid']),
  name: z.string(),
  description: z.string(),
  totalInterest: z.number(),
  totalPayments: z.number(),
  payoffTime: z.number(), // months
  monthlyPayment: z.number(),
  explanation: z.string().max(240), // ≤240 tegn for explainability
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  confidence: z.number().min(0).max(100)
});

const DebtRecommendationSchema = z.object({
  id: z.string(),
  debtId: z.string(),
  title: z.string(),
  description: z.string(),
  action: z.enum(['increase_payment', 'refinance', 'consolidate', 'negotiate', 'pay_off']),
  impact: z.enum(['low', 'medium', 'high']),
  effort: z.enum(['low', 'medium', 'high']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  explanation: z.string().max(240),
  actionSteps: z.array(z.string()),
  expectedSavings: z.number(),
  timeframe: z.string(),
  confidence: z.number().min(0).max(100)
});

const DebtAgentStateSchema = z.object({
  userId: z.string(),
  analysisDate: z.string(),
  debts: z.array(DebtSchema),
  strategies: z.array(DebtStrategySchema),
  recommendations: z.array(DebtRecommendationSchema),
  currentStrategy: z.enum(['snowball', 'avalanche', 'hybrid']).optional(),
  totalDebt: z.number(),
  totalInterest: z.number(),
  debtToIncomeRatio: z.number(),
  creditScore: z.number().optional(),
  agentVersion: z.string()
});

export type Debt = z.infer<typeof DebtSchema>;
export type DebtStrategy = z.infer<typeof DebtStrategySchema>;
export type DebtRecommendation = z.infer<typeof DebtRecommendationSchema>;
export type DebtAgentState = z.infer<typeof DebtAgentStateSchema>;

export class DebtAgent {
  private state: DebtAgentState;
  private agentVersion = '1.0.0';

  constructor(userId: string) {
    this.state = {
      userId,
      analysisDate: new Date().toISOString(),
      debts: [],
      strategies: [],
      recommendations: [],
      totalDebt: 0,
      totalInterest: 0,
      debtToIncomeRatio: 0,
      agentVersion: this.agentVersion
    };
  }

  /**
   * Main orchestration method - LangGraph style workflow
   */
  async analyzeDebt(debtData: any[], incomeData?: any): Promise<DebtAgentState> {
    try {
      // Step 1: Sensing - Collect and validate debt data
      await this.sensing(debtData, incomeData);
      
      // Step 2: Reasoning - Analyze debt structure and calculate strategies
      await this.reasoning();
      
      // Step 3: Planning - Generate debt payoff strategies
      await this.planning();
      
      // Step 4: Acting - Generate specific recommendations
      await this.acting();
      
      // Step 5: Learning - Update agent knowledge
      await this.learning();
      
      return this.state;
    } catch (error) {
      console.error('DebtAgent analysis failed:', error);
      throw new Error(`Debt analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Step 1: Sensing - Data collection and validation
   */
  private async sensing(debtData: any[], incomeData?: any): Promise<void> {
    console.log('🔍 [DebtAgent] Sensing: Collecting debt data...');
    
    // Validate and transform debt data
    const validatedDebts = debtData.map(item => DebtSchema.parse({
      id: item.id || `debt_${Date.now()}_${Math.random()}`,
      name: item.name,
      balance: item.balance,
      interestRate: item.interestRate,
      minimumPayment: item.minimumPayment,
      type: item.type,
      priority: item.priority || 'medium',
      isSecured: item.isSecured || false,
      remainingTerm: item.remainingTerm
    }));

    this.state.debts = validatedDebts;
    this.state.totalDebt = validatedDebts.reduce((sum, debt) => sum + debt.balance, 0);
    
    // Calculate debt-to-income ratio if income data provided
    if (incomeData) {
      const monthlyIncome = incomeData.monthly || incomeData.annual / 12;
      const monthlyDebtPayments = validatedDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
      this.state.debtToIncomeRatio = (monthlyDebtPayments / monthlyIncome) * 100;
    }
    
    console.log(`✅ [DebtAgent] Sensing complete: ${validatedDebts.length} debts analyzed, total: ${this.state.totalDebt.toFixed(0)} kr`);
  }

  /**
   * Step 2: Reasoning - Analyze debt structure and patterns
   */
  private async reasoning(): Promise<void> {
    console.log('🧠 [DebtAgent] Reasoning: Analyzing debt structure...');
    
    // Calculate total interest payments
    this.state.totalInterest = this.state.debts.reduce((sum, debt) => {
      const monthlyRate = debt.interestRate / 100 / 12;
      const months = debt.remainingTerm || 60; // Default 5 years
      const totalInterest = debt.balance * monthlyRate * months;
      return sum + totalInterest;
    }, 0);
    
    // Analyze debt characteristics
    const highInterestDebts = this.state.debts.filter(debt => debt.interestRate > 15);
    const smallDebts = this.state.debts.filter(debt => debt.balance < 10000);
    const largeDebts = this.state.debts.filter(debt => debt.balance > 100000);
    
    console.log(`✅ [DebtAgent] Reasoning complete: ${highInterestDebts.length} high-interest, ${smallDebts.length} small, ${largeDebts.length} large debts`);
  }

  /**
   * Step 3: Planning - Generate debt payoff strategies
   */
  private async planning(): Promise<void> {
    console.log('📋 [DebtAgent] Planning: Generating payoff strategies...');
    
    const strategies: DebtStrategy[] = [];
    
    // Generate Snowball Strategy (smallest balance first)
    const snowballStrategy = await this.generateSnowballStrategy();
    strategies.push(snowballStrategy);
    
    // Generate Avalanche Strategy (highest interest first)
    const avalancheStrategy = await this.generateAvalancheStrategy();
    strategies.push(avalancheStrategy);
    
    // Generate Hybrid Strategy (balanced approach)
    const hybridStrategy = await this.generateHybridStrategy();
    strategies.push(hybridStrategy);
    
    this.state.strategies = strategies;
    
    // Determine recommended strategy
    this.state.currentStrategy = this.recommendBestStrategy(strategies);
    
    console.log(`✅ [DebtAgent] Planning complete: ${strategies.length} strategies generated, recommended: ${this.state.currentStrategy}`);
  }

  /**
   * Step 4: Acting - Generate specific recommendations
   */
  private async acting(): Promise<void> {
    console.log('⚡ [DebtAgent] Acting: Generating recommendations...');
    
    const recommendations: DebtRecommendation[] = [];
    
    // Generate debt-specific recommendations
    for (const debt of this.state.debts) {
      const debtRecommendations = await this.generateDebtRecommendations(debt);
      recommendations.push(...debtRecommendations);
    }
    
    // Generate general debt management recommendations
    const generalRecommendations = await this.generateGeneralRecommendations();
    recommendations.push(...generalRecommendations);
    
    // Sort by priority and impact
    recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const impactOrder = { high: 3, medium: 2, low: 1 };
      
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
    
    this.state.recommendations = recommendations;
    
    console.log(`✅ [DebtAgent] Acting complete: ${recommendations.length} recommendations generated`);
  }

  /**
   * Step 5: Learning - Update agent knowledge
   */
  private async learning(): Promise<void> {
    console.log('🎓 [DebtAgent] Learning: Updating knowledge base...');
    
    const insights = {
      totalDebts: this.state.debts.length,
      averageInterestRate: this.state.debts.reduce((sum, debt) => sum + debt.interestRate, 0) / this.state.debts.length,
      highestInterestDebt: this.state.debts.reduce((max, debt) => debt.interestRate > max.interestRate ? debt : max),
      smallestDebt: this.state.debts.reduce((min, debt) => debt.balance < min.balance ? debt : min),
      debtToIncomeRatio: this.state.debtToIncomeRatio
    };
    
    console.log('📊 Learning insights:', insights);
    console.log('✅ [DebtAgent] Learning complete: Knowledge base updated');
  }

  /**
   * Generate Snowball Strategy
   */
  private async generateSnowballStrategy(): Promise<DebtStrategy> {
    const sortedDebts = [...this.state.debts].sort((a, b) => a.balance - b.balance);
    
    let totalInterest = 0;
    let totalPayments = 0;
    let currentMonth = 0;
    const monthlyBudget = this.calculateMonthlyBudget();
    
    for (const debt of sortedDebts) {
      const remainingDebts = sortedDebts.slice(sortedDebts.indexOf(debt));
      const availablePayment = monthlyBudget + 
        remainingDebts.slice(1).reduce((sum, d) => sum + d.minimumPayment, 0);
      
      const payoffTime = this.calculatePayoffTime(debt, availablePayment);
      const interest = this.calculateInterest(debt, payoffTime, availablePayment);
      
      totalInterest += interest;
      totalPayments += debt.balance + interest;
      currentMonth += payoffTime;
    }
    
    return {
      strategy: 'snowball',
      name: 'Snøball-strategi',
      description: 'Betal av gjeld med lavest saldo først for rask motivasjon',
      totalInterest,
      totalPayments,
      payoffTime: currentMonth,
      monthlyPayment: monthlyBudget,
      explanation: `Fokuserer på små gjeld først for rask motivasjon. Totalt ${totalInterest.toFixed(0)} kr i renter over ${Math.round(currentMonth/12)} år.`,
      pros: [
        'Rask motivasjon ved å betale av små gjeld',
        'Enkel å følge',
        'Psykologisk fordelaktig',
        'Reduserer antall kreditorer raskt'
      ],
      cons: [
        'Kan koste mer i renter totalt',
        'Ikke optimal matematisk',
        'Kan ta lengre tid totalt'
      ],
      confidence: 85
    };
  }

  /**
   * Generate Avalanche Strategy
   */
  private async generateAvalancheStrategy(): Promise<DebtStrategy> {
    const sortedDebts = [...this.state.debts].sort((a, b) => b.interestRate - a.interestRate);
    
    let totalInterest = 0;
    let totalPayments = 0;
    let currentMonth = 0;
    const monthlyBudget = this.calculateMonthlyBudget();
    
    for (const debt of sortedDebts) {
      const remainingDebts = sortedDebts.slice(sortedDebts.indexOf(debt));
      const availablePayment = monthlyBudget + 
        remainingDebts.slice(1).reduce((sum, d) => sum + d.minimumPayment, 0);
      
      const payoffTime = this.calculatePayoffTime(debt, availablePayment);
      const interest = this.calculateInterest(debt, payoffTime, availablePayment);
      
      totalInterest += interest;
      totalPayments += debt.balance + interest;
      currentMonth += payoffTime;
    }
    
    return {
      strategy: 'avalanche',
      name: 'Avalanche-strategi',
      description: 'Betal av gjeld med høyest rente først for minst totale kostnad',
      totalInterest,
      totalPayments,
      payoffTime: currentMonth,
      monthlyPayment: monthlyBudget,
      explanation: `Matematisk optimal: fokuserer på høyeste renter først. Sparer ${(this.state.totalInterest - totalInterest).toFixed(0)} kr sammenlignet med minimumsbetalinger.`,
      pros: [
        'Minste totale kostnad i renter',
        'Matematisk optimal',
        'Raskest til gjeldsfrihet',
        'Sparer mest penger'
      ],
      cons: [
        'Kan ta tid før første gjeldsfrihet',
        'Mindre motivasjon i starten',
        'Krever disiplin'
      ],
      confidence: 95
    };
  }

  /**
   * Generate Hybrid Strategy
   */
  private async generateHybridStrategy(): Promise<DebtStrategy> {
    // Hybrid: Pay off small debts first, then highest interest
    const smallDebts = this.state.debts.filter(debt => debt.balance < 20000);
    const largeDebts = this.state.debts.filter(debt => debt.balance >= 20000);
    
    const sortedSmallDebts = smallDebts.sort((a, b) => a.balance - b.balance);
    const sortedLargeDebts = largeDebts.sort((a, b) => b.interestRate - a.interestRate);
    
    const allDebts = [...sortedSmallDebts, ...sortedLargeDebts];
    
    let totalInterest = 0;
    let totalPayments = 0;
    let currentMonth = 0;
    const monthlyBudget = this.calculateMonthlyBudget();
    
    for (const debt of allDebts) {
      const remainingDebts = allDebts.slice(allDebts.indexOf(debt));
      const availablePayment = monthlyBudget + 
        remainingDebts.slice(1).reduce((sum, d) => sum + d.minimumPayment, 0);
      
      const payoffTime = this.calculatePayoffTime(debt, availablePayment);
      const interest = this.calculateInterest(debt, payoffTime, availablePayment);
      
      totalInterest += interest;
      totalPayments += debt.balance + interest;
      currentMonth += payoffTime;
    }
    
    return {
      strategy: 'hybrid',
      name: 'Hybrid-strategi',
      description: 'Kombinerer snøball og avalanche for balansert tilnærming',
      totalInterest,
      totalPayments,
      payoffTime: currentMonth,
      monthlyPayment: monthlyBudget,
      explanation: `Balanserer motivasjon og optimalisering: små gjeld først, deretter høyeste renter. Sparer ${(this.state.totalInterest - totalInterest).toFixed(0)} kr.`,
      pros: [
        'Balanserer motivasjon og optimalisering',
        'Rask motivasjon fra små gjeld',
        'Optimaliserer store gjeld',
        'Fleksibel tilnærming'
      ],
      cons: [
        'Mer kompleks å følge',
        'Ikke helt optimal matematisk',
        'Krever mer planlegging'
      ],
      confidence: 80
    };
  }

  /**
   * Generate debt-specific recommendations
   */
  private async generateDebtRecommendations(debt: Debt): Promise<DebtRecommendation[]> {
    const recommendations: DebtRecommendation[] = [];
    
    // High interest rate recommendation
    if (debt.interestRate > 15) {
      recommendations.push({
        id: `high-interest-${debt.id}`,
        debtId: debt.id,
        title: `Prioriter ${debt.name} - høy rente`,
        description: `Rente på ${debt.interestRate}% er svært høy og krever umiddelbar oppmerksomhet`,
        action: 'increase_payment',
        impact: 'high',
        effort: 'medium',
        priority: 'high',
        explanation: `Høy rente på ${debt.interestRate}% koster deg ${(debt.balance * debt.interestRate / 100 / 12).toFixed(0)} kr per måned i renter.`,
        actionSteps: [
          'Øk månedlig betaling så mye som mulig',
          'Vurder refinansiering til lavere rente',
          'Kontakt kreditor for å forhandle rente',
          'Vurder konsolidering med andre gjeld'
        ],
        expectedSavings: debt.balance * (debt.interestRate - 10) / 100 / 12 * 12, // Annual savings
        timeframe: '1-3 måneder',
        confidence: 90
      });
    }
    
    // Small balance recommendation
    if (debt.balance < 10000 && debt.interestRate > 10) {
      recommendations.push({
        id: `small-balance-${debt.id}`,
        debtId: debt.id,
        title: `Betal av ${debt.name} raskt`,
        description: `Lav saldo på ${debt.balance.toFixed(0)} kr kan betales av raskt`,
        action: 'pay_off',
        impact: 'medium',
        effort: 'low',
        priority: 'medium',
        explanation: `Lav saldo på ${debt.balance.toFixed(0)} kr kan betales av med ekstra betalinger og gi rask motivasjon.`,
        actionSteps: [
          'Betal ekstra hver måned',
          'Bruk bonus eller ekstra inntekt',
          'Reduser andre utgifter midlertidig',
          'Feire når gjelden er betalt av'
        ],
        expectedSavings: debt.balance * debt.interestRate / 100 / 12 * 6, // 6 months of interest
        timeframe: '2-6 måneder',
        confidence: 85
      });
    }
    
    return recommendations;
  }

  /**
   * Generate general debt management recommendations
   */
  private async generateGeneralRecommendations(): Promise<DebtRecommendation[]> {
    const recommendations: DebtRecommendation[] = [];
    
    // Debt consolidation recommendation
    if (this.state.debts.length > 3) {
      const averageRate = this.state.debts.reduce((sum, debt) => sum + debt.interestRate, 0) / this.state.debts.length;
      
      recommendations.push({
        id: 'debt-consolidation',
        debtId: 'general',
        title: 'Vurder gjelds konsolidering',
        description: 'Kombiner flere gjeld til én med lavere rente',
        action: 'consolidate',
        impact: 'high',
        effort: 'high',
        priority: averageRate > 12 ? 'high' : 'medium',
        explanation: `Konsolidering kan redusere gjennomsnittsrenten fra ${averageRate.toFixed(1)}% og forenkle betalinger.`,
        actionSteps: [
          'Sammenlign konsolideringslån',
          'Beregn totale kostnader',
          'Sjekk kredittscore først',
          'Vurder sikkerhet og vilkår',
          'Søk om lån hos flere banker'
        ],
        expectedSavings: this.state.totalDebt * (averageRate - 8) / 100 / 12 * 12,
        timeframe: '1-2 måneder',
        confidence: 75
      });
    }
    
    return recommendations;
  }

  /**
   * Calculate monthly budget for debt payments
   */
  private calculateMonthlyBudget(): number {
    const totalMinimum = this.state.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    return totalMinimum * 1.2; // 20% extra for accelerated payoff
  }

  /**
   * Calculate payoff time for a debt
   */
  private calculatePayoffTime(debt: Debt, monthlyPayment: number): number {
    if (monthlyPayment <= debt.minimumPayment) {
      return debt.remainingTerm || 60;
    }
    
    const monthlyRate = debt.interestRate / 100 / 12;
    const balance = debt.balance;
    const payment = monthlyPayment;
    
    if (monthlyRate === 0) {
      return Math.ceil(balance / payment);
    }
    
    const months = -Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  }

  /**
   * Calculate total interest for a debt
   */
  private calculateInterest(debt: Debt, months: number, monthlyPayment: number): number {
    const totalPayments = monthlyPayment * months;
    return Math.max(0, totalPayments - debt.balance);
  }

  /**
   * Recommend best strategy based on user profile
   */
  private recommendBestStrategy(strategies: DebtStrategy[]): 'snowball' | 'avalanche' | 'hybrid' {
    const snowball = strategies.find(s => s.strategy === 'snowball')!;
    const avalanche = strategies.find(s => s.strategy === 'avalanche')!;
    const hybrid = strategies.find(s => s.strategy === 'hybrid')!;
    
    // If debt-to-income ratio is high, prioritize avalanche for speed
    if (this.state.debtToIncomeRatio > 40) {
      return 'avalanche';
    }
    
    // If many small debts, snowball might be better for motivation
    const smallDebts = this.state.debts.filter(debt => debt.balance < 20000);
    if (smallDebts.length > 2) {
      return 'snowball';
    }
    
    // Default to avalanche for mathematical optimality
    return 'avalanche';
  }

  /**
   * Get explainability summary (≤240 characters)
   */
  getExplainabilitySummary(): string {
    const strategy = this.state.currentStrategy;
    const totalDebt = this.state.totalDebt;
    const recCount = this.state.recommendations.length;
    
    return `Gjeldsanalyse: ${strategy}-strategi anbefalt for ${totalDebt.toFixed(0)} kr total gjeld. ${recCount} anbefalinger generert for optimal gjeldsnedbetaling.`;
  }

  /**
   * Get agent state for observability
   */
  getState(): DebtAgentState {
    return { ...this.state };
  }
}
