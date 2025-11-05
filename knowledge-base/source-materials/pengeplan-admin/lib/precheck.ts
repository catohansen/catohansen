/**
 * Precheck Agent - Pre-deployment validation
 * Sjekker kodekvalitet, dependencies, build status
 */

import { AgentContext, AgentResult } from './manager'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class PrecheckAgent {
  async execute(context: AgentContext, step: any): Promise<AgentResult> {
    console.log(`[PrecheckAgent] Starting pre-deployment checks for ${context.deploymentId}`)
    
    const checks = await Promise.allSettled([
      this.checkLinting(),
      this.checkTypeScript(),
      this.checkDependencies(),
      this.checkBuild(),
      this.checkTests()
    ])

    const results = checks.map((check, index) => {
      if (check.status === 'fulfilled') {
        return check.value
      } else {
        return {
          name: ['linting', 'typescript', 'dependencies', 'build', 'tests'][index],
          status: 'error',
          message: check.reason?.message || 'Unknown error'
        }
      }
    })

    const hasErrors = results.some(r => r.status === 'error')
    const hasWarnings = results.some(r => r.status === 'warning')

    let status: 'success' | 'warning' | 'error' | 'blocking' = 'success'
    if (hasErrors) status = 'blocking'
    else if (hasWarnings) status = 'warning'

    const message = this.generateSummaryMessage(results)

    return {
      agent: 'precheck',
      status,
      message,
      data: {
        checks: results,
        timestamp: new Date().toISOString()
      },
      recommendations: this.generateRecommendations(results)
    }
  }

  private async checkLinting(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      const { stdout, stderr } = await execAsync('npm run lint')
      return {
        name: 'linting',
        status: 'success',
        message: 'Linting passed',
        details: { output: stdout }
      }
    } catch (error: any) {
      return {
        name: 'linting',
        status: 'error',
        message: 'Linting failed',
        details: { error: error.message, stderr: error.stderr }
      }
    }
  }

  private async checkTypeScript(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      const { stdout, stderr } = await execAsync('npx tsc --noEmit')
      return {
        name: 'typescript',
        status: 'success',
        message: 'TypeScript compilation passed',
        details: { output: stdout }
      }
    } catch (error: any) {
      return {
        name: 'typescript',
        status: 'error',
        message: 'TypeScript compilation failed',
        details: { error: error.message, stderr: error.stderr }
      }
    }
  }

  private async checkDependencies(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      const { stdout, stderr } = await execAsync('npm audit --audit-level=high')
      const hasVulnerabilities = stdout.includes('found') && stdout.includes('vulnerabilities')
      
      if (hasVulnerabilities) {
        return {
          name: 'dependencies',
          status: 'warning',
          message: 'High-severity vulnerabilities found',
          details: { output: stdout }
        }
      }
      
      return {
        name: 'dependencies',
        status: 'success',
        message: 'No high-severity vulnerabilities found',
        details: { output: stdout }
      }
    } catch (error: any) {
      return {
        name: 'dependencies',
        status: 'warning',
        message: 'Could not check dependencies',
        details: { error: error.message }
      }
    }
  }

  private async checkBuild(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      const { stdout, stderr } = await execAsync('npm run build')
      return {
        name: 'build',
        status: 'success',
        message: 'Build successful',
        details: { output: stdout }
      }
    } catch (error: any) {
      return {
        name: 'build',
        status: 'error',
        message: 'Build failed',
        details: { error: error.message, stderr: error.stderr }
      }
    }
  }

  private async checkTests(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      const { stdout, stderr } = await execAsync('npm test -- --passWithNoTests')
      return {
        name: 'tests',
        status: 'success',
        message: 'Tests passed',
        details: { output: stdout }
      }
    } catch (error: any) {
      return {
        name: 'tests',
        status: 'warning',
        message: 'Some tests failed',
        details: { error: error.message, stderr: error.stderr }
      }
    }
  }

  private generateSummaryMessage(results: any[]): string {
    const successCount = results.filter(r => r.status === 'success').length
    const warningCount = results.filter(r => r.status === 'warning').length
    const errorCount = results.filter(r => r.status === 'error').length

    if (errorCount > 0) {
      return `Pre-deployment checks failed: ${errorCount} errors, ${warningCount} warnings`
    } else if (warningCount > 0) {
      return `Pre-deployment checks passed with ${warningCount} warnings`
    } else {
      return `All pre-deployment checks passed (${successCount}/5)`
    }
  }

  private generateRecommendations(results: any[]): string[] {
    const recommendations: string[] = []

    results.forEach(result => {
      if (result.status === 'error') {
        switch (result.name) {
          case 'linting':
            recommendations.push('Fix ESLint errors before deployment')
            break
          case 'typescript':
            recommendations.push('Resolve TypeScript compilation errors')
            break
          case 'build':
            recommendations.push('Fix build errors - check dependencies and configuration')
            break
          case 'dependencies':
            recommendations.push('Update vulnerable dependencies')
            break
          case 'tests':
            recommendations.push('Fix failing tests or update test expectations')
            break
        }
      } else if (result.status === 'warning') {
        switch (result.name) {
          case 'dependencies':
            recommendations.push('Consider updating dependencies with vulnerabilities')
            break
          case 'tests':
            recommendations.push('Review and fix failing tests')
            break
        }
      }
    })

    return recommendations
  }
}



















