/**
 * Performance Agent - Performance analysis and optimization
 * Analyserer bundle size, performance metrics, og optimaliseringer
 */

import { AgentContext, AgentResult } from './manager'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

export class PerfAgent {
  async execute(context: AgentContext, step: any): Promise<AgentResult> {
    console.log(`[PerfAgent] Starting performance analysis for ${context.deploymentId}`)
    
    const analyses = await Promise.allSettled([
      this.analyzeBundleSize(),
      this.checkImageOptimization(),
      this.analyzeDependencies(),
      this.checkCodeSplitting(),
      this.analyzeBuildOutput()
    ])

    const results = analyses.map((analysis, index) => {
      if (analysis.status === 'fulfilled') {
        return analysis.value
      } else {
        return {
          name: ['bundle', 'images', 'dependencies', 'splitting', 'build'][index],
          status: 'error',
          message: analysis.reason?.message || 'Unknown error'
        }
      }
    })

    const hasErrors = results.some(r => r.status === 'error')
    const hasWarnings = results.some(r => r.status === 'warning')

    let status: 'success' | 'warning' | 'error' | 'blocking' = 'success'
    if (hasErrors) status = 'error'
    else if (hasWarnings) status = 'warning'

    const message = this.generatePerformanceSummary(results)

    return {
      agent: 'performance',
      status,
      message,
      data: {
        analyses: results,
        timestamp: new Date().toISOString()
      },
      recommendations: this.generatePerformanceRecommendations(results)
    }
  }

