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
 * Module Detail Page
 * Comprehensive module management with health monitoring, sync history, and releases
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Code2,
  GitBranch,
  Package,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  RefreshCw,
  Settings,
  ExternalLink,
  Play,
  Tag,
  Download,
  Star,
  GitFork,
  AlertTriangle,
  Github,
  Shield,
  Zap,
  Calendar,
  FileText,
  BarChart3,
  Network,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Module {
  id: string
  name: string
  displayName: string
  version: string
  description?: string
  githubRepo?: string
  githubUrl?: string
  npmPackage?: string
  syncStatus: string
  buildStatus: string
  lastSynced?: string
  lastSyncError?: string
  githubStats?: {
    stars: number
    forks: number
    openIssues: number
  }
  npmStats?: {
    downloads: number
    version: string
  }
  category?: string
  status?: string
  autoSync: boolean
}

interface HealthCheck {
  checkedAt: string
  buildPassing: boolean
  testsPassing: boolean
  lintPassing: boolean
  coverage?: number
  vulnerabilities: number
  dependenciesOutdated: number
  buildTime?: number
  testTime?: number
  bundleSize?: number
}

// Sync History Component
function SyncHistoryDisplay({ moduleId }: { moduleId: string }) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [moduleId])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setHistory(data.module?.syncHistory || [])
      }
    } catch (error) {
      console.error('Error fetching sync history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-gray-400">Loading...</p>
  }

  if (history.length === 0) {
    return <p className="text-gray-400">No sync history</p>
  }

  return (
    <div className="space-y-2">
      {history.slice(0, 10).map((sync: any) => (
        <div
          key={sync.id}
          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              sync.status === 'success' ? 'bg-green-500' :
              sync.status === 'error' ? 'bg-red-500' :
              'bg-yellow-500'
            }`} />
            <div>
              <p className="text-sm font-medium">{sync.direction}</p>
              <p className="text-xs text-gray-400">
                {new Date(sync.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          {sync.duration && (
            <p className="text-xs text-gray-400">
              {sync.duration}ms
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// Webhook Config Component
function WebhookConfig({ moduleId }: { moduleId: string }) {
  const [webhook, setWebhook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settingUp, setSettingUp] = useState(false)

  useEffect(() => {
    fetchWebhook()
  }, [moduleId])

  const fetchWebhook = async () => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        // Find webhook for this module
        // For now, just check if module has webhookUrl
        setWebhook(data.module?.webhookUrl ? { url: data.module.webhookUrl } : null)
      }
    } catch (error) {
      console.error('Error fetching webhook:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetupWebhook = async () => {
    setSettingUp(true)
    try {
      const response = await fetch(`/api/modules/${moduleId}/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      })

      if (response.ok) {
        await fetchWebhook()
        alert('Webhook setup successfully!')
      } else {
        throw new Error('Webhook setup failed')
      }
    } catch (error) {
      console.error('Webhook setup error:', error)
      alert('Webhook setup failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSettingUp(false)
    }
  }

  if (loading) {
    return <p className="text-gray-400">Loading...</p>
  }

  if (webhook) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <p className="text-sm text-green-400">Webhook is configured</p>
          <p className="text-xs text-gray-400 mt-1">{webhook.url}</p>
        </div>
        <button
          onClick={() => fetch('/api/modules/' + moduleId + '/webhook', { method: 'DELETE', credentials: 'include' })}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
        >
          Delete Webhook
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">
        Webhooks enable automatic synchronization when changes are pushed to GitHub.
      </p>
      <button
        onClick={handleSetupWebhook}
        disabled={settingUp}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
      >
        {settingUp ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Setting up...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Setup Webhook
          </>
        )}
      </button>
    </div>
  )
}

