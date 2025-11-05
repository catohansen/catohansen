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
 * Structured Logger
 * 
 * Provides structured logging for the entire Hansen Global Solutions platform
 * 
 * Usage:
 * ```ts
 * import { logger } from '@/lib/logger'
 * 
 * logger.info('User logged in', { userId: '123' })
 * logger.error('Failed to process', { error, context })
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class Logger {
  private formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      })
    }
  }

  private output(entry: LogEntry): void {
    if (process.env.NODE_ENV === 'production') {
      // In production, use structured JSON logging
      console.log(JSON.stringify(entry))
    } else {
      // In development, use pretty formatted logging
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[entry.level]

      const color = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      }[entry.level]

      const reset = '\x1b[0m'

      console.log(
        `${color}${emoji} [${entry.level.toUpperCase()}]${reset} ${entry.message}`,
        entry.context ? `\n  Context: ${JSON.stringify(entry.context, null, 2)}` : '',
        entry.error ? `\n  Error: ${entry.error.name}: ${entry.error.message}` : ''
      )
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      this.output(this.formatEntry('debug', message, context))
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatEntry('info', message, context))
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.output(this.formatEntry('warn', message, context, error))
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.output(this.formatEntry('error', message, context, error))
  }

  // Convenience methods for common patterns
  apiRequest(method: string, path: string, status: number, latency: number, context?: Record<string, unknown>): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    this[level](`${method} ${path} - ${status} - ${latency}ms`, {
      method,
      path,
      status,
      latency,
      ...context
    })
  }

  moduleOperation(module: string, operation: string, success: boolean, context?: Record<string, unknown>): void {
    const level = success ? 'info' : 'error'
    this[level](`Module ${module}: ${operation}`, {
      module,
      operation,
      success,
      ...context
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export Logger class for testing
export { Logger }



