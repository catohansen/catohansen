'use client'

/**
 * Multi-Agent System Dashboard
 * 
 * This dashboard provides real-time monitoring and control of the
 * Multi-Agent Orchestration System for Pengeplan 2.0.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Bot, 
  Activity, 
  Play, 
  Pause, 
  Square, 
  RefreshCw,
  Settings,
  Eye,
  Zap,
  Shield,
  Database,
  Brain,
  Server,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Loader2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  ResponsiveContainer
} from 'recharts'

interface AgentStatus {
  name: string
  type: 'BACKEND' | 'FRONTEND' | 'SECURITY' | 'ANALYTICS' | 'OBSERVABILITY'
  enabled: boolean
  priority: number
  interval: number
  lastRun?: string
  status: 'idle' | 'running' | 'error' | 'disabled'
}

interface AgentTask {
  id: string
  agentType: string
  task: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: string
  startedAt?: string
  completedAt?: string
  result?: any
  error?: string
}

interface SystemOptimization {
  id: string
  type: 'performance' | 'security' | 'data_integrity' | 'user_experience'
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  status: 'identified' | 'implementing' | 'completed' | 'failed'
  metrics: {
    before: number
    after: number
    improvement: number
  }
  agentResponsible: string
  createdAt: string
  completedAt?: string
}

interface MultiAgentSystemStatus {
  isRunning: boolean
  agents: AgentStatus[]
  activeTasks: number
  completedTasks: number
  failedTasks: number
  optimizations: SystemOptimization[]
}

const MultiAgentDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<MultiAgentSystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [expandedAgents, setExpandedAgents] = useState<string[]>([])

  // Fetch system status
  const fetchSystemStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/multi-agent')
      if (response.ok) {
        const result = await response.json()
        setSystemStatus(result.data)
        setLastUpdate(new Date())
      } else {
        console.error('Failed to fetch multi-agent system status')
      }
    } catch (error) {
      console.error('Error fetching multi-agent system status:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchSystemStatus()
  }, [fetchSystemStatus])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setRefreshing(true)
      fetchSystemStatus()
    }, 10000)

    return () => clearInterval(interval)
  }, [autoRefresh, fetchSystemStatus])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchSystemStatus()
  }

  const handleSystemControl = async (action: string) => {
    try {
      const response = await fetch('/api/admin/multi-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        await fetchSystemStatus()
      } else {
        console.error(`Failed to ${action} system`)
      }
    } catch (error) {
      console.error(`Error ${action}ing system:`, error)
    }
  }

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'BACKEND': return <Server className="h-5 w-5" />
      case 'FRONTEND': return <Eye className="h-5 w-5" />
      case 'SECURITY': return <Shield className="h-5 w-5" />
      case 'ANALYTICS': return <Activity className="h-5 w-5" />
      case 'OBSERVABILITY': return <Zap className="h-5 w-5" />
      default: return <Bot className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'green'
      case 'idle': return 'blue'
      case 'error': return 'red'
      case 'disabled': return 'gray'
      default: return 'blue'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'idle': return <Clock className="h-4 w-4 text-blue-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      case 'disabled': return <Square className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'red'
      case 'high': return 'orange'
      case 'medium': return 'blue'
      case 'low': return 'green'
      default: return 'blue'
    }
  }

  const toggleAgentExpansion = (agentName: string) => {
    setExpandedAgents(prev => 
      prev.includes(agentName) 
        ? prev.filter(name => name !== agentName)
        : [...prev, agentName]
    )
  }

  // Sample data for charts
  const agentPerformanceData = [
    { time: '00:00', backend: 95, frontend: 88, security: 98, analytics: 92, observability: 96 },
    { time: '04:00', backend: 94, frontend: 87, security: 97, analytics: 91, observability: 95 },
    { time: '08:00', backend: 96, frontend: 89, security: 99, analytics: 93, observability: 97 },
    { time: '12:00', backend: 95, frontend: 88, security: 98, analytics: 92, observability: 96 },
    { time: '16:00', backend: 97, frontend: 90, security: 99, analytics: 94, observability: 98 },
    { time: '20:00', backend: 95, frontend: 88, security: 98, analytics: 92, observability: 96 }
  ]

  const taskDistributionData = [
    { name: 'Completed', value: systemStatus?.completedTasks || 0, color: '#10B981' },
    { name: 'Running', value: systemStatus?.activeTasks || 0, color: '#3B82F6' },
    { name: 'Failed', value: systemStatus?.failedTasks || 0, color: '#EF4444' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-lg font-medium text-gray-600">Loading Multi-Agent System...</span>
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Multi-Agent System</h1>
                <p className="text-sm text-gray-600">Intelligent Orchestration & Monitoring</p>
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
        {/* System Control */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant={systemStatus?.isRunning ? 'default' : 'secondary'}>
                  {systemStatus?.isRunning ? 'Running' : 'Stopped'}
                </Badge>
                <span className="text-sm text-gray-600">
                  {systemStatus?.isRunning ? 'All agents operational' : 'System stopped'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleSystemControl('start')}
                  disabled={systemStatus?.isRunning}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSystemControl('stop')}
                  disabled={!systemStatus?.isRunning}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {systemStatus?.agents.filter(a => a.status === 'running').length || 0}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                  <p className="text-2xl font-bold text-green-600">
                    {systemStatus?.activeTasks || 0}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {systemStatus?.completedTasks || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Tasks</p>
                  <p className="text-2xl font-bold text-red-600">
                    {systemStatus?.failedTasks || 0}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Agent Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={agentPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="backend" stroke="#3B82F6" strokeWidth={2} name="Backend AI" />
                      <Line type="monotone" dataKey="frontend" stroke="#10B981" strokeWidth={2} name="Frontend AI" />
                      <Line type="monotone" dataKey="security" stroke="#EF4444" strokeWidth={2} name="Security AI" />
                      <Line type="monotone" dataKey="analytics" stroke="#F59E0B" strokeWidth={2} name="Analytics AI" />
                      <Line type="monotone" dataKey="observability" stroke="#8B5CF6" strokeWidth={2} name="Observability AI" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Task Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Task Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={taskDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {taskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemStatus?.agents.filter(a => a.status === 'error').length > 0 ? (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Agent Errors Detected</AlertTitle>
                      <AlertDescription>
                        {systemStatus.agents.filter(a => a.status === 'error').length} agent(s) are in error state.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>All Systems Operational</AlertTitle>
                      <AlertDescription>
                        All agents are running normally with no errors detected.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="space-y-4">
              {systemStatus?.agents.map((agent) => (
                <Card key={agent.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getAgentIcon(agent.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{agent.name}</h3>
                          <p className="text-sm text-gray-600">
                            Priority: {agent.priority} • Interval: {agent.interval}ms
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusColor(agent.status) === 'green' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAgentExpansion(agent.name)}
                        >
                          {expandedAgents.includes(agent.name) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {expandedAgents.includes(agent.name) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Status</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {getStatusIcon(agent.status)}
                              <span className="text-sm">{agent.status}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Last Run</p>
                            <p className="text-sm text-gray-900">
                              {agent.lastRun ? new Date(agent.lastRun).toLocaleString() : 'Never'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Enabled</p>
                            <p className="text-sm text-gray-900">
                              {agent.enabled ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {/* This would be populated with actual task data */}
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No recent tasks available</p>
                      <p className="text-sm">Tasks will appear here as agents execute them</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimizations Tab */}
          <TabsContent value="optimizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Optimizations</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {/* This would be populated with actual optimization data */}
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No optimizations identified yet</p>
                      <p className="text-sm">Optimizations will appear here as agents identify them</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleString()} • Multi-Agent System v2.0.0
        </div>
      </div>
    </div>
  )
}

export default MultiAgentDashboard
