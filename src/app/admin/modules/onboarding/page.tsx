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
 * Module Onboarding Wizard
 * Interactive multi-step wizard for registering new modules
 * 
 * Features:
 * - Step-by-step guidance
 * - Real-time validation
 * - Auto-fill from MODULE_INFO.json
 * - GitHub repository validation
 * - Progress saving
 * - Conflict detection
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Info,
  Github,
  Package,
  GitBranch,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import GitHubRepoSelector from '@/modules/module-management/components/GitHubRepoSelector'
import type { GitHubRepo } from '@/modules/module-management/components/GitHubRepoSelector'

interface ModuleInfo {
  id?: string
  name?: string
  displayName?: string
  version?: string
  description?: string
  repository?: {
    url?: string
    branch?: string
  }
  npmPackage?: string
  dependencies?: string[]
  category?: string
}

interface ValidationResult {
  valid: boolean
  message?: string
  suggestion?: string
}

export default function ModuleOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo>({
    version: '1.0.0',
  })
  const [moduleName, setModuleName] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({})
  const [availableModules, setAvailableModules] = useState<string[]>([])
  const [autoFilled, setAutoFilled] = useState(false)
  const [githubCheck, setGithubCheck] = useState<{
    checking: boolean
    valid?: boolean
    message?: string
    exists?: boolean
  }>({ checking: false })

  const steps = [
    { number: 1, name: 'Discovery', icon: Sparkles },
    { number: 2, name: 'Information', icon: FileText },
    { number: 3, name: 'GitHub Setup', icon: Github },
    { number: 4, name: 'Review', icon: CheckCircle2 },
  ]

  useEffect(() => {
    fetchAvailableModules()
    // Load saved state
    const saved = localStorage.getItem('module-onboarding-state')
    if (saved) {
      try {
        const state = JSON.parse(saved)
        if (state.moduleInfo) {
          setModuleInfo(state.moduleInfo)
        }
        if (state.currentStep) {
          setCurrentStep(state.currentStep)
        }
      } catch {
        // Ignore
      }
    }
    
    // Track onboarding start (analytics endpoint to be implemented)
    // trackAnalytics('start')
  }, [])

  const fetchAvailableModules = async () => {
    try {
      // Fetch list of available modules from filesystem
      // This could be enhanced with an API endpoint
      const response = await fetch('/api/modules', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.modules) {
          const names = data.modules.map((m: any) => m.name)
          setAvailableModules(names)
        }
      }
    } catch {
      // Ignore
    }
  }

  const handleAutoFill = async (moduleName: string) => {
    if (!moduleName) return
    
    setLoading(true)
    try {
      // Fetch MODULE_INFO.json content
      const response = await fetch(`/api/modules/onboarding/auto-fill?module=${encodeURIComponent(moduleName)}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.moduleInfo) {
          setModuleInfo(data.moduleInfo)
          setModuleName(moduleName)
          setAutoFilled(true)
          
          // Validate auto-filled data
          if (data.moduleInfo.id) {
            validateField('id', data.moduleInfo.id)
          }
          if (data.moduleInfo.version) {
            validateField('version', data.moduleInfo.version)
          }
          if (data.moduleInfo.repository?.url) {
            validateField('repository.url', data.moduleInfo.repository.url)
            checkGitHubRepository(data.moduleInfo.repository.url)
          }
        }
      }
    } catch (error) {
      console.error('Auto-fill error:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateField = async (field: string, value: string) => {
    if (!value) {
      setValidationResults((prev) => ({
        ...prev,
        [field]: { valid: false, message: 'This field is required' },
      }))
      return
    }

    setValidating(true)
    try {
      const response = await fetch(
        `/api/modules/onboarding/validate?field=${field}&value=${encodeURIComponent(value)}&moduleInfo=${encodeURIComponent(JSON.stringify(moduleInfo))}`,
        {
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setValidationResults((prev) => ({
          ...prev,
          [field]: {
            valid: data.valid,
            message: data.message,
            suggestion: data.suggestion,
          },
        }))
      }
    } catch (error) {
      console.error('Validation error:', error)
    } finally {
      setValidating(false)
    }
  }

  const checkGitHubRepository = async (url: string) => {
    if (!url) return

    setGithubCheck({ checking: true })
    try {
      const response = await fetch('/api/modules/onboarding/github-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        const data = await response.json()
        setGithubCheck({
          checking: false,
          valid: data.valid,
          exists: data.exists,
          message: data.error || (data.valid ? 'Repository found and accessible' : ''),
        })
      } else {
        setGithubCheck({
          checking: false,
          valid: false,
          message: 'Failed to check repository',
        })
      }
    } catch (error) {
      setGithubCheck({
        checking: false,
        valid: false,
        message: 'Error checking repository',
      })
    }
  }

  const saveProgress = () => {
    const state = {
      currentStep,
      moduleInfo,
      savedAt: new Date(),
    }
    localStorage.setItem('module-onboarding-state', JSON.stringify(state))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Final validation
      const response = await fetch('/api/modules/onboarding/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ moduleInfo, moduleName }),
      })

      if (!response.ok) {
        throw new Error('Validation failed')
      }

      const validation = await response.json()

      if (!validation.validation.valid) {
        alert('Please fix errors before submitting')
        return
      }

      // Register module
      const registerResponse = await fetch('/api/modules/onboarding/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ moduleInfo, moduleName }),
      })

      if (!registerResponse.ok) {
        throw new Error('Registration failed')
      }

      const result = await registerResponse.json()

      if (result.success) {
        // Clear saved state
        localStorage.removeItem('module-onboarding-state')
        
        // Redirect to module detail page
        router.push(`/admin/modules/${result.moduleId}`)
      } else {
        throw new Error(result.error || 'Registration failed')
      }
    } catch (error: any) {
      alert('Failed to register module: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    saveProgress()
  }, [currentStep, moduleInfo])

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return !!(moduleInfo.id || moduleInfo.name)
      case 3:
        return !!moduleInfo.repository?.url && githubCheck.valid !== false
      case 4:
        return Object.values(validationResults).every((v) => v.valid !== false)
      default:
        return false
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push('/admin/modules')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/modules"
              className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Modules
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Module Onboarding Wizard
            </h1>
            <p className="text-gray-400 mt-2">
              Register a new module in just a few simple steps
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-blue-400' : 'text-gray-400'
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          {/* Step 1: Discovery */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Discover Module</h2>
                <p className="text-gray-400">
                  Enter the module name or let us auto-fill from MODULE_INFO.json
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Module Name / ID
                  </label>
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => {
                      setModuleName(e.target.value)
                      if (e.target.value) {
                        validateField('id', e.target.value)
                      }
                    }}
                    onBlur={() => {
                      if (moduleName && !autoFilled) {
                        handleAutoFill(moduleName)
                      }
                    }}
                    placeholder="e.g., my-awesome-module"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {validationResults.id && (
                    <div
                      className={`mt-2 text-sm flex items-center gap-2 ${
                        validationResults.id.valid
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {validationResults.id.valid ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span>{validationResults.id.message}</span>
                    </div>
                  )}
                  {autoFilled && (
                    <div className="mt-2 text-sm text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Auto-filled from MODULE_INFO.json
                    </div>
                  )}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400">
                        Auto-Discovery
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        Enter your module name and we&apos;ll automatically detect and
                        load information from MODULE_INFO.json if it exists.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Module Information</h2>
                <p className="text-gray-400">
                  Provide details about your module
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Module ID *
                    </label>
                    <input
                      type="text"
                      value={moduleInfo.id || ''}
                      onChange={(e) => {
                        setModuleInfo({ ...moduleInfo, id: e.target.value })
                        validateField('id', e.target.value)
                      }}
                      placeholder="my-module"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {validationResults.id && (
                      <p
                        className={`mt-1 text-xs ${
                          validationResults.id.valid
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {validationResults.id.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={moduleInfo.displayName || ''}
                      onChange={(e) =>
                        setModuleInfo({ ...moduleInfo, displayName: e.target.value })
                      }
                      placeholder="My Awesome Module"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Version *
                  </label>
                  <input
                    type="text"
                    value={moduleInfo.version || ''}
                    onChange={(e) => {
                      setModuleInfo({ ...moduleInfo, version: e.target.value })
                      validateField('version', e.target.value)
                    }}
                    placeholder="1.0.0"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {validationResults.version && (
                    <p
                      className={`mt-1 text-xs ${
                        validationResults.version.valid
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {validationResults.version.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={moduleInfo.description || ''}
                    onChange={(e) =>
                      setModuleInfo({ ...moduleInfo, description: e.target.value })
                    }
                    placeholder="Describe what this module does..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: GitHub Setup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">GitHub Setup</h2>
                <p className="text-gray-400">
                  Connect your GitHub account to select or create a repository
                </p>
              </div>

              <GitHubRepoSelector
                onRepoSelect={(repo: GitHubRepo) => {
                  setModuleInfo({
                    ...moduleInfo,
                    repository: {
                      url: repo.html_url,
                      branch: repo.default_branch,
                    },
                  })
                  if (repo.html_url) {
                    validateField('repository.url', repo.html_url)
                    checkGitHubRepository(repo.html_url)
                  }
                }}
                onCreateRepo={async (repoName: string, isPrivate: boolean, description?: string) => {
                  const response = await fetch(
                    '/api/modules/onboarding/github/repos/create',
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({
                        name: repoName,
                        private: isPrivate,
                        description: description || moduleInfo.description || '',
                      }),
                    }
                  )

                  if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.error || 'Failed to create repository')
                  }

                  const data = await response.json()
                  if (!data.success || !data.repo) {
                    throw new Error('Failed to create repository')
                  }

                  return data.repo
                }}
                initialRepoUrl={moduleInfo.repository?.url}
              />

              {/* Manual URL Input (Fallback) */}
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-3">
                  Or enter repository URL manually:
                </p>
                <input
                  type="url"
                  value={moduleInfo.repository?.url || ''}
                  onChange={(e) => {
                    setModuleInfo({
                      ...moduleInfo,
                      repository: {
                        ...moduleInfo.repository,
                        url: e.target.value,
                      },
                    })
                    if (e.target.value) {
                      validateField('repository.url', e.target.value)
                      checkGitHubRepository(e.target.value)
                    }
                  }}
                  placeholder="https://github.com/owner/repo"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {githubCheck.checking && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-blue-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Checking repository...
                  </div>
                )}
                {!githubCheck.checking && githubCheck.message && (
                  <div
                    className={`mt-2 text-sm flex items-center gap-2 ${
                      githubCheck.valid ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {githubCheck.valid ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{githubCheck.message}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-400">
                      Automatic Webhook Setup
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      After registration, we&apos;ll automatically set up webhooks
                      for push, release, and pull request events to keep your
                      module in sync.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Review & Confirm</h2>
                <p className="text-gray-400">
                  Review your module information before registration
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Module ID</p>
                      <p className="text-white font-medium">{moduleInfo.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Version</p>
                      <p className="text-white font-medium">{moduleInfo.version}</p>
                    </div>
                    {moduleInfo.displayName && (
                      <div>
                        <p className="text-sm text-gray-400">Display Name</p>
                        <p className="text-white font-medium">
                          {moduleInfo.displayName}
                        </p>
                      </div>
                    )}
                    {moduleInfo.repository?.url && (
                      <div>
                        <p className="text-sm text-gray-400">GitHub Repository</p>
                        <a
                          href={moduleInfo.repository.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                        >
                          {moduleInfo.repository.url}
                          <Github className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                  {moduleInfo.description && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Description</p>
                      <p className="text-white">{moduleInfo.description}</p>
                    </div>
                  )}
                </div>

                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-400">
                        Ready to Register
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        All required fields are filled and validated. Click
                        &quot;Complete Registration&quot; to create your module.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={handlePrevStep}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (canProceed()) {
                    setCurrentStep(currentStep + 1)
                  } else {
                    alert('Please complete required fields before proceeding')
                  }
                }}
                disabled={!canProceed()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Registration
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

