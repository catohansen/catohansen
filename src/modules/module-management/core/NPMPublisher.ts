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
 * NPM Publisher
 * Handles publishing modules to NPM
 * 
 * Features:
 * - Package.json validation
 * - NPM package name availability check
 * - Automatic versioning
 * - Publishing with changelog
 * - Update tracking
 */

import { prisma } from '@/lib/db/prisma'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'

const execAsync = promisify(exec)

export interface NPMPublishOptions {
  moduleId: string
  version?: string
  access?: 'public' | 'restricted'
  tag?: string
  dryRun?: boolean
}

export interface NPMPublishResult {
  success: boolean
  packageName?: string
  version?: string
  npmUrl?: string
  error?: string
}

/**
 * NPM Publisher
 * Handles NPM publishing operations
 */
export class NPMPublisher {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Check if NPM package name is available
   */
  async checkPackageNameAvailability(
    packageName: string
  ): Promise<{ available: boolean; error?: string }> {
    try {
      // Check NPM registry
      const response = await fetch(`https://registry.npmjs.org/${packageName}`, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.status === 404) {
        // Package doesn't exist, available
        return { available: true }
      }

      if (response.ok) {
        // Package exists, not available
        const data = await response.json()
        return {
          available: false,
          error: `Package "${packageName}" already exists on NPM. Current version: ${data['dist-tags']?.latest || 'unknown'}`,
        }
      }

      // API error
      return {
        available: false,
        error: 'Failed to check package availability',
      }
    } catch (error: any) {
      return {
        available: false,
        error: error.message || 'Failed to check package availability',
      }
    }
  }

  /**
   * Validate package.json
   */
  async validatePackageJson(
    moduleName: string
  ): Promise<{ valid: boolean; errors: string[]; packageJson?: any }> {
    try {
      const packageJsonPath = path.join(
        this.rootPath,
        'src/modules',
        moduleName,
        'package.json'
      )

      // Check if package.json exists
      try {
        await fs.access(packageJsonPath)
      } catch {
        return {
          valid: false,
          errors: ['package.json not found in module directory'],
        }
      }

      // Read and parse package.json
      const content = await fs.readFile(packageJsonPath, 'utf-8')
      const packageJson = JSON.parse(content)

      const errors: string[] = []

      // Validate required fields
      if (!packageJson.name) {
        errors.push('package.json missing "name" field')
      }
      if (!packageJson.version) {
        errors.push('package.json missing "version" field')
      }
      if (!packageJson.description) {
        errors.push('package.json missing "description" field')
      }

      // Validate name format
      if (packageJson.name && !this.isValidNPMPackageName(packageJson.name)) {
        errors.push(
          'package.json "name" must follow NPM naming conventions (@scope/package-name or package-name)'
        )
      }

      // Validate version format
      if (
        packageJson.version &&
        !this.isValidSemanticVersion(packageJson.version)
      ) {
        errors.push(
          'package.json "version" must follow semantic versioning (X.Y.Z)'
        )
      }

      return {
        valid: errors.length === 0,
        errors,
        packageJson,
      }
    } catch (error: any) {
      return {
        valid: false,
        errors: [error.message || 'Failed to validate package.json'],
      }
    }
  }

  /**
   * Publish module to NPM
   */
  async publishToNPM(
    options: NPMPublishOptions
  ): Promise<NPMPublishResult> {
    try {
      const module = await prisma.module.findUnique({
        where: { id: options.moduleId },
      })

      if (!module) {
        return {
          success: false,
          error: `Module ${options.moduleId} not found`,
        }
      }

      const modulePath = path.join(
        this.rootPath,
        'src/modules',
        module.name
      )

      // Validate package.json
      const validation = await this.validatePackageJson(module.name)
      if (!validation.valid || !validation.packageJson) {
        return {
          success: false,
          error: `package.json validation failed: ${validation.errors.join(', ')}`,
        }
      }

      const packageName = validation.packageJson.name
      const packageVersion = options.version || validation.packageJson.version

      // Check package name availability
      const availability = await this.checkPackageNameAvailability(packageName)
      if (!availability.available) {
        return {
          success: false,
          error: availability.error || 'Package name not available',
        }
      }

      // Update package.json version if provided
      if (options.version && options.version !== validation.packageJson.version) {
        validation.packageJson.version = options.version
        const packageJsonPath = path.join(modulePath, 'package.json')
        await fs.writeFile(
          packageJsonPath,
          JSON.stringify(validation.packageJson, null, 2)
        )
      }

      // Publish to NPM
      if (!options.dryRun) {
        const publishCommand = `npm publish ${modulePath} --access=${options.access || 'public'} ${options.tag ? `--tag=${options.tag}` : ''}`

        try {
          const { stdout, stderr } = await execAsync(publishCommand, {
            cwd: this.rootPath,
            env: {
              ...process.env,
              NPM_TOKEN: process.env.NPM_TOKEN, // NPM token for authentication
            },
          })

          if (stderr && !stderr.includes('npm notice')) {
            throw new Error(stderr)
          }

          // Update module in database
          await prisma.module.update({
            where: { id: options.moduleId },
            data: {
              version: packageVersion,
              npmStats: {
                downloads: 0,
                version: packageVersion,
                lastPublish: new Date(),
              },
              lastNpmSync: new Date(),
            },
          })

          return {
            success: true,
            packageName,
            version: packageVersion,
            npmUrl: `https://www.npmjs.com/package/${packageName}`,
          }
        } catch (error: any) {
          return {
            success: false,
            error: error.message || 'Failed to publish to NPM',
          }
        }
      } else {
        // Dry run
        return {
          success: true,
          packageName,
          version: packageVersion,
          npmUrl: `https://www.npmjs.com/package/${packageName}`,
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to publish to NPM',
      }
    }
  }

  /**
   * Validate NPM package name
   */
  private isValidNPMPackageName(name: string): boolean {
    // NPM package name rules:
    // - Can start with @scope/ for scoped packages
    // - Otherwise lowercase, alphanumeric, hyphens, underscores
    // - Max 214 characters
    const npmNameRegex =
      /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
    return npmNameRegex.test(name) && name.length <= 214
  }

  /**
   * Validate semantic version
   */
  private isValidSemanticVersion(version: string): boolean {
    const semverRegex =
      /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?(\+[a-zA-Z0-9]+)?$/
    return semverRegex.test(version)
  }

  /**
   * Get NPM package stats
   */
  async getNPMPackageStats(
    packageName: string
  ): Promise<{
    downloads?: number
    version?: string
    lastPublish?: Date
    maintainers?: string[]
  } | null> {
    try {
      const response = await fetch(
        `https://registry.npmjs.org/${packageName}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      const latestVersion =
        data['dist-tags']?.latest || Object.keys(data.versions).pop()
      const versionData = data.versions[latestVersion]

      return {
        downloads: 0, // Would need npm API for actual downloads
        version: latestVersion,
        lastPublish: versionData?.time
          ? new Date(versionData.time)
          : undefined,
        maintainers: versionData?.maintainers?.map((m: any) => m.name) || [],
      }
    } catch {
      return null
    }
  }
}

/**
 * Create NPM publisher instance
 */
export function createNPMPublisher(rootPath?: string) {
  return new NPMPublisher(rootPath)
}

/**
 * Default NPM publisher instance
 */
export const npmPublisher = new NPMPublisher()





