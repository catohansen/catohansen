/**
 * BudgetAgent - Analyzes budget deviations and suggests reallocations
 */

import { AgentContext } from '../orchestrator';

export class BudgetAgent {
  static async execute(context: AgentContext): Promise<AgentContext> {
    console.log('🔍 [BudgetAgent] Analyzing budget...');
    
    if (!context.budget) {
      console.log('⚠️ [BudgetAgent] No budget data available');
      return context;
    }

    const suggestions = [];
    const categories = context.budget.categories || [];
    
    // Analyze budget deviations
    for (const category of categories) {
      const variance = (category.actual || 0) - (category.planned || 0);
      const variancePercentage = category.planned > 0 ? (variance / category.planned) * 100 : 0;
      
      // Generate suggestions based on variance
      if (variancePercentage > 20) {
        // Over budget - suggest reduction
        suggestions.push({
          kind: 'budget_realloc',
          category: category.name,
          reasoning: `Overskridelse på ${Math.abs(variancePercentage).toFixed(1)}% i ${category.name}. Foreslår reduksjon på ${Math.abs(variance * 0.8).toFixed(0)} kr.`,
          confidence: 85,
          targetJson: {
            type: 'budget_reduction',
            categoryId: category.id,
            categoryName: category.name,
            currentPlanned: category.planned,
            suggestedPlanned: Math.max(0, category.planned - Math.abs(variance * 0.8)),
            reduction: Math.abs(variance * 0.8)
          },
          impactJson: {
            before: {
              planned: category.planned,
              actual: category.actual,
              variance: variance
            },
            after: {
              planned: Math.max(0, category.planned - Math.abs(variance * 0.8)),
              actual: category.actual,
              variance: variance - Math.abs(variance * 0.8)
            },
            savings: Math.abs(variance * 0.8)
          }
        });
      } else if (variancePercentage < -20) {
        // Under budget - suggest reallocation
        suggestions.push({
          kind: 'budget_realloc',
          category: category.name,
          reasoning: `Under budsjett med ${Math.abs(variancePercentage).toFixed(1)}% i ${category.name}. Foreslår reallokering til høyere prioritet.`,
          confidence: 75,
          targetJson: {
            type: 'budget_reallocation',
            categoryId: category.id,
            categoryName: category.name,
            currentPlanned: category.planned,
            suggestedPlanned: category.planned * 0.8, // Reduce by 20%
            reallocation: category.planned * 0.2
          },
          impactJson: {
            before: {
              planned: category.planned,
              actual: category.actual,
              variance: variance
            },
            after: {
              planned: category.planned * 0.8,
              actual: category.actual,
              variance: variance + (category.planned * 0.2)
            },
            availableForReallocation: category.planned * 0.2
          }
        });
      }
    }

    // Add general budget optimization suggestions
    const totalPlanned = categories.reduce((sum, cat) => sum + (cat.planned || 0), 0);
    const totalActual = categories.reduce((sum, cat) => sum + (cat.actual || 0), 0);
    const totalVariance = totalActual - totalPlanned;

    if (totalVariance > 0 && totalVariance > totalPlanned * 0.1) {
      // Overall over budget
      suggestions.push({
        kind: 'budget_realloc',
        category: 'general',
        reasoning: `Total budsjett overskridelse på ${((totalVariance / totalPlanned) * 100).toFixed(1)}%. Foreslår generell budsjettgjennomgang.`,
        confidence: 90,
        targetJson: {
          type: 'budget_review',
          totalPlanned,
          totalActual,
          totalVariance,
          suggestedReduction: totalVariance * 0.6
        },
        impactJson: {
          before: {
            totalPlanned,
            totalActual,
            variance: totalVariance
          },
          after: {
            totalPlanned: totalPlanned - (totalVariance * 0.6),
            totalActual,
            variance: totalVariance * 0.4
          },
          potentialSavings: totalVariance * 0.6
        }
      });
    }

    console.log(`✅ [BudgetAgent] Generated ${suggestions.length} budget suggestions`);
    
    return {
      ...context,
      suggestions: [...context.suggestions, ...suggestions],
      confidence: Math.max(context.confidence, suggestions.length > 0 ? 80 : 0)
    };
  }
}
