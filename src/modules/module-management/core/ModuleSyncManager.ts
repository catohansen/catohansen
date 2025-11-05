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
 * Module Sync Manager
 * Intelligent module synchronization between monorepo and GitHub repos
 * Inspired by Turborepo and Nx monorepo tools
 */

import { prisma } from '@/lib/db/prisma'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'

const execAsync = promisify(exec)

export interface SyncOptions {
  dryRun?: boolean
  force?: boolean
  commitMessage?: string
  branch?: string
}

export interface SyncResult {
  success: boolean
  moduleId: string
  direction: 'to-github' | 'from-github' | 'bidirectional'
  changes?: {
    files: string[]
    commits: string[]
    additions?: number
    deletions?: number
  }
  error?: string
  duration?: number
}

export interface ModuleInfo {
  id: string
  name: string
  path: string
  githubRepo?: string
  githubUrl?: string
  npmPackage?: string
  version: string
}

/**
 * Module Sync Manager
 * Handles bidirectional synchronization between monorepo and GitHub repos
 */
export class ModuleSyncManager {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Sync module to GitHub repo
   * Uses Git Subtree for efficient synchronization
   */
  async syncToGitHub(
    moduleId: string,
    options: SyncOptions = {}
  ): Promise<SyncResult> {
    const startTime = Date.now()

    try {
      // Get module info from database
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      })

      if (!module) {
        throw new Error(`Module ${moduleId} not found`)
      }

      if (!module.githubRepo) {
        throw new Error(`Module ${moduleId} does not have GitHub repo configured`)
      }

      const modulePath = path.join(this.rootPath, 'src/modules', module.name)
      
      // Check if module directory exists
      try {
        await fs.access(modulePath)
      } catch {
        throw new Error(`Module directory not found: ${modulePath}`)
      }

      // Get module changes
      const changes = await this.getModuleChanges(modulePath)

      if (changes.files.length === 0 && !options.force) {
        return {
          success: true,
          moduleId,
          direction: 'to-github',
          changes: {
            files: [],
            commits: [],
          },
          duration: Date.now() - startTime,
        }
      }

      if (options.dryRun) {
        return {
          success: true,
          moduleId,
          direction: 'to-github',
          changes,
          duration: Date.now() - startTime,
        }
      }

      // Update module status to SYNCING
      await prisma.module.update({
        where: { id: moduleId },
        data: { syncStatus: 'SYNCING' },
      })

      // Create sync log entry
      const syncLog = await prisma.moduleSync.create({
        data: {
          moduleId,
          direction: 'to-github',
          status: 'pending',
          branch: options.branch || module.githubBranch || 'main',
        },
      })

