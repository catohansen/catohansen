/**
 * Real-Time Alerts System - Sanntids-varsler og notifikasjoner
 * 
 * Dette systemet sender umiddelbare varsler til admin når kritiske hendelser
 * oppstår i Pengeplan 2.0. Integrert med alle monitoring-systemer for
 * maksimal sikkerhet og kontroll.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Bell,
  BellOff,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Search,
  Clock,
  User,
  Database,
  Cpu,
  Shield,
  Activity
} from 'lucide-react'

export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  message: string
  source: string
  timestamp: Date
  acknowledged: boolean
  resolved: boolean
  userId?: string
  metadata?: Record<string, any>
  actions?: AlertAction[]
}

export interface AlertAction {
  id: string
  label: string
  action: string
  variant: 'default' | 'destructive' | 'outline'
}

export interface AlertFilters {
  type?: string
  source?: string
  acknowledged?: boolean
  resolved?: boolean
  timeRange?: '1h' | '24h' | '7d' | '30d'
}

export default function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [filters, setFilters] = useState<AlertFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Connect to real-time alerts stream
  useEffect(() => {
    if (isPaused) return

    const eventSource = new EventSource('/api/live/alerts/stream')
    
    eventSource.onopen = () => {
      setIsConnected(true)
      console.log('Connected to alerts stream')
    }

    eventSource.onmessage = (event) => {
      try {
        const alertData = JSON.parse(event.data)
        const newAlert: Alert = {
          id: alertData.id,
          type: alertData.type,
          title: alertData.title,
          message: alertData.message,
          source: alertData.source,
          timestamp: new Date(alertData.timestamp),
          acknowledged: false,
          resolved: false,
          userId: alertData.userId,
          metadata: alertData.metadata,
          actions: alertData.actions
        }
        
        setAlerts(prev => [newAlert, ...prev].slice(0, 100)) // Keep last 100 alerts
        setLastUpdate(new Date())
      } catch (error) {
        console.error('Failed to parse alert data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Alerts stream error:', error)
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [isPaused])

  // Load initial alerts
  useEffect(() => {
    fetchInitialAlerts()
  }, [])

  const fetchInitialAlerts = async () => {
    try {
      const response = await fetch('/api/admin/alerts')
      const data = await response.json()
      setAlerts(data.alerts || [])
    } catch (error) {
      console.error('Failed to fetch initial alerts:', error)
    }
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(`/api/admin/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      })
      
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true }
            : alert
        )
      )
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      await fetch(`/api/admin/alerts/${alertId}/resolve`, {
        method: 'POST'
      })
      
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, resolved: true }
            : alert
        )
      )
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  const executeAlertAction = async (alertId: string, actionId: string) => {
    try {
      await fetch(`/api/admin/alerts/${alertId}/action/${actionId}`, {
        method: 'POST'
      })
      
      // Refresh alerts after action
      fetchInitialAlerts()
    } catch (error) {
      console.error('Failed to execute alert action:', error)
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filters.type && alert.type !== filters.type) return false
    if (filters.source && alert.source !== filters.source) return false
    if (filters.acknowledged !== undefined && alert.acknowledged !== filters.acknowledged) return false
    if (filters.resolved !== undefined && alert.resolved !== filters.resolved) return false
    
    if (filters.timeRange) {
      const now = new Date()
      const timeRanges = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }
      
      const timeLimit = now.getTime() - timeRanges[filters.timeRange]
      if (alert.timestamp.getTime() < timeLimit) return false
    }
    
    return true
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      case 'success': return 'bg-green-50 border-green-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'FinanceIntegrityCore': return <Database className="h-4 w-4" />
      case 'ReconciliationEngine': return <CheckCircle className="h-4 w-4" />
      case 'MockDataScanner': return <Shield className="h-4 w-4" />
      case 'DataProvenance': return <Activity className="h-4 w-4" />
      case 'SystemHealth': return <Cpu className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const criticalAlerts = filteredAlerts.filter(a => a.type === 'critical' && !a.resolved).length
  const warningAlerts = filteredAlerts.filter(a => a.type === 'warning' && !a.resolved).length
  const unacknowledgedAlerts = filteredAlerts.filter(a => !a.acknowledged && !a.resolved).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sanntids Varsler</h1>
          <p className="text-gray-600">Live overvåking av kritiske hendelser i Pengeplan 2.0</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isConnected ? "default" : "destructive"}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isConnected ? 'Tilkoblet' : 'Frakoblet'}
          </Badge>
          <Button
            variant={isPaused ? "outline" : "default"}
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <BellOff className="h-4 w-4 mr-1" /> : <Bell className="h-4 w-4 mr-1" />}
            {isPaused ? 'Pauset' : 'Aktiv'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInitialAlerts}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Kritiske</p>
                <p className="text-2xl font-bold text-red-900">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Advarsler</p>
                <p className="text-2xl font-bold text-yellow-900">{warningAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Ubehandlet</p>
                <p className="text-2xl font-bold text-blue-900">{unacknowledgedAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Totalt</p>
                <p className="text-2xl font-bold text-gray-900">{filteredAlerts.length}</p>
              </div>
              <Activity className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filter Varsler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={filters.type || ''}
                  onChange={(e) => setFilters({...filters, type: e.target.value || undefined})}
                >
                  <option value="">Alle</option>
                  <option value="critical">Kritisk</option>
                  <option value="warning">Advarsel</option>
                  <option value="info">Info</option>
                  <option value="success">Suksess</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Kilde</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={filters.source || ''}
                  onChange={(e) => setFilters({...filters, source: e.target.value || undefined})}
                >
                  <option value="">Alle</option>
                  <option value="FinanceIntegrityCore">Finance Integrity</option>
                  <option value="ReconciliationEngine">Reconciliation</option>
                  <option value="MockDataScanner">Mock Data Scanner</option>
                  <option value="DataProvenance">Data Provenance</option>
                  <option value="SystemHealth">System Health</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={filters.acknowledged === undefined ? '' : filters.acknowledged.toString()}
                  onChange={(e) => setFilters({
                    ...filters, 
                    acknowledged: e.target.value === '' ? undefined : e.target.value === 'true'
                  })}
                >
                  <option value="">Alle</option>
                  <option value="false">Ubehandlet</option>
                  <option value="true">Behandlet</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tidsperiode</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={filters.timeRange || ''}
                  onChange={(e) => setFilters({...filters, timeRange: e.target.value as any || undefined})}
                >
                  <option value="">Alle</option>
                  <option value="1h">Siste time</option>
                  <option value="24h">Siste 24 timer</option>
                  <option value="7d">Siste 7 dager</option>
                  <option value="30d">Siste 30 dager</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({})}
                  className="w-full"
                >
                  Nullstill
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingen varsler</h3>
              <p className="text-gray-600">Alle systemer fungerer optimalt!</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`${getAlertBg(alert.type)} border-2`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{alert.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge variant="outline" className="text-xs bg-green-100">
                            Behandlet
                          </Badge>
                        )}
                        {alert.resolved && (
                          <Badge variant="outline" className="text-xs bg-blue-100">
                            Løst
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          {getSourceIcon(alert.source)}
                          <span>{alert.source}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{alert.timestamp.toLocaleString()}</span>
                        </div>
                        {alert.userId && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{alert.userId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {alert.actions?.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant}
                        size="sm"
                        onClick={() => executeAlertAction(alert.id, action.id)}
                      >
                        {action.label}
                      </Button>
                    ))}
                    
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {!alert.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Last Update */}
      <div className="text-xs text-gray-500 text-center">
        Sist oppdatert: {lastUpdate.toLocaleString()}
      </div>
    </div>
  )
}









