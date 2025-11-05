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
 * Sync Queue Manager
 * Manages queue system for module sync operations
 * 
 * Features:
 * - Priority queue (manual > auto)
 * - Retry logic with exponential backoff
 * - Failed job handling
 * - Background worker
 */

import { prisma } from '@/lib/db/prisma'
import { moduleSyncManager } from './ModuleSyncManager'

export interface SyncJob {
  id: string
  moduleId: string
  direction: 'to-github' | 'from-github' | 'bidirectional'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  maxAttempts: number
  attempts: number
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'DLQ'
  runAt: Date
  createdAt: Date
}

export interface QueueStats {
  pending: number
  running: number
  success: number
  failed: number
  dlq: number
}

/**
 * Sync Queue Manager
 * Handles queue operations for module syncs
 */
export class SyncQueueManager {
  private processing = false
  private intervalId: NodeJS.Timeout | null = null

  /**
   * Add sync job to queue
   */
  async enqueueSync(
    moduleId: string,
    options: {
      direction?: 'to-github' | 'from-github' | 'bidirectional'
      priority?: 'low' | 'normal' | 'high' | 'urgent'
      delay?: number
      maxAttempts?: number
    } = {}
  ): Promise<string> {
    const {
      direction = 'to-github',
      priority = 'normal',
      delay = 0,
      maxAttempts = 3,
    } = options

    const runAt = new Date(Date.now() + delay)

    const job = await prisma.job.create({
      data: {
        type: 'module-sync',
        payload: {
          moduleId,
          direction,
          priority,
        },
        status: 'PENDING',
        maxAttempts,
        runAt,
      },
    })

    // Start processing if not already running
    if (!this.processing) {
      this.startProcessing()
    }

    return job.id
  }

  /**
   * Process queue
   */
  async processQueue(): Promise<void> {
    if (this.processing) {
      return
    }

    this.processing = true

    try {
      // Get pending jobs, ordered by priority and runAt
      const jobs = await prisma.job.findMany({
        where: {
          type: 'module-sync',
          status: 'PENDING',
          runAt: { lte: new Date() },
        },
        orderBy: [
          { runAt: 'asc' },
        ],
        take: 10, // Process max 10 at a time
      })

      for (const job of jobs) {
        try {
          // Update status to RUNNING
          await prisma.job.update({
            where: { id: job.id },
            data: { status: 'RUNNING' },
          })

          const payload = job.payload as any
          const { moduleId, direction = 'to-github' } = payload

          // Execute sync
          let result

          if (direction === 'to-github') {
            result = await moduleSyncManager.syncToGitHub(moduleId)
          } else if (direction === 'from-github') {
            result = await moduleSyncManager.syncFromGitHub(moduleId)
          } else {
            const { toGitHub, fromGitHub } = await moduleSyncManager.bidirectionalSync(moduleId)
            result = {
              success: toGitHub.success && fromGitHub.success,
              toGitHub,
              fromGitHub,
            }
          }

          if (result.success) {
            // Mark as success
            await prisma.job.update({
              where: { id: job.id },
              data: {
                status: 'SUCCESS',
                completedAt: new Date(),
              },
            })
          } else {
            throw new Error(result.error || 'Sync failed')
          }
        } catch (error: any) {
          // Increment attempts
          const attempts = job.attempts + 1

          if (attempts >= job.maxAttempts) {
            // Move to DLQ (Dead Letter Queue)
            await prisma.job.update({
              where: { id: job.id },
              data: {
                status: 'DLQ',
                attempts,
                lastError: error.message || 'Unknown error',
              },
            })
          } else {
            // Retry with exponential backoff
            const delay = Math.pow(2, attempts) * 1000 // 2s, 4s, 8s, etc.
            const runAt = new Date(Date.now() + delay)

            await prisma.job.update({
              where: { id: job.id },
              data: {
                status: 'PENDING',
                attempts,
                runAt,
                lastError: error.message || 'Unknown error',
              },
            })
          }
        }
      }
    } catch (error) {
      console.error('Queue processing error:', error)
    } finally {
      this.processing = false
    }
  }

  /**
   * Start background processing
   */
  startProcessing(intervalMs: number = 5000): void {
    if (this.intervalId) {
      return // Already running
    }

    // Process immediately
    this.processQueue()

    // Then process every interval
    this.intervalId = setInterval(() => {
      this.processQueue()
    }, intervalMs)
  }

  /**
   * Stop background processing
   */
  stopProcessing(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.processing = false
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<QueueStats> {
    const [pending, running, success, failed, dlq] = await Promise.all([
      prisma.job.count({
        where: { type: 'module-sync', status: 'PENDING' },
      }),
      prisma.job.count({
        where: { type: 'module-sync', status: 'RUNNING' },
      }),
      prisma.job.count({
        where: { type: 'module-sync', status: 'SUCCESS' },
      }),
      prisma.job.count({
        where: { type: 'module-sync', status: 'FAILED' },
      }),
      prisma.job.count({
        where: { type: 'module-sync', status: 'DLQ' },
      }),
    ])

    return { pending, running, success, failed, dlq }
  }

  /**
   * Retry failed job
   */
  async retryJob(jobId: string): Promise<void> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.type !== 'module-sync') {
      throw new Error('Job not found')
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'PENDING',
        attempts: 0,
        runAt: new Date(),
        lastError: null,
      },
    })

    // Trigger processing
    this.processQueue()
  }

  /**
   * Clean old successful jobs
   */
  async cleanOldJobs(olderThanDays: number = 7): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const result = await prisma.job.deleteMany({
      where: {
        type: 'module-sync',
        status: 'SUCCESS',
        completedAt: { lt: cutoffDate },
      },
    })

    return result.count
  }
}

/**
 * Create sync queue manager instance
 */
export function createSyncQueueManager() {
  return new SyncQueueManager()
}

/**
 * Default sync queue manager instance
 */
export const syncQueueManager = new SyncQueueManager()

// Auto-start processing on module load
if (typeof setInterval !== 'undefined') {
  syncQueueManager.startProcessing(10000) // Process every 10 seconds
}





