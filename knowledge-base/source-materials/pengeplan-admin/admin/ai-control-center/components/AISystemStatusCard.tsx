'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Eye, Shield, Zap, Power, Activity, TrendingUp, AlertTriangle } from 'lucide-react'

interface AISystemStatusCardProps {
  system: {
    id: string
    name: string
    description?: string
    status: boolean
    healthScore?: number
    avgLatency?: number
    successRate?: number
    errorRate?: number
    costPerRequest?: number
    provider?: string
  }
}

export default function AISystemStatusCard({ system }: AISystemStatusCardProps) {
  const getSystemIcon = (name: string) => {
    if (name.includes('Revolutionary')) return <Brain className="h-5 w-5" />
    if (name.includes('Image')) return <Eye className="h-5 w-5" />
    if (name.includes('Security')) return <Shield className="h-5 w-5" />
    if (name.includes('DeepSeek')) return <Zap className="h-5 w-5" />
    return <Power className="h-5 w-5" />
  }

  const getStatusColor = (system: any) => {
    if (!system.status) return 'bg-gray-300'
    if (system.healthScore && system.healthScore > 90) return 'bg-green-500'
    if (system.healthScore && system.healthScore > 70) return 'bg-yellow-400'
    return 'bg-red-500'
  }

  const getStatusText = (system: any) => {
    if (!system.status) return 'Deaktivert'
    if (system.healthScore && system.healthScore > 90) return 'Utmerket'
    if (system.healthScore && system.healthScore > 70) return 'God'
    return 'Krever oppmerksomhet'
  }

  const getHealthColor = (score?: number) => {
    if (!score) return 'text-gray-500'
    if (score > 90) return 'text-green-600'
    if (score > 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getSystemIcon(system.name)}
            <div>
              <h3 className="font-semibold text-sm">{system.name}</h3>
              {system.description && (
                <p className="text-xs text-gray-600 mt-1">{system.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(system)}`}></div>
            <Badge variant="outline" className="text-xs">
              {getStatusText(system)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          {system.healthScore && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Helse</span>
              <span className={`font-medium ${getHealthColor(system.healthScore)}`}>
                {system.healthScore.toFixed(0)}%
              </span>
            </div>
          )}
          
          {system.avgLatency && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Latency</span>
              <span className="font-medium">{system.avgLatency.toFixed(2)}s</span>
            </div>
          )}
          
          {system.successRate && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Suksess</span>
              <span className="font-medium text-green-600">
                {system.successRate.toFixed(1)}%
              </span>
            </div>
          )}
          
          {system.costPerRequest && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Kostnad</span>
              <span className="font-medium">
                ${system.costPerRequest.toFixed(4)}
              </span>
            </div>
          )}
          
          {system.provider && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Provider</span>
              <Badge variant="outline" className="text-xs">
                {system.provider}
              </Badge>
            </div>
          )}
        </div>

        {system.errorRate && system.errorRate > 5 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Høy feilrate: {system.errorRate.toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}



