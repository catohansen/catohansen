'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users,
  CheckCircle,
  Target,
  Zap,
  Download
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { RealTimeSync } from './_components/RealTimeSync'

interface AnalyticsData {
  ocrAccuracy: {
    totalProcessed: number
    successfulExtractions: number
    accuracyRate: number
    commonErrors: Array<{ field: string; count: number; percentage: number }>
  }
  notificationStats: {
    totalSent: number
    successfulDeliveries: number
    billsSavedFromOverdue: number
    averageResponseTime: number
  }
  systemHealth: {
    uptime: number
    averageResponseTime: number
    errorRate: number
    activeUsers: number
  }
  userFeedback: {
    totalResponses: number
    averageRating: number
    commonIssues: Array<{ issue: string; count: number }>
    satisfactionTrend: Array<{ date: string; rating: number }>
  }
}

export default function BillsAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [realTimeData, setRealTimeData] = useState<unknown>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _realTimeDataUsed = realTimeData

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/bills-analytics?period=${selectedPeriod}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
      } else {
        console.error('Failed to fetch analytics:', data.error)
        // Fallback to empty state or show error
        setAnalytics(null)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Real-time Sync Component */}
      <RealTimeSync onDataUpdate={setRealTimeData} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Regning-modul Analytics</h1>
          <p className="text-gray-600">Oversikt over ytelse og brukeropplevelse</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
            className="border rounded px-3 py-2"
          >
            <option value="7d">Siste 7 dager</option>
            <option value="30d">Siste 30 dager</option>
            <option value="90d">Siste 90 dager</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Eksporter rapport
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">OCR Nøyaktighet</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.ocrAccuracy.accuracyRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Regninger reddet</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.notificationStats.billsSavedFromOverdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive brukere</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.systemHealth.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Brukertilfredshet</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.userFeedback.averageRating}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OCR Accuracy Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            OCR Nøyaktighet og Feilanalyse
          </CardTitle>
          <CardDescription>
            Detaljert oversikt over OCR-ytelse og vanlige feil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Samlet statistikk</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Totalt behandlet:</span>
                  <span className="font-medium">{analytics.ocrAccuracy.totalProcessed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vellykkede ekstraksjoner:</span>
                  <span className="font-medium text-green-600">{analytics.ocrAccuracy.successfulExtractions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nøyaktighetsrate:</span>
                  <span className="font-medium text-blue-600">{analytics.ocrAccuracy.accuracyRate}%</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Vanlige feil</h3>
              <div className="space-y-2">
                {analytics.ocrAccuracy.commonErrors.map((error, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{error.field}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{error.count}</span>
                      <Badge variant="outline" className="text-xs">
                        {error.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-green-600" />
            Notifikasjonsstatistikk
          </CardTitle>
          <CardDescription>
            Effekt av varslingssystemet på brukeradferd
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{analytics.notificationStats.totalSent}</p>
              <p className="text-sm text-gray-600">Varsler sendt</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analytics.notificationStats.successfulDeliveries}</p>
              <p className="text-sm text-gray-600">Levert</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{analytics.notificationStats.billsSavedFromOverdue}</p>
              <p className="text-sm text-gray-600">Regninger reddet</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{analytics.notificationStats.averageResponseTime}s</p>
              <p className="text-sm text-gray-600">Gjennomsnittlig responstid</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Systemhelse
          </CardTitle>
          <CardDescription>
            Ytelse og stabilitet for regning-modulen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analytics.systemHealth.uptime}%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{analytics.systemHealth.averageResponseTime}ms</p>
              <p className="text-sm text-gray-600">Gjennomsnittlig responstid</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{analytics.systemHealth.errorRate}%</p>
              <p className="text-sm text-gray-600">Feilrate</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{analytics.systemHealth.activeUsers}</p>
              <p className="text-sm text-gray-600">Aktive brukere</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Brukerfeedback og Tilfredshet
          </CardTitle>
          <CardDescription>
            Brukeropplevelse og vanlige problemer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Samlet feedback</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Totalt svar:</span>
                  <span className="font-medium">{analytics.userFeedback.totalResponses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gjennomsnittlig vurdering:</span>
                  <span className="font-medium text-purple-600">{analytics.userFeedback.averageRating}/5</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Vanlige problemer</h3>
              <div className="space-y-2">
                {analytics.userFeedback.commonIssues.map((issue, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{issue.issue}</span>
                    <Badge variant="outline" className="text-xs">
                      {issue.count} rapporter
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Anbefalinger for Forbedring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">OCR-forbedringer</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Forbedre KID-nummer gjenkjenning</li>
                <li>• Tren modell på flere norske fakturaer</li>
                <li>• Legg til manuell verifisering for kritiske felter</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Brukeropplevelse</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Forbedre notifikasjonstidspunkt</li>
                <li>• Forenkle UI for nybegynnere</li>
                <li>• Legg til flere hjelpefunksjoner</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
