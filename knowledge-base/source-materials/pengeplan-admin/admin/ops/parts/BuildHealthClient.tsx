'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  GitBranch, 
  User, 
  ExternalLink,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface BuildRun {
  id: string
  pipeline: string
  commitSha: string
  branch: string
  status: 'success' | 'failed'
  startedAt: string
  endedAt: string
  durationMs: number
  initiator?: string
  errorSummary?: string
  artifactUrl?: string
  metadata?: Record<string, unknown>
}

interface BuildStats {
  pipeline: string
  status: string
  _count: { id: number }
  _avg: { durationMs: number | null }
}

interface LatestBuild {
  pipeline: string
  latest?: {
    status: 'success' | 'failed'
    startedAt: string
    commitSha: string
    initiator?: string
    errorSummary?: string
  }
}

interface Props {
  initialBuilds: BuildRun[]
  initialStats: BuildStats[]
  initialLatestBuilds: LatestBuild[]
}

export default function BuildHealthClient({ 
  initialBuilds, 
  initialStats, 
  initialLatestBuilds 
}: Props) {
  const [builds, setBuilds] = useState<BuildRun[]>(initialBuilds)
  const [stats] = useState<BuildStats[]>(initialStats)
  const [latestBuilds] = useState<LatestBuild[]>(initialLatestBuilds)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedBuild, setSelectedBuild] = useState<BuildRun | null>(null)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/admin/builds/summary?limit=50')
      if (response.ok) {
        const data = await response.json()
        setBuilds(data.builds)
        // Update stats from response if available
      }
    } catch (error) {
      console.error('Failed to refresh build data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    return status === 'success' ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (status: string) => {
    return status === 'success' ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Success
      </Badge>
    ) : (
      <Badge variant="destructive">
        Failed
      </Badge>
    )
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Nå'
    if (diffMins < 60) return `${diffMins}m siden`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}t siden`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d siden`
  }

  const getPipelineStats = (pipeline: string) => {
    const pipelineStats = stats.filter(s => s.pipeline === pipeline)
    const successCount = pipelineStats.find(s => s.status === 'success')?._count.id || 0
    const failedCount = pipelineStats.find(s => s.status === 'failed')?._count.id || 0
    const total = successCount + failedCount
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0
    
    return { successCount, failedCount, total, successRate }
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['local', 'staging', 'prod'].map((pipeline) => {
          const latest = latestBuilds.find(lb => lb.pipeline === pipeline)?.latest
          const pipelineStats = getPipelineStats(pipeline)
          
          return (
            <Card key={pipeline} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{pipeline}</CardTitle>
                  {latest && getStatusIcon(latest.status)}
                </div>
              </CardHeader>
              <CardContent>
                {latest ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(latest.status)}
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(latest.startedAt)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {latest.commitSha.substring(0, 8)}
                      </div>
                      {latest.initiator && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {latest.initiator}
                        </div>
                      )}
                    </div>
                    <div className="text-xs">
                      <div>Success rate: {pipelineStats.successRate}%</div>
                      <div>Total builds: {pipelineStats.total}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">Ingen builds registrert</div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Build Historikk</h2>
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Oppdater
        </Button>
      </div>

      {/* Build History Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4">Pipeline</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Branch</th>
                  <th className="text-left p-4">Commit</th>
                  <th className="text-left p-4">Initiator</th>
                  <th className="text-left p-4">Duration</th>
                  <th className="text-left p-4">Tidspunkt</th>
                  <th className="text-left p-4">Handlinger</th>
                </tr>
              </thead>
              <tbody>
                {builds.map((build) => (
                  <tr key={build.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">
                        {build.pipeline}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(build.status)}
                        {getStatusBadge(build.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {build.branch}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">
                      {build.commitSha.substring(0, 8)}
                    </td>
                    <td className="p-4">
                      {build.initiator && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {build.initiator}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(build.durationMs)}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {formatTimeAgo(build.startedAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBuild(build)}
                        >
                          Vis
                        </Button>
                        {build.artifactUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(build.artifactUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Build Details Modal */}
      {selectedBuild && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Build Detaljer</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBuild(null)}
                >
                  Lukk
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Pipeline</label>
                  <div className="capitalize">{selectedBuild.pipeline}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedBuild.status)}
                    {getStatusBadge(selectedBuild.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Branch</label>
                  <div>{selectedBuild.branch}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Commit</label>
                  <div className="font-mono text-sm">{selectedBuild.commitSha}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Initiator</label>
                  <div>{selectedBuild.initiator || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <div>{formatDuration(selectedBuild.durationMs)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Startet</label>
                  <div>{new Date(selectedBuild.startedAt).toLocaleString('no-NO')}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Avsluttet</label>
                  <div>{new Date(selectedBuild.endedAt).toLocaleString('no-NO')}</div>
                </div>
              </div>
              
              {selectedBuild.errorSummary && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Feilmelding</label>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div className="text-sm text-red-800">{selectedBuild.errorSummary}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedBuild.metadata && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Metadata</label>
                  <pre className="mt-1 p-3 bg-gray-50 border rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedBuild.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}