      try {
        // Check if remote exists
        let remoteExists = false
        try {
          const { stdout } = await execAsync(
            `git remote get-url ${module.name} 2>/dev/null || echo ""`
          )
          remoteExists = !!stdout.trim()
        } catch {
          remoteExists = false
        }

        // Add remote if not exists
        if (!remoteExists) {
          const githubUrl = module.githubUrl || `https://github.com/${module.githubRepo}.git`
          await execAsync(
            `git remote add ${module.name} ${githubUrl} || git remote set-url ${module.name} ${githubUrl}`
          )
        }

        // Use git subtree push for efficient sync
        const branch = options.branch || module.githubBranch || 'main'
        const commitMessage = options.commitMessage || `Sync ${module.displayName} to GitHub`
        
        // Push subtree to GitHub
        await execAsync(
          `git subtree push --prefix=src/modules/${module.name} ${module.name} ${branch}`,
          { cwd: this.rootPath }
        )

        // Update sync log
        await prisma.moduleSync.update({
          where: { id: syncLog.id },
          data: {
            status: 'success',
            changes: {
              files: changes.files,
              commits: changes.commits,
              additions: changes.additions,
              deletions: changes.deletions,
            },
            syncedBy: 'automated',
            duration: Date.now() - startTime,
          },
        })

        // Update module sync status
        await prisma.module.update({
          where: { id: moduleId },
          data: {
            lastSynced: new Date(),
            syncStatus: 'SYNCED',
            lastSyncError: null,
          },
        })

        return {
          success: true,
          moduleId,
          direction: 'to-github',
          changes,
          duration: Date.now() - startTime,
        }
      } catch (error: any) {
        // Update sync log with error
        await prisma.moduleSync.update({
          where: { id: syncLog.id },
          data: {
            status: 'error',
            error: error.message || 'Unknown error',
            duration: Date.now() - startTime,
          },
        })

        // Update module sync status
        await prisma.module.update({
          where: { id: moduleId },
          data: {
            syncStatus: 'ERROR',
            lastSyncError: error.message || 'Unknown error',
          },
        })

        throw error
      }
    } catch (error: any) {
      return {
        success: false,
        moduleId,
        direction: 'to-github',
        error: error.message || 'Unknown error',
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Sync module from GitHub repo
   * Pulls changes from GitHub repo back to monorepo
   */
  async syncFromGitHub(
    moduleId: string,
    options: SyncOptions = {}
  ): Promise<SyncResult> {
    const startTime = Date.now()

    try {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      })

      if (!module || !module.githubRepo) {
        throw new Error(`Module ${moduleId} not found or GitHub repo not configured`)
      }

      if (options.dryRun) {
        return {
          success: true,
          moduleId,
          direction: 'from-github',
          duration: Date.now() - startTime,
        }
      }

      // Create sync log entry
      const syncLog = await prisma.moduleSync.create({
        data: {
          moduleId,
          direction: 'from-github',
          status: 'pending',
          branch: options.branch || module.githubBranch || 'main',
        },
      })

      try {
        const branch = options.branch || module.githubBranch || 'main'

        // Pull subtree from GitHub
        await execAsync(
          `git subtree pull --prefix=src/modules/${module.name} ${module.name} ${branch} --squash`,
          { cwd: this.rootPath }
        )

        // Get changes
        const changes = await this.getModuleChanges(
          path.join(this.rootPath, 'src/modules', module.name)
        )

        // Update sync log
        await prisma.moduleSync.update({
          where: { id: syncLog.id },
          data: {
            status: 'success',
            changes,
            syncedBy: 'automated',
            duration: Date.now() - startTime,
          },
        })

        // Update module sync status
        await prisma.module.update({
          where: { id: moduleId },
          data: {
            lastSynced: new Date(),
            syncStatus: 'SYNCED',
            lastSyncError: null,
          },
        })

        return {
          success: true,
          moduleId,
          direction: 'from-github',
          changes,
          duration: Date.now() - startTime,
        }
      } catch (error: any) {
        await prisma.moduleSync.update({
          where: { id: syncLog.id },
          data: {
            status: 'error',
            error: error.message || 'Unknown error',
            duration: Date.now() - startTime,
          },
        })

        throw error
      }
    } catch (error: any) {
      return {
        success: false,
        moduleId,
        direction: 'from-github',
        error: error.message || 'Unknown error',
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Bidirectional sync (monorepo ↔ GitHub repo)
   */
  async bidirectionalSync(
    moduleId: string,
    options: SyncOptions = {}
  ): Promise<{
    toGitHub: SyncResult
    fromGitHub: SyncResult
  }> {
    const toGitHub = await this.syncToGitHub(moduleId, options)
    const fromGitHub = await this.syncFromGitHub(moduleId, options)

    return { toGitHub, fromGitHub }
  }

  /**
   * Get module changes (files and commits)
   */
  private async getModuleChanges(modulePath: string): Promise<{
    files: string[]
    commits: string[]
    additions?: number
    deletions?: number
  }> {
    try {
      // Get modified files in module directory
      const { stdout: filesOutput } = await execAsync(
        `git status --porcelain -- "src/modules/${path.basename(modulePath)}/" | awk '{print $2}' || echo ""`,
        { cwd: this.rootPath }
      )

      const files = filesOutput
        .split('\n')
        .filter((line) => line.trim())
        .map((file) => file.trim())

      // Get recent commits
      const { stdout: commitsOutput } = await execAsync(
        `git log --oneline --max-count=10 -- "src/modules/${path.basename(modulePath)}/" || echo ""`,
        { cwd: this.rootPath }
      )

      const commits = commitsOutput
        .split('\n')
        .filter((line) => line.trim())
        .map((commit) => commit.trim())

      // Get diff stats
      let additions = 0
      let deletions = 0

      try {
        const { stdout: diffStats } = await execAsync(
          `git diff --stat -- "src/modules/${path.basename(modulePath)}/" || echo ""`,
          { cwd: this.rootPath }
        )

        // Parse diff stats (simplified)
        const statsMatch = diffStats.match(/(\d+)\s+\+\s+(\d+)/)
        if (statsMatch) {
          additions = parseInt(statsMatch[1]) || 0
          deletions = parseInt(statsMatch[2]) || 0
        }
      } catch {
        // Ignore diff stats errors
      }

      return {
        files,
        commits,
        additions,
        deletions,
      }
    } catch (error) {
      return {
        files: [],
        commits: [],
      }
    }
  }

  /**
   * Get module info from MODULE_INFO.json
   */
  async getModuleInfo(moduleName: string): Promise<ModuleInfo | null> {
    try {
      const modulePath = path.join(
        this.rootPath,
        'src/modules',
        moduleName,
        'MODULE_INFO.json'
      )

      const content = await fs.readFile(modulePath, 'utf-8')
      const info = JSON.parse(content)

      // Get from database if exists
      const module = await prisma.module.findUnique({
        where: { name: moduleName },
      })

      return {
        id: module?.id || info.id || moduleName,
        name: info.id || moduleName,
        path: path.join('src/modules', moduleName),
        githubRepo: module?.githubRepo || info.repository?.url?.match(/github\.com\/([^\/]+)\/([^\/]+)/)?.[0]?.replace('github.com/', ''),
        githubUrl: module?.githubUrl || info.repository?.url,
        npmPackage: module?.npmPackage || info.api?.sdk,
        version: module?.version || info.version || '1.0.0',
      }
    } catch {
      return null
    }
  }

  /**
   * Sync all modules with auto-sync enabled
   */
  async syncAllModules(options: SyncOptions = {}): Promise<SyncResult[]> {
    const modules = await prisma.module.findMany({
      where: {
        autoSync: true,
        githubRepo: { not: null },
      },
    })

    const results: SyncResult[] = []

    for (const module of modules) {
      try {
        const result = await this.syncToGitHub(module.id, options)
        results.push(result)
      } catch (error: any) {
        results.push({
          success: false,
          moduleId: module.id,
          direction: 'to-github',
          error: error.message || 'Unknown error',
        })
      }
    }

    return results
  }
}

/**
 * Create module sync manager instance
 */
export function createModuleSyncManager(rootPath?: string) {
  return new ModuleSyncManager(rootPath)
}

/**
 * Default module sync manager instance
 */
export const moduleSyncManager = new ModuleSyncManager()

