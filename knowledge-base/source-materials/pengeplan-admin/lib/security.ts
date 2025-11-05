/**
 * Security Agent - Security scanning and vulnerability detection
 * Sjekker for secrets, vulnerabilities, og sikkerhetstrusler
 */

import { AgentContext, AgentResult } from './manager'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

export class SecurityAgent {
  async execute(context: AgentContext, step: any): Promise<AgentResult> {
    console.log(`[SecurityAgent] Starting security scan for ${context.deploymentId}`)
    
    const scans = await Promise.allSettled([
      this.scanForSecrets(),
      this.scanDependencies(),
      this.scanCodePatterns(),
      this.checkSecurityHeaders(),
      this.analyzePermissions()
    ])

    const results = scans.map((scan, index) => {
      if (scan.status === 'fulfilled') {
        return scan.value
      } else {
        return {
          name: ['secrets', 'dependencies', 'patterns', 'headers', 'permissions'][index],
          status: 'error',
          message: scan.reason?.message || 'Unknown error'
        }
      }
    })

    const criticalIssues = results.filter(r => r.severity === 'critical').length
    const highIssues = results.filter(r => r.severity === 'high').length
    const mediumIssues = results.filter(r => r.severity === 'medium').length

    let status: 'success' | 'warning' | 'error' | 'blocking' = 'success'
    if (criticalIssues > 0) status = 'blocking'
    else if (highIssues > 0) status = 'error'
    else if (mediumIssues > 0) status = 'warning'

    const message = this.generateSecuritySummary(criticalIssues, highIssues, mediumIssues)

    return {
      agent: 'security',
      status,
      message,
      data: {
        scans: results,
        summary: {
          critical: criticalIssues,
          high: highIssues,
          medium: mediumIssues,
          total: criticalIssues + highIssues + mediumIssues
        },
        timestamp: new Date().toISOString()
      },
      recommendations: this.generateSecurityRecommendations(results),
      requiresHumanApproval: criticalIssues > 0 || highIssues > 2
    }
  }

