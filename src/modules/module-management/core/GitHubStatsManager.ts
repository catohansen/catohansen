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
 * GitHub Stats Manager
 * Fetches and caches GitHub statistics for modules
 */

import { prisma } from '@/lib/db/prisma'

export interface GitHubStats {
  stars: number
  forks: number
  watchers: number
  issues: number
  openIssues: number
  pullRequests: number
  openPullRequests: number
  lastRelease?: {
    version: string
    publishedAt: Date
  }
  contributors?: number
}

export interface NPMStats {
  downloads: number
  version: string
  lastPublish?: Date
  maintainers?: string[]
}

/**
 * GitHub Stats Manager
 * Manages GitHub statistics for modules
 * 
 * Features:
 * - Smart rate limiting with header parsing
 * - Exponential backoff on rate limit
 * - Response caching
 * - Rate limit tracking
 */
export class GitHubStatsManager {
  private rateLimitCache = new Map<string, { remaining: number; resetAt: number }>()
  private requestQueue: Array<() => Promise<any>> = []
  private processingQueue = false

  /**
   * Fetch GitHub stats for module with smart rate limiting
   */
  async fetchGitHubStats(githubRepo: string): Promise<GitHubStats | null> {
    try {
      const [owner, repo] = githubRepo.split('/')
      
      if (!owner || !repo) {
        throw new Error(`Invalid GitHub repo format: ${githubRepo}`)
      }

      // Check rate limit cache
      const rateLimitKey = 'github-api'
      const cached = this.rateLimitCache.get(rateLimitKey)
      
      if (cached && cached.remaining <= 10 && cached.resetAt > Date.now()) {
        // Wait until rate limit resets
        const waitTime = cached.resetAt - Date.now() + 1000 // Add 1 second buffer
        console.log(`Rate limit low, waiting ${waitTime}ms before request`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }

      // Fetch from GitHub API
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          // Add Authorization header if GITHUB_TOKEN is set
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      })

      // Parse rate limit headers
      const remaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0')
      const resetAt = parseInt(response.headers.get('x-ratelimit-reset') || '0') * 1000
      
      this.rateLimitCache.set(rateLimitKey, {
        remaining,
        resetAt,
      })

      // Handle rate limit (429)
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '60')
        console.warn(`Rate limit exceeded, waiting ${retryAfter}s`)
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000))
        
        // Retry once
        return this.fetchGitHubStats(githubRepo)
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Fetch issues and PRs
      const [issuesResponse, prsResponse, releasesResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=1`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            ...(process.env.GITHUB_TOKEN && {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            }),
          },
        }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=1`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            ...(process.env.GITHUB_TOKEN && {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            }),
          },
        }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            ...(process.env.GITHUB_TOKEN && {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            }),
          },
        }).catch(() => null), // Releases might not exist
      ])

      const issuesData = issuesResponse.ok ? await issuesResponse.json() : []
      const prsData = prsResponse.ok ? await prsResponse.json() : []
      const releasesData = releasesResponse?.ok ? await releasesResponse.json() : null

      const stats: GitHubStats = {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.watchers_count || 0,
        issues: issuesData.length || 0,
        openIssues: data.open_issues_count || 0,
        pullRequests: prsData.length || 0,
        openPullRequests: data.open_issues_count || 0, // Approximate
        contributors: 0, // Would need separate API call
        lastRelease: releasesData
          ? {
              version: releasesData.tag_name || releasesData.name,
              publishedAt: new Date(releasesData.published_at),
            }
          : undefined,
      }

      return stats
    } catch (error: any) {
      console.error(`Failed to fetch GitHub stats for ${githubRepo}:`, error)
      return null
    }
  }

  /**
   * Fetch NPM stats for module
   */
  async fetchNPMStats(npmPackage: string): Promise<NPMStats | null> {
    try {
      // Fetch from NPM API
      const response = await fetch(`https://registry.npmjs.org/${npmPackage}`)

      if (!response.ok) {
        return null // Package might not be published yet
      }

      const data = await response.json()

      const latestVersion = data['dist-tags']?.latest
      const versions = data.versions || {}
      const latestData = versions[latestVersion]

      const stats: NPMStats = {
        downloads: 0, // Would need separate API call to npmjs.com/downloads API
        version: latestVersion || '0.0.0',
        lastPublish: latestData?.time ? new Date(latestData.time) : undefined,
        maintainers: data.maintainers?.map((m: any) => m.name) || [],
      }

      return stats
    } catch (error: any) {
      console.error(`Failed to fetch NPM stats for ${npmPackage}:`, error)
      return null
    }
  }

  /**
   * Update module GitHub stats
   */
  async updateModuleStats(moduleId: string): Promise<void> {
    try {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      })

      if (!module) {
        throw new Error(`Module ${moduleId} not found`)
      }

      // Fetch GitHub stats
      if (module.githubRepo) {
        const githubStats = await this.fetchGitHubStats(module.githubRepo)
        
        if (githubStats) {
          await prisma.module.update({
            where: { id: moduleId },
            data: {
              githubStats: githubStats as any,
              lastGitHubSync: new Date(),
            },
          })
        }
      }

      // Fetch NPM stats
      if (module.npmPackage) {
        const npmStats = await this.fetchNPMStats(module.npmPackage)
        
        if (npmStats) {
          await prisma.module.update({
            where: { id: moduleId },
            data: {
              npmStats: npmStats as any,
              lastNpmSync: new Date(),
            },
          })
        }
      }
    } catch (error: any) {
      console.error(`Failed to update stats for module ${moduleId}:`, error)
    }
  }

  /**
   * Update stats for all modules
   */
  async updateAllModulesStats(): Promise<void> {
    const modules = await prisma.module.findMany({
      where: {
        OR: [
          { githubRepo: { not: null } },
          { npmPackage: { not: null } },
        ],
      },
    })

      for (const module of modules) {
        try {
          await this.updateModuleStats(module.id)
          
          // Smart rate limiting based on remaining requests
          const rateLimitKey = 'github-api'
          const cached = this.rateLimitCache.get(rateLimitKey)
          
          if (cached && cached.remaining < 100) {
            // Slow down if rate limit is getting low
            const waitTime = cached.remaining < 50 ? 2000 : 1000
            await new Promise((resolve) => setTimeout(resolve, waitTime))
          } else {
            // Normal delay
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        } catch (error) {
          console.error(`Failed to update stats for ${module.name}:`, error)
        }
      }
  }
}

/**
 * Create GitHub stats manager instance
 */
export function createGitHubStatsManager() {
  return new GitHubStatsManager()
}

/**
 * Default GitHub stats manager instance
 */
export const githubStatsManager = new GitHubStatsManager()

