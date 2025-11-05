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
  Activity, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Zap, 
  Image, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Target,
  Users,
  Smartphone,
  Monitor
} from 'lucide-react'

interface PerformanceMetrics {
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
  performanceScore: number
  lastUpdated: Date
}

interface UserBehaviorData {
  totalSessions: number
  averageSessionDuration: number
  mostClickedElements: Array<{ element: string; clicks: number }>
  conversionRate: number
  topPages: Array<{ page: string; visits: number }>
}

interface CTAOptimization {
  id: string
  variant: string
  clicks: number
  impressions: number
  conversions: number
  conversionRate: number
  lastUpdated: Date
}

interface ImageOptimization {
  url: string
  originalSize: number
  optimizedSize: number
  savings: number
  format: string
  lazyLoaded: boolean
}

interface Bottleneck {
  type: string
  resource: string
  duration: number
  impact: 'high' | 'medium' | 'low'
  suggestion: string
  priority: number
}

export default function AIOptimizationCenter() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [userBehavior, setUserBehavior] = useState<UserBehaviorData | null>(null)
  const [ctaOptimizations, setCtaOptimizations] = useState<CTAOptimization[]>([])
  const [imageOptimizations, setImageOptimizations] = useState<ImageOptimization[]>([])
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadOptimizationData()
    const interval = setInterval(loadOptimizationData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadOptimizationData = async () => {
    try {
      setLoading(true)
      
      // Load performance metrics
      const perfResponse = await fetch('/api/admin/ai/optimization/performance')
      if (perfResponse.ok) {
        const perfData = await perfResponse.json()
        setPerformanceMetrics(perfData)
      }

      // Load user behavior data
      const behaviorResponse = await fetch('/api/admin/ai/optimization/behavior')
      if (behaviorResponse.ok) {
        const behaviorData = await behaviorResponse.json()
        setUserBehavior(behaviorData)
      }

      // Load CTA optimizations
      const ctaResponse = await fetch('/api/admin/ai/optimization/cta')
      if (ctaResponse.ok) {
        const ctaData = await ctaResponse.json()
        setCtaOptimizations(ctaData)
      }

      // Load image optimizations
      const imageResponse = await fetch('/api/admin/ai/optimization/images')
      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        setImageOptimizations(imageData)
      }

      // Load bottlenecks
      const bottleneckResponse = await fetch('/api/admin/ai/optimization/bottlenecks')
      if (bottleneckResponse.ok) {
        const bottleneckData = await bottleneckResponse.json()
        setBottlenecks(bottleneckData)
      }

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to load optimization data:', error)
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading optimization data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Optimization Center</h1>
          <p className="text-gray-600 mt-2">
            Intelligent monitoring and optimization of Pengeplan 2.0 performance
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
          <Button onClick={loadOptimizationData} size="sm" className="mt-2">
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.performanceScore}</div>
              <div className="flex items-center space-x-2 mt-2">
                {getPerformanceBadge(performanceMetrics.performanceScore)}
              </div>
              <Progress 
                value={performanceMetrics.performanceScore} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LCP</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.lcp.toFixed(0)}ms</div>
              <p className="text-xs text-muted-foreground">
                {performanceMetrics.lcp < 2500 ? 'Good' : 'Needs improvement'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">FID</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.fid.toFixed(0)}ms</div>
              <p className="text-xs text-muted-foreground">
                {performanceMetrics.fid < 100 ? 'Good' : 'Needs improvement'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CLS</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.cls.toFixed(3)}</div>
              <p className="text-xs text-muted-foreground">
                {performanceMetrics.cls < 0.1 ? 'Good' : 'Needs improvement'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="cta">CTA Optimization</TabsTrigger>
          <TabsTrigger value="images">Image Optimization</TabsTrigger>
          <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Performance Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className={`text-lg font-bold ${getPerformanceColor(performanceMetrics.performanceScore)}`}>
                        {performanceMetrics.performanceScore}/100
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>LCP: {performanceMetrics.lcp.toFixed(0)}ms</span>
                        <span className={performanceMetrics.lcp < 2500 ? 'text-green-600' : 'text-red-600'}>
                          {performanceMetrics.lcp < 2500 ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>FID: {performanceMetrics.fid.toFixed(0)}ms</span>
                        <span className={performanceMetrics.fid < 100 ? 'text-green-600' : 'text-red-600'}>
                          {performanceMetrics.fid < 100 ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CLS: {performanceMetrics.cls.toFixed(3)}</span>
                        <span className={performanceMetrics.cls < 0.1 ? 'text-green-600' : 'text-red-600'}>
                          {performanceMetrics.cls < 0.1 ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">No performance data available</p>
                )}
              </CardContent>
            </Card>

            {/* User Behavior Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Behavior</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userBehavior ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                        <p className="text-2xl font-bold">{userBehavior.totalSessions}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                        <p className="text-2xl font-bold">{userBehavior.averageSessionDuration.toFixed(1)}s</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(userBehavior.conversionRate * 100).toFixed(1)}%
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">No behavior data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common optimization tasks and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto p-4 flex flex-col items-start space-y-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">Run Performance Audit</span>
                  <span className="text-xs text-gray-600">Analyze current performance</span>
                </Button>
                <Button className="h-auto p-4 flex flex-col items-start space-y-2">
                  <Image className="h-5 w-5" />
                  <span className="font-medium">Optimize Images</span>
                  <span className="text-xs text-gray-600">Compress and convert images</span>
                </Button>
                <Button className="h-auto p-4 flex flex-col items-start space-y-2">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">A/B Test CTAs</span>
                  <span className="text-xs text-gray-600">Test different CTA variants</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
              <CardDescription>
                Real-time performance metrics and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {performanceMetrics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{performanceMetrics.lcp.toFixed(0)}ms</div>
                      <div className="text-sm text-gray-600">Largest Contentful Paint</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {performanceMetrics.lcp < 2500 ? 'Good' : 'Needs improvement'}
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{performanceMetrics.fid.toFixed(0)}ms</div>
                      <div className="text-sm text-gray-600">First Input Delay</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {performanceMetrics.fid < 100 ? 'Good' : 'Needs improvement'}
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{performanceMetrics.cls.toFixed(3)}</div>
                      <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {performanceMetrics.cls < 0.1 ? 'Good' : 'Needs improvement'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No performance data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Behavior Analytics</CardTitle>
              <CardDescription>
                Insights into how users interact with your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userBehavior ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Most Clicked Elements</h4>
                      <div className="space-y-2">
                        {userBehavior.mostClickedElements.slice(0, 5).map((element, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{element.element}</span>
                            <Badge variant="secondary">{element.clicks} clicks</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Top Pages</h4>
                      <div className="space-y-2">
                        {userBehavior.topPages.slice(0, 5).map((page, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{page.page}</span>
                            <Badge variant="secondary">{page.visits} visits</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No behavior data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Optimization Tab */}
        <TabsContent value="cta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CTA Optimization</CardTitle>
              <CardDescription>
                A/B testing results and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ctaOptimizations.length > 0 ? (
                <div className="space-y-4">
                  {ctaOptimizations.map((cta) => (
                    <div key={cta.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{cta.id}</h4>
                          <p className="text-sm text-gray-600">Variant: {cta.variant}</p>
                        </div>
                        <Badge className={cta.conversionRate > 0.1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {(cta.conversionRate * 100).toFixed(1)}% conversion
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Clicks:</span>
                          <span className="ml-2 font-medium">{cta.clicks}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Impressions:</span>
                          <span className="ml-2 font-medium">{cta.impressions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Conversions:</span>
                          <span className="ml-2 font-medium">{cta.conversions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No CTA optimization data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Optimization Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Optimization</CardTitle>
              <CardDescription>
                Image compression and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imageOptimizations.length > 0 ? (
                <div className="space-y-4">
                  {imageOptimizations.map((image, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-sm truncate">{image.url}</h4>
                          <p className="text-xs text-gray-600">Format: {image.format}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {(image.savings / 1024).toFixed(1)}KB saved
                          </div>
                          <div className="text-xs text-gray-600">
                            {((image.savings / image.originalSize) * 100).toFixed(1)}% reduction
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={image.lazyLoaded ? 'default' : 'secondary'}>
                          {image.lazyLoaded ? 'Lazy Loaded' : 'Not Lazy Loaded'}
                        </Badge>
                        <Badge variant="outline">{image.format.toUpperCase()}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No image optimization data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bottlenecks Tab */}
        <TabsContent value="bottlenecks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Bottlenecks</CardTitle>
              <CardDescription>
                Issues affecting site performance and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bottlenecks.length > 0 ? (
                <div className="space-y-4">
                  {bottlenecks.map((bottleneck, index) => (
                    <Alert key={index} className={bottleneck.impact === 'high' ? 'border-red-200 bg-red-50' : ''}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{bottleneck.resource}</div>
                            <div className="text-sm text-gray-600 mt-1">{bottleneck.suggestion}</div>
                          </div>
                          <div className="text-right ml-4">
                            {getImpactBadge(bottleneck.impact)}
                            <div className="text-xs text-gray-500 mt-1">
                              {bottleneck.duration.toFixed(0)}ms
                            </div>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No performance bottlenecks detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