export default function ModuleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.moduleId as string

  const [module, setModule] = useState<Module | null>(null)
  const [health, setHealth] = useState<HealthCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'sync' | 'releases'>('overview')
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (moduleId) {
      fetchModule()
      fetchHealth()
    }
  }, [moduleId])

  const fetchModule = async () => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch module')
      }

      const data = await response.json()
      setModule(data.module)
    } catch (error) {
      console.error('Error fetching module:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHealth = async () => {
    try {
      const response = await fetch(`/api/modules/${moduleId}/health`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setHealth(data.health?.latestHealthCheck || null)
      }
    } catch (error) {
      console.error('Error fetching health:', error)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch(`/api/modules/${moduleId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ direction: 'to-github', force: true }),
      })

      if (!response.ok) {
        throw new Error('Sync failed')
      }

      await fetchModule()
    } catch (error) {
      console.error('Sync error:', error)
      alert('Sync failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSyncing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SYNCED':
      case 'PASSING':
        return 'text-green-500 bg-green-500/10'
      case 'PENDING':
      case 'SYNCING':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'ERROR':
      case 'FAILING':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Module not found</p>
          <Link
            href="/admin/modules"
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
            ← Back to Modules
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/modules"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {module.displayName}
            </h1>
            <p className="text-gray-400 mt-2">{module.name} • v{module.version}</p>
          </div>
        </div>
        <div className="flex gap-4">
          {module.githubRepo && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <GitBranch className="w-4 h-4" />
                  Sync to GitHub
                </>
              )}
            </button>
          )}
          {module.githubUrl && (
            <a
              href={module.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </a>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Sync Status</p>
          <div className={`mt-2 px-3 py-1 rounded-full inline-flex items-center gap-2 ${getStatusColor(module.syncStatus)}`}>
            {module.syncStatus}
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Build Status</p>
          <div className={`mt-2 px-3 py-1 rounded-full inline-flex items-center gap-2 ${getStatusColor(module.buildStatus)}`}>
            {module.buildStatus}
          </div>
        </div>
        {module.githubStats && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">GitHub Stars</p>
            <p className="text-2xl font-bold mt-2">{module.githubStats.stars || 0}</p>
          </div>
        )}
        {health && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Test Coverage</p>
            <p className="text-2xl font-bold mt-2">
              {health.coverage ? `${health.coverage.toFixed(0)}%` : 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex gap-4">
          {(['overview', 'health', 'sync', 'releases'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {module.description && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="text-gray-300">{module.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-4">GitHub Integration</h3>
                {module.githubRepo ? (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Repository:</span>{' '}
                      <span className="text-white">{module.githubRepo}</span>
                    </div>
                    {module.githubStats && (
                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{module.githubStats.stars}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitFork className="w-4 h-4 text-blue-400" />
                          <span>{module.githubStats.forks}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span>{module.githubStats.openIssues} issues</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">Not configured</p>
                )}
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-4">NPM Integration</h3>
                {module.npmPackage ? (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Package:</span>{' '}
                      <span className="text-white">{module.npmPackage}</span>
                    </div>
                    {module.npmStats && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-green-400" />
                          <span>{module.npmStats.downloads?.toLocaleString() || 0} downloads</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">Not published</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            {health ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Build Status</p>
                    <div className={`mt-2 ${health.buildPassing ? 'text-green-500' : 'text-red-500'}`}>
                      {health.buildPassing ? '✓ Passing' : '✗ Failing'}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Tests</p>
                    <div className={`mt-2 ${health.testsPassing ? 'text-green-500' : 'text-red-500'}`}>
                      {health.testsPassing ? '✓ Passing' : '✗ Failing'}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Lint</p>
                    <div className={`mt-2 ${health.lintPassing ? 'text-green-500' : 'text-red-500'}`}>
                      {health.lintPassing ? '✓ Passing' : '✗ Failing'}
                    </div>
                  </div>
                </div>

                {health.coverage !== undefined && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold mb-4">Test Coverage</h3>
                    <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
                        style={{ width: `${health.coverage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {health.coverage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Vulnerabilities</p>
                    <p className={`text-2xl font-bold mt-2 ${health.vulnerabilities > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {health.vulnerabilities}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <p className="text-gray-400 text-sm">Outdated Dependencies</p>
                    <p className={`text-2xl font-bold mt-2 ${health.dependenciesOutdated > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {health.dependenciesOutdated}
                    </p>
                  </div>
                  {health.bundleSize && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                      <p className="text-gray-400 text-sm">Bundle Size</p>
                      <p className="text-2xl font-bold mt-2">
                        {(health.bundleSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No health data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Sync History</h3>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <GitBranch className="w-3 h-3" />
                      Sync Now
                    </>
                  )}
                </button>
              </div>
              <SyncHistoryDisplay moduleId={moduleId} />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Webhook Configuration</h3>
              <WebhookConfig moduleId={moduleId} />
            </div>
          </div>
        )}

        {activeTab === 'releases' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Releases</h3>
              <p className="text-gray-400">Release history will be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

