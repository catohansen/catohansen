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
 * Version Manager
 * Intelligent semantic versioning with auto-bump based on commit messages
 * Inspired by semantic-release and conventional commits
 */

import { prisma } from '@/lib/db/prisma'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
// Simple semver implementation (or use semver package if installed)
const semver = {
  valid: (version: string) => {
    // Simple version validation
    return /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?/.test(version) ? version : null
  },
  inc: (version: string, release: string, prereleaseId?: string) => {
    if (!semver.valid(version)) return null
    const [major, minor, patch, ...rest] = version.split('.')
    const patchNum = parseInt(patch || '0')
    const minorNum = parseInt(minor || '0')
    const majorNum = parseInt(major || '0')
    
    if (release === 'major') return `${majorNum + 1}.0.0`
    if (release === 'minor') return `${majorNum}.${minorNum + 1}.0`
    if (release === 'patch') return `${majorNum}.${minorNum}.${patchNum + 1}`
    if (release === 'prerelease') {
      const preId = prereleaseId || 'beta'
      return `${majorNum}.${minorNum}.${patchNum + 1}-${preId}.0`
    }
    return null
  },
  diff: (oldVersion: string, newVersion: string) => {
    const [oldMajor, oldMinor, oldPatch] = oldVersion.split('.').map(Number)
    const [newMajor, newMinor, newPatch] = newVersion.split('.').map(Number)
    
    if (newMajor > oldMajor) return 'major'
    if (newMinor > oldMinor) return 'minor'
    if (newPatch > oldPatch) return 'patch'
    return 'patch'
  },
}

const execAsync = promisify(exec)

export interface VersionBumpOptions {
  type?: 'major' | 'minor' | 'patch' | 'auto'
  prerelease?: boolean
  prereleaseId?: string
  commitMessage?: string
  createGitTag?: boolean
  updateDependents?: boolean
}

export interface VersionBumpResult {
  success: boolean
  moduleId: string
  oldVersion: string
  newVersion: string
  type: 'major' | 'minor' | 'patch' | 'prerelease'
  changes?: {
    commits: string[]
    breaking: boolean
    features: number
    fixes: number
  }
  error?: string
}

/**
 * Version Manager
 * Handles semantic versioning for modules
 */
export class VersionManager {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Auto-bump version based on commit messages
   * Uses Conventional Commits format:
   * - feat: → minor bump
   * - fix: → patch bump
   * - BREAKING: → major bump
   */
  async autoBumpVersion(
    moduleId: string,
    options: VersionBumpOptions = {}
  ): Promise<VersionBumpResult> {
    try {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      })

      if (!module) {
        throw new Error(`Module ${moduleId} not found`)
      }

      const oldVersion = module.version

      // Analyze commit history
      const commitAnalysis = await this.analyzeCommits(
        module.name,
        module.lastSynced || undefined
      )

      // Determine version bump type
      let bumpType: 'major' | 'minor' | 'patch' | 'prerelease'
      
      if (options.type && options.type !== 'auto') {
        bumpType = options.type
      } else {
        bumpType = this.determineBumpType(commitAnalysis)
      }

      // Calculate new version
      const newVersion = options.prerelease
        ? semver.inc(oldVersion, `prerelease`, options.prereleaseId || 'beta') || oldVersion
        : semver.inc(oldVersion, bumpType) || oldVersion

      if (newVersion === oldVersion) {
        return {
          success: false,
          moduleId,
          oldVersion,
          newVersion: oldVersion,
          type: bumpType,
          error: 'No version change needed',
        }
      }

      // Update version in database
      await prisma.module.update({
        where: { id: moduleId },
        data: { version: newVersion },
      })

      // Update MODULE_INFO.json
      await this.updateModuleInfo(module.name, newVersion)

      // Create git tag if requested
      if (options.createGitTag !== false) {
        const tag = `v${newVersion}`
        await execAsync(`git tag ${tag} -m "Release ${newVersion}"`, {
          cwd: this.rootPath,
        })
      }

      // Update dependent modules if requested
      if (options.updateDependents) {
        await this.updateDependentModules(moduleId, newVersion)
      }

