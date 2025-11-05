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
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 */

'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

type Props = { 
  children: ReactNode
  fallback?: ReactNode
}

type State = { 
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { 
    hasError: false,
    error: undefined,
    errorInfo: undefined
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary] Caught error:', error, errorInfo)
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   errorTracking.captureException(error, { extra: errorInfo })
    // }

    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
                Noe gikk galt
              </h1>
              <p className="text-neutral-600 mb-4">
                Beklager, vi opplevde en uventet feil.
              </p>
              {this.state.error && (
                <p className="text-sm text-neutral-500 mb-6 font-mono">
                  {this.state.error.message || 'Ukjent feil'}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined, errorInfo: undefined })
                  window.location.reload()
                }}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Oppdater siden
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Gå til forsiden
              </button>
            </div>
            {process.env.NODE_ENV !== 'production' && this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-neutral-500 mb-2">
                  Tekniske detaljer (kun i utvikling)
                </summary>
                <pre className="text-xs bg-neutral-100 p-4 rounded overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}



