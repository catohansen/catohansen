/**
 * Operations Agent - Monitoring, health checks, and predictive analysis
 * Analyserer system health, deployment patterns, og predikerer problemer
 */

import { AgentContext, AgentResult } from './manager'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class OpsAgent {
  async execute(context: AgentContext, step: any): Promise<AgentResult> {
    console.log(`[OpsAgent] Starting operations analysis for ${context.deploymentId}`)
    
    const analyses = await Promise.allSettled([
      this.analyzeSystemHealth(),
      this.checkResourceUsage(),
      this.analyzeDeploymentHistory(),
      this.predictFailureRisk(),
      this.checkServiceDependencies()
    ])

    const results = analyses.map((analysis, index) => {
      if (analysis.status === 'fulfilled') {
        return analysis.value
      } else {
        return {
          name: ['health', 'resources', 'history', 'prediction', 'dependencies'][index],
          status: 'error',
          message: analysis.reason?.message || 'Unknown error'
        }
      }
    })

    const hasErrors = results.some(r => r.status === 'error')
    const hasWarnings = results.some(r => r.status === 'warning')
    const hasHighRisk = results.some(r => r.riskLevel === 'high')

    let status: 'success' | 'warning' | 'error' | 'blocking' = 'success'
    if (hasHighRisk) status = 'blocking'
    else if (hasErrors) status = 'error'
    else if (hasWarnings) status = 'warning'

    const message = this.generateOpsSummary(results)

    return {
      agent: 'ops',
      status,
      message,
      data: {
        analyses: results,
        timestamp: new Date().toISOString(),
        riskAssessment: this.calculateOverallRisk(results)
      },
      recommendations: this.generateOpsRecommendations(results),
      requiresHumanApproval: hasHighRisk
    }
  }

  private async analyzeSystemHealth(): Promise<{ name: string; status: string; message: string; riskLevel?: string; details?: any }> {
    try {
      // Sjekk system health metrics
      const healthChecks = await Promise.allSettled([
        this.checkDatabaseHealth(),
        this.checkAPIResponseTime(),
        this.checkMemoryUsage(),
        this.checkDiskSpace()
      ])

      const healthResults = healthChecks.map((check, index) => {
        if (check.status === 'fulfilled') {
          return check.value
        } else {
          return {
            service: ['database', 'api', 'memory', 'disk'][index],
            status: 'error',
            message: check.reason?.message || 'Unknown error'
          }
        }
      })

      const unhealthyServices = healthResults.filter(h => h.status !== 'healthy').length
      const criticalServices = healthResults.filter(h => h.status === 'critical').length

      let riskLevel = 'low'
      if (criticalServices > 0) riskLevel = 'high'
      else if (unhealthyServices > 0) riskLevel = 'medium'

      return {
        name: 'health',
        status: unhealthyServices > 0 ? 'warning' : 'success',
        message: `${unhealthyServices} unhealthy services detected`,
        riskLevel,
        details: {
          services: healthResults,
          summary: {
            total: healthResults.length,
            healthy: healthResults.filter(h => h.status === 'healthy').length,
            unhealthy: unhealthyServices,
            critical: criticalServices
          }
        }
      }
    } catch (error: any) {
      return {
        name: 'health',
        status: 'error',
        message: 'System health analysis failed',
        riskLevel: 'high',
        details: { error: error.message }
      }
    }
  }

  private async checkResourceUsage(): Promise<{ name: string; status: string; message: string; riskLevel?: string; details?: any }> {
    try {
      // Sjekk CPU og minne bruk
      const { stdout: cpuOutput } = await execAsync('top -l 1 | grep "CPU usage" | awk \'{print $3}\' | sed \'s/%//\' || echo "0"')
      const cpuUsage = parseFloat(cpuOutput.trim())

      const { stdout: memOutput } = await execAsync('vm_stat | grep "Pages free" | awk \'{print $3}\' | sed \'s/\\.//\' || echo "0"')
      const freePages = parseInt(memOutput.trim())
      const memUsage = Math.max(0, 100 - (freePages / 1000)) // Rough calculation

      const highUsage = cpuUsage > 80 || memUsage > 80
      const criticalUsage = cpuUsage > 95 || memUsage > 95

      let riskLevel = 'low'
      if (criticalUsage) riskLevel = 'high'
      else if (highUsage) riskLevel = 'medium'

      return {
        name: 'resources',
        status: criticalUsage ? 'error' : highUsage ? 'warning' : 'success',
        message: `CPU: ${cpuUsage.toFixed(1)}%, Memory: ${memUsage.toFixed(1)}%`,
        riskLevel,
        details: {
          cpu: { usage: cpuUsage, status: cpuUsage > 80 ? 'high' : 'normal' },
          memory: { usage: memUsage, status: memUsage > 80 ? 'high' : 'normal' },
          recommendations: highUsage ? [
            'Consider scaling resources',
            'Monitor for memory leaks',
            'Optimize resource-intensive operations'
          ] : []
        }
      }
    } catch (error: any) {
      return {
        name: 'resources',
        status: 'warning',
        message: 'Resource usage check failed',
        riskLevel: 'medium',
        details: { error: error.message }
      }
    }
  }

  private async analyzeDeploymentHistory(): Promise<{ name: string; status: string; message: string; riskLevel?: string; details?: any }> {
    try {
      // Simuler deployment history analyse
      // I en ekte implementasjon ville dette hente fra database
      const mockHistory = {
        totalDeployments: 15,
        successfulDeployments: 12,
        failedDeployments: 3,
        averageDeployTime: 180, // seconds
        lastFailure: '2024-01-10',
        failurePattern: 'database_connection'
      }

      const successRate = (mockHistory.successfulDeployments / mockHistory.totalDeployments) * 100
      const recentFailures = mockHistory.failedDeployments > 0

      let riskLevel = 'low'
      if (successRate < 70) riskLevel = 'high'
      else if (successRate < 85 || recentFailures) riskLevel = 'medium'

      return {
        name: 'history',
        status: successRate < 85 ? 'warning' : 'success',
        message: `Success rate: ${successRate.toFixed(1)}% (${mockHistory.successfulDeployments}/${mockHistory.totalDeployments})`,
        riskLevel,
        details: {
          history: mockHistory,
          successRate,
          recommendations: successRate < 85 ? [
            'Review recent deployment failures',
            'Improve testing before deployment',
            'Consider staging environment validation'
          ] : []
        }
      }
    } catch (error: any) {
      return {
        name: 'history',
        status: 'error',
        message: 'Deployment history analysis failed',
        riskLevel: 'medium',
        details: { error: error.message }
      }
    }
  }

  private async predictFailureRisk(): Promise<{ name: string; status: string; message: string; riskLevel?: string; details?: any }> {
    try {
      // Simuler prediktiv analyse basert på patterns
      const riskFactors = {
        timeOfDay: this.getTimeRisk(),
        dayOfWeek: this.getDayRisk(),
        recentChanges: this.getChangeRisk(),
        systemLoad: this.getLoadRisk()
      }

      const totalRisk = Object.values(riskFactors).reduce((sum, risk) => sum + risk, 0)
      const averageRisk = totalRisk / Object.keys(riskFactors).length

      let riskLevel = 'low'
      if (averageRisk > 7) riskLevel = 'high'
      else if (averageRisk > 4) riskLevel = 'medium'

      return {
        name: 'prediction',
        status: averageRisk > 4 ? 'warning' : 'success',
        message: `Predicted failure risk: ${averageRisk.toFixed(1)}/10`,
        riskLevel,
        details: {
          riskFactors,
          averageRisk,
          recommendations: averageRisk > 4 ? [
            'Consider delaying deployment to lower-risk time',
            'Increase monitoring during deployment',
            'Prepare rollback plan'
          ] : []
        }
      }
    } catch (error: any) {
      return {
        name: 'prediction',
        status: 'error',
        message: 'Risk prediction failed',
        riskLevel: 'medium',
        details: { error: error.message }
      }
    }
  }

  private async checkServiceDependencies(): Promise<{ name: string; status: string; message: string; riskLevel?: string; details?: any }> {
    try {
      // Sjekk avhengigheter til eksterne tjenester
      const dependencies = [
        { name: 'Database', url: 'localhost:5432', critical: true },
        { name: 'Vercel API', url: 'api.vercel.com', critical: true },
        { name: 'Supabase', url: 'supabase.co', critical: true },
        { name: 'GitHub API', url: 'api.github.com', critical: false }
      ]

      const dependencyChecks = await Promise.allSettled(
        dependencies.map(async (dep) => {
          try {
            // Simuler health check
            const isHealthy = Math.random() > 0.1 // 90% success rate for demo
            return {
              name: dep.name,
              status: isHealthy ? 'healthy' : 'unhealthy',
              critical: dep.critical
            }
          } catch (error) {
            return {
              name: dep.name,
              status: 'error',
              critical: dep.critical
            }
          }
        })
      )

      const results = dependencyChecks.map((check, index) => {
        if (check.status === 'fulfilled') {
          return check.value
        } else {
          return {
            name: dependencies[index].name,
            status: 'error',
            critical: dependencies[index].critical
          }
        }
      })

      const unhealthyCritical = results.filter(r => r.status !== 'healthy' && r.critical).length
      const unhealthyNonCritical = results.filter(r => r.status !== 'healthy' && !r.critical).length

      let riskLevel = 'low'
      if (unhealthyCritical > 0) riskLevel = 'high'
      else if (unhealthyNonCritical > 0) riskLevel = 'medium'

      return {
        name: 'dependencies',
        status: unhealthyCritical > 0 ? 'error' : unhealthyNonCritical > 0 ? 'warning' : 'success',
        message: `${unhealthyCritical} critical, ${unhealthyNonCritical} non-critical dependencies unhealthy`,
        riskLevel,
        details: {
          dependencies: results,
          summary: {
            total: results.length,
            healthy: results.filter(r => r.status === 'healthy').length,
            unhealthy: unhealthyCritical + unhealthyNonCritical,
            critical: unhealthyCritical
          }
        }
      }
    } catch (error: any) {
      return {
        name: 'dependencies',
        status: 'error',
        message: 'Dependency check failed',
        riskLevel: 'high',
        details: { error: error.message }
      }
    }
  }

  // Helper methods for risk calculation
  private getTimeRisk(): number {
    const hour = new Date().getHours()
    // Higher risk during business hours (9-17)
    return hour >= 9 && hour <= 17 ? 6 : 2
  }

  private getDayRisk(): number {
    const day = new Date().getDay()
    // Higher risk on weekdays
    return day >= 1 && day <= 5 ? 5 : 2
  }

  private getChangeRisk(): number {
    // Simuler basert på antall recent commits
    return Math.min(8, Math.random() * 10)
  }

  private getLoadRisk(): number {
    // Simuler basert på system load
    return Math.min(7, Math.random() * 8)
  }

  private async checkDatabaseHealth(): Promise<{ service: string; status: string; message?: string }> {
    try {
      // Simuler database health check
      const isHealthy = Math.random() > 0.05 // 95% success rate
      return {
        service: 'database',
        status: isHealthy ? 'healthy' : 'critical',
        message: isHealthy ? 'Connection OK' : 'Connection failed'
      }
    } catch (error) {
      return {
        service: 'database',
        status: 'critical',
        message: 'Health check failed'
      }
    }
  }

  private async checkAPIResponseTime(): Promise<{ service: string; status: string; message?: string }> {
    try {
      // Simuler API response time check
      const responseTime = Math.random() * 1000 // 0-1000ms
      const isHealthy = responseTime < 500
      return {
        service: 'api',
        status: isHealthy ? 'healthy' : 'warning',
        message: `Response time: ${responseTime.toFixed(0)}ms`
      }
    } catch (error) {
      return {
        service: 'api',
        status: 'error',
        message: 'API check failed'
      }
    }
  }

  private async checkMemoryUsage(): Promise<{ service: string; status: string; message?: string }> {
    try {
      // Simuler memory usage check
      const usage = Math.random() * 100
      const isHealthy = usage < 80
      return {
        service: 'memory',
        status: isHealthy ? 'healthy' : usage > 95 ? 'critical' : 'warning',
        message: `Usage: ${usage.toFixed(1)}%`
      }
    } catch (error) {
      return {
        service: 'memory',
        status: 'error',
        message: 'Memory check failed'
      }
    }
  }

  private async checkDiskSpace(): Promise<{ service: string; status: string; message?: string }> {
    try {
      // Simuler disk space check
      const usage = Math.random() * 100
      const isHealthy = usage < 85
      return {
        service: 'disk',
        status: isHealthy ? 'healthy' : usage > 95 ? 'critical' : 'warning',
        message: `Usage: ${usage.toFixed(1)}%`
      }
    } catch (error) {
      return {
        service: 'disk',
        status: 'error',
        message: 'Disk check failed'
      }
    }
  }

  private calculateOverallRisk(results: any[]): { level: string; score: number; factors: string[] } {
    const riskScores = results.map(r => {
      switch (r.riskLevel) {
        case 'high': return 8
        case 'medium': return 4
        case 'low': return 1
        default: return 2
      }
    })

    const averageScore = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length
    const factors = results.filter(r => r.riskLevel === 'high' || r.riskLevel === 'medium').map(r => r.name)

    let level = 'low'
    if (averageScore > 6) level = 'high'
    else if (averageScore > 3) level = 'medium'

    return {
      level,
      score: Math.round(averageScore * 10) / 10,
      factors
    }
  }

  private generateOpsSummary(results: any[]): string {
    const highRisk = results.filter(r => r.riskLevel === 'high').length
    const mediumRisk = results.filter(r => r.riskLevel === 'medium').length
    const errors = results.filter(r => r.status === 'error').length

    if (highRisk > 0) {
      return `🚨 HIGH RISK: ${highRisk} critical issues detected - deployment not recommended`
    } else if (errors > 0) {
      return `⚠️ ERRORS: ${errors} operational issues found`
    } else if (mediumRisk > 0) {
      return `⚠️ MEDIUM RISK: ${mediumRisk} issues require attention`
    } else {
      return `✅ Operations check passed - system ready for deployment`
    }
  }

  private generateOpsRecommendations(results: any[]): string[] {
    const recommendations: string[] = []

    results.forEach(result => {
      if (result.details?.recommendations) {
        recommendations.push(...result.details.recommendations)
      }
    })

    if (recommendations.length === 0) {
      recommendations.push('✅ No operational recommendations - system is healthy')
    }

    return [...new Set(recommendations)] // Remove duplicates
  }
}



















