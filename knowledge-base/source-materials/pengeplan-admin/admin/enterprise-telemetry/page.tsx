/**
 * Enterprise Telemetry & Alerts System
 * 
 * Real-time telemetry dashboard and alert system
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Shield, Activity, Database, Brain, CheckCircle, AlertTriangle, XCircle,
  RefreshCw, Eye, Lock, TrendingUp, TrendingDown, Clock, Users, Zap, BarChart3,
  FileText, Globe, Server, Cpu, HardDrive, Network, Smartphone, Monitor, Bot,
  Sparkles, Target, Star, ArrowUpRight, ArrowDownRight, DollarSign, Search,
  Filter, Download, ExternalLink, Info, CreditCard, Settings, AlertCircle,
  X, Loader2, Pause, Play, Layers, Scale, Gauge, LineChart, PieChart, AreaChart,
  Bell, BellOff, AlertOctagon, CheckSquare, Square, UserCheck, MessageSquare,
  Calendar, MapPin, Phone, Mail, User, ChevronDown, ChevronUp, MoreHorizontal
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Line, Area, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart,
  BarChart, Bar, ScatterChart, Scatter
} from 'recharts'
// Removed non-existent imports - using Card components instead

// Define interfaces for data structures
interface AlertEvent {
  id: string
  severity: 'P0' | 'P1' | 'P2' | 'P3'
  category: string
  title: string
  message: string
  source: string
  topic: string
  correlationId?: string
  labels?: Record<string, any>
  metrics?: Record<string, any>
  status: 'open' | 'ack' | 'resolved' | 'suppressed'
  owner?: string
  playbookId?: string
  createdAt: Date
  lastSeenAt: Date
  resolvedAt?: Date
}

interface AgentHeartbeat {
  id: string
  agent: string
  status: 'ok' | 'degraded' | 'down'
  latencyMs: number
  tasksRunning: number
  failuresLast5m: number
  lastTask?: string
  metadata?: Record<string, any>
  updatedAt: Date
}

interface TraceIndex {
  id: string
  correlationId: string
  spanCount: number
  firstSeen: Date
  lastSeen: Date
  hotPath?: string[]
  rootCause?: string
  duration?: number
  status: 'active' | 'completed' | 'failed'
}

interface TelemetryData {
  alerts: {
    total: number
    open: number
    acknowledged: number
    resolved: number
    suppressed: number
    bySeverity: Array<{ severity: string; count: number }>
    byCategory: Array<{ category: string; count: number }>
    recent: AlertEvent[]
  }
  agents: {
    total: number
    healthy: number
    degraded: number
    down: number
    heartbeats: AgentHeartbeat[]
  }
  traces: {
    total: number
    active: number
    completed: number
    failed: number
    avgDuration: number
    recent: TraceIndex[]
  }
  metrics: {
    systemHealth: number
    responseTime: number
    errorRate: number
    throughput: number
    memoryUsage: number
    cpuUsage: number
  }
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
  onClick?: () => void
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
  onClick
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
    <Card 
      className={`${getColorClasses(color)} transition-all duration-200 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const EnterpriseTelemetryDashboard: React.FC = () => {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<AlertEvent | null>(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [alertAction, setAlertAction] = useState<'ack' | 'resolve' | 'suppress'>('ack')
  const [alertNote, setAlertNote] = useState('')

  const fetchTelemetryData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/telemetry') // Assuming this API exists
      if (response.ok) {
        const result = await response.json()
        setTelemetryData(result.data)
        setLastUpdate(new Date())
      } else {
        console.error('Failed to fetch telemetry data')
      }
    } catch (error) {
      console.error('Error fetching telemetry data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTelemetryData()
  }, [fetchTelemetryData])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        setRefreshing(true)
        fetchTelemetryData()
      }, 10000) // Refresh every 10 seconds for real-time feel
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, fetchTelemetryData])

  const handleAlertAction = async () => {
    if (!selectedAlert) return

    try {
      const response = await fetch(`/api/admin/telemetry/alerts/${selectedAlert.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: alertAction,
          note: alertNote
        })
      })

      if (response.ok) {
        await fetchTelemetryData()
        setIsAlertDialogOpen(false)
        setSelectedAlert(null)
        setAlertNote('')
      }
    } catch (error) {
      console.error('Error performing alert action:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'P0': return 'red'
      case 'P1': return 'orange'
      case 'P2': return 'blue'
      case 'P3': return 'green'
      default: return 'blue'
    }
  }

  const getSeverityBadge = (severity: string) => {
    const color = getSeverityColor(severity)
    return (
      <Badge 
        variant={color === 'red' ? 'destructive' : color === 'orange' ? 'secondary' : 'secondary'}
        className={`bg-${color}-500 text-white`}
      >
        {severity}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <Badge variant="destructive" className="bg-red-500 text-white">Open</Badge>
      case 'ack':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Acknowledged</Badge>
      case 'resolved':
        return <Badge variant="default" className="bg-green-500 text-white">Resolved</Badge>
      case 'suppressed':
        return <Badge variant="secondary" className="bg-gray-500 text-white">Suppressed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getAgentStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ok':
        return <Badge variant="default" className="bg-green-500 text-white">Healthy</Badge>
      case 'degraded':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Degraded</Badge>
      case 'down':
        return <Badge variant="destructive" className="bg-red-500 text-white">Down</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div>
        <h1>Enterprise Telemetry & Alerts</h1>
        <p>Sanntidsovervåkning av systemhelse, agenter og alerter.</p>
        <div className="text-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Laster telemetry data...</p>
        </div>
      </div>
    )
  }

  if (!telemetryData) {
    return (
      <div>
        <h1>Enterprise Telemetry & Alerts</h1>
        <p>Sanntidsovervåkning av systemhelse, agenter og alerter.</p>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Feil</AlertTitle>
          <AlertDescription>
            Kunne ikke laste telemetry data. Vennligst prøv igjen.
          </AlertDescription>
        </Alert>
        <Button onClick={() => { setLoading(true); fetchTelemetryData() }} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Prøv igjen
        </Button>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        
          
            <Activity className="h-8 w-8 text-blue-600" /> Enterprise Telemetry & Alerts
          
          
            Sanntidsovervåkning av systemhelse, agenter og alerter med avanserte visualiseringer.
          
        

        <div className="flex justify-end mb-4 space-x-2">
          <Button 
            onClick={() => { setLoading(true); fetchTelemetryData() }} 
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {refreshing ? 'Oppdaterer...' : 'Manuell Oppdatering'}
          </Button>
          <Button 
            onClick={() => setAutoRefresh(!autoRefresh)} 
            variant={autoRefresh ? "default" : "outline"}
          >
            {autoRefresh ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            Auto-oppdatering {autoRefresh ? 'På' : 'Av'}
          </Button>
        </div>

        {/* Overall Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="System Health"
            value={`${telemetryData.metrics.systemHealth}%`}
            icon={<Activity className="h-5 w-5" />}
            color={telemetryData.metrics.systemHealth < 80 ? 'red' : telemetryData.metrics.systemHealth < 95 ? 'orange' : 'green'}
            subtitle={`Last updated: ${lastUpdate.toLocaleTimeString()}`}
          />
          <MetricCard
            title="Open Alerts"
            value={telemetryData.alerts.open}
            icon={<AlertTriangle className="h-5 w-5" />}
            color={telemetryData.alerts.open > 10 ? 'red' : telemetryData.alerts.open > 5 ? 'orange' : 'green'}
            subtitle={`${telemetryData.alerts.total} total`}
            onClick={() => setActiveTab('alerts')}
          />
          <MetricCard
            title="Agent Status"
            value={`${telemetryData.agents.healthy}/${telemetryData.agents.total}`}
            icon={<Bot className="h-5 w-5" />}
            color={telemetryData.agents.down > 0 ? 'red' : telemetryData.agents.degraded > 0 ? 'orange' : 'green'}
            subtitle={`${telemetryData.agents.down} down, ${telemetryData.agents.degraded} degraded`}
            onClick={() => setActiveTab('agents')}
          />
          <MetricCard
            title="Active Traces"
            value={telemetryData.traces.active}
            icon={<Search className="h-5 w-5" />}
            color="blue"
            subtitle={`${telemetryData.traces.total} total traces`}
            onClick={() => setActiveTab('traces')}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="alerts">Alerter</TabsTrigger>
            <TabsTrigger value="agents">Agenter</TabsTrigger>
            <TabsTrigger value="traces">Sporing</TabsTrigger>
            <TabsTrigger value="metrics">Metrikker</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Alert Severity Distribution</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={telemetryData.alerts.bySeverity}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ severity, percent }) => `${severity}: ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                      >
                        {telemetryData.alerts.bySeverity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Agent Health Status</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ScrollArea className="h-full pr-4">
                    {telemetryData.agents.heartbeats.map((agent, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-2">
                          {getAgentStatusBadge(agent.status)}
                          <span className="font-medium">{agent.agent}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {agent.status === 'down' ? 'Down' : `Tasks: ${agent.tasksRunning}, Failures: ${agent.failuresLast5m}`}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Recent Alerts</CardTitle></CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] pr-4">
                  {telemetryData.alerts.recent.length > 0 ? (
                    telemetryData.alerts.recent.map((alert, index) => (
                      <div key={index} className="flex items-start space-x-3 py-2 border-b last:border-b-0">
                        {alert.severity === 'P0' && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
                        {alert.severity === 'P1' && <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />}
                        {alert.severity === 'P2' && <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />}
                        {alert.severity === 'P3' && <Info className="h-5 w-5 text-green-500 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="font-medium">{alert.title} {getSeverityBadge(alert.severity)} {getStatusBadge(alert.status)}</p>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {alert.source} • {alert.category} • {alert.createdAt.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAlert(alert)
                            setIsAlertDialogOpen(true)
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No recent alerts.</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard title="Total Alerts" value={telemetryData.alerts.total} icon={<Bell className="h-5 w-5" />} color="blue" />
              <MetricCard title="Open Alerts" value={telemetryData.alerts.open} icon={<AlertTriangle className="h-5 w-5" />} color="red" />
              <MetricCard title="Acknowledged" value={telemetryData.alerts.acknowledged} icon={<CheckSquare className="h-5 w-5" />} color="orange" />
              <MetricCard title="Resolved" value={telemetryData.alerts.resolved} icon={<CheckCircle className="h-5 w-5" />} color="green" />
              <MetricCard title="Suppressed" value={telemetryData.alerts.suppressed} icon={<BellOff className="h-5 w-5" />} color="purple" />
            </div>
            
            <Card>
              <CardHeader><CardTitle>Alert Categories</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={telemetryData.alerts.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard title="Total Agents" value={telemetryData.agents.total} icon={<Bot className="h-5 w-5" />} color="blue" />
              <MetricCard title="Healthy" value={telemetryData.agents.healthy} icon={<CheckCircle className="h-5 w-5" />} color="green" />
              <MetricCard title="Degraded" value={telemetryData.agents.degraded} icon={<AlertTriangle className="h-5 w-5" />} color="orange" />
              <MetricCard title="Down" value={telemetryData.agents.down} icon={<XCircle className="h-5 w-5" />} color="red" />
            </div>
            
            <Card>
              <CardHeader><CardTitle>Agent Performance</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={telemetryData.agents.heartbeats}>
                    <XAxis dataKey="agent" />
                    <YAxis yAxisId="left" label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Tasks', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Area yAxisId="left" type="monotone" dataKey="latencyMs" fill="#8884d8" stroke="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="tasksRunning" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traces" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard title="Total Traces" value={telemetryData.traces.total} icon={<Search className="h-5 w-5" />} color="blue" />
              <MetricCard title="Active" value={telemetryData.traces.active} icon={<Activity className="h-5 w-5" />} color="green" />
              <MetricCard title="Completed" value={telemetryData.traces.completed} icon={<CheckCircle className="h-5 w-5" />} color="green" />
              <MetricCard title="Failed" value={telemetryData.traces.failed} icon={<XCircle className="h-5 w-5" />} color="red" />
              <MetricCard title="Avg Duration" value={`${telemetryData.traces.avgDuration}ms`} icon={<Clock className="h-5 w-5" />} color="purple" />
            </div>
            
            <Card>
              <CardHeader><CardTitle>Recent Traces</CardTitle></CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {telemetryData.traces.recent.length > 0 ? (
                    telemetryData.traces.recent.map((trace, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(trace.status)}
                          <span className="font-medium">{trace.correlationId}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {trace.spanCount} spans • {trace.duration ? `${trace.duration}ms` : 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No recent traces.</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard title="Response Time" value={`${telemetryData.metrics.responseTime}ms`} icon={<Zap className="h-5 w-5" />} color={telemetryData.metrics.responseTime > 200 ? 'red' : 'green'} />
              <MetricCard title="Error Rate" value={`${(telemetryData.metrics.errorRate * 100).toFixed(2)}%`} icon={<XCircle className="h-5 w-5" />} color={telemetryData.metrics.errorRate > 0.01 ? 'red' : 'green'} />
              <MetricCard title="Throughput" value={telemetryData.metrics.throughput} icon={<TrendingUp className="h-5 w-5" />} color="blue" />
              <MetricCard title="Memory Usage" value={`${telemetryData.metrics.memoryUsage.toFixed(1)}%`} icon={<HardDrive className="h-5 w-5" />} color={telemetryData.metrics.memoryUsage > 80 ? 'red' : telemetryData.metrics.memoryUsage > 50 ? 'orange' : 'green'} />
              <MetricCard title="CPU Usage" value={`${telemetryData.metrics.cpuUsage.toFixed(1)}%`} icon={<Cpu className="h-5 w-5" />} color={telemetryData.metrics.cpuUsage > 80 ? 'red' : telemetryData.metrics.cpuUsage > 50 ? 'orange' : 'green'} />
            </div>
            
            <Card>
              <CardHeader><CardTitle>System Metrics</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[
                    { name: 'CPU', value: telemetryData.metrics.cpuUsage },
                    { name: 'Memory', value: telemetryData.metrics.memoryUsage },
                    { name: 'Error Rate', value: telemetryData.metrics.errorRate * 100 }
                  ]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alert Action Dialog */}
        <Dialog>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Alert Action</DialogTitle>
              <DialogDescription>
                {selectedAlert && `Perform action on alert: ${selectedAlert.title}`}
              </DialogDescription>
            </DialogHeader>
            {selectedAlert && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getSeverityBadge(selectedAlert.severity)}
                  {getStatusBadge(selectedAlert.status)}
                </div>
                <div>
                  <Label>Action</Label>
                  <Select
                    value={alertAction}
                    onValueChange={(value: 'ack' | 'resolve' | 'suppress') => 
                      setAlertAction(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ack">Acknowledge</SelectItem>
                      <SelectItem value="resolve">Resolve</SelectItem>
                      <SelectItem value="suppress">Suppress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Note</Label>
                  <Textarea
                    value={alertNote}
                    onChange={(e) => setAlertNote(e.target.value)}
                    placeholder="Add a note about this action..."
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAlertAction}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    {alertAction === 'ack' ? 'Acknowledge' : alertAction === 'resolve' ? 'Resolve' : 'Suppress'}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default EnterpriseTelemetryDashboard
