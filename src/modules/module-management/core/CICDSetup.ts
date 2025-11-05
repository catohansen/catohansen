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
 * CI/CD Setup Manager
 * Automatically sets up CI/CD workflows for modules
 * 
 * Features:
 * - GitHub Actions workflow generation
 * - Test setup configuration
 * - Deployment pipeline setup
 * - Environment configuration
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { prisma } from '@/lib/db/prisma'

export interface CICDConfig {
  moduleId: string
  moduleName: string
  testFramework?: 'jest' | 'vitest' | 'mocha'
  deployment?: 'vercel' | 'netlify' | 'self-hosted'
  environment?: Record<string, string>
}

export interface CICDSetupResult {
  success: boolean
  workflowPath?: string
  testConfigPath?: string
  error?: string
}

/**
 * CI/CD Setup Manager
 * Generates CI/CD configurations for modules
 */
export class CICDSetup {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Setup CI/CD for module
   */
  async setupCICD(config: CICDConfig): Promise<CICDSetupResult> {
    try {
      const module = await prisma.module.findUnique({
        where: { id: config.moduleId },
      })

      if (!module) {
        return {
          success: false,
          error: `Module ${config.moduleId} not found`,
        }
      }

      // Create workflows directory if it doesn't exist
      const workflowsDir = path.join(this.rootPath, '.github', 'workflows')
      await fs.mkdir(workflowsDir, { recursive: true })

      // Generate GitHub Actions workflow
      const workflowContent = this.generateWorkflow(config, module)
      const workflowPath = path.join(
        workflowsDir,
        `module-${module.name}.yml`
      )
      await fs.writeFile(workflowPath, workflowContent, 'utf-8')

      // Generate test config if needed
      let testConfigPath: string | undefined
      if (config.testFramework) {
        const testConfig = this.generateTestConfig(
          config,
          module.name
        )
        testConfigPath = path.join(
          this.rootPath,
          'src/modules',
          module.name,
          `${config.testFramework}.config.js`
        )
        await fs.writeFile(testConfigPath, testConfig, 'utf-8')
      }

      // Create environment template
      if (config.environment && Object.keys(config.environment).length > 0) {
        const envTemplate = this.generateEnvTemplate(config.environment)
        const envPath = path.join(
          this.rootPath,
          'src/modules',
          module.name,
          '.env.example'
        )
        await fs.writeFile(envPath, envTemplate, 'utf-8')
      }

      return {
        success: true,
        workflowPath,
        testConfigPath,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to setup CI/CD',
      }
    }
  }

  /**
   * Generate GitHub Actions workflow
   */
  private generateWorkflow(config: CICDConfig, module: any): string {
    const modulePath = `src/modules/${config.moduleName}`

    return `name: ${config.moduleName} CI/CD

on:
  push:
    branches: [main]
    paths:
      - '${modulePath}/**'
  pull_request:
    branches: [main]
    paths:
      - '${modulePath}/**'
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        working-directory: ${modulePath}
        run: npm test
      
      - name: Run linting
        working-directory: ${modulePath}
        run: npm run lint || true
      
      - name: Check build
        working-directory: ${modulePath}
        run: npm run build || true

  sync:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Sync to GitHub
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          MODULE_PATH="${modulePath}"
          GITHUB_REPO="${module.githubRepo || 'owner/repo'}"
          
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          
          git subtree push --prefix=\$MODULE_PATH https://github.com/\$GITHUB_REPO.git main || true
`
  }

  /**
   * Generate test config
   */
  private generateTestConfig(config: CICDConfig, moduleName: string): string {
    const configs: Record<string, string> = {
      jest: `module.exports = {
  displayName: '${moduleName}',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
`,
      vitest: `import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: '${moduleName}',
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
})
`,
      mocha: `module.exports = {
  require: ['ts-node/register'],
  extension: ['ts'],
  spec: ['src/**/*.test.ts'],
  timeout: 10000,
}
`,
    }

    return configs[config.testFramework || 'jest'] || configs.jest
  }

  /**
   * Generate environment template
   */
  private generateEnvTemplate(environment: Record<string, string>): string {
    const lines = Object.entries(environment)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
    return `# Environment variables for module
# Copy this file to .env and fill in actual values

${lines}
`
  }
}

/**
 * Create CI/CD setup instance
 */
export function createCICDSetup(rootPath?: string) {
  return new CICDSetup(rootPath)
}

/**
 * Default CI/CD setup instance
 */
export const cicdSetup = new CICDSetup()





