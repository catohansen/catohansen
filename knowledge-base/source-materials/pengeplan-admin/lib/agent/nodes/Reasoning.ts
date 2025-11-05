/**
 * Reasoning - Generates human-readable explanations for agent suggestions
 */

import { AgentContext } from '../orchestrator';

export class Reasoning {
  static async execute(context: AgentContext): Promise<AgentContext> {
    console.log('🔍 [Reasoning] Generating explanations...');
    
    const suggestions = context.suggestions.map(suggestion => {
      // Enhance reasoning with more context and confidence indicators
      const enhancedReasoning = this.enhanceReasoning(suggestion, context);
      
      return {
        ...suggestion,
        reasoning: enhancedReasoning,
        confidence: this.calculateConfidence(suggestion, context)
      };
    });

    // Sort suggestions by priority and confidence
    const sortedSuggestions = suggestions.sort((a, b) => {
      const priorityScore = this.getPriorityScore(a.kind) - this.getPriorityScore(b.kind);
      if (priorityScore !== 0) return priorityScore;
      return b.confidence - a.confidence;
    });

    console.log(`✅ [Reasoning] Enhanced ${suggestions.length} suggestions with explanations`);
    
    return {
      ...context,
      suggestions: sortedSuggestions,
      confidence: Math.max(...suggestions.map(s => s.confidence), 0)
    };
  }

  private enhanceReasoning(suggestion: any, context: AgentContext): string {
    const baseReasoning = suggestion.reasoning;
    const confidence = suggestion.confidence || 0;
    
    // Add confidence indicators
    let confidenceText = '';
    if (confidence >= 90) {
      confidenceText = ' (Høy tillit)';
    } else if (confidence >= 75) {
      confidenceText = ' (Moderat tillit)';
    } else if (confidence >= 60) {
      confidenceText = ' (Lav tillit)';
    }

    // Add context-specific enhancements
    let contextEnhancement = '';
    
    switch (suggestion.kind) {
      case 'budget_realloc':
        if (context.cashflow?.netFlow < 0) {
          contextEnhancement = ' Dette vil hjelpe med å balansere budsjettet.';
        }
        break;
        
      case 'bill_defer':
        if (context.bills?.length > 5) {
          contextEnhancement = ' Du har mange regninger som kommer, så dette gir deg pusterom.';
        }
        break;
        
      case 'bill_partpay':
        if (suggestion.targetJson?.totalAmount > 10000) {
          contextEnhancement = ' Stor regning som kan være vanskelig å betale på en gang.';
        }
        break;
        
      case 'debt_replan':
        if (context.debts?.length > 3) {
          contextEnhancement = ' Du har flere gjeld som kan optimaliseres.';
        }
        break;
        
      case 'goal_pause':
        if (context.cashflow?.netFlow < 0) {
          contextEnhancement = ' Midlertidig pause for å fokusere på akutte behov.';
        }
        break;
        
      case 'goal_prioritize':
        if (suggestion.targetJson?.urgentGoals?.length > 2) {
          contextEnhancement = ' Flere mål med kort tidsramme krever fokus.';
        }
        break;
    }

    // Ensure reasoning is within 240 character limit
    const fullReasoning = baseReasoning + contextEnhancement + confidenceText;
    
    if (fullReasoning.length <= 240) {
      return fullReasoning;
    }
    
    // Truncate if too long, but keep the base reasoning
    const truncated = baseReasoning + confidenceText;
    return truncated.length <= 240 ? truncated : baseReasoning.substring(0, 237) + '...';
  }

  private calculateConfidence(suggestion: any, context: AgentContext): number {
    let confidence = suggestion.confidence || 0;
    
    // Adjust confidence based on context
    switch (suggestion.kind) {
      case 'budget_realloc':
        // Higher confidence if we have recent budget data
        if (context.budget?.categories?.length > 0) {
          confidence += 5;
        }
        break;
        
      case 'bill_defer':
        // Higher confidence if cash flow is negative
        if (context.cashflow?.netFlow < 0) {
          confidence += 10;
        }
        break;
        
      case 'debt_replan':
        // Higher confidence if we have multiple debts
        if (context.debts?.length > 1) {
          confidence += 5;
        }
        break;
        
      case 'goal_pause':
        // Higher confidence if cash flow is negative
        if (context.cashflow?.netFlow < 0) {
          confidence += 15;
        }
        break;
    }
    
    // Reduce confidence if we have limited data
    if (!context.budget && !context.cashflow) {
      confidence -= 10;
    }
    
    return Math.max(0, Math.min(100, confidence));
  }

  private getPriorityScore(kind: string): number {
    // Priority order: 1 = highest priority
    const priorities: Record<string, number> = {
      'bill_defer': 1,           // Critical - immediate cash flow
      'bill_partpay': 2,         // Critical - immediate cash flow
      'budget_realloc': 3,       // Important - budget management
      'debt_replan': 4,          // Important - long-term financial health
      'goal_pause': 5,           // Moderate - can be delayed
      'goal_prioritize': 6,      // Moderate - optimization
      'goal_consolidate': 7,     // Low - convenience
      'goal_create_emergency': 8 // Low - long-term planning
    };
    
    return priorities[kind] || 10;
  }
}
