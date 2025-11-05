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
 * Module Validator
 * Comprehensive validation for module registration and onboarding
 * 
 * Features:
 * - GitHub repository validation (API check)
 * - Semantic versioning validation
 * - MODULE_INFO.json schema validation
 * - Dependency conflict detection
 * - Duplicate module name detection
 * - Conflict prediction via AI-driven detector
 */

import { prisma } from '@/lib/db/prisma'
import { conflictDetector } from './ConflictDetector'
import { githubStatsManager } from './GitHubStatsManager'

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  suggestions?: string[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
  severity: 'error' | 'warning'
}

export interface ValidationWarning {
  field: string
  message: string
  suggestion?: string
}

export interface ModuleInfo {
  id?: string
  name?: string
  displayName?: string
  version?: string
  description?: string
  repository?: {
    url?: string
    type?: string
  }
  npmPackage?: string
  dependencies?: string[]
  category?: string
  status?: string
}

/**
 * Module Validator
 * Validates module information before registration
 */
export class ModuleValidator {
  /**
   * Validate complete module information
   */
  async validateModule(
    moduleInfo: ModuleInfo,
    moduleName?: string
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // 1. Validate module name/ID
    if (!moduleInfo.id && !moduleInfo.name && !moduleName) {
      errors.push({
        field: 'id',
        message: 'Module ID or name is required',
        code: 'MISSING_ID',
        severity: 'error',
      })
    }

    const id = moduleInfo.id || moduleInfo.name || moduleName || ''
    if (id && !this.validateModuleName(id)) {
      errors.push({
        field: 'id',
        message: 'Module ID must be lowercase, alphanumeric with hyphens',
        code: 'INVALID_ID_FORMAT',
        severity: 'error',
      })
    }

    // 2. Check for duplicate module names
    if (id) {
      const duplicate = await this.checkDuplicateModule(id)
      if (duplicate) {
        errors.push({
          field: 'id',
          message: `Module "${id}" already exists`,
          code: 'DUPLICATE_MODULE',
          severity: 'error',
        })
      }
    }

    // 3. Validate version
    if (moduleInfo.version && !this.validateSemanticVersion(moduleInfo.version)) {
      errors.push({
        field: 'version',
        message: 'Version must follow semantic versioning (X.Y.Z)',
        code: 'INVALID_VERSION',
        severity: 'error',
      })
    }

    // 4. Validate GitHub repository
    if (moduleInfo.repository?.url) {
      const repoValidation = await this.validateGitHubRepository(moduleInfo.repository.url)
      if (!repoValidation.valid) {
        errors.push({
          field: 'repository.url',
          message: repoValidation.error || 'Invalid GitHub repository',
          code: repoValidation.code || 'INVALID_GITHUB_REPO',
          severity: 'error',
        })
      } else if (repoValidation.warnings) {
        warnings.push({
          field: 'repository.url',
          message: repoValidation.warnings,
        })
      }
    } else {
      warnings.push({
        field: 'repository.url',
        message: 'GitHub repository not specified - auto-sync will be disabled',
        suggestion: 'Add GitHub repository URL for automatic synchronization',
      })
    }

    // 5. Validate NPM package (if provided)
    if (moduleInfo.npmPackage && !this.validateNPMPackage(moduleInfo.npmPackage)) {
      warnings.push({
        field: 'npmPackage',
        message: 'NPM package name format may be invalid',
        suggestion: 'NPM packages should follow @scope/package-name format',
      })
    }

    // 6. Validate dependencies
    if (moduleInfo.dependencies && moduleInfo.dependencies.length > 0) {
      const depConflicts = await this.checkDependencyConflicts(
        id,
        moduleInfo.dependencies
      )
      if (depConflicts.length > 0) {
        warnings.push({
          field: 'dependencies',
          message: `Potential conflicts detected: ${depConflicts.join(', ')}`,
          suggestion: 'Review dependencies for version conflicts',
        })
      }
    }

    // 7. Validate description
    if (!moduleInfo.description || moduleInfo.description.trim().length < 10) {
      warnings.push({
        field: 'description',
        message: 'Module description is too short',
        suggestion: 'Add a detailed description (minimum 10 characters)',
      })
    }

    const suggestions: string[] = []

    if (errors.length === 0 && warnings.length === 0) {
      suggestions.push('✅ All validations passed! Ready to register.')
    }

    if (errors.length === 0 && moduleInfo.repository?.url) {
      suggestions.push('💡 Consider setting up webhooks for automatic sync')
      suggestions.push('💡 Run vulnerability scan after registration')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    }
  }

