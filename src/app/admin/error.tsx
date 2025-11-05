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
 * Admin Error Boundary
 * Handles errors in the admin panel
 */

'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log error for debugging
    console.error('Admin Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Noe gikk galt
        </h1>
        
        <p className="text-gray-600 mb-2">
          Det oppstod en feil i admin-panelet.
        </p>

        {error.message && (
          <p className="text-sm text-gray-500 mb-6">
            {error.message}
          </p>
        )}
        
        <div className="space-y-3">
          <button 
            onClick={reset}
            className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Prøv igjen
          </button>
          
          <button 
            onClick={() => router.push('/admin')}
            className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Tilbake til admin
          </button>

          <button 
            onClick={() => router.push('/admin/login')}
            className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-500 text-sm rounded-lg transition-colors"
          >
            Logg inn på nytt
          </button>
        </div>
        
        {error.digest && (
          <p className="text-xs text-gray-500 mt-6">
            Feil-ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}


