"use client"

import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AIMetric {
  id: string
  name: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'critical'
}

interface AIUsage {
  endpoint: string
  requests: number
  avgResponseTime: number
  successRate: number
  cost: number
  lastUsed: string
}

interface AIError {
  id: string
  endpoint: string
  error: string
  count: number
  lastOccurred: string
  severity: 'low' | 'medium' | 'high'
}

export default function AIIntegrationReportClient() {
  const [metrics, setMetrics] = useState<AIMetric[]>([])
  const [usage, setUsage] = useState<AIUsage[]>([])
  const [errors, setErrors] = useState<AIError[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchData = async () => {
    setLoading(true)
    try {
      // Simulate API calls - replace with actual endpoints
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - replace with real API calls
      setMetrics([
        {
          id: '1',
          name: 'Total AI Requests',
          value: 15420,
          unit: 'requests',
          change: 12.5,
          trend: 'up',
          status: 'good'
        },
        {
          id: '2',
          name: 'Average Response Time',
          value: 1.2,
          unit: 'seconds',
          change: -8.3,
          trend: 'up',
          status: 'good'
        },
        {
          id: '3',
          name: 'Success Rate',
          value: 98.7,
          unit: '%',
          change: 0.2,
          trend: 'stable',
          status: 'good'
        },
        {
          id: '4',
          name: 'Daily Cost',
          value: 45.60,
          unit: 'NOK',
          change: 15.2,
          trend: 'down',
          status: 'warning'
        },
        {
          id: '5',
          name: 'Active Users',
          value: 1240,
          unit: 'users',
          change: 8.1,
          trend: 'up',
          status: 'good'
        },
        {
          id: '6',
          name: 'Error Rate',
          value: 1.3,
          unit: '%',
          change: -0.5,
          trend: 'up',
          status: 'warning'
        }
      ])

      setUsage([
        {
          endpoint: '/api/ai/chat-enhanced',
          requests: 8540,
          avgResponseTime: 1.1,
          successRate: 99.2,
          cost: 28.50,
          lastUsed: '2 minutes ago'
        },
        {
          endpoint: '/api/ai/raadgiver',
          requests: 4320,
          avgResponseTime: 0.9,
          successRate: 98.8,
          cost: 12.30,
          lastUsed: '5 minutes ago'
        },
        {
          endpoint: '/api/ai/qa',
          requests: 2560,
          avgResponseTime: 1.5,
          successRate: 97.5,
          cost: 4.80,
          lastUsed: '1 hour ago'
        }
      ])

      setErrors([
        {
          id: '1',
          endpoint: '/api/ai/chat-enhanced',
          error: 'Rate limit exceeded',
          count: 23,
          lastOccurred: '10 minutes ago',
          severity: 'medium'
        },
        {
          id: '2',
          endpoint: '/api/ai/raadgiver',
          error: 'Invalid API key',
          count: 5,
          lastOccurred: '1 hour ago',
          severity: 'high'
        },
        {
          id: '3',
          endpoint: '/api/ai/qa',
          error: 'Timeout error',
          count: 12,
          lastOccurred: '30 minutes ago',
          severity: 'low'
        }
      ])

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching AI integration data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin text-violet-600" />
          <span className="text-gray-600">Loading AI integration data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.slice(0, 6).map((metric) => (
          <Card key={metric.id} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.name}
              </CardTitle>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <Badge className={getStatusColor(metric.status)}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value.toLocaleString()} {metric.unit}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                vs previous period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="errors">Error Monitoring</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-600" />
                  AI Service Health
                </CardTitle>
                <CardDescription>
                  Real-time status of all AI integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Chat Enhanced</p>
                      <p className="text-sm text-green-700">99.2% uptime</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">AI Rådgiver</p>
                      <p className="text-sm text-green-700">98.8% uptime</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">AI QA</p>
                      <p className="text-sm text-yellow-700">97.5% uptime</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Cost Analysis
                </CardTitle>
                <CardDescription>
                  AI service costs and optimization opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today&apos;s Cost</span>
                  <span className="font-semibold text-gray-900">45.60 NOK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold text-gray-900">1,247.30 NOK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cost per Request</span>
                  <span className="font-semibold text-gray-900">0.003 NOK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Projected Monthly</span>
                  <span className="font-semibold text-gray-900">1,368.00 NOK</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                API Usage Analytics
              </CardTitle>
              <CardDescription>
                Detailed breakdown of AI endpoint usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usage.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {item.endpoint}
                        </code>
                        <Badge className="bg-blue-100 text-blue-800">
                          {item.requests.toLocaleString()} requests
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        Last used: {item.lastUsed}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Avg Response:</span>
                        <span className="ml-2 font-medium">{item.avgResponseTime}s</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="ml-2 font-medium">{item.successRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cost:</span>
                        <span className="ml-2 font-medium">{item.cost} NOK</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Error Monitoring
              </CardTitle>
              <CardDescription>
                Recent errors and issues across AI services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errors.map((error) => (
                  <div key={error.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {error.endpoint}
                        </code>
                        <Badge className={getSeverityColor(error.severity)}>
                          {error.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {error.lastOccurred}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{error.error}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Occurrences: {error.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Response Times
                </CardTitle>
                <CardDescription>
                  Average response times by endpoint
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {usage.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">
                      {item.endpoint.split('/').pop()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (item.avgResponseTime / 2) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {item.avgResponseTime}s
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  User Activity
                </CardTitle>
                <CardDescription>
                  AI service usage by user segments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-semibold">1,240</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Users Today</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Requests/User</span>
                  <span className="font-semibold">12.4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Peak Usage</span>
                  <span className="font-semibold">14:30</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  )
}







