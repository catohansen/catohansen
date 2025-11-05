/**
 * AI-Agent Engine v3 - Sensing → Reasoning → Planning → Acting → Learning
 * Intelligent financial suggestions with NLP explanations and impact analysis
 */

// Mock schemas - replace with actual implementation as needed;

export interface AgentSuggestion {
  id: string;
  kind: string;
  reasoning: string;
  targetJson: any;
  impactJson: any;
  confidence: number;
  traceSteps: ReasoningStep[];
}

/**
 * SENSING: Gather financial context
 */
async function senseFinancialContext(userId: string): Promise<{
  bills: any[];
  debts: any[];
  goals: any[];
  budget: any;
  forecast: any;
  gaps: any[];
}> {
  const [bills, debts, goals, budget] = await Promise.all([
    // Critical and upcoming bills
    prisma.bill.findMany({
      where: {
        userId,
        OR: [
          { dueDate: { lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) } }, // Next 14 days
          { priority: { in: ['critical', 'high'] } }
        ]
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }]
    }),
    
    // Active debts
    prisma.debt.findMany({
      where: { userId },
      orderBy: { priority: 'asc' }
    }),
    
    // Active goals
    prisma.goal.findMany({
      where: { userId },
      orderBy: { priority: 'asc' }
    }),
    
    // Current budget (mock)
    { plannedCents: 50000, actualCents: 45000, categories: [] }
  ]);

  // Mock forecast and gaps (would integrate with cash flow system)
  const forecast = {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      balance: 15000 - (i * 500) + Math.sin(i / 7) * 3000 // Simulate weekly income
    }))
  };

  const gaps = forecast.daily
    .filter(day => day.balance < 0)
    .map(day => ({ date: day.date, shortfall: Math.abs(day.balance) }));

  return { bills, debts, goals, budget, forecast, gaps };
}

/**
 * REASONING: Apply heuristics to generate suggestions
 */
