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
 * Auto Sync Manager
 * Periodically syncs modules between filesystem, database, and GitHub
 * 
 * Features:
 * - Auto-discovery of modules from filesystem
 * - Registration of missing modules
 * - Sync with GitHub
 * - Update module metadata
 * - Cache invalidation for public API
 */

import { prisma } from '@/lib/db/prisma'
import { moduleManager } from './ModuleManager'
import { moduleSyncManager } from './ModuleSyncManager'
import { githubStatsManager } from './GitHubStatsManager'
import * as fs from 'fs/promises'
import * as path from 'path'

export interface AutoSyncResult {
  success: boolean
  discovered: number
  registered: number
  synced: number
  errors: string[]
}

/**
 * Auto Sync Manager
 * Handles automatic synchronization of modules
 */
export class AutoSyncManager {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Run full auto-sync
   * Discovers, registers, and syncs all modules
   */
  async syncAll(): Promise<AutoSyncResult> {
    const errors: string[] = []
    let discovered = 0
    let registered = 0
    let synced = 0

    try {
      // 1. Discover all modules from filesystem
      const modules = await this.discoverAllModules()

      discovered = modules.length

      // 2. Register missing modules
      for (const moduleName of modules) {
        try {
          const result = await moduleManager.registerModule(moduleName)
          if (result.success) {
            registered++
          } else {
            errors.push(
              `Failed to register ${moduleName}: ${result.error || 'Unknown error'}`
            )
          }
        } catch (error: any) {
          errors.push(`Error registering ${moduleName}: ${error.message}`)
        }
      }

      // 3. Sync all modules with GitHub (if enabled)
      const dbModules = await prisma.module.findMany({
        where: { autoSync: true },
      })

      for (const module of dbModules) {
        try {
          const result = await moduleSyncManager.syncToGitHub(module.id, {
            force: false,
          })
          if (result.success) {
            synced++
          } else {
            errors.push(
              `Failed to sync ${module.name}: ${result.error || 'Unknown error'}`
            )
          }
        } catch (error: any) {
          errors.push(`Error syncing ${module.name}: ${error.message}`)
        }
      }

      // 4. Update GitHub/NPM stats for all modules
      await this.updateAllStats()

      return {
        success: errors.length === 0,
        discovered,
        registered,
        synced,
        errors,
      }
    } catch (error: any) {
      errors.push(`Auto-sync failed: ${error.message}`)
      return {
        success: false,
        discovered,
        registered,
        synced,
        errors,
      }
    }
  }

  /**
   * Discover all modules from filesystem
   */
  private async discoverAllModules(): Promise<string[]> {
    const modulesDir = path.join(this.rootPath, 'src/modules')
    const modules: string[] = []

    try {
      const dirs = await fs.readdir(modulesDir, { withFileTypes: true })

      for (const dir of dirs) {
        if (!dir.isDirectory()) continue

        const moduleName = dir.name

        // Skip hidden directories and node_modules
        if (moduleName.startsWith('.') || moduleName === 'node_modules') {
          continue
        }

        // Check if MODULE_INFO.json exists
        const moduleInfoPath = path.join(
          modulesDir,
          moduleName,
          'MODULE_INFO.json'
        )

        try {
          await fs.access(moduleInfoPath)
          modules.push(moduleName)
        } catch {
          // Module exists but no MODULE_INFO.json - still include it
          // This allows auto-registration even without MODULE_INFO.json
          modules.push(moduleName)
        }
      }
    } catch (error) {
      console.error('Error discovering modules:', error)
    }

    return modules
  }

  /**
   * Update GitHub and NPM stats for all modules
   */
  private async updateAllStats(): Promise<void> {
    const modules = await prisma.module.findMany({
      where: {
        OR: [{ githubUrl: { not: null } }, { npmPackage: { not: null } }],
      },
    })

    for (const module of modules) {
      try {
        // Update GitHub stats
        if (module.githubUrl || module.githubRepo) {
          const githubStats = await githubStatsManager.fetchGitHubStats(
            module.githubRepo || module.githubUrl || ''
          )

          if (githubStats) {
            await prisma.module.update({
              where: { id: module.id },
              data: {
                githubStats: {
                  stars: githubStats.stars || 0,
                  forks: githubStats.forks || 0,
                  openIssues: githubStats.openIssues || 0,
                  lastUpdated: new Date(),
                },
                lastSynced: new Date(),
              },
            })
          }
        }

        // Update NPM stats (if npmPackage exists)
        if (module.npmPackage) {
          const npmStats = await githubStatsManager.fetchNPMStats(
            module.npmPackage
          )

          if (npmStats) {
            await prisma.module.update({
              where: { id: module.id },
              data: {
                npmStats: {
                  downloads: npmStats.downloads || 0,
                  version: npmStats.version || module.version,
                  lastUpdated: new Date(),
                },
                lastNpmSync: new Date(),
              },
            })
          }
        }
      } catch (error) {
        console.error(`Failed to update stats for ${module.name}:`, error)
        // Continue with other modules
      }
    }
  }

  /**
   * Invalidate cache for public API
   * This triggers a refresh of the public module list
   */
  async invalidateCache(): Promise<void> {
    // In a real implementation, you would invalidate cache here
    // For now, we rely on cache headers in the API route
    console.log('Cache invalidated for public modules API')
  }
}

/**
 * Create auto sync manager instance
 */
export function createAutoSyncManager(rootPath?: string) {
  return new AutoSyncManager(rootPath)
}

/**
 * Default auto sync manager instance
 */
export const autoSyncManager = new AutoSyncManager()

