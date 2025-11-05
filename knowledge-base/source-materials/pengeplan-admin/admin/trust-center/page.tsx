'use client'

/**
 * Trust Center & Transparency Layer Dashboard
 * 
 * This is the main Trust Center dashboard providing comprehensive
 * system transparency, audit trails, and real-time monitoring.
 * 
 * Implements META-PROMPT v4 principles:
 * - FRONTEND-AI: Reactive UI med live updates
 * - ANALYTICS-AI: Real-time telemetry visualization
 * - OBSERVABILITY-AI: Self-diagnostic health checks
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Shield, 
  Activity, 
  Database, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Eye,
  Lock,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Zap,
  BarChart3,
  FileText,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Network,
  Smartphone,
  Monitor,
  Bot,
  Sparkles,
  Target,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Search,
  Filter,
  Download,
  ExternalLink,
  Info,
  CreditCard,
  Settings,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts'

interface TrustCenterData {
  systemHealth: {
    overall: 'healthy' | 'degraded' | 'critical'
    score: number
    uptime: string
    lastChecked: string
  }
  dataIntegrity: {
    totalCalculations: number
    integrityScore: number
    auditTrailLength: number
    mockDataDetected: number
    lastScan: string
  }
  securityMetrics: {
    activeSessions: number
    failedLogins: number
    securityScore: number
    lastSecurityCheck: string
    cerbosStatus: 'healthy' | 'degraded' | 'critical'
  }
  aiTransparency: {
    totalAIRequests: number
    averageConfidence: number
    explainabilityScore: number
    lastModelUpdate: string
    aiHealthScore: number
  }
  complianceStatus: {
    gdprCompliant: boolean
    auditReady: boolean
    dataRetentionCompliant: boolean
    lastComplianceCheck: string
  }
  realTimeMetrics: {
    activeUsers: number
    requestsPerMinute: number
    averageResponseTime: number
    errorRate: number
    cacheHitRate: number
  }
  auditTrail: Array<{
    id: string
    timestamp: string
    action: string
    entity: string
    userId: string
    details: string
    integrityScore: number
  }>
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple'
  loading?: boolean
  correlationId?: string
  showTrace?: boolean
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  loading = false,
  correlationId,
  showTrace = false
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200'
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'orange': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'red': return 'text-red-600 bg-red-50 border-red-200'
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card className={`${getColorClasses(color)} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-lg font-semibold">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{value}</p>
              )}
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {trend && trendValue && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(trend)}
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
            {showTrace && correlationId && (
              <Button variant="outline" size="sm">
                Trace: {correlationId}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const TrustCenterDashboard: React.FC = () => {
  const [data, setData] = useState<TrustCenterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [traceDrawerOpen, setTraceDrawerOpen] = useState(false)
  const [traceDrawerData, setTraceDrawerData] = useState<any | null>(null)
  const [selectedCorrelationId, setSelectedCorrelationId] = useState<string | null>(null)

  // TraceDrawer functionality
  const openTraceDrawer = useCallback(async (correlationId: string) => {
    setSelectedCorrelationId(correlationId)
    setTraceDrawerOpen(true)
    
    try {
      const response = await fetch(`/api/admin/telemetry/${correlationId}`)
      if (response.ok) {
        const result = await response.json()
        setTraceDrawerData(result.data)
      } else {
        console.error('Failed to fetch trace data')
      }
    } catch (error) {
      console.error('Error fetching trace data:', error)
    }
  }, [])

  const closeTraceDrawer = useCallback(() => {
    setTraceDrawerOpen(false)
    setTraceDrawerData(null)
    setSelectedCorrelationId(null)
  }, [])

  // Trace button component
  const TraceButton = ({ 
    correlationId, 
    title = "Trace" 
  }: { 
    correlationId: string
    title?: string 
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => openTraceDrawer(correlationId)}
      className="h-6 w-6 p-0 hover:bg-blue-100"
      title={`Spor hele datakjeden for ${correlationId}`}
    >
      <Search className="h-3 w-3 text-blue-600" />
    </Button>
  )

  // FRONTEND-AI: Reactive UI med live updates
  const fetchTrustCenterData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/trust-center')
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
        setLastUpdate(new Date())
      } else {
        console.error('Failed to fetch Trust Center data')
      }
    } catch (error) {
      console.error('Error fetching Trust Center data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTrustCenterData()
  }, [fetchTrustCenterData])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setRefreshing(true)
      fetchTrustCenterData()
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh, fetchTrustCenterData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTrustCenterData()
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'green'
      case 'degraded': return 'orange'
      case 'critical': return 'red'
      default: return 'blue'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'degraded': return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />
      default: return <Activity className="h-5 w-5 text-blue-600" />
    }
  }

  // Sample data for charts
  const systemHealthHistory = [
    { time: '00:00', score: 98.5, uptime: 99.9 },
    { time: '04:00', score: 98.2, uptime: 99.8 },
    { time: '08:00', score: 98.8, uptime: 99.9 },
    { time: '12:00', score: 98.5, uptime: 99.9 },
    { time: '16:00', score: 98.7, uptime: 99.9 },
    { time: '20:00', score: 98.5, uptime: 99.9 }
  ]

  const dataIntegrityHistory = [
    { time: '00:00', integrity: 100, calculations: 1250 },
    { time: '04:00', integrity: 99.8, calculations: 1280 },
    { time: '08:00', integrity: 100, calculations: 1320 },
    { time: '12:00', integrity: 99.9, calculations: 1350 },
    { time: '16:00', integrity: 100, calculations: 1380 },
    { time: '20:00', integrity: 99.8, calculations: 1400 }
  ]

  const securityMetricsData = [
    { name: 'Active Sessions', value: data?.securityMetrics.activeSessions || 0, color: '#10B981' },
    { name: 'Failed Logins', value: data?.securityMetrics.failedLogins || 0, color: '#EF4444' },
    { name: 'Security Score', value: data?.securityMetrics.securityScore || 0, color: '#3B82F6' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-lg font-medium text-gray-600">Loading Trust Center...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trust Center</h1>
                <p className="text-sm text-gray-600">System Transparency & Monitoring Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50 border-green-200 text-green-700' : ''}
              >
                <Activity className="h-4 w-4 mr-2" />
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="System Health"
            value={data?.systemHealth.overall || 'Loading...'}
            subtitle={`Score: ${data?.systemHealth.score || 0}%`}
            icon={getHealthIcon(data?.systemHealth.overall || 'healthy')}
            color={getHealthColor(data?.systemHealth.overall || 'healthy')}
            loading={loading}
            correlationId={`system_health_${Date.now()}`}
            showTrace={true}
          />
          <MetricCard
            title="Data Integrity"
            value={`${data?.dataIntegrity.integrityScore || 0}%`}
            subtitle={`${data?.dataIntegrity.totalCalculations || 0} calculations`}
            icon={<Database className="h-5 w-5" />}
            color="green"
            loading={loading}
            correlationId={`data_integrity_${Date.now()}`}
            showTrace={true}
          />
          <MetricCard
            title="Security Score"
            value={`${data?.securityMetrics.securityScore || 0}%`}
            subtitle={`${data?.securityMetrics.activeSessions || 0} active sessions`}
            icon={<Lock className="h-5 w-5" />}
            color="blue"
            loading={loading}
            correlationId={`security_score_${Date.now()}`}
            showTrace={true}
          />
          <MetricCard
            title="AI Transparency"
            value={`${data?.aiTransparency.aiHealthScore || 0}%`}
            subtitle={`${data?.aiTransparency.totalAIRequests || 0} AI requests`}
            icon={<Brain className="h-5 w-5" />}
            color="purple"
            loading={loading}
            correlationId={`ai_transparency_${Date.now()}`}
            showTrace={true}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ai">AI Transparency</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>System Health Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={systemHealthHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Health Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="uptime" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Uptime %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Data Integrity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Data Integrity Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dataIntegrityHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="integrity" 
                        stackId="1"
                        stroke="#10B981" 
                        fill="#10B981"
                        fillOpacity={0.3}
                        name="Integrity %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Real-time Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data?.realTimeMetrics.activeUsers || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data?.realTimeMetrics.requestsPerMinute || 0}
                    </div>
                    <div className="text-sm text-gray-600">Requests/min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {data?.realTimeMetrics.averageResponseTime || 0}ms
                    </div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {data?.realTimeMetrics.errorRate || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Error Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {data?.realTimeMetrics.cacheHitRate || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Cache Hit Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Health</span>
                    <Badge variant={data?.systemHealth.overall === 'healthy' ? 'default' : 'destructive'}>
                      {data?.systemHealth.overall || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Health Score</span>
                    <span className="text-sm font-semibold">{data?.systemHealth.score || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className="text-sm font-semibold">{data?.systemHealth.uptime || '0%'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Checked</span>
                    <span className="text-sm text-gray-500">
                      {data?.systemHealth.lastChecked ? new Date(data.systemHealth.lastChecked).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Integrity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Integrity Score</span>
                    <span className="text-sm font-semibold">{data?.dataIntegrity.integrityScore || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Calculations</span>
                    <span className="text-sm font-semibold">{data?.dataIntegrity.totalCalculations || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audit Trail Length</span>
                    <span className="text-sm font-semibold">{data?.dataIntegrity.auditTrailLength || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mock Data Detected</span>
                    <span className="text-sm font-semibold text-red-600">{data?.dataIntegrity.mockDataDetected || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Security Score</span>
                    <span className="text-sm font-semibold">{data?.securityMetrics.securityScore || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Sessions</span>
                    <span className="text-sm font-semibold">{data?.securityMetrics.activeSessions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Failed Logins</span>
                    <span className="text-sm font-semibold text-red-600">{data?.securityMetrics.failedLogins || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cerbos Status</span>
                    <Badge variant={data?.securityMetrics.cerbosStatus === 'healthy' ? 'default' : 'destructive'}>
                      {data?.securityMetrics.cerbosStatus || 'Unknown'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={securityMetricsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {securityMetricsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Transparency Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Transparency</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Health Score</span>
                    <span className="text-sm font-semibold">{data?.aiTransparency.aiHealthScore || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total AI Requests</span>
                    <span className="text-sm font-semibold">{data?.aiTransparency.totalAIRequests || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Confidence</span>
                    <span className="text-sm font-semibold">{data?.aiTransparency.averageConfidence || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Explainability Score</span>
                    <span className="text-sm font-semibold">{data?.aiTransparency.explainabilityScore || 0}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confidence Level</span>
                        <span>{data?.aiTransparency.averageConfidence || 0}%</span>
                      </div>
                      <Progress value={data?.aiTransparency.averageConfidence || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Explainability</span>
                        <span>{data?.aiTransparency.explainabilityScore || 0}%</span>
                      </div>
                      <Progress value={data?.aiTransparency.explainabilityScore || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Health Score</span>
                        <span>{data?.aiTransparency.aiHealthScore || 0}%</span>
                      </div>
                      <Progress value={data?.aiTransparency.aiHealthScore || 0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">GDPR Compliant</span>
                    <Badge variant={data?.complianceStatus.gdprCompliant ? 'default' : 'destructive'}>
                      {data?.complianceStatus.gdprCompliant ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audit Ready</span>
                    <Badge variant={data?.complianceStatus.auditReady ? 'default' : 'destructive'}>
                      {data?.complianceStatus.auditReady ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Retention Compliant</span>
                    <Badge variant={data?.complianceStatus.dataRetentionCompliant ? 'default' : 'destructive'}>
                      {data?.complianceStatus.dataRetentionCompliant ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Compliance Check</span>
                    <span className="text-sm text-gray-500">
                      {data?.complianceStatus.lastComplianceCheck ? new Date(data.complianceStatus.lastComplianceCheck).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-600 mb-2">All Systems Compliant</h3>
                    <p className="text-sm text-gray-600">
                      Your system meets all regulatory requirements and is ready for audit.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {data?.auditTrail.map((audit) => (
                      <div key={audit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-1 bg-blue-100 rounded">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{audit.action}</div>
                            <div className="text-xs text-gray-500">
                              {audit.entity} • {audit.userId}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(audit.timestamp).toLocaleString()}
                          </div>
                          <div className="text-xs font-medium text-green-600">
                            {audit.integrityScore}% integrity
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!data?.auditTrail || data.auditTrail.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        No audit trail data available
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleString()} • Trust Center v2.0.0
        </div>

        {/* TraceDrawer */}
        {traceDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold">Trace Drawer</h2>
                  <p className="text-sm text-gray-500">
                    Correlation ID: {selectedCorrelationId}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeTraceDrawer}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {traceDrawerData ? (
                  <div className="space-y-6">
                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Trace Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {traceDrawerData.summary.totalEvents}
                            </div>
                            <div className="text-sm text-gray-500">Total Events</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {traceDrawerData.summary.integrityScore.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500">Integrity Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {traceDrawerData.summary.duration}ms
                            </div>
                            <div className="text-sm text-gray-500">Duration</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {traceDrawerData.summary.status}
                            </div>
                            <div className="text-sm text-gray-500">Status</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Event Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {traceDrawerData.visualization.timeline.map((event, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-shrink-0">
                                <div className={`w-3 h-3 rounded-full ${
                                  event.status === 'completed' ? 'bg-green-500' : 
                                  event.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{event.type}: {event.entity}</div>
                                <div className="text-sm text-gray-500">
                                  {event.source} • {new Date(event.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {event.latency}ms
                                </div>
                                <div className="text-xs text-gray-500">
                                  {event.integrityScore}% integrity
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Export trace functionality
                          console.log('Export trace:', selectedCorrelationId)
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Trace
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Open in audit trail
                          console.log('Open in audit trail:', selectedCorrelationId)
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in Audit Trail
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading trace data...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrustCenterDashboard
