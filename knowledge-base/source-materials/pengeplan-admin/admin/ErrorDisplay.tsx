'use client'

import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorDisplayProps {
  error: string
  details?: string
  suggestions?: string[]
  onRetry?: () => void
  showRetry?: boolean
}

export default function ErrorDisplay({ 
  error, 
  details, 
  suggestions = [], 
  onRetry,
  showRetry = true 
}: ErrorDisplayProps) {
  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-800">{error}</AlertTitle>
      {details && (
        <AlertDescription className="text-red-700 mt-2">
          {details}
        </AlertDescription>
      )}
      
      {suggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-red-800 mb-2">Forslag til løsning:</p>
          <ul className="text-sm text-red-700 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showRetry && onRetry && (
        <div className="mt-4 flex gap-2">
          <Button 
            onClick={onRetry} 
            size="sm" 
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Prøv igjen
          </Button>
          <Button 
            onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
            size="sm" 
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <ExternalLink className="h-3 w-3 mr-2" />
            OpenAI Dashboard
          </Button>
        </div>
      )}
    </Alert>
  )
}



































