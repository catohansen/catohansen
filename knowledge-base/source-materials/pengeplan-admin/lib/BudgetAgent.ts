/**
 * BudsjettAgent - Analyserer budsjettavvik og foreslår tiltak
 * Basert på LangGraph-stil orkestrering med explainability
 */

import { z } from 'zod';

// Zod schemas for type safety
const BudgetAnalysisSchema = z.object({
  category: z.string(),
  budgeted: z.number(),
  actual: z.number(),
  variance: z.number(),
  variancePercentage: z.number(),
  trend: z.enum(['increasing', 'decreasing', 'stable']),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical'])
});

const BudgetRecommendationSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  impact: z.enum(['low', 'medium', 'high']),
  effort: z.enum(['low', 'medium', 'high']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  explanation: z.string().max(240), // ≤240 tegn for explainability
  actionSteps: z.array(z.string()),
  expectedSavings: z.number().optional(),
  timeframe: z.string(),
  confidence: z.number().min(0).max(100)
});

const BudgetAgentStateSchema = z.object({
  userId: z.string(),
  analysisDate: z.string(),
  budgetData: z.array(BudgetAnalysisSchema),
  recommendations: z.array(BudgetRecommendationSchema),
  overallHealth: z.enum(['excellent', 'good', 'fair', 'poor', 'critical']),
  totalVariance: z.number(),
  totalSavings: z.number(),
  agentVersion: z.string()
});

export type BudgetAnalysis = z.infer<typeof BudgetAnalysisSchema>;
export type BudgetRecommendation = z.infer<typeof BudgetRecommendationSchema>;
export type BudgetAgentState = z.infer<typeof BudgetAgentStateSchema>;

export class BudgetAgent {
  private state: BudgetAgentState;
  private agentVersion = '1.0.0';

  constructor(userId: string) {
    this.state = {
      userId,
      analysisDate: new Date().toISOString(),
      budgetData: [],
      recommendations: [],
      overallHealth: 'good',
      totalVariance: 0,
      totalSavings: 0,
      agentVersion: this.agentVersion
    };
  }

