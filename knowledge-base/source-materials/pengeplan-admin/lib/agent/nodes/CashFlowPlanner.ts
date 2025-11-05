/**
 * CashFlowPlanner - Analyzes cash flow gaps and suggests payment strategies
 */

import { AgentContext } from '../orchestrator';

export class CashFlowPlanner {
  static async execute(context: AgentContext): Promise<AgentContext> {
    console.log('🔍 [CashFlowPlanner] Analyzing cash flow...');
    
    const suggestions = [];
    const { cashflow, bills } = context;
    
    if (!cashflow || !bills.length) {
      console.log('⚠️ [CashFlowPlanner] No cash flow or bill data available');
      return context;
    }

    // Analyze upcoming bills and cash flow
    const upcomingBills = bills.slice(0, 5); // Next 5 bills
    const totalUpcomingAmount = upcomingBills.reduce((sum, bill) => sum + bill.amountNok, 0);
    const monthlyNetFlow = cashflow.netFlow || 0;
    
    // Check for cash flow gaps
    if (monthlyNetFlow < 0) {
      // Negative cash flow - suggest bill deferral or partial payments
      suggestions.push({
        kind: 'bill_defer',
        reasoning: `Negativ kontantstrøm på ${Math.abs(monthlyNetFlow).toFixed(0)} kr/mnd. Foreslår utsettelse av ikke-kritiske regninger.`,
        confidence: 85,
        targetJson: {
          type: 'bill_deferral',
          monthlyDeficit: Math.abs(monthlyNetFlow),
          suggestedDeferrals: upcomingBills
            .filter(bill => bill.priority !== 'RED')
            .slice(0, 3)
            .map(bill => ({
              billId: bill.id,
              billTitle: bill.title,
              amount: bill.amountNok,
              currentDueDate: bill.dueDate,
              suggestedDeferralDays: 30
            }))
        },
        impactJson: {
          before: {
            monthlyNetFlow,
            upcomingBills: upcomingBills.length,
            totalUpcomingAmount
          },
          after: {
            monthlyNetFlow: monthlyNetFlow + (totalUpcomingAmount * 0.3), // Defer 30% of bills
            deferredBills: 3,
            immediateRelief: totalUpcomingAmount * 0.3
          },
          cashFlowImprovement: totalUpcomingAmount * 0.3
        }
      });
    }

    // Suggest partial payments for large bills
    const largeBills = upcomingBills.filter(bill => bill.amountNok > 5000);
    for (const bill of largeBills.slice(0, 2)) {
      const suggestedPartialAmount = Math.min(bill.amountNok * 0.5, monthlyNetFlow * 0.3);
      
      if (suggestedPartialAmount > 1000) {
        suggestions.push({
          kind: 'bill_partpay',
          reasoning: `Stor regning på ${bill.amountNok.toFixed(0)} kr. Foreslår delbetaling på ${suggestedPartialAmount.toFixed(0)} kr.`,
          confidence: 80,
          targetJson: {
            type: 'partial_payment',
            billId: bill.id,
            billTitle: bill.title,
            totalAmount: bill.amountNok,
            suggestedPartialAmount,
            remainingAmount: bill.amountNok - suggestedPartialAmount,
            paymentSchedule: [
              { date: new Date(), amount: suggestedPartialAmount },
              { date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), amount: bill.amountNok - suggestedPartialAmount }
            ]
          },
          impactJson: {
            before: {
              billAmount: bill.amountNok,
              dueDate: bill.dueDate,
              immediatePayment: bill.amountNok
            },
            after: {
              billAmount: bill.amountNok,
              immediatePayment: suggestedPartialAmount,
              remainingPayment: bill.amountNok - suggestedPartialAmount,
              nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            immediateRelief: bill.amountNok - suggestedPartialAmount
          }
        });
      }
    }

    // Suggest payment prioritization
    const highPriorityBills = bills.filter(bill => bill.priority === 'RED');
    if (highPriorityBills.length > 0 && monthlyNetFlow > 0) {
      suggestions.push({
        kind: 'bill_prioritize',
        reasoning: `${highPriorityBills.length} kritiske regninger identifisert. Foreslår prioritert betaling.`,
        confidence: 90,
        targetJson: {
          type: 'payment_prioritization',
          highPriorityBills: highPriorityBills.map(bill => ({
            billId: bill.id,
            billTitle: bill.title,
            amount: bill.amountNok,
            dueDate: bill.dueDate,
            priority: bill.priority
          })),
          suggestedPaymentOrder: highPriorityBills
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((bill, index) => ({
              billId: bill.id,
              priority: index + 1,
              suggestedPaymentDate: new Date(Math.min(
                new Date(bill.dueDate).getTime(),
                Date.now() + (index * 7 * 24 * 60 * 60 * 1000)
              ))
            }))
        },
        impactJson: {
          before: {
            criticalBills: highPriorityBills.length,
            totalCriticalAmount: highPriorityBills.reduce((sum, bill) => sum + bill.amountNok, 0),
            riskLevel: 'high'
          },
          after: {
            criticalBills: highPriorityBills.length,
            prioritizedPayments: highPriorityBills.length,
            riskLevel: 'medium',
            paymentSchedule: 'structured'
          },
          riskReduction: 'high'
        }
      });
    }

    console.log(`✅ [CashFlowPlanner] Generated ${suggestions.length} cash flow suggestions`);
    
    return {
      ...context,
      suggestions: [...context.suggestions, ...suggestions],
      confidence: Math.max(context.confidence, suggestions.length > 0 ? 85 : 0)
    };
  }
}
