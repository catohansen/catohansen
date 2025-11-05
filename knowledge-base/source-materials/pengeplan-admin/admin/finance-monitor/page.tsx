'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  DollarSign, 
  Eye, 
  FileText, 
  RefreshCw, 
  Shield, 
  TrendingUp, 
  Users,
  Zap,
  Brain,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react'

interface FinanceMonitorData {
  overall: {
    status: 'healthy' | 'degraded' | 'critical'
    uptime: number
    lastChecked: string
  }
  calculations: {
    total: number
    today: number
    errors: number
    averageTime: number
  }
  dataSources: {
    name: string
    status: 'healthy' | 'warning' | 'error'
    lastSync: string
    records: number
    errors: number
  }[]
  recentActivity: {
    id: string
    type: string
    userId: string
    timestamp: string
    status: 'success' | 'warning' | 'error'
    details: string
  }[]
  systemHealth: {
    database: { connected: boolean; latency: number }
    ai: { openai: boolean; deepseek: boolean }
    storage: { available: boolean; usage: string }
    api: { rateLimit: number; remaining: number }
  }
  alerts: {
    critical: number
    warning: number
    info: number
    total: number
  }
}

export default function FinanceMonitorPage() {
  const [data, setData] = useState<FinanceMonitorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    loadData()
    
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000) // 30 sekunder
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/admin/finance-monitor')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to load finance monitor data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'critical': return 'text-red-800 bg-red-200'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      case 'critical': return <AlertCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster Finance Monitor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <BarChart3 className="h-10 w-10 text-violet-600" />
                Finance Monitor
              </h1>
              <p className="text-gray-600 text-lg mt-2">Sanntids overvåkning av alle økonomiske prosesser</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={loadData}
                disabled={refreshing}
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Oppdaterer...' : 'Oppdater'}
              </Button>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Status */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Status</p>
                    <p className={`text-2xl font-bold ${getStatusColor(data?.overall.status || 'unknown')}`}>
                      {data?.overall.status?.toUpperCase() || 'UNKNOWN'}
                    </p>
                  </div>
                  {getStatusIcon(data?.overall.status || 'unknown')}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Uptime: {Math.floor((data?.overall.uptime || 0) / 3600)}h</p>
                  <p>Sist sjekket: {new Date(data?.overall.lastChecked || '').toLocaleTimeString('nb-NO')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Calculations */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Beregninger</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {data?.calculations.today || 0}
                    </p>
                    <p className="text-sm text-gray-500">i dag</p>
                  </div>
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Total: {data?.calculations.total || 0}</p>
                  <p>Feil: {data?.calculations.errors || 0}</p>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Datakilder</p>
                    <p className="text-2xl font-bold text-green-600">
                      {data?.dataSources.filter(ds => ds.status === 'healthy').length || 0}
                    </p>
                    <p className="text-sm text-gray-500">sunt</p>
                  </div>
                  <Database className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Total: {data?.dataSources.length || 0}</p>
                  <p>Feil: {data?.dataSources.filter(ds => ds.status === 'error').length || 0}</p>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Varsler</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {data?.alerts.critical || 0}
                    </p>
                    <p className="text-sm text-gray-500">kritiske</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Advarsler: {data?.alerts.warning || 0}</p>
                  <p>Total: {data?.alerts.total || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Oversikt</TabsTrigger>
              <TabsTrigger value="sources">Datakilder</TabsTrigger>
              <TabsTrigger value="activity">Aktivitet</TabsTrigger>
              <TabsTrigger value="health">Systemhelse</TabsTrigger>
              <TabsTrigger value="alerts">Varsler</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calculations Chart */}
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-blue-600" />
                      Beregninger per time
                    </CardTitle>
                    <CardDescription>
                      Antall økonomiske beregninger de siste 24 timene
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Chart kommer snart</p>
                        <p className="text-sm">Live data fra Finance Integrity Core</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Performance */}
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      System Performance
                    </CardTitle>
                    <CardDescription>
                      Ytelse og responstider
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Database</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">AI Services</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">70%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">API Rate</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">60%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Data Sources Tab */}
            <TabsContent value="sources" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Datakilder Status
                  </CardTitle>
                  <CardDescription>
                    Helse og synkronisering av alle økonomiske datakilder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.dataSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(source.status)}
                          <div>
                            <p className="font-medium">{source.name}</p>
                            <p className="text-sm text-gray-600">
                              {source.records.toLocaleString('nb-NO')} poster • 
                              Sist sync: {new Date(source.lastSync).toLocaleString('nb-NO')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(source.status)}>
                            {source.status.toUpperCase()}
                          </Badge>
                          {source.errors > 0 && (
                            <Badge variant="destructive">
                              {source.errors} feil
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Siste Aktivitet
                  </CardTitle>
                  <CardDescription>
                    Sanntids feed av alle økonomiske hendelser
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(activity.status)}
                          <div>
                            <p className="font-medium">{activity.type}</p>
                            <p className="text-sm text-gray-600">
                              Bruker: {activity.userId} • {activity.details}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(activity.timestamp).toLocaleTimeString('nb-NO')}
                          </p>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Health Tab */}
            <TabsContent value="health" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Database Health */}
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Status</span>
                        <Badge className={data?.systemHealth.database.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {data?.systemHealth.database.connected ? 'Koblet' : 'Frakoblet'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Latency</span>
                        <span>{data?.systemHealth.database.latency || 0}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Services */}
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>OpenAI</span>
                        <Badge className={data?.systemHealth.ai.openai ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {data?.systemHealth.ai.openai ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>DeepSeek</span>
                        <Badge className={data?.systemHealth.ai.deepseek ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {data?.systemHealth.ai.deepseek ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    System Varsler
                  </CardTitle>
                  <CardDescription>
                    Kritiske hendelser og advarsler som krever oppmerksomhet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Ingen aktive varsler</p>
                    <p className="text-sm text-gray-400">Systemet fungerer normalt</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
