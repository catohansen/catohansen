import { z } from "zod";

export const SuggestInputSchema = z.object({
  context: z.enum(["guardian","system"]).default("guardian"),
  scope: z.enum(["bills","debt","budget","goals"]).default("bills"),
  candidate: z.object({
    billId: z.string().cuid().optional(),
    dueBeforeDays: z.number().int().min(0).max(30).default(14) // finn hastende
  }).optional()
});

export const ExplainSchema = z.object({
  suggestionId: z.string().cuid()
});

export const DecisionSchema = z.object({
  suggestionId: z.string().cuid(),
  decision: z.enum(["accept","reject"]),
  reason: z.string().max(500).optional()
});

export const BillPartPaySchema = z.object({
  billId: z.string().cuid(),
  parts: z.array(z.object({
    amount: z.number().positive(),
    dueDate: z.string().datetime()
  })).min(2).max(4),
  reason: z.string().min(5).max(200)
});

export const BillDeferSchema = z.object({
  billId: z.string().cuid(),
  newDueDate: z.string().datetime(),
  reason: z.string().min(5).max(200)
});

export const BudgetReallocSchema = z.object({
  fromCategory: z.string(),
  toCategory: z.string(),
  amount: z.number().positive(),
  reason: z.string().min(5).max(200)
});

export const GoalPauseSchema = z.object({
  goalId: z.string().cuid(),
  pauseMonths: z.number().int().min(1).max(6),
  reason: z.string().min(5).max(200)
});

export const DebtRescheduleSchema = z.object({
  debtId: z.string().cuid(),
  newMinPayment: z.number().positive(),
  months: z.number().int().min(1).max(24),
  reason: z.string().min(5).max(200)
});

// Response schemas
export const SuggestionResponseSchema = z.object({
  suggestions: z.array(z.object({
    id: z.string().cuid(),
    kind: z.string(),
    reasoning: z.string(),
    impact: z.object({
      minBalanceDelta: z.number(),
      daysInNegativeDelta: z.number(),
      totalShortfallDelta: z.number()
    }),
    confidence: z.number().min(0).max(1)
  })),
  total: z.number().int().min(0)
});

export const ImpactAnalysisSchema = z.object({
  suggestionId: z.string().cuid(),
  baseline: z.object({
    minBalance: z.number(),
    daysInNegative: z.number(),
    totalShortfall: z.number(),
    firstGapDate: z.string().datetime().nullable()
  }),
  withPlan: z.object({
    minBalance: z.number(),
    daysInNegative: z.number(),
    totalShortfall: z.number(),
    firstGapDate: z.string().datetime().nullable()
  }),
  delta: z.object({
    minBalanceDelta: z.number(),
    daysInNegativeDelta: z.number(),
    totalShortfallDelta: z.number(),
    improvement: z.boolean()
  }),
  chart: z.object({
    baseline: z.array(z.object({
      date: z.string(),
      balance: z.number()
    })),
    withPlan: z.array(z.object({
      date: z.string(),
      balance: z.number()
    }))
  })
});

// Agent reasoning utilities
export interface ReasoningStep {
  tool: string;
  input: any;
  output: any;
  reasoning: string;
}

export interface AgentContext {
  userId: string;
  tokenId?: string;
  scopes?: string[];
  piiLevel?: string;
}

export interface SuggestionTarget {
  billId?: string;
  debtId?: string;
  goalId?: string;
  category?: string;
}

export interface ImpactMetrics {
  minBalanceDelta: number;
  daysInNegativeDelta: number;
  totalShortfallDelta: number;
  firstGapDateDelta?: number; // days difference
}

// Norwegian reasoning templates
export const REASONING_TEMPLATES = {
  bill_partpay: (billDesc: string, parts: number, savingDays: number) => 
    `Del ${billDesc} i ${parts} deler for å unngå minus i ${savingDays} dager.`,
  
  bill_defer: (billDesc: string, deferDays: number, reason: string) =>
    `Utsett ${billDesc} ${deferDays} dager. ${reason}`,
  
  budget_realloc: (fromCat: string, toCat: string, amount: number) =>
    `Flytt ${amount} kr fra ${fromCat} til ${toCat} denne måneden.`,
  
  goal_pause: (goalName: string, months: number, savedAmount: number) =>
    `Pause ${goalName} i ${months} mnd og frigjør ${savedAmount} kr/mnd.`,
  
  debt_rereschedule: (debtName: string, newPayment: number, extraMonths: number) =>
    `Reduser ${debtName} til ${newPayment} kr/mnd (+${extraMonths} mnd total).`
};

// Confidence scoring
export function calculateConfidence(
  impactMetrics: ImpactMetrics,
  riskFactors: {
    hasGaps: boolean;
    isOverdue: boolean;
    budgetTight: boolean;
  }
): number {
  let confidence = 0.5; // Base confidence
  
  // Positive impact increases confidence
  if (impactMetrics.minBalanceDelta > 0) confidence += 0.2;
  if (impactMetrics.daysInNegativeDelta < 0) confidence += 0.2;
  if (impactMetrics.totalShortfallDelta < 0) confidence += 0.1;
  
  // Risk factors decrease confidence
  if (riskFactors.hasGaps) confidence -= 0.1;
  if (riskFactors.isOverdue) confidence -= 0.2;
  if (riskFactors.budgetTight) confidence -= 0.1;
  
  return Math.max(0.1, Math.min(1.0, confidence));
}
















