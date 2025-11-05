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
 * Global Error Boundary
 * Handles errors that occur in the root layout
 * This is the fallback for errors that cannot be caught by regular error boundaries
 */

'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('Global Error:', error)
  }, [error])

  return (
    <html lang="no">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Kritisk feil
            </h1>
            
            <p className="text-gray-600 mb-2">
              Det oppstod en kritisk feil som ikke kunne håndteres.
            </p>

            {error.message && (
              <p className="text-sm text-gray-500 mb-6">
                {error.message}
              </p>
            )}
            
            <div className="space-y-3">
              <button 
                onClick={reset}
                className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Prøv igjen
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Tilbake til hjemmesiden
              </button>
            </div>
            
            {error.digest && (
              <p className="text-xs text-gray-500 mt-6">
                Feil-ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}




