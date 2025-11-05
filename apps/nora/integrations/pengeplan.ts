/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

/**
 * Nora Pengeplan 2.0 Integration
 * Connector for Pengeplan 2.0 module
 */

export interface PengeplanContext {
  userId: string
  projectId?: string
  budgetId?: string
  context?: 'budget' | 'expense' | 'income' | 'goal'
}

/**
 * Get Pengeplan context for Nora
 */
export async function getPengeplanContext(
  userId: string,
  projectId?: string
): Promise<PengeplanContext> {
  // In production, fetch from Pengeplan API
  return {
    userId,
    projectId,
    context: 'budget'
  }
}

/**
 * Nora can understand Pengeplan queries
 */
export function isPengeplanQuery(message: string): boolean {
  const keywords = [
    'pengeplan',
    'budsjett',
    'økonomi',
    'utgift',
    'inntekt',
    'sparing',
    'regnskap',
    'transaksjon'
  ]
  
  const lowerMessage = message.toLowerCase()
  return keywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Get relevant Pengeplan knowledge for Nora
 */
export async function getPengeplanKnowledge(
  query: string,
  userId: string
): Promise<string> {
  // In production, fetch from Pengeplan Knowledge Base
  return `Pengeplan 2.0 er et økonomistyringssystem laget av Cato Hansen.`
}



