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
 * Module Manager
 * Central module management system
 * Orchestrates sync, version, changelog, and stats management
 */

import { prisma } from '@/lib/db/prisma'
import { moduleSyncManager } from './ModuleSyncManager'
import { versionManager } from './VersionManager'
import { changelogGenerator } from './ChangelogGenerator'
import { githubStatsManager } from './GitHubStatsManager'
import * as fs from 'fs/promises'
import * as path from 'path'

export interface ModuleRegistration {
  name: string
  displayName: string
  description?: string
  githubRepo?: string
  githubUrl?: string
  npmPackage?: string
  version?: string
  category?: string
  status?: string
  autoSync?: boolean
  syncStrategy?: string
}

export interface ModuleHealth {
  buildStatus: 'PASSING' | 'FAILING' | 'PENDING' | 'UNKNOWN'
  testCoverage?: number
  lintStatus?: 'passing' | 'failing' | 'pending'
  dependenciesOutdated?: number
  vulnerabilities?: number
  buildTime?: number
  testTime?: number
  bundleSize?: number
}

/**
 * Module Manager
 * Central orchestrator for all module management operations
 */
export class ModuleManager {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Register module from MODULE_INFO.json
   */
  async registerModule(moduleName: string): Promise<{
    success: boolean
    moduleId?: string
    error?: string
  }> {
    try {
      const moduleInfoPath = path.join(
        this.rootPath,
        'src/modules',
        moduleName,
        'MODULE_INFO.json'
      )

      // Check if MODULE_INFO.json exists
      try {
        await fs.access(moduleInfoPath)
      } catch {
        return {
          success: false,
          error: `MODULE_INFO.json not found for module ${moduleName}`,
        }
      }

      // Read MODULE_INFO.json
      const content = await fs.readFile(moduleInfoPath, 'utf-8')
      const info = JSON.parse(content)

      // Extract GitHub repo from repository URL if provided
      let githubRepo: string | undefined
      let githubUrl: string | undefined
      
      if (info.repository?.url) {
        githubUrl = info.repository.url
        const match = githubUrl?.match(/github\.com\/([^\/]+)\/([^\/]+)/)
        if (match) {
          githubRepo = `${match[1]}/${match[2].replace('.git', '')}`
        }
      }

      // Create or update module in database
      const module = await prisma.module.upsert({
        where: { name: info.id || moduleName },
        update: {
          displayName: info.name || info.displayName || moduleName,
          description: info.description,
          githubRepo,
          githubUrl,
          npmPackage: info.api?.sdk || info.npmPackage,
          version: info.version || '1.0.0',
          category: info.category,
          status: info.status,
          standalone: info.standalone !== false,
          publishable: info.publishable !== false,
          license: info.license || 'PROPRIETARY',
        },
        create: {
          name: info.id || moduleName,
          displayName: info.name || info.displayName || moduleName,
          description: info.description,
          githubRepo,
          githubUrl,
          npmPackage: info.api?.sdk || info.npmPackage,
          version: info.version || '1.0.0',
          category: info.category,
          status: info.status,
          standalone: info.standalone !== false,
          publishable: info.publishable !== false,
          license: info.license || 'PROPRIETARY',
          autoSync: true,
          syncStrategy: 'subtree',
          syncStatus: 'PENDING',
          buildStatus: 'UNKNOWN',
        },
      })

      return {
        success: true,
        moduleId: module.id,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Register all modules from src/modules directory
   */
  async registerAllModules(): Promise<{
    success: number
    failed: number
    errors: Array<{ module: string; error: string }>
  }> {
    const modulesPath = path.join(this.rootPath, 'src/modules')
    
    try {
      const entries = await fs.readdir(modulesPath, { withFileTypes: true })
      const moduleDirs = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)

      let success = 0
      let failed = 0
      const errors: Array<{ module: string; error: string }> = []

      for (const moduleName of moduleDirs) {
        try {
          const result = await this.registerModule(moduleName)
          
          if (result.success) {
            success++
          } else {
            failed++
            errors.push({
              module: moduleName,
              error: result.error || 'Unknown error',
            })
          }
        } catch (error: any) {
          failed++
          errors.push({
            module: moduleName,
            error: error.message || 'Unknown error',
          })
        }
      }

      return { success, failed, errors }
    } catch (error: any) {
      return {
        success: 0,
        failed: 0,
        errors: [{ module: 'all', error: error.message || 'Unknown error' }],
      }
    }
  }

  /**
   * Get module health
   */
  async getModuleHealth(moduleId: string): Promise<ModuleHealth | null> {
    try {
      const healthCheck = await prisma.moduleHealthCheck.findFirst({
        where: { moduleId },
        orderBy: { checkedAt: 'desc' },
      })

      if (!healthCheck) {
        return null
      }

      return {
        buildStatus: healthCheck.buildPassing ? 'PASSING' : 'FAILING',
        testCoverage: healthCheck.coverage || undefined,
        lintStatus: healthCheck.lintPassing ? 'passing' : 'failing',
        dependenciesOutdated: healthCheck.dependenciesOutdated || undefined,
        vulnerabilities: healthCheck.vulnerabilities || undefined,
        buildTime: healthCheck.buildTime || undefined,
        testTime: healthCheck.testTime || undefined,
        bundleSize: healthCheck.bundleSize || undefined,
      }
    } catch {
      return null
    }
  }

  /**
   * Create release for module
   */
  async createRelease(
    moduleId: string,
    version: string,
    options: {
      changelog?: string
      releaseNotes?: string
      createGitTag?: boolean
      publishToNPM?: boolean
    } = {}
  ): Promise<{
    success: boolean
    releaseId?: string
    error?: string
  }> {
    try {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      })

      if (!module) {
        throw new Error(`Module ${moduleId} not found`)
      }

      // Generate changelog if not provided
      let changelog = options.changelog
      if (!changelog) {
        try {
          changelog = await changelogGenerator.generateChangelog(
            module.name,
            { toVersion: version }
          )
        } catch (error) {
          console.warn(`Failed to generate changelog for ${module.name}:`, error)
        }
      }

      // Create release record
      const release = await prisma.moduleRelease.create({
        data: {
          moduleId,
          version,
          tag: `v${version}`,
          changelog,
          releaseNotes: options.releaseNotes,
          published: false,
        },
      })

      // Bump version
      await versionManager.bumpVersion(moduleId, version, {
        createGitTag: options.createGitTag !== false,
        releaseNotes: options.releaseNotes || changelog || undefined,
      })

      // Sync to GitHub if enabled
      if (module.autoSync && module.githubRepo) {
        await moduleSyncManager.syncToGitHub(moduleId, {
          commitMessage: `chore: release ${version}`,
        })
      }

      return {
        success: true,
        releaseId: release.id,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }
}

/**
 * Create module manager instance
 */
export function createModuleManager(rootPath?: string) {
  return new ModuleManager(rootPath)
}

/**
 * Default module manager instance
 */
export const moduleManager = new ModuleManager()