  /**
   * Main orchestration method - LangGraph style workflow
   */
  async analyzeBudget(budgetData: any[]): Promise<BudgetAgentState> {
    try {
      // Step 1: Sensing - Collect and validate data
      await this.sensing(budgetData);
      
      // Step 2: Reasoning - Analyze patterns and identify issues
      await this.reasoning();
      
      // Step 3: Planning - Generate recommendations
      await this.planning();
      
      // Step 4: Acting - Execute recommendations (simulated)
      await this.acting();
      
      // Step 5: Learning - Update agent knowledge
      await this.learning();
      
      return this.state;
    } catch (error) {
      console.error('BudgetAgent analysis failed:', error);
      throw new Error(`Budget analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Step 1: Sensing - Data collection and validation
   */
  private async sensing(budgetData: any[]): Promise<void> {
    console.log('🔍 [BudgetAgent] Sensing: Collecting budget data...');
    
    // Validate and transform input data
    const validatedData = budgetData.map(item => {
      const variance = item.actual - item.budgeted;
      const variancePercentage = item.budgeted > 0 ? (variance / item.budgeted) * 100 : 0;
      
      return BudgetAnalysisSchema.parse({
        category: item.category,
        budgeted: item.budgeted,
        actual: item.actual,
        variance,
        variancePercentage,
        trend: this.calculateTrend(item.historicalData || []),
        riskLevel: this.assessRiskLevel(variancePercentage)
      });
    });

    this.state.budgetData = validatedData;
    this.state.totalVariance = validatedData.reduce((sum, item) => sum + item.variance, 0);
    
    console.log(`✅ [BudgetAgent] Sensing complete: ${validatedData.length} categories analyzed`);
  }

  /**
   * Step 2: Reasoning - Pattern analysis and issue identification
   */
  private async reasoning(): Promise<void> {
    console.log('🧠 [BudgetAgent] Reasoning: Analyzing patterns...');
    
    const highVarianceCategories = this.state.budgetData.filter(
      item => Math.abs(item.variancePercentage) > 20
    );
    
    const criticalCategories = this.state.budgetData.filter(
      item => item.riskLevel === 'critical'
    );
    
    // Determine overall budget health
    if (criticalCategories.length > 0) {
      this.state.overallHealth = 'critical';
    } else if (highVarianceCategories.length > 3) {
      this.state.overallHealth = 'poor';
    } else if (highVarianceCategories.length > 1) {
      this.state.overallHealth = 'fair';
    } else if (this.state.totalVariance < 0) {
      this.state.overallHealth = 'excellent';
    } else {
      this.state.overallHealth = 'good';
    }
    
    console.log(`✅ [BudgetAgent] Reasoning complete: Health = ${this.state.overallHealth}`);
  }

  /**
   * Step 3: Planning - Generate actionable recommendations
   */
  private async planning(): Promise<void> {
    console.log('📋 [BudgetAgent] Planning: Generating recommendations...');
    
    const recommendations: BudgetRecommendation[] = [];
    
    // Analyze each category and generate recommendations
    for (const category of this.state.budgetData) {
      const categoryRecommendations = await this.generateCategoryRecommendations(category);
      recommendations.push(...categoryRecommendations);
    }
    
    // Add general budget recommendations
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
    this.state.totalSavings = recommendations.reduce(
      (sum, rec) => sum + (rec.expectedSavings || 0), 0
    );
    
    console.log(`✅ [BudgetAgent] Planning complete: ${recommendations.length} recommendations generated`);
  }

  /**
   * Step 4: Acting - Execute recommendations (simulated)
   */
  private async acting(): Promise<void> {
    console.log('⚡ [BudgetAgent] Acting: Executing recommendations...');
    
    // In a real implementation, this would execute actual actions
    // For now, we'll simulate the execution and log results
    
    const executedRecommendations = this.state.recommendations.slice(0, 3); // Top 3
    
    for (const recommendation of executedRecommendations) {
      console.log(`🎯 Executing: ${recommendation.title}`);
      console.log(`   Impact: ${recommendation.impact}, Effort: ${recommendation.effort}`);
      console.log(`   Expected Savings: ${recommendation.expectedSavings || 0} kr`);
    }
    
    console.log(`✅ [BudgetAgent] Acting complete: ${executedRecommendations.length} recommendations executed`);
  }

  /**
   * Step 5: Learning - Update agent knowledge
   */
  private async learning(): Promise<void> {
    console.log('🎓 [BudgetAgent] Learning: Updating knowledge base...');
    
    // In a real implementation, this would update the agent's knowledge base
    // with insights from the current analysis
    
    const insights = {
      totalCategories: this.state.budgetData.length,
      highVarianceCount: this.state.budgetData.filter(item => Math.abs(item.variancePercentage) > 20).length,
      averageVariance: this.state.budgetData.reduce((sum, item) => sum + Math.abs(item.variancePercentage), 0) / this.state.budgetData.length,
      mostProblematicCategory: this.state.budgetData.reduce((max, item) => 
        Math.abs(item.variancePercentage) > Math.abs(max.variancePercentage) ? item : max
      )
    };
    
    console.log('📊 Learning insights:', insights);
    console.log('✅ [BudgetAgent] Learning complete: Knowledge base updated');
  }

  /**
   * Generate category-specific recommendations
   */
  private async generateCategoryRecommendations(category: BudgetAnalysis): Promise<BudgetRecommendation[]> {
    const recommendations: BudgetRecommendation[] = [];
    
    if (category.variancePercentage > 20) {
      // Over budget
      recommendations.push({
        id: `over-budget-${category.category}`,
        category: category.category,
        title: `Reduser ${category.category} utgifter`,
        description: `Du har overskredet budsjettet med ${Math.abs(category.variancePercentage).toFixed(1)}%`,
        impact: 'high',
        effort: 'medium',
        priority: category.riskLevel === 'critical' ? 'critical' : 'high',
        explanation: `Overskridelse på ${Math.abs(category.variance).toFixed(0)} kr krever umiddelbar oppmerksomhet for å unngå økonomisk stress.`,
        actionSteps: [
          'Gjennomgå alle utgifter i kategorien',
          'Identifiser unødvendige kostnader',
          'Implementer kostnadskontroll',
          'Sett opp månedlige grenser'
        ],
        expectedSavings: Math.abs(category.variance) * 0.8, // 80% of variance
        timeframe: '1-2 måneder',
        confidence: 85
      });
    } else if (category.variancePercentage < -20) {
      // Under budget - opportunity to save more
      recommendations.push({
        id: `under-budget-${category.category}`,
        category: category.category,
        title: `Optimaliser ${category.category} budsjett`,
        description: `Du bruker ${Math.abs(category.variancePercentage).toFixed(1)}% mindre enn budsjettert`,
        impact: 'medium',
        effort: 'low',
        priority: 'medium',
        explanation: `Du kan spare ${Math.abs(category.variance).toFixed(0)} kr ekstra ved å justere budsjettet nedover.`,
        actionSteps: [
          'Vurder om budsjettet kan reduseres',
          'Alloker overskuddet til gjeldsnedbetaling',
          'Øk sparing eller investeringer'
        ],
        expectedSavings: Math.abs(category.variance),
        timeframe: 'Umiddelbart',
        confidence: 95
      });
    }
    
    return recommendations;
  }

  /**
   * Generate general budget recommendations
   */
  private async generateGeneralRecommendations(): Promise<BudgetRecommendation[]> {
    const recommendations: BudgetRecommendation[] = [];
    
    if (this.state.overallHealth === 'critical' || this.state.overallHealth === 'poor') {
      recommendations.push({
        id: 'emergency-budget-review',
        category: 'general',
        title: 'Nødvendig budsjettgjennomgang',
        description: 'Kritisk budsjettsituasjon krever umiddelbar handling',
        impact: 'high',
        effort: 'high',
        priority: 'critical',
        explanation: 'Flere kategorier viser alvorlige avvik som kan føre til økonomisk krise hvis ikke håndtert.',
        actionSteps: [
          'Gjennomfør fullstendig budsjettgjennomgang',
          'Identifiser alle unødvendige utgifter',
          'Implementer strenge kostnadskontroller',
          'Vurder ekstra inntektskilder',
          'Kontakt økonomisk rådgiver'
        ],
        expectedSavings: this.state.totalVariance * 0.6,
        timeframe: '2-4 uker',
        confidence: 90
      });
    }
    
    // Always recommend budget tracking improvement
    recommendations.push({
      id: 'improve-budget-tracking',
      category: 'general',
      title: 'Forbedre budsjettsporing',
      description: 'Implementer bedre systemer for budsjettsporing og varsling',
      impact: 'medium',
      effort: 'low',
      priority: 'medium',
      explanation: 'Bedre sporing hjelper deg å oppdage problemer tidligere og holde deg på rett kurs.',
      actionSteps: [
        'Sett opp automatiske budsjettvarsler',
        'Gjennomfør ukentlige budsjettgjennomganger',
        'Bruk budsjettapp for bedre oversikt',
        'Sett opp kategorisering av utgifter'
      ],
      expectedSavings: 0,
      timeframe: '1 måned',
      confidence: 80
    });
    
    return recommendations;
  }

  /**
   * Calculate trend from historical data
   */
  private calculateTrend(historicalData: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (historicalData.length < 2) return 'stable';
    
    const recent = historicalData.slice(-3);
    const older = historicalData.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * Assess risk level based on variance percentage
   */
  private assessRiskLevel(variancePercentage: number): 'low' | 'medium' | 'high' | 'critical' {
    const absVariance = Math.abs(variancePercentage);
    
    if (absVariance > 50) return 'critical';
    if (absVariance > 30) return 'high';
    if (absVariance > 15) return 'medium';
    return 'low';
  }

  /**
   * Get explainability summary (≤240 characters)
   */
  getExplainabilitySummary(): string {
    const health = this.state.overallHealth;
    const recCount = this.state.recommendations.length;
    const savings = this.state.totalSavings;
    
    return `Budsjettanalyse: ${health} helse, ${recCount} anbefalinger, potensielle besparelser ${savings.toFixed(0)} kr. ${this.state.budgetData.length} kategorier analysert.`;
  }

  /**
   * Get agent state for observability
   */
  getState(): BudgetAgentState {
    return { ...this.state };
  }
}
