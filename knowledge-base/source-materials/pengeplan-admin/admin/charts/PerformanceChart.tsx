'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Target, 
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  RefreshCw
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface PerformanceData {
  timestamp: string
  lcp: number
  fid: number
  cls: number
  ttfb: number
  fcp: number
  si: number
}

interface ConversionData {
  date: string
  visitors: number
  conversions: number
  conversionRate: number
  revenue: number
}

interface AgentPerformanceData {
  agent: string
  performance: number
  uptime: number
  errors: number
  requests: number
}

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  timestamp: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function PerformanceChart() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [conversionData, setConversionData] = useState<ConversionData[]>([])
  const [agentData, setAgentData] = useState<AgentPerformanceData[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')

  useEffect(() => {
    loadChartData()
    const interval = setInterval(loadChartData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const loadChartData = async () => {
    try {
      setLoading(true)
      
      // Generate mock data for demonstration
      const mockPerformanceData = generateMockPerformanceData()
      const mockConversionData = generateMockConversionData()
      const mockAgentData = generateMockAgentData()
      const mockSystemMetrics = generateMockSystemMetrics()

      setPerformanceData(mockPerformanceData)
      setConversionData(mockConversionData)
      setAgentData(mockAgentData)
      setSystemMetrics(mockSystemMetrics)
    } catch (error) {
      console.error('Failed to load chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockPerformanceData = (): PerformanceData[] => {
    const data: PerformanceData[] = []
    const now = new Date()
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      data.push({
        timestamp: timestamp.toISOString().substring(11, 16),
        lcp: Math.random() * 2 + 1,
        fid: Math.random() * 100 + 10,
        cls: Math.random() * 0.1,
        ttfb: Math.random() * 200 + 50,
        fcp: Math.random() * 1.5 + 0.5,
        si: Math.random() * 3 + 1
      })
    }
    return data
  }

  const generateMockConversionData = (): ConversionData[] => {
    const data: ConversionData[] = []
    const now = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const visitors = Math.floor(Math.random() * 1000) + 500
      const conversions = Math.floor(visitors * (Math.random() * 0.1 + 0.05))
      data.push({
        date: date.toISOString().substring(5, 10),
        visitors,
        conversions,
        conversionRate: (conversions / visitors) * 100,
        revenue: conversions * (Math.random() * 100 + 50)
      })
    }
    return data
  }

  const generateMockAgentData = (): AgentPerformanceData[] => {
    return [
      { agent: 'LandingIntelligenceAgent', performance: 95, uptime: 99.8, errors: 2, requests: 1250 },
      { agent: 'PerformanceMonitoringAgent', performance: 88, uptime: 99.5, errors: 5, requests: 2100 },
      { agent: 'TranslationManager', performance: 92, uptime: 99.9, errors: 1, requests: 800 },
      { agent: 'DatabaseOptimizer', performance: 90, uptime: 99.7, errors: 3, requests: 1500 },
      { agent: 'SEOOptimizer', performance: 87, uptime: 99.6, errors: 4, requests: 950 }
    ]
  }

  const generateMockSystemMetrics = (): SystemMetrics[] => {
    const data: SystemMetrics[] = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 2 * 60 * 60 * 1000)
      data.push({
        timestamp: timestamp.toISOString().substring(11, 16),
        cpu: Math.random() * 40 + 20,
        memory: Math.random() * 30 + 40,
        disk: Math.random() * 20 + 60,
        network: Math.random() * 50 + 25
      })
    }
    return data
  }

  const getPerformanceColor = (value: number, threshold: number) => {
    return value <= threshold ? '#10B981' : value <= threshold * 1.5 ? '#F59E0B' : '#EF4444'
  }

  const getPerformanceStatus = (value: number, threshold: number) => {
    if (value <= threshold) return 'Excellent'
    if (value <= threshold * 1.5) return 'Good'
    return 'Needs Improvement'
  }

  const exportChartData = () => {
    const data = {
      performance: performanceData,
      conversion: conversionData,
      agents: agentData,
      system: systemMetrics,
      exported: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading performance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span>Performance Analytics</span>
          </h2>
          <p className="text-gray-600 mt-1">Real-time performance metrics and analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button onClick={loadChartData} size="sm" variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportChartData} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Core Web Vitals Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Core Web Vitals</span>
          </CardTitle>
          <CardDescription>
            LCP, FID, CLS, TTFB, FCP, and SI metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  name.toUpperCase()
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="lcp" 
                stroke="#0088FE" 
                strokeWidth={2}
                name="LCP (s)"
                dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="fid" 
                stroke="#00C49F" 
                strokeWidth={2}
                name="FID (ms)"
                dot={{ fill: '#00C49F', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="cls" 
                stroke="#FFBB28" 
                strokeWidth={2}
                name="CLS"
                dot={{ fill: '#FFBB28', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="ttfb" 
                stroke="#FF8042" 
                strokeWidth={2}
                name="TTFB (ms)"
                dot={{ fill: '#FF8042', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Conversion Analytics</span>
          </CardTitle>
          <CardDescription>
            Visitor conversion rates and revenue over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name === 'conversionRate' ? 'Conversion Rate (%)' : 
                  name === 'visitors' ? 'Visitors' :
                  name === 'conversions' ? 'Conversions' : 'Revenue (NOK)'
                ]}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="visitors"
                stackId="1"
                stroke="#8884D8"
                fill="#8884D8"
                fillOpacity={0.6}
                name="Visitors"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="conversions"
                stackId="2"
                stroke="#82CA9D"
                fill="#82CA9D"
                fillOpacity={0.6}
                name="Conversions"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversionRate"
                stroke="#FF8042"
                strokeWidth={3}
                name="Conversion Rate (%)"
                dot={{ fill: '#FF8042', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Agent Performance</span>
            </CardTitle>
            <CardDescription>
              Performance metrics for all AI agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={agentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="agent" type="category" width={120} />
                <Tooltip 
                  formatter={(value, name) => [
                    typeof value === 'number' ? `${value}%` : value,
                    name === 'performance' ? 'Performance' : name
                  ]}
                />
                <Bar 
                  dataKey="performance" 
                  fill="#8884D8"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Agent Distribution</span>
            </CardTitle>
            <CardDescription>
              Performance distribution across agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={agentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ agent, performance }) => `${agent}: ${performance}%`}
                  outerRadius={80}
                  fill="#8884D8"
                  dataKey="performance"
                >
                  {agentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>System Resource Usage</span>
          </CardTitle>
          <CardDescription>
            CPU, Memory, Disk, and Network utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={systemMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}%`,
                  name.toUpperCase()
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#FF6B6B" 
                strokeWidth={2}
                name="CPU"
                dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#4ECDC4" 
                strokeWidth={2}
                name="Memory"
                dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="disk" 
                stroke="#45B7D1" 
                strokeWidth={2}
                name="Disk"
                dot={{ fill: '#45B7D1', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="network" 
                stroke="#96CEB4" 
                strokeWidth={2}
                name="Network"
                dot={{ fill: '#96CEB4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Average LCP', value: '1.8s', status: 'good', threshold: 2.5 },
          { label: 'Average FID', value: '45ms', status: 'excellent', threshold: 100 },
          { label: 'Average CLS', value: '0.05', status: 'excellent', threshold: 0.1 },
          { label: 'Conversion Rate', value: '8.2%', status: 'good', threshold: 5 }
        ].map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-gray-600">{metric.label}</div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <Badge className={
                metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                metric.status === 'good' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {metric.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}



