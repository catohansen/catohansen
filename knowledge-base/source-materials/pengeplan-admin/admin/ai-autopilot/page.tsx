'use client'

import '../../globals.css'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bot, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Target,
  Users,
  Zap,
  Brain,
  Settings,
  RefreshCw,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface AgentStatus {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  lastUpdate: Date
  performance: number
  health: string
}

interface ImprovementRecommendation {
  agent: string
  score: number
  recommendation: string
  priority: 'high' | 'medium' | 'low'
  estimatedImpact: number
  implementationTime: number
  category: 'performance' | 'conversion' | 'stability' | 'cost'
  details: string
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  components: Array<{
    name: string
    status: 'healthy' | 'degraded' | 'unhealthy'
    lastCheck: Date
    metrics: any
  }>
  alerts: Array<{
    level: 'info' | 'warning' | 'error' | 'critical'
    message: string
    timestamp: Date
    component: string
  }>
}

interface AutopilotData {
  timestamp: Date
  reports: AgentStatus[]
  recommendations: ImprovementRecommendation[]
  systemHealth: SystemHealth
  summary: {
    totalAgents: number
    healthyAgents: number
    highPriorityItems: number
    estimatedImpact: number
  }
}

export default function AIAutopilotCenter() {
  const [autopilotData, setAutopilotData] = useState<AutopilotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    loadAutopilotData()
    const interval = setInterval(loadAutopilotData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadAutopilotData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/agents/meta')
      if (response.ok) {
        const data = await response.json()
        setAutopilotData(data.data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to load autopilot data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyImprovement = async (recommendation: ImprovementRecommendation) => {
    try {
      const response = await fetch('/api/agents/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply-improvement',
          recommendation
        })
      })

      if (response.ok) {
        // Refresh data after applying improvement
        await loadAutopilotData()
        console.log('Improvement applied successfully')
      }
    } catch (error) {
      console.error('Failed to apply improvement:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'unhealthy': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case 'degraded': return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
      case 'unhealthy': return <Badge className="bg-red-100 text-red-800">Unhealthy</Badge>
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  if (loading && !autopilotData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Autopilot data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <span>AI Autopilot Center</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Automatisk koordinering og prioritering av AI-forbedringer
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={loadAutopilotData} 
              size="sm" 
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsRunning(!isRunning)} 
              size="sm"
              variant={isRunning ? "destructive" : "default"}
            >
              {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </div>
      </div>

      {/* System Overview */}
      {autopilotData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{autopilotData.summary.totalAgents}</div>
              <p className="text-xs text-muted-foreground">
                {autopilotData.summary.healthyAgents} healthy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{autopilotData.systemHealth.overall}</div>
              <p className="text-xs text-muted-foreground">
                {autopilotData.systemHealth.alerts.length} alerts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{autopilotData.summary.highPriorityItems}</div>
              <p className="text-xs text-muted-foreground">
                items need attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{autopilotData.summary.estimatedImpact}%</div>
              <p className="text-xs text-muted-foreground">
                potential improvement
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Agent Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {autopilotData ? (
                  <div className="space-y-4">
                    {autopilotData.reports.map((agent) => (
                      <div key={agent.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            agent.status === 'healthy' ? 'bg-green-500' : 
                            agent.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium">{agent.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={agent.performance} className="w-20" />
                          <span className="text-sm text-gray-600">{agent.performance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No agent data available</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All Agents
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Autopilot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agent Status Tab */}
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Status Overview</CardTitle>
              <CardDescription>
                Real-time status of all AI agents in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {autopilotData ? (
                <div className="space-y-4">
                  {autopilotData.reports.map((agent) => (
                    <div key={agent.name} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          <p className="text-sm text-gray-600">Last update: {agent.lastUpdate.toLocaleTimeString()}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(agent.status)}
                          <p className="text-sm font-medium mt-1">Performance: {agent.performance}%</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={agent.performance} className="w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No agent data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Recommendations</CardTitle>
              <CardDescription>
                AI-generated recommendations for system optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {autopilotData ? (
                <div className="space-y-4">
                  {autopilotData.recommendations.map((recommendation, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{recommendation.agent}</h3>
                          <p className="text-sm text-gray-600">{recommendation.recommendation}</p>
                          <p className="text-xs text-gray-500 mt-1">{recommendation.details}</p>
                        </div>
                        <div className="text-right">
                          {getPriorityBadge(recommendation.priority)}
                          <p className="text-sm font-medium mt-1">Score: {recommendation.score}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm text-gray-600">
                          Impact: +{recommendation.estimatedImpact}% | 
                          Time: {recommendation.implementationTime}h | 
                          Category: {recommendation.category}
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => applyImprovement(recommendation)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recommendations available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Overall system health and component status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {autopilotData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Status</span>
                    <Badge className={
                      autopilotData.systemHealth.overall === 'healthy' ? 'bg-green-100 text-green-800' :
                      autopilotData.systemHealth.overall === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {autopilotData.systemHealth.overall}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Components</h4>
                    {autopilotData.systemHealth.components.map((component, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{component.name}</span>
                        <Badge className={
                          component.status === 'healthy' ? 'bg-green-100 text-green-800' :
                          component.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {component.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No health data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Active alerts and notifications from the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {autopilotData && autopilotData.systemHealth.alerts.length > 0 ? (
                <div className="space-y-4">
                  {autopilotData.systemHealth.alerts.map((alert, index) => (
                    <Alert key={index} className={
                      alert.level === 'critical' ? 'border-red-200 bg-red-50' :
                      alert.level === 'error' ? 'border-red-200 bg-red-50' :
                      alert.level === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Component: {alert.component} | {alert.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          <Badge className={
                            alert.level === 'critical' ? 'bg-red-100 text-red-800' :
                            alert.level === 'error' ? 'bg-red-100 text-red-800' :
                            alert.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {alert.level}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No active alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
