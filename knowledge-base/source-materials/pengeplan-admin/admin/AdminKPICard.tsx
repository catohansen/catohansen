'use client'

import { useState } from 'react'
import React from 'react'
import { 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  HelpCircle,
  Brain,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AIChat } from '@/components/ai/AIChat'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  description?: string
  tooltip?: string
  aiExplanation?: string
  className?: string
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
  icon?: React.ComponentType<any>
  trend?: string
}

export const AdminKPICard = React.memo(function AdminKPICard({
  title,
  value,
  change,
  changeType = 'neutral',
  description,
  tooltip,
  aiExplanation,
  className = '',
  color = 'blue'
}: KPICardProps) {
  const [showAIExplanation, setShowAIExplanation] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'decrease': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600 bg-green-100'
      case 'decrease': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCardColor = () => {
    switch (color) {
      case 'green': return 'border-green-200 bg-green-50'
      case 'orange': return 'border-orange-200 bg-orange-50'
      case 'red': return 'border-red-200 bg-red-50'
      case 'purple': return 'border-purple-200 bg-purple-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  const handleAIExplanation = async () => {
    if (aiExplanation) {
      setShowAIExplanation(true)
      return
    }

    setIsLoadingAI(true)
    try {
      // Generate AI explanation for this KPI
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Forklar hva "${title}" betyr i Pengeplan 2.0 admin-dashboard. Verdien er ${value}${change ? ` (endring: ${change}%)` : ''}. Gi en kort, teknisk forklaring.`,
          provider: 'deepseek',
          context: 'admin'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShowAIExplanation(true)
        // In a real implementation, you might want to cache this explanation
      }
    } catch (error) {
      console.error('Error getting AI explanation:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  return (
    <>
      <Card className={`${getCardColor()} ${className} hover:shadow-md transition-all duration-200`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {title}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAIExplanation}
              disabled={isLoadingAI}
              className="h-6 w-6 p-0"
            >
              {isLoadingAI ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Brain className="h-3 w-3 text-gray-500 hover:text-blue-600" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            
            {change !== undefined && (
              <Badge className={`${getTrendColor()} text-xs`}>
                {getTrendIcon()}
                <span className="ml-1">{Math.abs(change)}%</span>
              </Badge>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          )}
        </CardContent>
      </Card>

      {/* AI Explanation Modal */}
      {showAIExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI-forklaring: {title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIExplanation(false)}
              >
                ×
              </Button>
            </div>
            
            <AIChat 
              context="admin"
              placeholder={`Forklar ${title} i Pengeplan 2.0 admin-dashboard...`}
              maxHeight="400px"
            />
          </div>
        </div>
      )}
    </>
  )
})
