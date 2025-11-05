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
  Line
} from 'recharts'
import { 
  TestTube, 
  TrendingUp, 
  TrendingDown,
  Play,
  Pause,
  Square,
  Plus,
  Settings,
  BarChart3,
  Target,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react'
import { ABTest, ABTestStats } from '@/lib/ai/agents/ABVariantAgent'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function ABTestingDashboard() {
  const [tests, setTests] = useState<ABTest[]>([])
  const [testStats, setTestStats] = useState<Map<string, ABTestStats[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  useEffect(() => {
    loadTests()
  }, [])

  const loadTests = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/ab-testing')
      if (response.ok) {
        const data = await response.json()
        setTests(data.tests || [])
        
        // Load stats for each test
        const statsMap = new Map<string, ABTestStats[]>()
        for (const test of data.tests || []) {
          const statsResponse = await fetch(`/api/admin/ab-testing/${test.id}/stats`)
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            statsMap.set(test.id, statsData.stats || [])
          }
        }
        setTestStats(statsMap)
      }
    } catch (error) {
      console.error('Failed to load tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'paused': return 'text-yellow-600'
      case 'completed': return 'text-blue-600'
      case 'draft': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'paused': return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'completed': return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case 'draft': return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600'
    if (confidence >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getUpliftColor = (uplift: number) => {
    if (uplift > 0) return 'text-green-600'
    if (uplift < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const pauseTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/admin/ab-testing/${testId}/pause`, {
        method: 'POST'
      })
      if (response.ok) {
        loadTests()
      }
    } catch (error) {
      console.error('Failed to pause test:', error)
    }
  }

  const completeTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/admin/ab-testing/${testId}/complete`, {
        method: 'POST'
      })
      if (response.ok) {
        loadTests()
      }
    } catch (error) {
      console.error('Failed to complete test:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading A/B tests...</p>
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
            <TestTube className="h-8 w-8 text-blue-600" />
            <span>A/B Testing Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Optimize conversion rates with data-driven experiments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadTests} variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>
      </div>

      {/* Active Tests Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tests.filter(t => t.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Running experiments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
            <p className="text-xs text-muted-foreground">
              All experiments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Significant Results</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(testStats.values()).flat().filter(s => s.isSignificant).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Statistically significant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Uplift</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(testStats.values()).flat().length > 0 
                ? (Array.from(testStats.values()).flat().reduce((sum, s) => sum + s.uplift, 0) / Array.from(testStats.values()).flat().length).toFixed(1)
                : '0.0'
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Average improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {tests.map((test) => {
          const stats = testStats.get(test.id) || []
          const control = stats.find(s => s.variantId === 'control')
          const variant = stats.find(s => s.variantId !== 'control')
          
          return (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{test.name}</span>
                      {getStatusBadge(test.status)}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {test.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {test.status === 'active' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => pauseTest(test.id)}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => completeTest(test.id)}
                        >
                          <Square className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Test Info */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Test Details</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Metric:</span> {test.successMetric}</p>
                      <p><span className="font-medium">Audience:</span> {test.targetAudience}</p>
                      <p><span className="font-medium">Min Sample:</span> {test.minimumSampleSize}</p>
                      <p><span className="font-medium">Confidence:</span> {test.confidenceLevel}%</p>
                    </div>
                  </div>

                  {/* Variants Performance */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Variants Performance</h4>
                    <div className="space-y-2">
                      {stats.map((stat) => (
                        <div key={stat.variantId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{stat.variantName}</p>
                            <p className="text-xs text-gray-600">
                              {stat.participants} participants
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${getUpliftColor(stat.uplift)}`}>
                              {stat.conversionRate.toFixed(1)}%
                            </p>
                            <p className={`text-xs ${getUpliftColor(stat.uplift)}`}>
                              {stat.uplift > 0 ? '+' : ''}{stat.uplift.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statistical Significance */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Statistical Analysis</h4>
                    {variant && control && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Confidence:</span>
                          <span className={`text-sm font-medium ${getConfidenceColor(variant.confidence)}`}>
                            {variant.confidence.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Significant:</span>
                          <span className={`text-sm font-medium ${variant.isSignificant ? 'text-green-600' : 'text-red-600'}`}>
                            {variant.isSignificant ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Uplift:</span>
                          <span className={`text-sm font-medium ${getUpliftColor(variant.uplift)}`}>
                            {variant.uplift > 0 ? '+' : ''}{variant.uplift.toFixed(1)}%
                          </span>
                        </div>
                        {variant.isSignificant && variant.uplift > 0 && (
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              Variant shows significant improvement! Consider implementing.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {test.status === 'active' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Test Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.max(...stats.map(s => s.participants))} / {test.minimumSampleSize} participants
                      </span>
                    </div>
                    <Progress 
                      value={(Math.max(...stats.map(s => s.participants)) / test.minimumSampleSize) * 100} 
                      className="w-full" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Conversion Rate Chart */}
      {selectedTest && testStats.has(selectedTest) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Conversion Rate Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testStats.get(selectedTest) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="variantName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversionRate" fill="#8884D8" name="Conversion Rate (%)" />
                <Bar dataKey="confidence" fill="#82CA9D" name="Confidence (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from(testStats.values()).flat().filter(s => s.isSignificant && s.uplift > 0).length > 0 ? (
              Array.from(testStats.values()).flat()
                .filter(s => s.isSignificant && s.uplift > 0)
                .map((stat, index) => (
                  <Alert key={index}>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{stat.variantName}</strong> shows {stat.uplift.toFixed(1)}% uplift with {stat.confidence.toFixed(1)}% confidence. 
                      Consider implementing this variant.
                    </AlertDescription>
                  </Alert>
                ))
            ) : (
              <p className="text-gray-500 text-sm">No significant improvements detected yet. Continue running tests.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



