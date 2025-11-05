'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { 
  Smartphone, 
  Tablet, 
  Monitor,
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Image,
  Package,
  Database,
  Hand,
  Eye,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react'
import { MobilePerformance, MobileRecommendation } from '@/lib/ai/agents/MobileMonitoringAgent'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

interface MobileAnalytics {
  totalDevices: number
  deviceBreakdown: Record<string, number>
  averagePerformance: MobilePerformance
  topIssues: string[]
  recommendations: MobileRecommendation[]
}

interface OptimizationReport {
  imageOptimization: {
    totalImages: number
    optimizedImages: number
    savedBytes: number
    optimizationRate: number
  }
  bundleOptimization: {
    totalSize: number
    gzippedSize: number
    compressionRatio: number
  }
  cachingOptimization: {
    cacheHitRate: number
    staticAssetsCached: number
    apiResponsesCached: number
  }
  responsiveOptimization: {
    mobileFriendly: boolean
    touchFriendly: boolean
    viewportOptimized: boolean
    fontSizeOptimized: boolean
  }
}

export default function MobileMonitoringDashboard() {
  const [analytics, setAnalytics] = useState<MobileAnalytics | null>(null)
  const [optimizationReport, setOptimizationReport] = useState<OptimizationReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadMobileData()
    const interval = setInterval(loadMobileData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const loadMobileData = async () => {
    try {
      setLoading(true)
      
      const [analyticsResponse, optimizationResponse] = await Promise.all([
        fetch('/api/admin/mobile-monitoring/analytics'),
        fetch('/api/admin/mobile-monitoring/optimization')
      ])

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData.data)
      }

      if (optimizationResponse.ok) {
        const optimizationData = await optimizationResponse.json()
        setOptimizationReport(optimizationData.data)
      }

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to load mobile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />
      case 'usability': return <Hand className="h-4 w-4" />
      case 'accessibility': return <Eye className="h-4 w-4" />
      case 'seo': return <Monitor className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mobile monitoring data...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load mobile monitoring data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const deviceData = Object.entries(analytics.deviceBreakdown).map(([device, count]) => ({
    device: device.charAt(0).toUpperCase() + device.slice(1),
    count,
    percentage: (count / analytics.totalDevices) * 100
  }))

  const performanceData = [
    { metric: 'LCP', value: analytics.averagePerformance.lcp, score: analytics.averagePerformance.lcpScore },
    { metric: 'FID', value: analytics.averagePerformance.fid, score: analytics.averagePerformance.fidScore },
    { metric: 'CLS', value: analytics.averagePerformance.cls, score: analytics.averagePerformance.clsScore },
    { metric: 'TTFB', value: analytics.averagePerformance.ttfb, score: 100 - (analytics.averagePerformance.ttfb / 5) },
    { metric: 'FCP', value: analytics.averagePerformance.fcp, score: 100 - (analytics.averagePerformance.fcp / 2) },
    { metric: 'SI', value: analytics.averagePerformance.si, score: 100 - (analytics.averagePerformance.si / 3) }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Smartphone className="h-8 w-8 text-blue-600" />
            <span>Mobile Monitoring Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive mobile performance and optimization monitoring
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={loadMobileData} size="sm" variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              Monitored devices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center space-x-2">
              <span className={getPerformanceColor(analytics.averagePerformance.overallScore)}>
                {analytics.averagePerformance.overallScore.toFixed(0)}
              </span>
              {getPerformanceBadge(analytics.averagePerformance.overallScore)}
            </div>
            <p className="text-xs text-muted-foreground">
              Mobile performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              Performance issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.recommendations.length}</div>
            <p className="text-xs text-muted-foreground">
              Optimization tips
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Device Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percentage }) => `${device}: ${(percentage as number).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884D8"
                  dataKey="count"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#8884D8" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Core Web Vitals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">LCP</span>
                <span className={`text-sm font-bold ${getPerformanceColor(analytics.averagePerformance.lcpScore)}`}>
                  {analytics.averagePerformance.lcp.toFixed(2)}s
                </span>
              </div>
              <Progress value={analytics.averagePerformance.lcpScore} className="w-full" />
              <p className="text-xs text-gray-500">Largest Contentful Paint</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">FID</span>
                <span className={`text-sm font-bold ${getPerformanceColor(analytics.averagePerformance.fidScore)}`}>
                  {analytics.averagePerformance.fid.toFixed(0)}ms
                </span>
              </div>
              <Progress value={analytics.averagePerformance.fidScore} className="w-full" />
              <p className="text-xs text-gray-500">First Input Delay</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CLS</span>
                <span className={`text-sm font-bold ${getPerformanceColor(analytics.averagePerformance.clsScore)}`}>
                  {analytics.averagePerformance.cls.toFixed(3)}
                </span>
              </div>
              <Progress value={analytics.averagePerformance.clsScore} className="w-full" />
              <p className="text-xs text-gray-500">Cumulative Layout Shift</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Report */}
      {optimizationReport && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Image Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Optimization Rate</span>
                  <span className="text-sm font-bold text-green-600">
                    {optimizationReport.imageOptimization.optimizationRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={optimizationReport.imageOptimization.optimizationRate} className="w-full" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Images</p>
                    <p className="font-semibold">{optimizationReport.imageOptimization.totalImages}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Optimized</p>
                    <p className="font-semibold">{optimizationReport.imageOptimization.optimizedImages}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Saved Bytes</p>
                    <p className="font-semibold">{(optimizationReport.imageOptimization.savedBytes / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Compression</p>
                    <p className="font-semibold">{optimizationReport.bundleOptimization.compressionRatio.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hand className="h-5 w-5" />
              <span>Responsive Optimization</span>
            </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${optimizationReport.responsiveOptimization.mobileFriendly ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-sm">Mobile Friendly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${optimizationReport.responsiveOptimization.touchFriendly ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-sm">Touch Friendly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${optimizationReport.responsiveOptimization.viewportOptimized ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-sm">Viewport Optimized</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${optimizationReport.responsiveOptimization.fontSizeOptimized ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-sm">Font Size Optimized</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Cache Hit Rate</span>
                    <span className="text-sm font-bold text-green-600">
                      {optimizationReport.cachingOptimization.cacheHitRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={optimizationReport.cachingOptimization.cacheHitRate} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Issues */}
      {analytics.topIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Top Performance Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.topIssues.map((issue, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{issue}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analytics.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Optimization Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(rec.category)}
                      <h3 className="font-semibold">{rec.title}</h3>
                      {getPriorityBadge(rec.priority)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">+{rec.impact}% Impact</p>
                      <p className="text-xs text-gray-500">{rec.effort} effort</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">Implementation:</p>
                    <p className="text-gray-600">{rec.implementation}</p>
                    <p className="text-green-600 font-medium mt-1">{rec.estimatedImprovement}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
