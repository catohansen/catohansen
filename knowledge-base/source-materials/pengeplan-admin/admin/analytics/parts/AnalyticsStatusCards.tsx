'use client'

import { 
  BarChart3, 
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AnalyticsSummary {
  ga4Connected: boolean
  gtmConnected: boolean
  measurementId?: string
  containerId?: string
  lastEventName?: string
  lastHitAt?: string
}

interface AnalyticsStatusCardsProps {
  summary: AnalyticsSummary
}

export function AnalyticsStatusCards({ summary }: AnalyticsStatusCardsProps) {
  const getStatusIcon = (connected: boolean) => {
    if (connected) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (connected: boolean) => {
    return (
      <Badge variant={connected ? 'default' : 'secondary'}>
        {connected ? 'Tilkoblet' : 'Ikke tilkoblet'}
      </Badge>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* GA4 Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">GA4 Status</CardTitle>
          {getStatusIcon(summary.ga4Connected)}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getStatusBadge(summary.ga4Connected)}
            {summary.measurementId && (
              <p className="text-xs text-gray-600">
                ID: {summary.measurementId}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GTM Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">GTM Status</CardTitle>
          {getStatusIcon(summary.gtmConnected)}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getStatusBadge(summary.gtmConnected)}
            {summary.containerId && (
              <p className="text-xs text-gray-600">
                ID: {summary.containerId}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Last Event */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Siste Event</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summary.lastEventName ? (
              <>
                <Badge variant="outline">{summary.lastEventName}</Badge>
                <p className="text-xs text-gray-600">
                  {summary.lastHitAt 
                    ? new Date(summary.lastHitAt).toLocaleString('nb-NO')
                    : 'Ukjent tid'
                  }
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-gray-600">Ingen events</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summary.ga4Connected || summary.gtmConnected ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">System OK</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-600">Ingen tilkobling</span>
              </div>
            )}
            <p className="text-xs text-gray-600">
              {summary.ga4Connected && summary.gtmConnected 
                ? 'GA4 + GTM aktiv' 
                : summary.ga4Connected 
                  ? 'Kun GA4 aktiv'
                  : summary.gtmConnected
                    ? 'Kun GTM aktiv'
                    : 'Ingen analytics aktiv'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



