async function reasonSuggestions(
  context: AgentContext,
  financialData: any
): Promise<AgentSuggestion[]> {
  const suggestions: AgentSuggestion[] = [];
  const { bills, gaps, forecast, debts, goals } = financialData;
  
  // Heuristic 1: Bill part-pay for gap prevention
  if (gaps.length > 0) {
    const firstGap = gaps[0];
    const gapDate = new Date(firstGap.date);
    
    // Find bills due before gap that could be split
    const candidateBills = bills.filter((bill: any) => 
      bill.dueDate && 
      new Date(bill.dueDate) < gapDate &&
      bill.amountCents > 10000 && // Min 100 kr for splitting
      bill.status === 'pending'
    );

    for (const bill of candidateBills.slice(0, 2)) { // Max 2 suggestions
      const parts = calculateOptimalParts(bill.amountCents, gapDate, new Date(bill.dueDate));
      const impact = await simulateImpact(context.userId, {
        kind: 'bill_partpay',
        billId: bill.id,
        parts
      });

      const reasoning = REASONING_TEMPLATES.bill_partpay(
        bill.description,
        parts.length,
        Math.ceil((gapDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      );

      suggestions.push({
        id: generateSuggestionId(),
        kind: 'bill_partpay',
        reasoning,
        targetJson: { billId: bill.id, parts },
        impactJson: impact,
        confidence: calculateConfidence(impact.delta, {
          hasGaps: gaps.length > 0,
          isOverdue: new Date(bill.dueDate) < new Date(),
          budgetTight: true
        }),
        traceSteps: [
          {
            tool: 'gap_analysis',
            input: { gapDate: firstGap.date },
            output: { candidateBills: candidateBills.length },
            reasoning: 'Found gap, looking for bills to split'
          }
        ]
      });
    }
  }

  // Heuristic 2: Bill defer for non-critical
  const nonCriticalBills = bills.filter((bill: any) => 
    bill.priority !== 'critical' &&
    bill.dueDate &&
    new Date(bill.dueDate) > new Date() &&
    new Date(bill.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  for (const bill of nonCriticalBills.slice(0, 1)) {
    const deferDays = 14; // Standard defer
    const newDueDate = new Date(new Date(bill.dueDate).getTime() + deferDays * 24 * 60 * 60 * 1000);
    
    const impact = await simulateImpact(context.userId, {
      kind: 'bill_defer',
      billId: bill.id,
      newDueDate: newDueDate.toISOString()
    });

    suggestions.push({
      id: generateSuggestionId(),
      kind: 'bill_defer',
      reasoning: REASONING_TEMPLATES.bill_defer(bill.description, deferDays, 'Gir mer likviditet'),
      targetJson: { billId: bill.id, newDueDate: newDueDate.toISOString() },
      impactJson: impact,
      confidence: calculateConfidence(impact.delta, {
        hasGaps: gaps.length > 0,
        isOverdue: false,
        budgetTight: true
      }),
      traceSteps: []
    });
  }

  // Heuristic 3: Goal pause for liquidity
  if (gaps.length > 2) { // Multiple gaps
    const nonBufferGoals = goals.filter((goal: any) => 
      goal.type !== 'buffer' && goal.monthlyAlloc > 0
    );

    for (const goal of nonBufferGoals.slice(0, 1)) {
      const pauseMonths = 2;
      const savedPerMonth = goal.monthlyAlloc;
      
      const impact = await simulateImpact(context.userId, {
        kind: 'goal_pause',
        goalId: goal.id,
        pauseMonths,
        savedPerMonth
      });

      suggestions.push({
        id: generateSuggestionId(),
        kind: 'goal_pause',
        reasoning: REASONING_TEMPLATES.goal_pause(goal.label, pauseMonths, savedPerMonth / 100),
        targetJson: { goalId: goal.id, pauseMonths },
        impactJson: impact,
        confidence: calculateConfidence(impact.delta, {
          hasGaps: gaps.length > 0,
          isOverdue: false,
          budgetTight: true
        }),
        traceSteps: []
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * PLANNING: Calculate optimal parameters
 */
function calculateOptimalParts(
  totalAmountCents: number, 
  gapDate: Date, 
  originalDueDate: Date
): Array<{ amount: number; dueDate: string }> {
  const totalAmount = totalAmountCents / 100;
  const daysToGap = Math.ceil((gapDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  if (daysToGap <= 7) {
    // Split in 3: small now, medium before gap, rest after gap
    return [
      { amount: totalAmount * 0.3, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      { amount: totalAmount * 0.3, dueDate: new Date(gapDate.getTime() - 24 * 60 * 60 * 1000).toISOString() },
      { amount: totalAmount * 0.4, dueDate: new Date(gapDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() }
    ];
  } else {
    // Split in 2: half now, half before gap
    return [
      { amount: totalAmount * 0.5, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
      { amount: totalAmount * 0.5, dueDate: new Date(gapDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ];
  }
}

/**
 * ACTING: Simulate impact of suggestion
 */
async function simulateImpact(userId: string, suggestion: any): Promise<{
  baseline: any;
  withPlan: any;
  delta: ImpactMetrics;
  chart: any;
}> {
  // Mock impact simulation (would integrate with cash flow forecasting)
  const baseline = {
    minBalance: -5000,
    daysInNegative: 8,
    totalShortfall: 12000,
    firstGapDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  };

  const withPlan = {
    minBalance: -2000,
    daysInNegative: 3,
    totalShortfall: 6000,
    firstGapDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  };

  const delta: ImpactMetrics = {
    minBalanceDelta: withPlan.minBalance - baseline.minBalance,
    daysInNegativeDelta: withPlan.daysInNegative - baseline.daysInNegative,
    totalShortfallDelta: withPlan.totalShortfall - baseline.totalShortfall
  };

  // Generate chart data
  const chart = {
    baseline: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      balance: baseline.minBalance + i * 300 + Math.sin(i / 7) * 2000
    })),
    withPlan: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      balance: withPlan.minBalance + i * 400 + Math.sin(i / 7) * 2000
    }))
  };

  return { baseline, withPlan, delta, chart };
}

/**
 * LEARNING: Main agent engine
 */
export async function generateSuggestions(
  context: AgentContext,
  input: any
): Promise<AgentSuggestion[]> {
  try {
    console.log(`[AGENT] Generating suggestions for user ${context.userId}`);
    
    // SENSING: Gather financial data
    const financialData = await senseFinancialContext(context.userId);
    
    // REASONING: Apply heuristics
    const suggestions = await reasonSuggestions(context, financialData);
    
    // PLANNING: Store suggestions in database
    const storedSuggestions = await Promise.all(
      suggestions.map(async (suggestion) => {
        const stored = await prisma.agentSuggestion.create({
          data: {
            userId: context.userId,
            tokenId: context.tokenId,
            kind: suggestion.kind,
            source: context.tokenId ? 'guardian' : 'system',
            targetJson: suggestion.targetJson,
            impactJson: suggestion.impactJson,
            reasoning: suggestion.reasoning,
            traceJson: { steps: suggestion.traceSteps },
            status: 'pending'
          }
        });
        
        return { ...suggestion, id: stored.id };
      })
    );

    console.log(`[AGENT] Generated ${storedSuggestions.length} suggestions`);
    return storedSuggestions;
    
  } catch (error) {
    console.error('[AGENT] Suggestion generation failed:', error);
    throw new Error('Failed to generate suggestions');
  }
}

/**
 * Get detailed explanation for suggestion
 */
export async function explainSuggestion(suggestionId: string): Promise<{
  reasoning: string;
  trace: ReasoningStep[];
  impact: any;
  confidence: number;
}> {
  const suggestion = await prisma.agentSuggestion.findUnique({
    where: { id: suggestionId },
    include: { traces: true }
  });

  if (!suggestion) {
    throw new Error('Suggestion not found');
  }

  return {
    reasoning: suggestion.reasoning,
    trace: suggestion.traceJson?.steps || [],
    impact: suggestion.impactJson,
    confidence: calculateConfidence(
      suggestion.impactJson.delta,
      { hasGaps: true, isOverdue: false, budgetTight: true }
    )
  };
}

/**
 * Generate impact analysis
 */
export async function generateImpactAnalysis(suggestionId: string): Promise<any> {
  const suggestion = await prisma.agentSuggestion.findUnique({
    where: { id: suggestionId }
  });

  if (!suggestion) {
    throw new Error('Suggestion not found');
  }

  // Create or fetch impact snapshot
  let snapshot = await prisma.impactSnapshot.findFirst({
    where: { suggestionId }
  });

  if (!snapshot) {
    const impact = await simulateImpact(suggestion.userId, suggestion.targetJson);
    
    snapshot = await prisma.impactSnapshot.create({
      data: {
        userId: suggestion.userId,
        suggestionId,
        fromDate: new Date(),
        days: 30,
        scenario: { suggestion: suggestion.targetJson },
        baseline: impact.baseline,
        withPlan: impact.withPlan,
        delta: impact.delta
      }
    });
  }

  return {
    suggestionId,
    baseline: snapshot.baseline,
    withPlan: snapshot.withPlan,
    delta: snapshot.delta,
    chart: {
      baseline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        balance: (snapshot.baseline as any).minBalance + i * 300
      })),
      withPlan: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        balance: (snapshot.withPlan as any).minBalance + i * 400
      }))
    }
  };
}

/**
 * Materialize suggestion decision
 */
export async function materializeSuggestion(
  suggestionId: string,
  decision: 'accept' | 'reject',
  userId: string
): Promise<any> {
  const suggestion = await prisma.agentSuggestion.findFirst({
    where: { id: suggestionId, userId }
  });

  if (!suggestion) {
    throw new Error('Suggestion not found');
  }

  if (suggestion.status !== 'pending') {
    throw new Error('Suggestion already decided');
  }

  // Update suggestion status
  await prisma.agentSuggestion.update({
    where: { id: suggestionId },
    data: {
      status: decision === 'accept' ? 'accepted' : 'rejected',
      decidedAt: new Date()
    }
  });

  if (decision === 'accept') {
    // Materialize the suggestion using existing flows
    return await materializeByKind(suggestion.kind, suggestion.targetJson, userId);
  }

  return { decision: 'rejected' };
}

/**
 * Materialize suggestion by kind
 */
async function materializeByKind(kind: string, targetJson: any, userId: string): Promise<any> {
  switch (kind) {
    case 'bill_partpay':
      // Create planned cash transactions for each part
      const parts = targetJson.parts || [];
      const transactions = [];
      
      for (const part of parts) {
        // Mock transaction creation (would integrate with cash flow)
        transactions.push({
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: part.amount,
          dueDate: part.dueDate,
          type: 'planned_expense',
          linkedBillId: targetJson.billId
        });
      }
      
      return { transactionsCreated: transactions.length, parts };
      
    case 'bill_defer':
      // Update bill due date
      await prisma.bill.update({
        where: { id: targetJson.billId },
        data: { dueDate: new Date(targetJson.newDueDate) }
      });
      
      return { billId: targetJson.billId, newDueDate: targetJson.newDueDate };
      
    case 'goal_pause':
      // Pause goal for specified months
      // In production, this would update goal allocation
      return { goalId: targetJson.goalId, pausedMonths: targetJson.pauseMonths };
      
    default:
      throw new Error(`Unknown suggestion kind: ${kind}`);
  }
}

/**
 * Generate coaching message after decision
 */
export async function generatePostDecisionCoaching(
  suggestionId: string,
  decision: 'accept' | 'reject',
  userId: string
): Promise<string> {
  const suggestion = await prisma.agentSuggestion.findUnique({
    where: { id: suggestionId }
  });

  if (!suggestion) return '';

  const impact = suggestion.impactJson?.delta || {};
  
  if (decision === 'accept') {
    if (impact.minBalanceDelta > 0) {
      return `Flott valg! Dette forbedrer din likviditet med ${Math.round(impact.minBalanceDelta)} kr og reduserer risikoen for minus.`;
    } else {
      return `Takk for beslutningen. Dette gir deg mer fleksibilitet i hverdagen.`;
    }
  } else {
    return `Det er din økonomi - du kjenner situasjonen best. Jeg er her hvis du trenger andre forslag.`;
  }
}

/**
 * Helper functions
 */
function generateSuggestionId(): string {
  return `suggest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
















