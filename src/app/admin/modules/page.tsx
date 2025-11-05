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
 * Admin Module Dashboard
 * Enterprise-grade module management with GitHub sync, versioning, and health monitoring
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Layers,
  Network,
  Shield,
  Zap,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

interface Module {
  id: string
  name: string
  displayName: string
  version: string
  description?: string
  githubRepo?: string
  githubUrl?: string
  npmPackage?: string
  syncStatus?: 'PENDING' | 'SYNCING' | 'SYNCED' | 'ERROR'
  buildStatus?: 'UNKNOWN' | 'PASSING' | 'FAILING' | 'PENDING'
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
  autoSync?: boolean
  active?: boolean
  apiStatus?: 'ok' | 'offline' | 'error'
  link?: string
  adminLink?: string
  apiLink?: string
  icon?: string
  color?: string
  badge?: string
  features?: string[]
}

export default function ModulesPage() {
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'synced' | 'pending' | 'error'>('all')

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      setLoading(true)
      
      // Try new API first, fallback to old API
      let response = await fetch('/api/v1/admin/modules', {
        credentials: 'include',
      })

      if (!response.ok) {
        // Fallback to old API
        response = await fetch('/api/modules', {
          credentials: 'include',
        })
      }

      if (!response.ok) {
        // Final fallback: load from modules.json directly
        const modulesJson = await import('@/data/modules.json')
        setModules(modulesJson.default || [])
        setLoading(false)
        return
      }

      const data = await response.json()
      
      // Handle both new and old API formats
      const modulesList = data.modules || data.data?.modules || []
      
      // Enrich with API status
      const enrichedModules = await Promise.all(
        modulesList.map(async (m: Module) => {
          try {
            const statusRes = await fetch(`/api/v1/modules/${m.id}/status`, {
              credentials: 'include',
            })
            if (statusRes.ok) {
              const statusData = await statusRes.json()
              return {
                ...m,
                apiStatus: statusData.status === 'ok' ? 'ok' : 'offline',
                active: m.active !== undefined ? m.active : true
              }
            }
          } catch {
            // Status check failed
          }
          return {
            ...m,
            apiStatus: 'offline' as const,
            active: m.active !== undefined ? m.active : true
          }
        })
      )
      
      setModules(enrichedModules)
    } catch (error) {
      console.error('Error fetching modules:', error)
      // Fallback to modules.json
      try {
        const modulesJson = await import('@/data/modules.json')
        setModules(modulesJson.default || [])
      } catch {
        setModules([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async (moduleId: string, direction: 'to-github' | 'from-github' = 'to-github') => {
    setSyncing(moduleId)
    
    try {
      const response = await fetch(`/api/modules/${moduleId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ direction, force: true }),
      })

      if (!response.ok) {
        throw new Error('Sync failed')
      }

      // Refresh modules after sync
      await fetchModules()
    } catch (error) {
      console.error('Sync error:', error)
      alert('Sync failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSyncing(null)
    }
  }

  const handleBumpVersion = async (moduleId: string, type: 'major' | 'minor' | 'patch' = 'patch') => {
    try {
      const response = await fetch(`/api/modules/${moduleId}/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        throw new Error('Version bump failed')
      }

      await fetchModules()
    } catch (error) {
      console.error('Version bump error:', error)
      alert('Version bump failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleDiscoverModules = async () => {
    try {
      const response = await fetch('/api/modules/discover', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Module discovery failed')
      }

      const data = await response.json()
      
      if (data.success) {
        alert(`Discovered ${data.discovered} modules${data.failed > 0 ? `, ${data.failed} failed` : ''}`)
        await fetchModules()
      }
    } catch (error) {
      console.error('Module discovery error:', error)
      alert('Module discovery failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleToggleActive = async (moduleId: string, active: boolean) => {
    try {
      const response = await fetch('/api/v1/admin/modules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: moduleId, active })
      })

      if (!response.ok) {
        throw new Error('Failed to toggle module')
      }

      await fetchModules()
    } catch (error) {
      console.error('Toggle error:', error)
      alert('Failed to toggle module: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const filteredModules = modules.filter((module) => {
    if (filter === 'all') return true
    if (filter === 'synced') return module.syncStatus === 'SYNCED' || module.apiStatus === 'ok'
    if (filter === 'pending') return module.syncStatus === 'PENDING' || module.syncStatus === 'SYNCING' || !module.apiStatus
    if (filter === 'error') return module.syncStatus === 'ERROR' || module.apiStatus === 'error'
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SYNCED':
      case 'PASSING':
        return 'text-green-500 bg-green-500/10'
      case 'PENDING':
      case 'SYNCING':
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'ERROR':
      case 'FAILING':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SYNCED':
      case 'PASSING':
        return <CheckCircle2 className="w-4 h-4" />
      case 'PENDING':
      case 'SYNCING':
        return <Clock className="w-4 h-4 animate-spin" />
      case 'ERROR':
      case 'FAILING':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Module Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your modules, sync with GitHub, and track versions
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/modules/onboarding"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/50"
          >
            <Sparkles className="w-4 h-4" />
            New Module
          </Link>
          <button
            onClick={handleDiscoverModules}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Discover Modules
          </button>
          <button
            onClick={fetchModules}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Modules</p>
              <p className="text-2xl font-bold mt-2">{modules.length}</p>
            </div>
            <Code2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Synced</p>
              <p className="text-2xl font-bold mt-2">
                {modules.filter((m) => m.syncStatus === 'SYNCED').length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Sync</p>
              <p className="text-2xl font-bold mt-2">
                {modules.filter((m) => m.syncStatus === 'PENDING' || m.syncStatus === 'SYNCING').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Errors</p>
              <p className="text-2xl font-bold mt-2">
                {modules.filter((m) => m.syncStatus === 'ERROR').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'synced', 'pending', 'error'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div
            key={module.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{module.displayName}</h3>
                <p className="text-gray-400 text-sm mt-1">{module.name}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* API Status Badge */}
                {module.apiStatus && (
                  <Badge variant={module.apiStatus === 'ok' ? 'success' : module.apiStatus === 'error' ? 'error' : 'warning'}>
                    {module.apiStatus.toUpperCase()}
                  </Badge>
                )}
                {/* Sync Status Badge */}
                {module.syncStatus && (
                  <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs ${getStatusColor(module.syncStatus)}`}>
                    {getStatusIcon(module.syncStatus)}
                    {module.syncStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {module.description && (
              <p className="text-gray-300 text-sm">{module.description}</p>
            )}

            {/* Version */}
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">v{module.version}</span>
            </div>

            {/* GitHub & NPM Stats */}
            <div className="flex gap-4 text-sm">
              {module.githubStats && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    <Star className="w-3 h-3 inline mr-1" />
                    {module.githubStats.stars || 0}
                  </span>
                  <span className="text-gray-300">
                    <GitFork className="w-3 h-3 inline mr-1" />
                    {module.githubStats.forks || 0}
                  </span>
                </div>
              )}
              {module.npmStats && (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    <Download className="w-3 h-3 inline mr-1" />
                    {module.npmStats.downloads || 0}
                  </span>
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Aktiv:</span>
                <Switch
                  checked={module.active !== false}
                  onCheckedChange={(checked) => handleToggleActive(module.id, checked)}
                />
              </div>
              {module.link && (
                <Link
                  href={module.link}
                  target="_blank"
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Åpne
                </Link>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-700">
              {module.githubRepo && (
                <button
                  onClick={() => handleSync(module.id, 'to-github')}
                  disabled={syncing === module.id}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {syncing === module.id ? (
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
              <button
                onClick={() => handleBumpVersion(module.id, 'patch')}
                className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Bump
              </button>
              {module.githubUrl && (
                <a
                  href={module.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Last Synced */}
            {module.lastSynced && (
              <p className="text-xs text-gray-500">
                Last synced: {new Date(module.lastSynced).toLocaleString()}
              </p>
            )}

            {/* Error Message */}
            {module.syncStatus === 'ERROR' && module.lastSyncError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-xs text-red-400">{module.lastSyncError}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No modules found</p>
          <button
            onClick={() => router.push('/admin/modules/register')}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Register Modules
          </button>
        </div>
      )}
    </div>
  )
}

