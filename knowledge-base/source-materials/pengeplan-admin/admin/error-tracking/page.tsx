'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  AlertTriangle, 
  Bug, 
  Clock, 
  Filter, 
  Search,
  RefreshCw,
  Download,
  Eye,
  XCircle,
  CheckCircle,
  Info,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warning' | 'info' | 'debug'
  message: string
  source: string
  stack?: string
  userId?: string
  sessionId?: string
  resolved: boolean
  tags: string[]
}

interface ErrorStats {
  total: number
  resolved: number
  unresolved: number
  byLevel: Record<string, number>
  bySource: Record<string, number>
  trend: 'up' | 'down' | 'stable'
}

export default function ErrorTrackingPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [stats, setStats] = useState<ErrorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)

  useEffect(() => {
    fetchErrorData()
    const interval = setInterval(fetchErrorData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchErrorData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/error-tracking')
      const data = await response.json()
      setErrors(data.errors)
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch error data:', error)
      // Fallback to mock data
      setErrors([
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Database connection timeout',
          source: 'Database',
          stack: 'Error: Connection timeout\n    at Database.connect()\n    at UserService.getUser()',
          userId: 'user-123',
          sessionId: 'session-456',
          resolved: false,
          tags: ['database', 'timeout', 'critical']
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'warning',
          message: 'High memory usage detected',
          source: 'System',
          userId: 'user-456',
          sessionId: 'session-789',
          resolved: true,
          tags: ['memory', 'performance']
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'error',
          message: 'AI prompt fetch failed',
          source: 'AI System',
          stack: 'Error: Prompt not found\n    at fetchPrompt()\n    at AIAgent.analyze()',
          userId: 'user-789',
          sessionId: 'session-012',
          resolved: false,
          tags: ['ai', 'prompt', 'fetch']
        }
      ])
      setStats({
        total: 3,
        resolved: 1,
        unresolved: 2,
        byLevel: { error: 2, warning: 1, info: 0, debug: 0 },
        bySource: { 'Database': 1, 'System': 1, 'AI System': 1 },
        trend: 'up'
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredErrors = errors.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === 'all' || error.level === filterLevel
    const matchesSource = filterSource === 'all' || error.source === filterSource
    
    return matchesSearch && matchesLevel && matchesSource
  })

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      case 'debug': return <Bug className="h-4 w-4 text-gray-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'debug': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const resolveError = async (errorId: string) => {
    try {
      await fetch(`/api/admin/error-tracking/${errorId}/resolve`, { method: 'POST' })
      setErrors(prev => prev.map(error => 
        error.id === errorId ? { ...error, resolved: true } : error
      ))
    } catch (error) {
      console.error('Failed to resolve error:', error)
    }
  }

  const exportErrors = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'Level', 'Message', 'Source', 'Resolved'],
      ...filteredErrors.map(error => [
        error.id,
        error.timestamp,
        error.level,
        error.message,
        error.source,
        error.resolved ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `errors-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🐛 Error Tracking</h1>
          <p className="text-gray-600">Overvåk og håndter systemfeil og logger</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={fetchErrorData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Oppdater
          </Button>
          <Button variant="outline" onClick={exportErrors}>
            <Download className="h-4 w-4 mr-2" />
            Eksporter
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale Feil</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.trend === 'up' ? (
                  <span className="text-red-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Økende
                  </span>
                ) : stats.trend === 'down' ? (
                  <span className="text-green-600 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Synkende
                  </span>
                ) : (
                  <span className="text-gray-600">Stabil</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uløste Feil</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.unresolved}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.unresolved / stats.total) * 100) : 0}% av totale feil
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Løste Feil</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% av totale feil
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kritiske Feil</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.byLevel.error || 0}</div>
              <p className="text-xs text-muted-foreground">
                Krever umiddelbar oppmerksomhet
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer og Søk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Søk</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk i feilmeldinger..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Nivå</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kilde</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle</option>
                <option value="Database">Database</option>
                <option value="System">System</option>
                <option value="AI System">AI System</option>
                <option value="API">API</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setFilterLevel('all')
                  setFilterSource('all')
                }}
                className="w-full"
              >
                Nullstill Filtere
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Feil Liste</TabsTrigger>
          <TabsTrigger value="stats">Statistikk</TabsTrigger>
          <TabsTrigger value="trends">Trender</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredErrors.map((error) => (
              <Card key={error.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getLevelIcon(error.level)}
                      <div>
                        <CardTitle className="text-lg">{error.message}</CardTitle>
                        <CardDescription>
                          {error.source} • {new Date(error.timestamp).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getLevelColor(error.level)}>
                        {error.level.toUpperCase()}
                      </Badge>
                      {error.resolved ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Løst
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Uløst
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {error.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {error.userId && <span>User: {error.userId}</span>}
                      {error.sessionId && <span>Session: {error.sessionId}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedError(error)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Se Detaljer
                      </Button>
                      {!error.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveError(error.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marker som Løst
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feil etter Nivå</CardTitle>
                <CardDescription>Fordeling av feil etter alvorlighetsgrad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats?.byLevel || {}).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              level === 'error' ? 'bg-red-600' :
                              level === 'warning' ? 'bg-yellow-600' :
                              level === 'info' ? 'bg-blue-600' : 'bg-gray-600'
                            }`}
                            style={{ width: `${(count / (stats?.total || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feil etter Kilde</CardTitle>
                <CardDescription>Fordeling av feil etter systemkomponent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats?.bySource || {}).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / (stats?.total || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feil Trender</CardTitle>
              <CardDescription>Utvikling av feil over tid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Graf kommer snart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Detail Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getLevelIcon(selectedError.level)}
                  Feil Detaljer
                </CardTitle>
                <Button variant="outline" onClick={() => setSelectedError(null)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Melding</h3>
                <p className="text-gray-700">{selectedError.message}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Stack Trace</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {selectedError.stack || 'Ingen stack trace tilgjengelig'}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Metadata</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>ID:</strong> {selectedError.id}</div>
                    <div><strong>Timestamp:</strong> {new Date(selectedError.timestamp).toLocaleString()}</div>
                    <div><strong>Source:</strong> {selectedError.source}</div>
                    <div><strong>Level:</strong> {selectedError.level}</div>
                    {selectedError.userId && <div><strong>User ID:</strong> {selectedError.userId}</div>}
                    {selectedError.sessionId && <div><strong>Session ID:</strong> {selectedError.sessionId}</div>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedError.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

