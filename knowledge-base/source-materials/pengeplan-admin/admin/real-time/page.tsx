'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  Users, 
  Server, 
  Database, 
  Network, 
  Shield, 
  Brain, 
  Zap, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Download, 
  Settings, 
  Bell, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Key,
  Heart,
  Target,
  Award,
  Trophy,
  Sparkles
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts'

interface RealTimeMetric {
  timestamp: string
  value: number
  status: 'normal' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  resolved: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface LiveUser {
  id: string
  name: string
  type: 'user' | 'verge' | 'admin'
  currentPage: string
  sessionDuration: number
  lastActivity: string
  location: string
  device: string
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  avgResponseTime: number
  errorRate: number
  cpu: number
  memory: number
  disk: number
  network: number
  activeConnections: number
  lastUpdated: string
}

export default function RealTimePage() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [dataSource, setDataSource] = useState<'fresh' | 'cached'>('fresh')
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Oversikt', icon: Globe },
    { id: 'users', label: 'Brukere', icon: Users },
    { id: 'system', label: 'System', icon: Server },
    { id: 'alerts', label: 'Alerts', icon: Bell }
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  useEffect(() => {
    fetchRealTimeData()
    
    const interval = setInterval(fetchRealTimeData, 30000) // Update every 30 seconds
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchRealTimeData = useCallback(async () => {
    try {
      if (metrics.length === 0) {
        setLoading(true)
      }
      
      const response = await fetch('/api/admin/real-time')
      const data = await response.json()
      
      if (data.success) {
        setDataSource(data.cached ? 'cached' : 'fresh')
        
        if (!data.cached) {
          setMetrics(data.data.metrics)
          setAlerts(data.data.alerts)
          setLiveUsers(data.data.liveUsers)
          setSystemHealth(data.data.systemHealth)
        }
      } else {
        console.error('Failed to fetch real-time data:', data.error)
      }

    } catch (error) {
      console.error('Error fetching real-time data:', error)
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }, [metrics.length])

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <Bell className="h-4 w-4 text-blue-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Memoized chart component for better performance
  const MemoizedAreaChart = useMemo(() => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.6}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }, [metrics])

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Laster real-time data...</span>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout>
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-600" />
              Real-time Monitoring
            </h1>
            <p className="text-gray-600">Live oversikt over systemaktivitet</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchRealTimeData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Oppdater
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Eksporter
            </Button>
            <Badge className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
            <Badge className={`${dataSource === 'fresh' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              <Database className="h-3 w-3 mr-1" />
              {dataSource === 'fresh' ? 'Fresh Data' : 'Cached Data'}
            </Badge>
          </div>
        </div>

        {/* System Health Alert */}
        {systemHealth && systemHealth.status && (
          <Alert className={`${getHealthColor(systemHealth.status)} border-0 mt-6`}>
            <div className="flex items-center gap-2">
              {getHealthIcon(systemHealth.status)}
              <div>
                <strong>System Status:</strong> {systemHealth.status.toUpperCase()} • 
                Uptime: {systemHealth.uptime}% • 
                Response Time: {systemHealth.avgResponseTime}ms • 
                Active Connections: {systemHealth.activeConnections?.toLocaleString() || 'N/A'}
              </div>
            </div>
          </Alert>
        )}

        {/* Custom Toggle Menu - Like Legacy Dashboard */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-1">
              <div className="flex w-full space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Real-time Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">Aktive Brukere</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{liveUsers.length}</div>
                    <p className="text-sm text-gray-600">Online nå</p>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">+12% fra i går</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">System Uptime</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{systemHealth?.uptime}%</div>
                    <p className="text-sm text-gray-600">Siste 24 timer</p>
                    <div className="mt-2 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">Stabil</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      <CardTitle className="text-lg">Response Time</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{systemHealth?.avgResponseTime}ms</div>
                    <p className="text-sm text-gray-600">Gjennomsnittlig</p>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">-0.2s forbedring</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <CardTitle className="text-lg">Aktive Alerts</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {alerts.filter(alert => !alert.resolved).length}
                    </div>
                    <p className="text-sm text-gray-600">Åpne alerts</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Bell className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-600">Krever oppmerksomhet</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Activity Chart */}
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Real-time Aktivitet
                  </CardTitle>
                  <CardDescription className="text-sm">Live oversikt over systemaktivitet</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72 w-full">
                    {MemoizedAreaChart}
                  </div>
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Sist oppdatert: {lastRefresh.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              {/* System Performance */}
              {systemHealth && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-lg">CPU</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{systemHealth.cpu}%</div>
                      <p className="text-sm text-gray-600">Bruk</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg">Minne</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{systemHealth.memory}%</div>
                      <p className="text-sm text-gray-600">Bruk</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-5 w-5 text-purple-500" />
                        <CardTitle className="text-lg">Disk</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{systemHealth.disk}%</div>
                      <p className="text-sm text-gray-600">Bruk</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Network className="h-5 w-5 text-orange-500" />
                        <CardTitle className="text-lg">Nettverk</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">{systemHealth.avgResponseTime}ms</div>
                      <p className="text-sm text-gray-600">Latency</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Live Brukere
                  </CardTitle>
                  <CardDescription>Aktive brukere på systemet akkurat nå</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liveUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            user.type === 'user' ? 'bg-blue-500' :
                            user.type === 'verge' ? 'bg-purple-500' : 'bg-orange-500'
                          }`} />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.currentPage}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{user.sessionDuration} min</div>
                          <div className="text-xs text-gray-500">{user.device}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              {systemHealth && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Performance</CardTitle>
                      <CardDescription>Real-time systemytelse</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">CPU Usage:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${systemHealth.cpu}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{systemHealth.cpu}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Memory Usage:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${systemHealth.memory}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{systemHealth.memory}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Disk Usage:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${systemHealth.disk}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{systemHealth.disk}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Network Status</CardTitle>
                      <CardDescription>Nettverksytelse og tilkoblinger</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Latency:</span>
                          <span className="text-sm font-medium">{systemHealth.avgResponseTime}ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Active Connections:</span>
                          <span className="text-sm font-medium">{systemHealth.activeConnections?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Error Rate:</span>
                          <span className="text-sm font-medium">{systemHealth.errorRate}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-500" />
                    System Alerts
                  </CardTitle>
                  <CardDescription>Alle systemvarsler og hendelser</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'error' ? 'border-red-500 bg-red-50' :
                        alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                        alert.type === 'success' ? 'border-green-500 bg-green-50' :
                        'border-blue-500 bg-blue-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getAlertIcon(alert.type)}
                            <div>
                              <div className="font-medium">{alert.title}</div>
                              <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
                              <div className="text-xs text-gray-500 mt-2">
                                {new Date(alert.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            {alert.resolved ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Løst
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                Åpen
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          Sist oppdatert: {lastRefresh.toLocaleString()}
        </div>
      </div>
    </AdminPageLayout>
  )
}