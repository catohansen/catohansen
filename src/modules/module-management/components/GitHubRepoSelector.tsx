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
 * GitHub Repository Selector Component
 * 
 * Features:
 * - GitHub OAuth login
 * - List user's repositories
 * - Select existing or create new
 * - Auto-fill module info from repo
 * - Search and filter repositories
 */

'use client'

import { useState, useEffect } from 'react'
import {
  Github,
  Plus,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Search,
  Lock,
  Globe,
  Loader2,
  AlertCircle,
} from 'lucide-react'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  default_branch: string
  html_url: string
  updated_at: string
  language?: string | null
}

interface GitHubRepoSelectorProps {
  onRepoSelect: (repo: GitHubRepo) => void
  onCreateRepo?: (repoName: string, isPrivate: boolean, description?: string) => Promise<GitHubRepo>
  initialRepoUrl?: string
  selectedRepo?: GitHubRepo | null
}

export default function GitHubRepoSelector({
  onRepoSelect,
  onCreateRepo,
  initialRepoUrl,
  selectedRepo: externalSelectedRepo,
}: GitHubRepoSelectorProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(
    externalSelectedRepo || null
  )
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newRepoName, setNewRepoName] = useState('')
  const [newRepoPrivate, setNewRepoPrivate] = useState(true)
  const [newRepoDescription, setNewRepoDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Check if GitHub is authenticated
  useEffect(() => {
    checkGitHubAuth()
  }, [])

  // Filter repos based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRepos(repos)
      return
    }

    const query = searchQuery.toLowerCase()
    setFilteredRepos(
      repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          repo.full_name.toLowerCase().includes(query) ||
          (repo.description && repo.description.toLowerCase().includes(query))
      )
    )
  }, [searchQuery, repos])

  const checkGitHubAuth = async () => {
    setChecking(true)
    setError(null)
    try {
      const response = await fetch(
        '/api/modules/onboarding/github/auth/check',
        {
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setAuthenticated(data.authenticated)
        if (data.authenticated && data.repos) {
          setRepos(data.repos)
          setFilteredRepos(data.repos)

          // Auto-select if initialRepoUrl is provided
          if (initialRepoUrl && !selectedRepo) {
            const matchingRepo = data.repos.find(
              (repo: GitHubRepo) => repo.html_url === initialRepoUrl
            )
            if (matchingRepo) {
              setSelectedRepo(matchingRepo)
              onRepoSelect(matchingRepo)
            }
          }
        }
      } else {
        setAuthenticated(false)
      }
    } catch (error) {
      console.error('GitHub auth check error:', error)
      setError('Failed to check GitHub authentication')
      setAuthenticated(false)
    } finally {
      setChecking(false)
    }
  }

  const handleGitHubLogin = () => {
    window.location.href = '/api/modules/onboarding/github/auth/login'
  }

  const handleRepoSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo)
    onRepoSelect(repo)
    setError(null)
  }

  const handleCreateRepo = async () => {
    if (!newRepoName || !onCreateRepo) return

    setCreating(true)
    setError(null)
    try {
      const repo = await onCreateRepo(
        newRepoName,
        newRepoPrivate,
        newRepoDescription || undefined
      )
      setRepos([repo, ...repos])
      setFilteredRepos([repo, ...filteredRepos])
      handleRepoSelect(repo)
      setShowCreateForm(false)
      setNewRepoName('')
      setNewRepoDescription('')
    } catch (error: any) {
      setError(error.message || 'Failed to create repository')
    } finally {
      setCreating(false)
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">Checking GitHub connection...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="p-6 bg-blue-500/10 border border-blue-500/50 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Github className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">
              Connect GitHub
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Log in with GitHub to select an existing repository or create a
              new one. This allows us to automatically sync your module with
              GitHub.
            </p>
            <button
              onClick={handleGitHubLogin}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white rounded-lg transition-all flex items-center gap-2 font-semibold"
            >
              <Github className="w-5 h-5" />
              Connect GitHub Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select or Create Repository</h3>
          <p className="text-sm text-gray-400 mt-1">
            {repos.length} repository{repos.length !== 1 ? 'ies' : ''} found
          </p>
        </div>
        <button
          onClick={checkGitHubAuth}
          disabled={loading}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search repositories..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Repository List */}
      <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-700 rounded-lg p-4 bg-gray-900/50">
        {filteredRepos.length === 0 ? (
          <div className="text-center py-8">
            <Github className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {searchQuery
                ? 'No repositories found matching your search'
                : 'No repositories found'}
            </p>
          </div>
        ) : (
          filteredRepos.map((repo) => {
            const isSelected = selectedRepo?.id === repo.id
            return (
              <button
                key={repo.id}
                onClick={() => handleRepoSelect(repo)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 shadow-md shadow-purple-500/20'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Github className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-white">
                        {repo.full_name}
                      </span>
                      {repo.private ? (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Public
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Branch: {repo.default_branch}</span>
                      {repo.language && <span>Language: {repo.language}</span>}
                      <span>
                        Updated:{' '}
                        {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-6 h-6 text-purple-500 flex-shrink-0 ml-4" />
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Create New Repository */}
      {showCreateForm ? (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="font-semibold mb-3 text-white">Create New Repository</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Repository Name
              </label>
              <input
                type="text"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                placeholder="repository-name"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters, numbers, hyphens, and underscores allowed
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                value={newRepoDescription}
                onChange={(e) => setNewRepoDescription(e.target.value)}
                placeholder="Repository description..."
                rows={2}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newRepoPrivate}
                onChange={(e) => setNewRepoPrivate(e.target.checked)}
                className="rounded border-gray-600"
              />
              <span className="text-sm text-gray-300">
                Private repository (recommended for proprietary modules)
              </span>
            </label>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreateRepo}
                disabled={!newRepoName || creating}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Repository
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setNewRepoName('')
                  setNewRepoDescription('')
                  setError(null)
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        onCreateRepo && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-white"
          >
            <Plus className="w-4 h-4" />
            Create New Repository
          </button>
        )
      )}
    </div>
  )
}