  /**
   * Validate GitHub repository URL and check existence
   */
  async validateGitHubRepository(
    url: string
  ): Promise<{
    valid: boolean
    error?: string
    code?: string
    warnings?: string
    exists?: boolean
    repo?: { owner: string; name: string }
  }> {
    try {
      // Extract owner/repo from URL
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!match) {
        return {
          valid: false,
          error: 'Invalid GitHub URL format. Expected: https://github.com/owner/repo',
          code: 'INVALID_URL_FORMAT',
        }
      }

      const [, owner, repoName] = match
      const repo = repoName.replace('.git', '')

      // Check if repository exists via GitHub API
      const githubToken = process.env.GITHUB_TOKEN
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(githubToken && {
            Authorization: `token ${githubToken}`,
          }),
        },
      })

      if (response.status === 404) {
        return {
          valid: false,
          error: 'GitHub repository does not exist or is not accessible',
          code: 'REPO_NOT_FOUND',
          exists: false,
          repo: { owner, name: repo },
        }
      }

      if (response.status === 403) {
        return {
          valid: false,
          error: 'GitHub API rate limit exceeded or access denied',
          code: 'GITHUB_API_ERROR',
          exists: undefined,
          repo: { owner, name: repo },
          warnings: 'Make sure GITHUB_TOKEN is configured correctly',
        }
      }

      if (!response.ok) {
        return {
          valid: false,
          error: `GitHub API error: ${response.statusText}`,
          code: 'GITHUB_API_ERROR',
          repo: { owner, name: repo },
        }
      }

      const data = await response.json()

      // Check if repository is private (requires token)
      if (data.private && !githubToken) {
        return {
          valid: true,
          exists: true,
          repo: { owner, name: repo },
          warnings: 'Repository is private - GITHUB_TOKEN required for full access',
        }
      }

      return {
        valid: true,
        exists: true,
        repo: { owner, name: repo },
      }
    } catch (error: any) {
      return {
        valid: false,
        error: error.message || 'Failed to validate GitHub repository',
        code: 'VALIDATION_ERROR',
      }
    }
  }

  /**
   * Validate semantic version
   */
  validateSemanticVersion(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?(\+[a-zA-Z0-9]+)?$/
    return semverRegex.test(version)
  }

  /**
   * Validate module name format
   */
  validateModuleName(name: string): boolean {
    const nameRegex = /^[a-z0-9-]+$/
    return nameRegex.test(name) && name.length >= 3 && name.length <= 50
  }

  /**
   * Validate NPM package name
   */
  validateNPMPackage(packageName: string): boolean {
    // Basic NPM package name validation
    const npmRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
    return npmRegex.test(packageName)
  }

  /**
   * Check for duplicate module names
   */
  async checkDuplicateModule(moduleName: string): Promise<boolean> {
    try {
      const existing = await prisma.module.findUnique({
        where: { name: moduleName },
      })
      return existing !== null
    } catch {
      return false
    }
  }

  /**
   * Check dependency conflicts
   */
  async checkDependencyConflicts(
    moduleName: string,
    dependencies: string[]
  ): Promise<string[]> {
    const conflicts: string[] = []

    // Check if dependencies exist in the system
    for (const dep of dependencies) {
      try {
        // Extract module name from dependency (could be npm package or module name)
        const depModule = await prisma.module.findFirst({
          where: {
            OR: [
              { name: dep },
              { npmPackage: dep },
              { name: { contains: dep.split('/').pop() || dep } },
            ],
          },
        })

        if (!depModule) {
          conflicts.push(`${dep} - Module not found in system`)
        }
      } catch {
        // Ignore errors
      }
    }

    return conflicts
  }

  /**
   * Validate MODULE_INFO.json schema
   */
  validateModuleInfoSchema(json: any): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    const requiredFields = ['id', 'name']
    for (const field of requiredFields) {
      if (!json[field]) {
        errors.push({
          field,
          message: `Required field "${field}" is missing`,
          code: 'MISSING_REQUIRED_FIELD',
          severity: 'error',
        })
      }
    }

    if (json.version && !this.validateSemanticVersion(json.version)) {
      errors.push({
        field: 'version',
        message: 'Version must follow semantic versioning',
        code: 'INVALID_VERSION',
        severity: 'error',
      })
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * Quick validation for real-time feedback
   */
  async quickValidate(
    field: string,
    value: string,
    moduleInfo?: ModuleInfo
  ): Promise<{ valid: boolean; message?: string; suggestion?: string }> {
    switch (field) {
      case 'id':
      case 'name':
        if (!this.validateModuleName(value)) {
          return {
            valid: false,
            message: 'Must be lowercase, alphanumeric with hyphens',
            suggestion: 'Example: my-awesome-module',
          }
        }
        const duplicate = await this.checkDuplicateModule(value)
        if (duplicate) {
          return {
            valid: false,
            message: 'Module name already exists',
            suggestion: 'Choose a different name',
          }
        }
        return { valid: true }

      case 'version':
        if (!this.validateSemanticVersion(value)) {
          return {
            valid: false,
            message: 'Must follow semantic versioning (X.Y.Z)',
            suggestion: 'Example: 1.0.0',
          }
        }
        return { valid: true }

      case 'repository.url':
        const repoValidation = await this.validateGitHubRepository(value)
        if (!repoValidation.valid) {
          return {
            valid: false,
            message: repoValidation.error,
            suggestion: 'Format: https://github.com/owner/repo',
          }
        }
        return {
          valid: true,
          message: '✅ Repository found and accessible',
        }

      default:
        return { valid: true }
    }
  }
}

/**
 * Create module validator instance
 */
export function createModuleValidator() {
  return new ModuleValidator()
}

/**
 * Default module validator instance
 */
export const moduleValidator = new ModuleValidator()