      return {
        success: true,
        moduleId,
        oldVersion,
        newVersion,
        type: bumpType,
        changes: commitAnalysis,
      }
    } catch (error: any) {
      return {
        success: false,
        moduleId,
        oldVersion: '',
        newVersion: '',
        type: 'patch',
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Manually bump version
   */
  async bumpVersion(
    moduleId: string,
    newVersion: string,
    options: {
      createGitTag?: boolean
      updateDependents?: boolean
      releaseNotes?: string
    } = {}
  ): Promise<VersionBumpResult> {
    try {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      })

      if (!module) {
        throw new Error(`Module ${moduleId} not found`)
      }

      const oldVersion = module.version

      // Validate version
      if (!semver.valid(newVersion)) {
        throw new Error(`Invalid version: ${newVersion}`)
      }

      // Update version in database
      await prisma.module.update({
        where: { id: moduleId },
        data: { version: newVersion },
      })

      // Update MODULE_INFO.json
      await this.updateModuleInfo(module.name, newVersion)

      // Create release record
      const release = await prisma.moduleRelease.create({
        data: {
          moduleId,
          version: newVersion,
          tag: `v${newVersion}`,
          changelog: options.releaseNotes,
          published: false,
        },
      })

      // Create git tag if requested
      if (options.createGitTag !== false) {
        await execAsync(
          `git tag ${release.tag} -m "${options.releaseNotes || `Release ${newVersion}`}"`,
          { cwd: this.rootPath }
        )
      }

      // Update dependent modules if requested
      if (options.updateDependents) {
        await this.updateDependentModules(moduleId, newVersion)
      }

      return {
        success: true,
        moduleId,
        oldVersion,
        newVersion,
        type: this.getVersionTypeChange(oldVersion, newVersion),
      }
    } catch (error: any) {
      return {
        success: false,
        moduleId,
        oldVersion: '',
        newVersion: '',
        type: 'patch',
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Analyze commits to determine version bump
   */
  private async analyzeCommits(
    moduleName: string,
    since?: Date
  ): Promise<{
    commits: string[]
    breaking: boolean
    features: number
    fixes: number
  }> {
    try {
      const sinceDate = since
        ? `--since="${since.toISOString()}"`
        : ''

      const { stdout } = await execAsync(
        `git log --pretty=format:"%s" ${sinceDate} -- "src/modules/${moduleName}/" || echo ""`,
        { cwd: this.rootPath }
      )

      const commits = stdout
        .split('\n')
        .filter((line) => line.trim())
        .map((commit) => commit.trim())

      let breaking = false
      let features = 0
      let fixes = 0

      for (const commit of commits) {
        const lowerCommit = commit.toLowerCase()

        // Check for breaking changes
        if (lowerCommit.includes('breaking') || lowerCommit.includes('!:')) {
          breaking = true
        }

        // Count features
        if (lowerCommit.startsWith('feat') || lowerCommit.includes(':feat')) {
          features++
        }

        // Count fixes
        if (lowerCommit.startsWith('fix') || lowerCommit.includes(':fix')) {
          fixes++
        }
      }

      return {
        commits,
        breaking,
        features,
        fixes,
      }
    } catch {
      return {
        commits: [],
        breaking: false,
        features: 0,
        fixes: 0,
      }
    }
  }

  /**
   * Determine bump type from commit analysis
   */
  private determineBumpType(analysis: {
    breaking: boolean
    features: number
    fixes: number
  }): 'major' | 'minor' | 'patch' {
    if (analysis.breaking) {
      return 'major'
    }
    if (analysis.features > 0) {
      return 'minor'
    }
    if (analysis.fixes > 0) {
      return 'patch'
    }
    return 'patch' // Default to patch if no changes detected
  }

  /**
   * Get version type change
   */
  private getVersionTypeChange(
    oldVersion: string,
    newVersion: string
  ): 'major' | 'minor' | 'patch' {
    const diff = semver.diff(oldVersion, newVersion)
    
    if (diff === 'major') return 'major'
    if (diff === 'minor') return 'minor'
    return 'patch'
  }

  /**
   * Update MODULE_INFO.json with new version
   */
  private async updateModuleInfo(moduleName: string, newVersion: string): Promise<void> {
    const moduleInfoPath = path.join(
      this.rootPath,
      'src/modules',
      moduleName,
      'MODULE_INFO.json'
    )

    try {
      const content = await fs.readFile(moduleInfoPath, 'utf-8')
      const info = JSON.parse(content)
      
      info.version = newVersion

      await fs.writeFile(
        moduleInfoPath,
        JSON.stringify(info, null, 2) + '\n',
        'utf-8'
      )
    } catch (error) {
      console.warn(`Failed to update MODULE_INFO.json for ${moduleName}:`, error)
    }
  }

  /**
   * Update dependent modules with new version
   */
  private async updateDependentModules(
    moduleId: string,
    newVersion: string
  ): Promise<void> {
    const dependents = await prisma.moduleDependency.findMany({
      where: { dependsOnId: moduleId },
      include: { module: true },
    })

    for (const dependency of dependents) {
      // Update dependency version constraint if needed
      // This is a simplified implementation
      console.log(
        `Would update dependency ${dependency.module.name} to use module@${newVersion}`
      )
    }
  }
}

/**
 * Create version manager instance
 */
export function createVersionManager(rootPath?: string) {
  return new VersionManager(rootPath)
}

/**
 * Default version manager instance
 */
export const versionManager = new VersionManager()