  private async analyzeBundleSize(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      // Sjekk om .next folder eksisterer
      try {
        await fs.access('.next')
      } catch {
        return {
          name: 'bundle',
          status: 'warning',
          message: 'Build not found - run npm run build first',
          details: { note: 'Cannot analyze bundle size without build' }
        }
      }

      // Analyser bundle size
      const { stdout } = await execAsync('du -sh .next/static 2>/dev/null || echo "0B"')
      const bundleSize = stdout.trim()

      // Sjekk for store filer
      const { stdout: largeFiles } = await execAsync('find .next/static -name "*.js" -size +500k 2>/dev/null | head -10 || true')
      const largeFileList = largeFiles.trim().split('\n').filter(f => f.length > 0)

      if (largeFileList.length > 0) {
        return {
          name: 'bundle',
          status: 'warning',
          message: `Bundle size: ${bundleSize} - ${largeFileList.length} large files found`,
          details: {
            totalSize: bundleSize,
            largeFiles: largeFileList,
            recommendations: [
              'Consider code splitting for large files',
              'Remove unused dependencies',
              'Optimize imports'
            ]
          }
        }
      }

      return {
        name: 'bundle',
        status: 'success',
        message: `Bundle size: ${bundleSize} - looks good`,
        details: {
          totalSize: bundleSize,
          largeFiles: []
        }
      }
    } catch (error: any) {
      return {
        name: 'bundle',
        status: 'error',
        message: 'Bundle analysis failed',
        details: { error: error.message }
      }
    }
  }

  private async checkImageOptimization(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      // Sjekk for unoptimized images
      const { stdout } = await execAsync('find . -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" | grep -v node_modules | grep -v .next | head -20')
      const imageFiles = stdout.trim().split('\n').filter(f => f.length > 0)

      const unoptimizedImages: any[] = []
      const largeImages: any[] = []

      for (const image of imageFiles) {
        try {
          const { stdout: sizeOutput } = await execAsync(`stat -f%z "${image}" 2>/dev/null || stat -c%s "${image}" 2>/dev/null || echo "0"`)
          const sizeBytes = parseInt(sizeOutput.trim())
          const sizeKB = Math.round(sizeBytes / 1024)

          if (sizeKB > 500) {
            largeImages.push({
              file: image,
              size: `${sizeKB}KB`
            })
          }

          // Sjekk om det er Next.js Image komponent
          const content = await fs.readFile(image.replace(/\.(jpg|jpeg|png|gif|webp)$/, '.tsx'), 'utf-8').catch(() => '')
          if (!content.includes('next/image') && !content.includes('Image from')) {
            unoptimizedImages.push(image)
          }
        } catch (error) {
          // Skip files that can't be analyzed
        }
      }

      if (largeImages.length > 0 || unoptimizedImages.length > 0) {
        return {
          name: 'images',
          status: 'warning',
          message: `${largeImages.length} large images, ${unoptimizedImages.length} unoptimized images found`,
          details: {
            largeImages,
            unoptimizedImages,
            recommendations: [
              'Use Next.js Image component for optimization',
              'Compress large images',
              'Consider WebP format for better compression'
            ]
          }
        }
      }

      return {
        name: 'images',
        status: 'success',
        message: 'Image optimization looks good',
        details: {
          totalImages: imageFiles.length,
          largeImages: [],
          unoptimizedImages: []
        }
      }
    } catch (error: any) {
      return {
        name: 'images',
        status: 'error',
        message: 'Image analysis failed',
        details: { error: error.message }
      }
    }
  }

  private async analyzeDependencies(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'))
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      const heavyDependencies = [
        'lodash', 'moment', 'jquery', 'bootstrap', 'material-ui',
        'antd', 'semantic-ui', 'bulma', 'tailwindcss'
      ]

      const foundHeavy = Object.keys(dependencies).filter(dep => 
        heavyDependencies.some(heavy => dep.includes(heavy))
      )

      const unusedDeps: string[] = []
      const duplicateDeps: string[] = []

      // Enkel sjekk for potensielt ubrukte dependencies
      for (const dep of Object.keys(dependencies)) {
        try {
          const { stdout } = await execAsync(`grep -r "from ['\"]${dep}['\"]" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | head -1`)
          if (!stdout.trim()) {
            unusedDeps.push(dep)
          }
        } catch (error) {
          // Dependency might be used in other ways
        }
      }

      if (foundHeavy.length > 0 || unusedDeps.length > 0) {
        return {
          name: 'dependencies',
          status: 'warning',
          message: `${foundHeavy.length} heavy dependencies, ${unusedDeps.length} potentially unused dependencies`,
          details: {
            heavyDependencies: foundHeavy,
            unusedDependencies: unusedDeps.slice(0, 10), // Limit to first 10
            recommendations: [
              'Consider lighter alternatives for heavy dependencies',
              'Remove unused dependencies to reduce bundle size',
              'Use tree-shaking for better optimization'
            ]
          }
        }
      }

      return {
        name: 'dependencies',
        status: 'success',
        message: 'Dependencies look optimized',
        details: {
          totalDependencies: Object.keys(dependencies).length,
          heavyDependencies: [],
          unusedDependencies: []
        }
      }
    } catch (error: any) {
      return {
        name: 'dependencies',
        status: 'error',
        message: 'Dependency analysis failed',
        details: { error: error.message }
      }
    }
  }

  private async checkCodeSplitting(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      // Sjekk for dynamic imports
      const { stdout } = await execAsync('grep -r "import(" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | wc -l')
      const dynamicImports = parseInt(stdout.trim())

      // Sjekk for Next.js lazy loading
      const { stdout: lazyOutput } = await execAsync('grep -r "lazy\\|dynamic" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | wc -l')
      const lazyComponents = parseInt(lazyOutput.trim())

      if (dynamicImports === 0 && lazyComponents === 0) {
        return {
          name: 'splitting',
          status: 'warning',
          message: 'No code splitting detected',
          details: {
            dynamicImports,
            lazyComponents,
            recommendations: [
              'Consider using dynamic imports for large components',
              'Implement lazy loading for better performance',
              'Split routes and components to reduce initial bundle size'
            ]
          }
        }
      }

      return {
        name: 'splitting',
        status: 'success',
        message: `Code splitting detected: ${dynamicImports} dynamic imports, ${lazyComponents} lazy components`,
        details: {
          dynamicImports,
          lazyComponents
        }
      }
    } catch (error: any) {
      return {
        name: 'splitting',
        status: 'error',
        message: 'Code splitting analysis failed',
        details: { error: error.message }
      }
    }
  }

  private async analyzeBuildOutput(): Promise<{ name: string; status: string; message: string; details?: any }> {
    try {
      // Sjekk build output for warnings
      const { stdout, stderr } = await execAsync('npm run build 2>&1 | grep -i "warning\\|error" | head -10 || true')
      const buildWarnings = stdout.trim().split('\n').filter(w => w.length > 0)

      if (buildWarnings.length > 0) {
        return {
          name: 'build',
          status: 'warning',
          message: `${buildWarnings.length} build warnings found`,
          details: {
            warnings: buildWarnings,
            recommendations: [
              'Fix build warnings for better performance',
              'Review webpack configuration',
              'Optimize build process'
            ]
          }
        }
      }

      return {
        name: 'build',
        status: 'success',
        message: 'Build output looks clean',
        details: {
          warnings: []
        }
      }
    } catch (error: any) {
      return {
        name: 'build',
        status: 'error',
        message: 'Build analysis failed',
        details: { error: error.message }
      }
    }
  }

  private generatePerformanceSummary(results: any[]): string {
    const warnings = results.filter(r => r.status === 'warning').length
    const errors = results.filter(r => r.status === 'error').length

    if (errors > 0) {
      return `Performance analysis failed: ${errors} errors, ${warnings} warnings`
    } else if (warnings > 0) {
      return `Performance analysis completed: ${warnings} optimization opportunities found`
    } else {
      return `Performance analysis passed: all checks green`
    }
  }

  private generatePerformanceRecommendations(results: any[]): string[] {
    const recommendations: string[] = []

    results.forEach(result => {
      if (result.details?.recommendations) {
        recommendations.push(...result.details.recommendations)
      }
    })

    if (recommendations.length === 0) {
      recommendations.push('✅ Performance looks good - no optimization needed')
    }

    return [...new Set(recommendations)] // Remove duplicates
  }
}



















