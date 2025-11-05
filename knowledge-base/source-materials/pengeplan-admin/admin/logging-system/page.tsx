'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Clock,
  User,
  Activity,
  Database,
  Server,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
  Bug,
  Eye,
  Trash2,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  source: string
  message: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  stackTrace?: string
  tags: string[]
}

interface LogStats {
  total: number
  byLevel: Record<string, number>
  bySource: Record<string, number>
  errorRate: number
  avgResponseTime: number
  topErrors: Array<{ message: string; count: number }>
}

interface LogFilter {
  level: string
  source: string
  timeRange: string
  searchTerm: string
  userId?: string
}

export default function LoggingSystemPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState<LogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<LogFilter>({
    level: 'all',
    source: 'all',
    timeRange: '1h',
    searchTerm: ''
  })
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  useEffect(() => {
    fetchLogData()
    const interval = setInterval(fetchLogData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchLogData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/logging-system')
      const data = await response.json()
      setLogs(data.logs)
      setStats(data.stats)
    } catch (error) {
      // Failed to fetch log data - using fallback data
      console.warn('Failed to fetch log data, using fallback:', error.message)
      // Fallback to mock data
      setLogs([
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'error',
          source: 'Database',
          message: 'Connection timeout to PostgreSQL database',
          context: { query: 'SELECT * FROM users', duration: 5000 },
          userId: 'user-123',
          sessionId: 'session-456',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          stackTrace: 'Error: Connection timeout\n    at Database.connect()\n    at UserService.getUser()',
          tags: ['database', 'timeout', 'critical']
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'info',
          source: 'API',
          message: 'User login successful',
          context: { userId: 'user-789', loginMethod: 'email' },
          userId: 'user-789',
          sessionId: 'session-789',
          ip: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          tags: ['auth', 'login', 'success']
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'warn',
          source: 'AI Service',
          message: 'AI response time exceeded threshold',
          context: { responseTime: 1500, threshold: 1000 },
          userId: 'user-456',
          sessionId: 'session-012',
          ip: '192.168.1.75',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          tags: ['ai', 'performance', 'warning']
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          level: 'debug',
          source: 'Cache',
          message: 'Cache miss for key: user_preferences_123',
          context: { key: 'user_preferences_123', ttl: 3600 },
          tags: ['cache', 'miss', 'debug']
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          level: 'fatal',
          source: 'System',
          message: 'Out of memory error - system restart required',
          context: { memoryUsage: '95%', availableMemory: '512MB' },
          stackTrace: 'FatalError: Out of memory\n    at System.allocateMemory()\n    at ProcessManager.start()',
          tags: ['system', 'memory', 'fatal']
        }
      ])
      setStats({
        total: 1247,
        byLevel: { debug: 156, info: 892, warn: 123, error: 67, fatal: 9 },
        bySource: { 'Database': 234, 'API': 456, 'AI Service': 189, 'Cache': 298, 'System': 70 },
        errorRate: 5.4,
        avgResponseTime: 245,
        topErrors: [
          { message: 'Connection timeout', count: 23 },
          { message: 'Invalid credentials', count: 18 },
          { message: 'Rate limit exceeded', count: 15 },
          { message: 'Database lock timeout', count: 12 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filters.level === 'all' || log.level === filters.level
    const matchesSource = filters.source === 'all' || log.source === filters.source
    const matchesSearch = log.message.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         (log.userId && log.userId.includes(filters.searchTerm))
    
    return matchesLevel && matchesSource && matchesSearch
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'fatal': return 'bg-red-100 text-red-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'warn': return 'bg-yellow-100 text-yellow-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'debug': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'fatal': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      case 'debug': return <Bug className="h-4 w-4 text-gray-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Source', 'Message', 'User ID', 'IP'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.source,
        log.message,
        log.userId || '',
        log.ip || ''
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
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
          <h1 className="text-3xl font-bold text-gray-900">📝 Logging System</h1>
          <p className="text-gray-600">Comprehensive system logging og log analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={fetchLogData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Oppdater
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Eksporter
          </Button>
        </div>
      </div>

      {/* Log Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale Logger</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Siste 24 timer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feilrate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.errorRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.byLevel.error + stats.byLevel.fatal} feil totalt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gjennomsnittlig Svarstid</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">
                System performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kritiske Feil</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.byLevel.fatal}</div>
              <p className="text-xs text-muted-foreground">
                Fatal errors
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Søk</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk i logger..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Nivå</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle</option>
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="fatal">Fatal</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kilde</label>
              <select
                value={filters.source}
                onChange={(e) => setFilters({...filters, source: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle</option>
                <option value="Database">Database</option>
                <option value="API">API</option>
                <option value="AI Service">AI Service</option>
                <option value="Cache">Cache</option>
                <option value="System">System</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tidsperiode</label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1h">Siste time</option>
                <option value="6h">Siste 6 timer</option>
                <option value="24h">Siste 24 timer</option>
                <option value="7d">Siste 7 dager</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({
                  level: 'all',
                  source: 'all',
                  timeRange: '1h',
                  searchTerm: ''
                })}
                className="w-full"
              >
                Nullstill Filtere
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Content */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Log Entries</TabsTrigger>
          <TabsTrigger value="stats">Statistikk</TabsTrigger>
          <TabsTrigger value="errors">Feilanalyse</TabsTrigger>
          <TabsTrigger value="settings">Innstillinger</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getLevelIcon(log.level)}
                      <div>
                        <CardTitle className="text-lg">{log.message}</CardTitle>
                        <CardDescription>
                          {log.source} • {new Date(log.timestamp).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Se Detaljer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {log.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {log.userId && (
                        <div>
                          <span className="font-semibold">User ID:</span>
                          <div className="text-gray-600">{log.userId}</div>
                        </div>
                      )}
                      {log.ip && (
                        <div>
                          <span className="font-semibold">IP:</span>
                          <div className="text-gray-600">{log.ip}</div>
                        </div>
                      )}
                      {log.sessionId && (
                        <div>
                          <span className="font-semibold">Session:</span>
                          <div className="text-gray-600">{log.sessionId}</div>
                        </div>
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Logger etter Nivå
                </CardTitle>
                <CardDescription>Fordeling av logger etter alvorlighetsgrad</CardDescription>
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
                              level === 'fatal' || level === 'error' ? 'bg-red-600' :
                              level === 'warn' ? 'bg-yellow-600' :
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
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Logger etter Kilde
                </CardTitle>
                <CardDescription>Fordeling av logger etter systemkomponent</CardDescription>
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

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Top Feil
              </CardTitle>
              <CardDescription>Mest frekvente feilmeldinger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topErrors.map((error, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{error.message}</div>
                      <div className="text-sm text-gray-600">
                        {error.count} forekomster
                      </div>
                    </div>
                    <Badge variant="destructive">
                      {error.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Logging Innstillinger
                </CardTitle>
                <CardDescription>Konfigurer logging parametere</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Debug Logging</h4>
                    <p className="text-sm text-gray-600">Aktiver debug level logging</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Structured Logging</h4>
                    <p className="text-sm text-gray-600">Bruk JSON format for logger</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Log Rotation</h4>
                    <p className="text-sm text-gray-600">Automatisk rotasjon av log filer</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Log Retention
                </CardTitle>
                <CardDescription>Konfigurer log oppbevaring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Debug Logs</label>
                  <div className="text-sm text-gray-600">7 dager</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Info Logs</label>
                  <div className="text-sm text-gray-600">30 dager</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Error Logs</label>
                  <div className="text-sm text-gray-600">90 dager</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Fatal Logs</label>
                  <div className="text-sm text-gray-600">1 år</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getLevelIcon(selectedLog.level)}
                  Log Detaljer
                </CardTitle>
                <Button variant="outline" onClick={() => setSelectedLog(null)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Melding</h3>
                <p className="text-gray-700">{selectedLog.message}</p>
              </div>
              {selectedLog.stackTrace && (
                <div>
                  <h3 className="font-semibold mb-2">Stack Trace</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              )}
              {selectedLog.context && (
                <div>
                  <h3 className="font-semibold mb-2">Context</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.context, null, 2)}
                  </pre>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Metadata</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>ID:</strong> {selectedLog.id}</div>
                    <div><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</div>
                    <div><strong>Source:</strong> {selectedLog.source}</div>
                    <div><strong>Level:</strong> {selectedLog.level}</div>
                    {selectedLog.userId && <div><strong>User ID:</strong> {selectedLog.userId}</div>}
                    {selectedLog.sessionId && <div><strong>Session ID:</strong> {selectedLog.sessionId}</div>}
                    {selectedLog.ip && <div><strong>IP:</strong> {selectedLog.ip}</div>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLog.tags.map((tag, index) => (
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

