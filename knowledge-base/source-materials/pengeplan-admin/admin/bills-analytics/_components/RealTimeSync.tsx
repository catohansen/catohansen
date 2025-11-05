'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Database,
  Wifi,
  WifiOff,
  Eye,
  EyeOff
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RealTimeData {
  timestamp: string
  activeUsers: number
  billsProcessed: number
  ocrAccuracy: number
  notificationsSent: number
  errors: number
  systemLoad: number
  vergeCollaborations: number
  chatMessages: number
}

interface RealTimeSyncProps {
  onDataUpdate: (data: RealTimeData) => void
}

export function RealTimeSync({ onDataUpdate }: RealTimeSyncProps) {
  const [isConnected] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null)
  const [dataHistory, setDataHistory] = useState<RealTimeData[]>([])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      // Mock real-time data - in production, this would be WebSocket or Server-Sent Events
      const newData: RealTimeData = {
        timestamp: new Date().toISOString(),
        activeUsers: Math.floor(Math.random() * 50) + 100,
        billsProcessed: Math.floor(Math.random() * 20) + 5,
        ocrAccuracy: 85 + Math.random() * 10,
        notificationsSent: Math.floor(Math.random() * 15) + 3,
        errors: Math.floor(Math.random() * 3),
        systemLoad: 20 + Math.random() * 60,
        vergeCollaborations: Math.floor(Math.random() * 8) + 2,
        chatMessages: Math.floor(Math.random() * 25) + 5
      }

      setRealTimeData(newData)
      setLastUpdate(new Date().toLocaleTimeString('nb-NO'))
      onDataUpdate(newData)

      // Keep only last 20 data points
      setDataHistory(prev => {
        const updated = [...prev, newData]
        return updated.slice(-20)
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isPaused, onDataUpdate])

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600'
    if (value >= thresholds.warning) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (value >= thresholds.warning) return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    return <AlertTriangle className="w-4 h-4 text-red-600" />
  }

  if (!realTimeData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Kobler til real-time data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              {isConnected ? (
                <Wifi className="w-5 h-5 mr-2 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 mr-2 text-red-600" />
              )}
              Real-time Data Sync
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPaused(!isPaused)}
                className={isPaused ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}
              >
                {isPaused ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {isPaused ? 'Pauset' : 'Aktiv'}
              </Button>
              <Badge className={isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {isConnected ? 'Tilkoblet' : 'Frakoblet'}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Sist oppdatert: {lastUpdate}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive brukere</p>
                <p className="text-2xl font-bold text-gray-900">{realTimeData.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12% fra i går</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regninger behandlet</p>
                <p className="text-2xl font-bold text-gray-900">{realTimeData.billsProcessed}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8% fra i går</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">OCR nøyaktighet</p>
                <p className="text-2xl font-bold text-gray-900">{realTimeData.ocrAccuracy.toFixed(1)}%</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center">
              {getStatusIcon(realTimeData.ocrAccuracy, { good: 90, warning: 80 })}
              <span className={`text-sm ml-1 ${getStatusColor(realTimeData.ocrAccuracy, { good: 90, warning: 80 })}`}>
                {realTimeData.ocrAccuracy >= 90 ? 'Utmerket' : 
                 realTimeData.ocrAccuracy >= 80 ? 'God' : 'Trenger forbedring'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Systembelastning</p>
                <p className="text-2xl font-bold text-gray-900">{realTimeData.systemLoad.toFixed(1)}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center">
              {getStatusIcon(100 - realTimeData.systemLoad, { good: 30, warning: 50 })}
              <span className={`text-sm ml-1 ${getStatusColor(100 - realTimeData.systemLoad, { good: 30, warning: 50 })}`}>
                {realTimeData.systemLoad <= 70 ? 'Normal' : 
                 realTimeData.systemLoad <= 85 ? 'Høy' : 'Kritisk'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verge Collaboration Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Verge-samarbeid i sanntid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{realTimeData.vergeCollaborations}</p>
              <p className="text-sm text-gray-600">Aktive samarbeid</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{realTimeData.chatMessages}</p>
              <p className="text-sm text-gray-600">Chat-meldinger</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{realTimeData.notificationsSent}</p>
              <p className="text-sm text-gray-600">Varsler sendt</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Feilovervåking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{realTimeData.errors}</p>
                <p className="text-sm text-gray-600">Feil siste time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">0.2%</p>
                <p className="text-sm text-gray-600">Feilrate</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {realTimeData.errors === 0 ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Alle systemer OK
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {realTimeData.errors} feil
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Data-trend (siste 20 oppdateringer)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-end space-x-1">
            {dataHistory.slice(-20).map((data, index) => (
              <div
                key={index}
                className="flex-1 bg-purple-200 rounded-t"
                style={{ height: `${(data.activeUsers / 150) * 100}%` }}
                title={`${data.activeUsers} brukere`}
              />
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            Aktive brukere over tid
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