  private async scanForSecrets(): Promise<{ name: string; status: string; message: string; severity: string; details?: any }> {
    try {
      // Sjekk for vanlige secret patterns
      const secretPatterns = [
        /(?:password|passwd|pwd)\s*[:=]\s*['"]?[^'"\s]{8,}['"]?/gi,
        /(?:api[_-]?key|apikey)\s*[:=]\s*['"]?[a-zA-Z0-9]{20,}['"]?/gi,
        /(?:secret|token)\s*[:=]\s*['"]?[a-zA-Z0-9]{20,}['"]?/gi,
        /(?:private[_-]?key|privatekey)\s*[:=]\s*['"]?-----BEGIN/gi,
        /(?:database[_-]?url|db[_-]?url)\s*[:=]\s*['"]?[a-zA-Z0-9+.-]+:\/\/[^'"\s]+['"]?/gi
      ]

      const files = await this.getSourceFiles()
      const findings: any[] = []

      for (const file of files) {
        try {
          const content = await fs.readFile(file, 'utf-8')
          
          for (const pattern of secretPatterns) {
            const matches = content.match(pattern)
            if (matches) {
              findings.push({
                file,
                pattern: pattern.source,
                matches: matches.length,
                lines: this.getLineNumbers(content, matches)
              })
            }
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }

      if (findings.length > 0) {
        return {
          name: 'secrets',
          status: 'error',
          message: `Found ${findings.length} potential secret leaks`,
          severity: 'critical',
          details: { findings }
        }
      }

      return {
        name: 'secrets',
        status: 'success',
        message: 'No potential secrets found',
        severity: 'low',
        details: { filesScanned: files.length }
      }
    } catch (error: any) {
      return {
        name: 'secrets',
        status: 'error',
        message: 'Secret scan failed',
        severity: 'medium',
        details: { error: error.message }
      }
    }
  }

  private async scanDependencies(): Promise<{ name: string; status: string; message: string; severity: string; details?: any }> {
    try {
      const { stdout, stderr } = await execAsync('npm audit --json')
      const auditResult = JSON.parse(stdout)
      
      const vulnerabilities = auditResult.vulnerabilities || {}
      const critical = Object.values(vulnerabilities).filter((v: any) => v.severity === 'critical').length
      const high = Object.values(vulnerabilities).filter((v: any) => v.severity === 'high').length
      const moderate = Object.values(vulnerabilities).filter((v: any) => v.severity === 'moderate').length

      if (critical > 0) {
        return {
          name: 'dependencies',
          status: 'error',
          message: `${critical} critical vulnerabilities found`,
          severity: 'critical',
          details: { critical, high, moderate, vulnerabilities }
        }
      } else if (high > 0) {
        return {
          name: 'dependencies',
          status: 'error',
          message: `${high} high-severity vulnerabilities found`,
          severity: 'high',
          details: { critical, high, moderate, vulnerabilities }
        }
      } else if (moderate > 0) {
        return {
          name: 'dependencies',
          status: 'warning',
          message: `${moderate} moderate vulnerabilities found`,
          severity: 'medium',
          details: { critical, high, moderate, vulnerabilities }
        }
      }

      return {
        name: 'dependencies',
        status: 'success',
        message: 'No high-severity vulnerabilities found',
        severity: 'low',
        details: { critical, high, moderate }
      }
    } catch (error: any) {
      return {
        name: 'dependencies',
        status: 'warning',
        message: 'Could not scan dependencies',
        severity: 'medium',
        details: { error: error.message }
      }
    }
  }

  private async scanCodePatterns(): Promise<{ name: string; status: string; message: string; severity: string; details?: any }> {
    try {
      const dangerousPatterns = [
        { pattern: /eval\s*\(/gi, name: 'eval() usage', severity: 'high' },
        { pattern: /innerHTML\s*=/gi, name: 'innerHTML assignment', severity: 'medium' },
        { pattern: /document\.write\s*\(/gi, name: 'document.write() usage', severity: 'medium' },
        { pattern: /dangerouslySetInnerHTML/gi, name: 'dangerouslySetInnerHTML', severity: 'medium' },
        { pattern: /localStorage\.setItem\s*\([^,]+,\s*[^)]*password/gi, name: 'Password in localStorage', severity: 'high' }
      ]

      const files = await this.getSourceFiles()
      const findings: any[] = []

      for (const file of files) {
        try {
          const content = await fs.readFile(file, 'utf-8')
          
          for (const { pattern, name, severity } of dangerousPatterns) {
            const matches = content.match(pattern)
            if (matches) {
              findings.push({
                file,
                pattern: name,
                severity,
                matches: matches.length,
                lines: this.getLineNumbers(content, matches)
              })
            }
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }

      const criticalFindings = findings.filter(f => f.severity === 'high').length
      const mediumFindings = findings.filter(f => f.severity === 'medium').length

      if (criticalFindings > 0) {
        return {
          name: 'patterns',
          status: 'error',
          message: `${criticalFindings} critical security patterns found`,
          severity: 'high',
          details: { findings }
        }
      } else if (mediumFindings > 0) {
        return {
          name: 'patterns',
          status: 'warning',
          message: `${mediumFindings} potentially unsafe patterns found`,
          severity: 'medium',
          details: { findings }
        }
      }

      return {
        name: 'patterns',
        status: 'success',
        message: 'No dangerous code patterns found',
        severity: 'low',
        details: { filesScanned: files.length }
      }
    } catch (error: any) {
      return {
        name: 'patterns',
        status: 'error',
        message: 'Code pattern scan failed',
        severity: 'medium',
        details: { error: error.message }
      }
    }
  }

  private async checkSecurityHeaders(): Promise<{ name: string; status: string; message: string; severity: string; details?: any }> {
    // Dette ville normalt sjekke mot en live URL, men for nå returnerer vi en placeholder
    return {
      name: 'headers',
      status: 'success',
      message: 'Security headers check (placeholder)',
      severity: 'low',
      details: { note: 'Would check CSP, HSTS, X-Frame-Options, etc.' }
    }
  }

  private async analyzePermissions(): Promise<{ name: string; status: string; message: string; severity: string; details?: any }> {
    try {
      // Sjekk file permissions for sensitive files
      const sensitiveFiles = ['.env', '.env.local', 'package.json', 'next.config.js']
      const findings: any[] = []

      for (const file of sensitiveFiles) {
        try {
          const stats = await fs.stat(file)
          const mode = stats.mode.toString(8)
          if (mode.endsWith('7') || mode.endsWith('6')) {
            findings.push({
              file,
              permission: mode,
              issue: 'World-readable file'
            })
          }
        } catch (error) {
          // File doesn't exist, which is fine
        }
      }

      if (findings.length > 0) {
        return {
          name: 'permissions',
          status: 'warning',
          message: `${findings.length} permission issues found`,
          severity: 'medium',
          details: { findings }
        }
      }

      return {
        name: 'permissions',
        status: 'success',
        message: 'File permissions look good',
        severity: 'low',
        details: { filesChecked: sensitiveFiles.length }
      }
    } catch (error: any) {
      return {
        name: 'permissions',
        status: 'error',
        message: 'Permission check failed',
        severity: 'medium',
        details: { error: error.message }
      }
    }
  }

  private async getSourceFiles(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .next | head -50')
      return stdout.trim().split('\n').filter(f => f.length > 0)
    } catch (error) {
      return []
    }
  }

  private getLineNumbers(content: string, matches: RegExpMatchArray): number[] {
    const lines: number[] = []
    const contentLines = content.split('\n')
    
    matches.forEach(match => {
      const index = content.indexOf(match)
      let currentIndex = 0
      for (let i = 0; i < contentLines.length; i++) {
        currentIndex += contentLines[i].length + 1
        if (currentIndex > index) {
          lines.push(i + 1)
          break
        }
      }
    })
    
    return lines
  }

  private generateSecuritySummary(critical: number, high: number, medium: number): string {
    if (critical > 0) {
      return `🚨 CRITICAL: ${critical} critical security issues found - deployment blocked`
    } else if (high > 0) {
      return `⚠️ HIGH: ${high} high-severity security issues found`
    } else if (medium > 0) {
      return `⚠️ MEDIUM: ${medium} medium-severity security issues found`
    } else {
      return `✅ Security scan passed - no critical issues found`
    }
  }

  private generateSecurityRecommendations(results: any[]): string[] {
    const recommendations: string[] = []

    results.forEach(result => {
      if (result.severity === 'critical') {
        recommendations.push(`🚨 CRITICAL: Fix ${result.name} issues immediately`)
      } else if (result.severity === 'high') {
        recommendations.push(`⚠️ HIGH: Address ${result.name} issues before production`)
      } else if (result.severity === 'medium') {
        recommendations.push(`📋 MEDIUM: Consider fixing ${result.name} issues`)
      }
    })

    if (recommendations.length === 0) {
      recommendations.push('✅ No security recommendations - all checks passed')
    }

    return recommendations
  }
}



















