'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Target,
  Users,
  Zap,
  Brain,
  Settings,
  Download,
  RefreshCw,
  Server,
  Database,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Award,
  Star
} from 'lucide-react'

interface SystemSnapshot {
  timestamp: string
  period: string
  systemStatus: 'Stable' | 'Warning' | 'Critical'
  uptime: number
  version: string
  performance: {
    avgResponseTime: number
    cacheHitRate: number
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
  }
  coreWebVitals: {
    LCP: number
    CLS: number
    FID: number
    TTFB: number
    FCP: number
    SI: number
  }
  ai: {
    totalAgents: number
    healthyAgents: number
    activeAgents: number
    avgROI: number
    recommendations: number
    highPriorityItems: number
  }
  alerts: {
    last24h: number
    critical: number
    warnings: number
    resolved: number
  }
  business: {
    totalUsers: number
    activeUsers: number
    conversionRate: number
    revenue: number
    growth: number
  }
  trends: Array<{
    time: string
    uptime: number
    performance: number
    errors: number
    requests: number
  }>
  healthScore: number
  recommendations: Array<{
    agent: string
    priority: 'high' | 'medium' | 'low'
    recommendation: string
    impact: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function TechSnapshotDashboard() {
  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadSnapshot()
    const interval = setInterval(loadSnapshot, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadSnapshot = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/system/snapshot')
      if (response.ok) {
        const data = await response.json()
        setSnapshot(data.data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to load snapshot:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportSnapshot = async (format: 'json' | 'pdf' = 'json') => {
    try {
      setExporting(true)
      
      const response = await fetch('/api/admin/system/snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export', format })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (format === 'json') {
          const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `pengeplan-snapshot-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }
    } catch (error) {
      console.error('Failed to export snapshot:', error)
    } finally {
      setExporting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stable': return 'text-green-600'
      case 'Warning': return 'text-yellow-600'
      case 'Critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Stable': return <Badge className="bg-green-100 text-green-800">Stable</Badge>
      case 'Warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'Critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  if (loading && !snapshot) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system snapshot...</p>
        </div>
      </div>
    )
  }

  if (!snapshot) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load system snapshot. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span>Tech Snapshot Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive system overview for investors and stakeholders
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={loadSnapshot} 
              size="sm" 
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => exportSnapshot('json')} 
              size="sm"
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export JSON'}
            </Button>
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center space-x-2">
              <span className={getStatusColor(snapshot.systemStatus)}>
                {snapshot.systemStatus}
              </span>
              {getStatusBadge(snapshot.systemStatus)}
            </div>
            <p className="text-xs text-muted-foreground">
              Health Score: {snapshot.healthScore}/100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.ai.healthyAgents}/{snapshot.ai.totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              Healthy agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.alerts.last24h}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-gray-600">{snapshot.performance.avgResponseTime}ms</span>
              </div>
              <Progress value={100 - (snapshot.performance.avgResponseTime / 5)} className="w-full" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cache Hit Rate</span>
                <span className="text-sm text-gray-600">{snapshot.performance.cacheHitRate}%</span>
              </div>
              <Progress value={snapshot.performance.cacheHitRate} className="w-full" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-gray-600">{snapshot.performance.cpuUsage}%</span>
              </div>
              <Progress value={snapshot.performance.cpuUsage} className="w-full" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-600">{snapshot.performance.memoryUsage}%</span>
              </div>
              <Progress value={snapshot.performance.memoryUsage} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Core Web Vitals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">LCP</span>
                <span className={`text-sm ${snapshot.coreWebVitals.LCP < 2.5 ? 'text-green-600' : 'text-red-600'}`}>
                  {snapshot.coreWebVitals.LCP}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CLS</span>
                <span className={`text-sm ${snapshot.coreWebVitals.CLS < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                  {snapshot.coreWebVitals.CLS}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">FID</span>
                <span className={`text-sm ${snapshot.coreWebVitals.FID < 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {snapshot.coreWebVitals.FID}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">TTFB</span>
                <span className={`text-sm ${snapshot.coreWebVitals.TTFB < 200 ? 'text-green-600' : 'text-red-600'}`}>
                  {snapshot.coreWebVitals.TTFB}ms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>System Performance Trends (24h)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={snapshot.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="uptime"
                stackId="1"
                stroke="#8884D8"
                fill="#8884D8"
                fillOpacity={0.6}
                name="Uptime (%)"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="performance"
                stackId="2"
                stroke="#82CA9D"
                fill="#82CA9D"
                fillOpacity={0.6}
                name="Performance (%)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="errors"
                stroke="#FF8042"
                strokeWidth={2}
                name="Errors"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Agents</span>
                <span className="text-sm text-gray-600">{snapshot.ai.activeAgents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average ROI</span>
                <span className="text-sm text-green-600">+{snapshot.ai.avgROI}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Recommendations</span>
                <span className="text-sm text-gray-600">{snapshot.ai.recommendations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">High Priority</span>
                <span className="text-sm text-red-600">{snapshot.ai.highPriorityItems}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Business Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Users</span>
                <span className="text-sm text-gray-600">{snapshot.business.totalUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Users</span>
                <span className="text-sm text-gray-600">{snapshot.business.activeUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Conversion Rate</span>
                <span className="text-sm text-green-600">{snapshot.business.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Growth</span>
                <span className="text-sm text-green-600">+{snapshot.business.growth}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {snapshot.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>AI Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {snapshot.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{rec.agent}</h3>
                      <p className="text-sm text-gray-600">{rec.recommendation}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {rec.priority}
                      </Badge>
                      <p className="text-sm font-medium mt-1">Impact: +{rec.impact}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

         {/* Footer */}
         <div className="flex justify-between items-center text-sm text-gray-500">
           <p>System Version: {snapshot.version} | Period: {snapshot.period}</p>
           <div className="flex space-x-2">
             <Button onClick={()=>window.open('/api/admin/system/snapshot')} className='bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700'>JSON</Button>
             <Button onClick={()=>window.open('/api/admin/system/snapshot/pdf')} className='bg-green-600 text-white px-3 py-1 text-xs rounded hover:bg-green-700'>PDF</Button>
             <Button onClick={()=>window.open('/admin/system/snapshot/recipients')} className='bg-purple-600 text-white px-3 py-1 text-xs rounded hover:bg-purple-700'>Mottakere</Button>
             <p>Generated: {new Date(snapshot.timestamp).toLocaleString()}</p>
           </div>
         </div>
    </div>
  )
}
