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
 * Nora Task Decomposer
 * Breaks down complex tasks into smaller, manageable subtasks
 * Helps Nora handle complex requests step-by-step
 */

export interface Subtask {
  id: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dependencies: string[] // IDs of other subtasks that must complete first
  estimatedTime?: number // in minutes
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
}

export interface TaskPlan {
  originalTask: string
  subtasks: Subtask[]
  estimatedTotalTime: number
  complexity: 'simple' | 'moderate' | 'complex'
}

export class TaskDecomposer {
  /**
   * Analyze task complexity
   */
  analyzeComplexity(task: string): 'simple' | 'moderate' | 'complex' {
    const taskLower = task.toLowerCase()
    
    // Complexity indicators
    const complexIndicators = [
      'implementer', 'bygg', 'lag', 'opprett hele', 'sett opp',
      'integrer', 'migrer', 'refaktorer', 'automatiser'
    ]
    
    const moderateIndicators = [
      'oppdater', 'endre', 'forbedre', 'legge til', 'fikse'
    ]
    
    // Count indicators
    let complexCount = 0
    let moderateCount = 0
    
    for (const indicator of complexIndicators) {
      if (taskLower.includes(indicator)) complexCount++
    }
    
    for (const indicator of moderateIndicators) {
      if (taskLower.includes(indicator)) moderateCount++
    }
    
    // Determine complexity
    if (complexCount >= 2 || task.split(' ').length > 20) {
      return 'complex'
    } else if (moderateCount >= 1 || complexCount >= 1 || task.split(' ').length > 10) {
      return 'moderate'
    }
    
    return 'simple'
  }

  /**
   * Decompose complex task into subtasks
   */
  decompose(task: string): TaskPlan {
    const complexity = this.analyzeComplexity(task)
    
    // For simple tasks, return single subtask
    if (complexity === 'simple') {
      return {
        originalTask: task,
        subtasks: [{
          id: '1',
          description: task,
          priority: 'high',
          dependencies: [],
          status: 'pending'
        }],
        estimatedTotalTime: 5,
        complexity
      }
    }

    // For moderate/complex tasks, break down
    const subtasks = this.createSubtasks(task, complexity)
    const estimatedTotalTime = subtasks.reduce((sum, st) => sum + (st.estimatedTime || 10), 0)

    return {
      originalTask: task,
      subtasks,
      estimatedTotalTime,
      complexity
    }
  }

  /**
   * Create subtasks based on task type
   */
  private createSubtasks(task: string, complexity: 'moderate' | 'complex'): Subtask[] {
    const taskLower = task.toLowerCase()
    const subtasks: Subtask[] = []

    // Pattern: "Implementer X med Y og Z"
    if (taskLower.includes('implementer') || taskLower.includes('bygg')) {
      subtasks.push({
        id: '1',
        description: 'Analyser krav og design',
        priority: 'high',
        dependencies: [],
        estimatedTime: complexity === 'complex' ? 15 : 10,
        status: 'pending'
      })

      subtasks.push({
        id: '2',
        description: 'Opprett grunnleggende struktur og filer',
        priority: 'high',
        dependencies: ['1'],
        estimatedTime: complexity === 'complex' ? 20 : 15,
        status: 'pending'
      })

      subtasks.push({
        id: '3',
        description: 'Implementer kjernefunksjonalitet',
        priority: 'high',
        dependencies: ['2'],
        estimatedTime: complexity === 'complex' ? 30 : 20,
        status: 'pending'
      })

      subtasks.push({
        id: '4',
        description: 'Test og verifiser implementering',
        priority: 'medium',
        dependencies: ['3'],
        estimatedTime: 10,
        status: 'pending'
      })

      if (complexity === 'complex') {
        subtasks.push({
          id: '5',
          description: 'Dokumenter og oppdater README',
          priority: 'low',
          dependencies: ['4'],
          estimatedTime: 10,
          status: 'pending'
        })
      }
    }

    // Pattern: "Integrer X med Y"
    else if (taskLower.includes('integrer')) {
      subtasks.push({
        id: '1',
        description: 'Undersøk API og dokumentasjon',
        priority: 'high',
        dependencies: [],
        estimatedTime: 15,
        status: 'pending'
      })

      subtasks.push({
        id: '2',
        description: 'Opprett integrasjonsmodul',
        priority: 'high',
        dependencies: ['1'],
        estimatedTime: 20,
        status: 'pending'
      })

      subtasks.push({
        id: '3',
        description: 'Test integrasjon',
        priority: 'medium',
        dependencies: ['2'],
        estimatedTime: 10,
        status: 'pending'
      })
    }

    // Default: Generic breakdown
    else {
      subtasks.push({
        id: '1',
        description: 'Forberedelse og planlegging',
        priority: 'high',
        dependencies: [],
        estimatedTime: 10,
        status: 'pending'
      })

      subtasks.push({
        id: '2',
        description: 'Utfør oppgaven',
        priority: 'high',
        dependencies: ['1'],
        estimatedTime: complexity === 'complex' ? 30 : 20,
        status: 'pending'
      })

      subtasks.push({
        id: '3',
        description: 'Verifiser og test',
        priority: 'medium',
        dependencies: ['2'],
        estimatedTime: 10,
        status: 'pending'
      })
    }

    return subtasks
  }

  /**
   * Get next subtask to execute
   */
  getNextSubtask(plan: TaskPlan): Subtask | null {
    // Find pending subtasks with no pending dependencies
    const completedIds = plan.subtasks
      .filter(st => st.status === 'completed')
      .map(st => st.id)

    const available = plan.subtasks.filter(st => 
      st.status === 'pending' &&
      st.dependencies.every(dep => completedIds.includes(dep))
    )

    // Return highest priority
    if (available.length === 0) return null

    const highPriority = available.filter(st => st.priority === 'high')
    if (highPriority.length > 0) return highPriority[0]

    return available[0]
  }
}

// Singleton instance
let taskDecomposer: TaskDecomposer | null = null

export function getTaskDecomposer(): TaskDecomposer {
  if (!taskDecomposer) {
    taskDecomposer = new TaskDecomposer()
  }
  return taskDecomposer
}

