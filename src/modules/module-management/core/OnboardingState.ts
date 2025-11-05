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
 * Onboarding State Manager
 * Manages onboarding wizard state and progress
 * 
 * Features:
 * - Save/restore progress
 * - Multi-step state management
 * - Validation state tracking
 * - Auto-fill from MODULE_INFO.json
 */

import * as fs from 'fs/promises'
import * as path from 'path'

export interface OnboardingStep {
  step: number
  name: string
  completed: boolean
  data: Record<string, any>
  validated: boolean
}

export interface OnboardingState {
  currentStep: number
  totalSteps: number
  steps: OnboardingStep[]
  moduleInfo?: {
    id?: string
    name?: string
    displayName?: string
    version?: string
    description?: string
    repository?: {
      url?: string
    }
    npmPackage?: string
    dependencies?: string[]
    category?: string
  }
  validation?: {
    valid: boolean
    errors: any[]
    warnings: any[]
  }
  savedAt?: Date
}

/**
 * Onboarding State Manager
 * Handles onboarding wizard state
 */
export class OnboardingStateManager {
  private rootPath: string
  private storageKey = 'module-onboarding-state'

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Initialize onboarding state
   */
  initializeState(moduleName?: string): OnboardingState {
    return {
      currentStep: 1,
      totalSteps: 4,
      steps: [
        {
          step: 1,
          name: 'discovery',
          completed: false,
          data: {},
          validated: false,
        },
        {
          step: 2,
          name: 'information',
          completed: false,
          data: {},
          validated: false,
        },
        {
          step: 3,
          name: 'github-setup',
          completed: false,
          data: {},
          validated: false,
        },
        {
          step: 4,
          name: 'review',
          completed: false,
          data: {},
          validated: false,
        },
      ],
      moduleInfo: moduleName
        ? {
            id: moduleName,
            name: moduleName,
          }
        : undefined,
    }
  }

  /**
   * Load state from local storage (client-side)
   */
  loadState(): OnboardingState | null {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      const saved = localStorage.getItem(this.storageKey)
      if (!saved) {
        return null
      }

      const state = JSON.parse(saved)
      return {
        ...state,
        savedAt: state.savedAt ? new Date(state.savedAt) : undefined,
      }
    } catch {
      return null
    }
  }

  /**
   * Save state to local storage (client-side)
   */
  saveState(state: OnboardingState): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          ...state,
          savedAt: new Date(),
        })
      )
    } catch (error) {
      console.error('Failed to save onboarding state:', error)
    }
  }

  /**
   * Clear saved state
   */
  clearState(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error('Failed to clear onboarding state:', error)
    }
  }

  /**
   * Auto-fill from MODULE_INFO.json
   */
  async autoFillFromModuleInfo(moduleName: string): Promise<Partial<OnboardingState['moduleInfo']>> {
    try {
      const moduleInfoPath = path.join(
        this.rootPath,
        'src/modules',
        moduleName,
        'MODULE_INFO.json'
      )

      const content = await fs.readFile(moduleInfoPath, 'utf-8')
      const info = JSON.parse(content)

      return {
        id: info.id || info.name || moduleName,
        name: info.name || info.id || moduleName,
        displayName: info.displayName || info.name,
        version: info.version || '1.0.0',
        description: info.description,
        repository: info.repository,
        npmPackage: info.npmPackage || info.api?.sdk,
        dependencies: info.dependencies,
        category: info.category,
      }
    } catch (error) {
      console.warn(`Failed to load MODULE_INFO.json for ${moduleName}:`, error)
      return {
        id: moduleName,
        name: moduleName,
        version: '1.0.0',
      }
    }
  }

  /**
   * Update step data
   */
  updateStep(
    state: OnboardingState,
    stepNumber: number,
    data: Record<string, any>,
    completed: boolean = false,
    validated: boolean = false
  ): OnboardingState {
    const step = state.steps.find((s) => s.step === stepNumber)
    if (step) {
      step.data = { ...step.data, ...data }
      step.completed = completed
      step.validated = validated
    }

    // Update module info if provided
    if (data.moduleInfo) {
      state.moduleInfo = { ...state.moduleInfo, ...data.moduleInfo }
    }

    return { ...state }
  }

  /**
   * Move to next step
   */
  nextStep(state: OnboardingState): OnboardingState {
    if (state.currentStep < state.totalSteps) {
      return {
        ...state,
        currentStep: state.currentStep + 1,
      }
    }
    return state
  }

  /**
   * Move to previous step
   */
  previousStep(state: OnboardingState): OnboardingState {
    if (state.currentStep > 1) {
      return {
        ...state,
        currentStep: state.currentStep - 1,
      }
    }
    return state
  }

  /**
   * Jump to specific step
   */
  goToStep(state: OnboardingState, stepNumber: number): OnboardingState {
    if (stepNumber >= 1 && stepNumber <= state.totalSteps) {
      return {
        ...state,
        currentStep: stepNumber,
      }
    }
    return state
  }

  /**
   * Get current step
   */
  getCurrentStep(state: OnboardingState): OnboardingStep | undefined {
    return state.steps.find((s) => s.step === state.currentStep)
  }

  /**
   * Get progress percentage
   */
  getProgress(state: OnboardingState): number {
    const completedSteps = state.steps.filter((s) => s.completed).length
    return Math.round((completedSteps / state.totalSteps) * 100)
  }

  /**
   * Check if can proceed to next step
   */
  canProceed(state: OnboardingState, stepNumber: number): boolean {
    const step = state.steps.find((s) => s.step === stepNumber)
    if (!step) {
      return false
    }

    // Step 1 (discovery) - always can proceed
    if (stepNumber === 1) {
      return true
    }

    // Check if previous steps are completed
    for (let i = 1; i < stepNumber; i++) {
      const prevStep = state.steps.find((s) => s.step === i)
      if (!prevStep || !prevStep.completed) {
        return false
      }
    }

    // Step 2 (information) - requires module info
    if (stepNumber === 2) {
      return !!(state.moduleInfo?.id || state.moduleInfo?.name)
    }

    // Step 3 (github-setup) - requires repository URL
    if (stepNumber === 3) {
      return !!state.moduleInfo?.repository?.url
    }

    // Step 4 (review) - requires validation
    if (stepNumber === 4) {
      return state.validation?.valid === true
    }

    return step.validated
  }
}

/**
 * Create onboarding state manager instance
 */
export function createOnboardingStateManager(rootPath?: string) {
  return new OnboardingStateManager(rootPath)
}

/**
 * Default onboarding state manager instance
 */
export const onboardingStateManager = new OnboardingStateManager()





