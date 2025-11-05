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

'use client'

import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import Link from 'next/link'

export default function NoraError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-nora-dark-bg text-white">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">💠</div>
              <h1 className="text-2xl font-semibold mb-2">
                Nora-siden opplevde en feil
              </h1>
              <p className="text-neutral-400 mb-4">
                {error.message || 'En uventet feil oppstod'}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Prøv igjen
              </button>
              <Link
                href="/"
                className="block w-full px-4 py-2 border border-primary-500/50 text-primary-500 rounded-lg hover:bg-primary-500/10 transition-colors"
              >
                Gå til forsiden
              </Link>
            </div>
          </div>
        </div>
      }
    >
      {/* This won't render, but ErrorBoundary will catch errors */}
      <div />
    </ErrorBoundary>
  )
}



