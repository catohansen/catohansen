'use client'

import { useState, useEffect } from 'react'
import { Activity, Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppShell from '@/components/layout/AppShell'

interface SLOMetric {
  name: string
  target: number
  current: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  description: string
}

interface DORAMetrics {
  deployFrequency: number
  leadTime: number
  mttr: number
  changeFailureRate: number
}

export default function SLOPage() {
  const [sloMetrics, setSloMetrics] = useState<SLOMetric[]>([])
  const [doraMetrics, setDoraMetrics] = useState<DORAMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in production this would come from monitoring systems
    const mockSLOMetrics: SLOMetric[] = [
      {
        name: 'Availability',
        target: 99.9,
        current: 99.95,
        unit: '%',
        status: 'good',
        trend: 'up',
        description: 'System availability over the last 30 days'
      },
      {
        name: 'API Response Time (p95)',
        target: 300,
        current: 245,
        unit: 'ms',
        status: 'good',
        trend: 'down',
        description: '95th percentile API response time'
      },
      {
        name: 'Error Rate',
        target: 0.1,
        current: 0.05,
        unit: '%',
        status: 'good',
        trend: 'down',
        description: 'Percentage of failed requests'
      },
      {
        name: 'Database Connection Time',
        target: 50,
        current: 65,
        unit: 'ms',
        status: 'warning',
        trend: 'up',
        description: 'Average database connection time'
      },
      {
        name: 'Page Load Time',
        target: 2000,
        current: 1850,
        unit: 'ms',
        status: 'good',
        trend: 'down',
        description: 'Average page load time'
      }
    ]

    const mockDORAMetrics: DORAMetrics = {
      deployFrequency: 12, // deployments per week
      leadTime: 2.5, // days
      mttr: 45, // minutes
      changeFailureRate: 5 // percentage
    }

    setSloMetrics(mockSLOMetrics)
    setDoraMetrics(mockDORAMetrics)
    setIsLoading(false)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800">På mål</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Advarsel</Badge>
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Kritisk</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Ukjent</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatMetric = (value: number, unit: string) => {
    if (unit === '%') {
      return `${value.toFixed(2)}%`
    }
    if (unit === 'ms') {
      return `${Math.round(value)}ms`
    }
    return `${value}${unit}`
  }

  if (isLoading) {
    return (
      <AppShell role="admin">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laster SLO-data...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Level Objectives</h1>
        <p className="text-gray-600">Overvåk systemytelse og mål</p>
      </div>

      {/* SLO Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sloMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{metric.name}</CardTitle>
                {getStatusIcon(metric.status)}
              </div>
              <CardDescription>{metric.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatMetric(metric.current, metric.unit)}
                  </span>
                  {getStatusBadge(metric.status)}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Mål: {formatMetric(metric.target, metric.unit)}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-gray-600">
                      {metric.trend === 'up' ? 'Økende' : 
                       metric.trend === 'down' ? 'Synkende' : 'Stabil'}
                    </span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.status === 'good' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min((metric.current / metric.target) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DORA Metrics */}
      {doraMetrics && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              DORA Metrics
            </CardTitle>
            <CardDescription>
              DevOps Research and Assessment metrics for delivery performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {doraMetrics.deployFrequency}
                </div>
                <div className="text-sm text-gray-600">Deployments per week</div>
                <div className="text-xs text-gray-500 mt-1">Deploy Frequency</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {doraMetrics.leadTime}d
                </div>
                <div className="text-sm text-gray-600">Average lead time</div>
                <div className="text-xs text-gray-500 mt-1">Lead Time for Changes</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {doraMetrics.mttr}m
                </div>
                <div className="text-sm text-gray-600">Mean time to recovery</div>
                <div className="text-xs text-gray-500 mt-1">MTTR</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {doraMetrics.changeFailureRate}%
                </div>
                <div className="text-sm text-gray-600">Change failure rate</div>
                <div className="text-xs text-gray-500 mt-1">Change Failure Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SLA Information */}
      <Card>
        <CardHeader>
          <CardTitle>Service Level Agreement</CardTitle>
          <CardDescription>
            Våre garantier til kundene
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Availability SLA</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 99.9% uptime guarantee</li>
                <li>• 24/7 monitoring</li>
                <li>• Automatic failover</li>
                <li>• Status page updates</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Performance SLA</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• API response time &lt; 300ms (p95)</li>
                <li>• Page load time &lt; 2s</li>
                <li>• Error rate &lt; 0.1%</li>
                <li>• Database queries &lt; 50ms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
