'use client'

import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Shield,
  Clock,
  AlertTriangle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StatsOverviewProps {
  stats: any
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Ingen statistikk tilgjengelig</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Mest brukte ressurser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topResources.slice(0, 5).map((resource: any, index: number) => (
              <div key={resource.resource} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{resource.resource}</p>
                    <p className="text-sm text-muted-foreground">
                      {resource.count} beslutninger
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={resource.allowRate > 0.8 ? "default" : resource.allowRate > 0.5 ? "secondary" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {resource.allowRate > 0.8 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {(resource.allowRate * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Mest brukte handlinger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topActions.slice(0, 5).map((action: any, index: number) => (
              <div key={action.action} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{action.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {action.count} beslutninger
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={action.allowRate > 0.8 ? "default" : action.allowRate > 0.5 ? "secondary" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {action.allowRate > 0.8 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {(action.allowRate * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Ytelse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gjennomsnittlig latens</span>
                <span className="font-medium">{stats.stats.averageLatency.toFixed(1)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">P95 latens</span>
                <span className="font-medium">{stats.stats.p95Latency.toFixed(1)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tidsramme</span>
                <span className="font-medium">{stats.timeframe}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">PDP Status</span>
                <Badge variant={stats.health.healthy ? "default" : "destructive"}>
                  {stats.health.healthy ? "Healthy" : "Unhealthy"}
                </Badge>
              </div>
              {stats.health.latency && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Health Check Latency</span>
                  <span className="font-medium">{stats.health.latency}ms</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sist oppdatert</span>
                <span className="font-medium text-xs">
                  {new Date(stats.generatedAt).toLocaleString('nb-NO')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}