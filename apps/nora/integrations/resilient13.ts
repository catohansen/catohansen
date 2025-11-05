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
 * Nora Resilient13 Integration
 * Connector for Resilient13 module
 */

export interface Resilient13Context {
  userId: string
  resilienceScore?: number
  goals?: string[]
  context?: 'wellbeing' | 'growth' | 'resilience'
}

/**
 * Get Resilient13 context for Nora
 */
export async function getResilient13Context(
  userId: string
): Promise<Resilient13Context> {
  // In production, fetch from Resilient13 API
  return {
    userId,
    resilienceScore: 75,
    context: 'wellbeing'
  }
}

/**
 * Nora can understand Resilient13 queries
 */
export function isResilient13Query(message: string): boolean {
  const keywords = [
    'resilient13',
    'resiliens',
    'velvære',
    'mental helse',
    'stress',
    'mestring',
    'vokst',
    'mål'
  ]
  
  const lowerMessage = message.toLowerCase()
  return keywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Get relevant Resilient13 knowledge for Nora
 */
export async function getResilient13Knowledge(
  query: string,
  userId: string
): Promise<string> {
  // In production, fetch from Resilient13 Knowledge Base
  return `Resilient13 er et velvære- og vekstsystem laget av Cato Hansen.`
}



