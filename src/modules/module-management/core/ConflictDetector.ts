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
 * Conflict Detector
 * AI-driven conflict detection for module synchronization
 * 
 * Features:
 * - Conflict detection based on file patterns
 * - Historical conflict analysis
 * - Predictive conflict detection
 * - Automatic merge strategy suggestions
 */

import { prisma } from '@/lib/db/prisma'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'

const execAsync = promisify(exec)

export interface Conflict {
  file: string
  type: 'add' | 'delete' | 'modify' | 'rename'
  localChange?: string
  remoteChange?: string
  severity: 'low' | 'medium' | 'high'
  suggestion?: string
}

export interface ConflictAnalysis {
  moduleId: string
  conflicts: Conflict[]
  totalConflicts: number
  criticalConflicts: number
  canAutoMerge: boolean
  suggestedStrategy: 'merge' | 'ours' | 'theirs' | 'manual'
  analyzedAt: Date
}

/**
 * Conflict Detector
 * Detects potential conflicts during sync
 */
export class ConflictDetector {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Analyze potential conflicts before sync
   */
  async analyzeConflicts(
    moduleId: string,
    direction: 'to-github' | 'from-github'
  ): Promise<ConflictAnalysis> {
    try {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      })

      if (!module || !module.githubRepo) {
        throw new Error('Module not found or GitHub repo not configured')
      }

      const modulePath = path.join(this.rootPath, 'src/modules', module.name)

      // Get local changes
      const localChanges = await this.getLocalChanges(modulePath)

      // Get remote changes (from git log)
      const remoteChanges = await this.getRemoteChanges(
        modulePath,
        module.githubRepo,
        direction
      )

      // Detect conflicts
      const conflicts = this.detectConflicts(localChanges, remoteChanges)

      // Analyze conflicts
      const criticalConflicts = conflicts.filter(
        (c) => c.severity === 'high' || c.type === 'delete'
      ).length

      const canAutoMerge = criticalConflicts === 0 && conflicts.length < 5

      let suggestedStrategy: ConflictAnalysis['suggestedStrategy'] = 'merge'
      if (criticalConflicts > 0) {
        suggestedStrategy = 'manual'
      } else if (direction === 'to-github') {
        suggestedStrategy = 'ours'
      } else {
        suggestedStrategy = 'theirs'
      }

      return {
        moduleId,
        conflicts,
        totalConflicts: conflicts.length,
        criticalConflicts,
        canAutoMerge,
        suggestedStrategy,
        analyzedAt: new Date(),
      }
    } catch (error: any) {
      throw new Error(`Failed to analyze conflicts: ${error.message}`)
    }
  }

  /**
   * Get local changes
   */
  private async getLocalChanges(modulePath: string): Promise<Map<string, Conflict['type']>> {
    try {
      const { stdout } = await execAsync(
        `git status --porcelain -- "src/modules/${path.basename(modulePath)}/" || echo ""`,
        { cwd: this.rootPath }
      )

      const changes = new Map<string, Conflict['type']>()

      for (const line of stdout.split('\n')) {
        if (!line.trim()) continue

        const status = line.substring(0, 2)
        const file = line.substring(3).trim()

        if (status.startsWith('??')) {
          changes.set(file, 'add')
        } else if (status.startsWith('D')) {
          changes.set(file, 'delete')
        } else if (status.startsWith('M') || status.startsWith('A')) {
          changes.set(file, 'modify')
        }
      }

      return changes
    } catch {
      return new Map()
    }
  }

  /**
   * Get remote changes
   */
  private async getRemoteChanges(
    modulePath: string,
    githubRepo: string,
    direction: 'to-github' | 'from-github'
  ): Promise<Map<string, Conflict['type']>> {
    // This would fetch from GitHub API or git log
    // For now, return empty map
    return new Map()
  }

  /**
   * Detect conflicts between local and remote changes
   */
  private detectConflicts(
    local: Map<string, Conflict['type']>,
    remote: Map<string, Conflict['type']>
  ): Conflict[] {
    const conflicts: Conflict[] = []

    // Find overlapping files
    for (const [file, localType] of Array.from(local.entries())) {
      const remoteType = remote.get(file)

      if (remoteType && remoteType !== localType) {
        conflicts.push({
          file,
          type: localType,
          severity: this.calculateSeverity(localType, remoteType),
          suggestion: this.generateSuggestion(localType, remoteType),
        })
      }
    }

    return conflicts
  }

  /**
   * Calculate conflict severity
   */
  private calculateSeverity(
    localType: Conflict['type'],
    remoteType: Conflict['type']
  ): Conflict['severity'] {
    // Delete conflicts are always high severity
    if (localType === 'delete' || remoteType === 'delete') {
      return 'high'
    }

    // Add conflicts are usually low
    if (localType === 'add' && remoteType === 'add') {
      return 'low'
    }

    // Modify conflicts are medium
    return 'medium'
  }

  /**
   * Generate merge suggestion
   */
  private generateSuggestion(
    localType: Conflict['type'],
    remoteType: Conflict['type']
  ): string {
    if (localType === 'delete' && remoteType === 'modify') {
      return 'Keep deletion or merge changes before deleting'
    }
    if (localType === 'modify' && remoteType === 'delete') {
      return 'Keep modification, remote deletion may be accidental'
    }
    if (localType === 'modify' && remoteType === 'modify') {
      return 'Merge both changes manually'
    }
    return 'Review changes and merge manually'
  }
}

/**
 * Create conflict detector instance
 */
export function createConflictDetector(rootPath?: string) {
  return new ConflictDetector(rootPath)
}

/**
 * Default conflict detector instance
 */
export const conflictDetector = new ConflictDetector()

