'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users,
  Zap
} from 'lucide-react'

interface PromptAnalytics {
  totalPrompts: number
  activePrompts: number
  totalUsage: number
  averageResponseTime: number
  successRate: number
  topPrompts: Array<{
    name: string
    usage: number
    successRate: number
    avgResponseTime: number
  }>
  usageByCategory: Record<string, number>
  performanceMetrics: {
    cacheHitRate: number
    errorRate: number
    throughput: number
  }
}

export default function PromptAnalytics() {
  const [analytics, setAnalytics] = useState<PromptAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock analytics data - replace with real API call
      const mockData: PromptAnalytics = {
        totalPrompts: 4,
        activePrompts: 4,
        totalUsage: 1247,
        averageResponseTime: 850,
        successRate: 94.2,
        topPrompts: [
          {
            name: 'okonomisk-coach-chat',
            usage: 456,
            successRate: 96.1,
            avgResponseTime: 720
          },
          {
            name: 'nav-soknad-generator',
            usage: 234,
            successRate: 92.3,
            avgResponseTime: 1200
          },
          {
            name: 'budsjett-optimalisering',
            usage: 198,
            successRate: 95.5,
            avgResponseTime: 980
          },
          {
            name: 'verge-dokument-analyse',
            usage: 159,
            successRate: 91.2,
            avgResponseTime: 1100
          }
        ],
        usageByCategory: {
          'chat': 456,
          'nav': 234,
          'economic': 198,
          'verge': 159
        },
        performanceMetrics: {
          cacheHitRate: 78.5,
          errorRate: 2.1,
          throughput: 156.2
        }
      }
      
      setAnalytics(mockData)
    } catch (error) {
      console.error('Error loading analytics:', error)
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Prompt Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Overvåk ytelse og bruk av AI-prompts i Pengeplan 2.0
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {['1d', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range === '1d' ? 'I dag' : 
                 range === '7d' ? '7 dager' :
                 range === '30d' ? '30 dager' : '90 dager'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totalt Prompts</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalPrompts}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totalt Bruk</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsage.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gjennomsnittlig Tid</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageResponseTime}ms</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suksessrate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Prompts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              🔥 Mest Brukte Prompts
            </h2>
            
            <div className="space-y-4">
              {analytics.topPrompts.map((prompt, index) => (
                <div key={prompt.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-violet-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{prompt.name}</p>
                      <p className="text-sm text-gray-600">{prompt.usage} bruk</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{prompt.successRate}%</p>
                    <p className="text-xs text-gray-600">{prompt.avgResponseTime}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              ⚡ Ytelsesmetrikker
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Cache Hit Rate</span>
                  <span className="text-sm font-medium text-gray-900">{analytics.performanceMetrics.cacheHitRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-violet-600 h-2 rounded-full" 
                    style={{ width: `${analytics.performanceMetrics.cacheHitRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Error Rate</span>
                  <span className="text-sm font-medium text-gray-900">{analytics.performanceMetrics.errorRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${analytics.performanceMetrics.errorRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Throughput</span>
                  <span className="text-sm font-medium text-gray-900">{analytics.performanceMetrics.throughput} req/min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(analytics.performanceMetrics.throughput / 200 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage by Category */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            📈 Bruk per Kategori
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.usageByCategory).map(([category, usage]) => (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{usage}</p>
                <p className="text-sm text-gray-600 capitalize">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


