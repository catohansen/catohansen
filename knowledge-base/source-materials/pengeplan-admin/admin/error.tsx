'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
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
        
        <p className="text-gray-600 mb-6">
          Det oppstod en feil i admin-panelet. Prøv å oppdatere siden eller kontakt support hvis problemet vedvarer.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={reset}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Prøv igjen
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/admin'}
            className="w-full"
          >
            Tilbake til admin
          </Button>
        </div>
        
        {error.digest && (
          <p className="text-xs text-gray-500 mt-4">
            Feil-ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}


