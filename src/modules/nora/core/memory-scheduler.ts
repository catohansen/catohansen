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
 * Memory Scheduler
 * Kjører automatiske oppgaver for minne-håndtering
 * - Temporal decay (minner svekkes over tid)
 * - Forget old memories (sletter gamle minner)
 * - Memory optimization (optimaliserer minne-struktur)
 */

import { getMemoryEngine } from './memory-engine'

export class MemoryScheduler {
  private decayInterval: NodeJS.Timeout | null = null
  private forgetInterval: NodeJS.Timeout | null = null

  /**
   * Start automatiske oppgaver
   */
  start(): void {
    // Temporal decay - kjør hver 6. time
    this.decayInterval = setInterval(async () => {
      try {
        const memoryEngine = getMemoryEngine()
        await memoryEngine.decayMemories()
        console.log('🧠 Memory decay completed')
      } catch (error) {
        console.error('❌ Memory decay failed:', error)
      }
    }, 6 * 60 * 60 * 1000) // 6 hours

    // Forget old memories - kjør daglig
    this.forgetInterval = setInterval(async () => {
      try {
        const memoryEngine = getMemoryEngine()
        await memoryEngine.forgetOldMemories(60) // Delete memories older than 60 days
        console.log('🧹 Old memories cleanup completed')
      } catch (error) {
        console.error('❌ Old memories cleanup failed:', error)
      }
    }, 24 * 60 * 60 * 1000) // 24 hours

    console.log('⏰ Memory scheduler started')
  }

  /**
   * Stopp automatiske oppgaver
   */
  stop(): void {
    if (this.decayInterval) {
      clearInterval(this.decayInterval)
      this.decayInterval = null
    }
    if (this.forgetInterval) {
      clearInterval(this.forgetInterval)
      this.forgetInterval = null
    }
    console.log('⏰ Memory scheduler stopped')
  }

  /**
   * Kjør oppgaver manuelt
   */
  async runTasks(): Promise<void> {
    try {
      const memoryEngine = getMemoryEngine()
      await memoryEngine.decayMemories()
      await memoryEngine.forgetOldMemories(60)
      console.log('✅ Manual memory tasks completed')
    } catch (error) {
      console.error('❌ Manual memory tasks failed:', error)
    }
  }
}

let memoryScheduler: MemoryScheduler | null = null

export function getMemoryScheduler(): MemoryScheduler {
  if (!memoryScheduler) {
    memoryScheduler = new MemoryScheduler()
  }
  return memoryScheduler
}

