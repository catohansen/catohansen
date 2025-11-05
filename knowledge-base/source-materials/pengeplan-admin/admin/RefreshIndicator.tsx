import { RefreshCw, Activity, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RefreshIndicatorProps {
  isUpdating: boolean
  lastRefresh: Date
  error: string | null
  onRefresh?: () => void
  showLastRefresh?: boolean
  variant?: 'badge' | 'button' | 'inline'
  size?: 'sm' | 'md' | 'lg'
}

export function RefreshIndicator({
  isUpdating,
  lastRefresh,
  error,
  onRefresh,
  showLastRefresh = true,
  variant = 'badge',
  size = 'md'
}: RefreshIndicatorProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (variant === 'badge') {
    return (
      <Badge 
        className={`${
          error 
            ? 'bg-red-100 text-red-800' 
            : isUpdating 
              ? 'bg-blue-100 text-blue-800 animate-pulse' 
              : 'bg-green-100 text-green-800'
        }`}
      >
        <Activity className={`${sizeClasses[size]} mr-1`} />
        {error ? 'Feil' : isUpdating ? 'Oppdaterer...' : 'Live'}
      </Badge>
    )
  }

  if (variant === 'button') {
    return (
      <Button 
        onClick={onRefresh} 
        variant="outline" 
        size="sm" 
        disabled={isUpdating}
        className="relative"
      >
        <RefreshCw className={`${sizeClasses[size]} mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
        {isUpdating ? 'Oppdaterer...' : 'Oppdater'}
        {error && (
          <AlertCircle className="h-3 w-3 ml-1 text-red-500" />
        )}
      </Button>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${textSizes[size]} text-gray-500`}>
        {isUpdating && <RefreshCw className={`${sizeClasses[size]} animate-spin`} />}
        {error && <AlertCircle className={`${sizeClasses[size]} text-red-500`} />}
        {showLastRefresh && (
          <>
            Sist oppdatert: {lastRefresh.toLocaleString()}
            {isUpdating && <span className="text-blue-600"> (Oppdaterer...)</span>}
            {error && <span className="text-red-600"> (Feil: {error})</span>}
          </>
        )}
      </div>
    )
  }

  return null
}
