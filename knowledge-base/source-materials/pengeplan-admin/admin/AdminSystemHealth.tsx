'use client'

import { useState, useEffect } from 'react'
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Activity,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react'

interface SystemHealth {
  overall: 'excellent' | 'good' | 'warning' | 'critical'
  services: {
    database: 'up' | 'down' | 'degraded'
    api: 'up' | 'down' | 'degraded'
    auth: 'up' | 'down' | 'degraded'
    email: 'up' | 'down' | 'degraded'
  }
  metrics: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
  lastCheck: string
}

const mockSystemHealth: SystemHealth = {
  overall: 'excellent',
  services: {
    database: 'up',
    api: 'up',
    auth: 'up',
    email: 'up'
  },
  metrics: {
    cpu: 23,
    memory: 67,
    disk: 45,
    network: 12
  },
  lastCheck: new Date().toISOString()
}

export function AdminSystemHealth() {
  const [health, setHealth] = useState<SystemHealth>(mockSystemHealth)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'text-green-600 bg-green-100'
      case 'degraded': return 'text-yellow-600 bg-yellow-100'
      case 'down': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'down': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/admin/system/health')
      const data = await response.json()
      if (data.success) {
        setHealth(data.data)
      }
    } catch (error) {
      console.error('Error refreshing system health:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatLastCheck = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Nå'
    if (minutes < 60) return `${minutes} minutter siden`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} timer siden`
    const days = Math.floor(hours / 24)
    return `${days} dager siden`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Server className="h-5 w-5 text-gray-600" />
          Systemhelse
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Oppdater
        </button>
      </div>

      {/* Overall Status */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <span className="text-xl font-semibold text-gray-900">
            {health.overall === 'excellent' ? 'Utmerket' :
             health.overall === 'good' ? 'God' :
             health.overall === 'warning' ? 'Advarsel' : 'Kritisk'}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Sist sjekk: {formatLastCheck(health.lastCheck)}
        </p>
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Database className="h-5 w-5 text-gray-600" />
          <div>
            <div className="text-sm font-medium text-gray-700">Database</div>
            <div className="flex items-center gap-1">
              {getStatusIcon(health.services.database)}
              <span className="text-xs text-gray-600">
                {health.services.database === 'up' ? 'Oppe' :
                 health.services.database === 'degraded' ? 'Nedgradert' : 'Nede'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Globe className="h-5 w-5 text-gray-600" />
          <div>
            <div className="text-sm font-medium text-gray-700">API</div>
            <div className="flex items-center gap-1">
              {getStatusIcon(health.services.api)}
              <span className="text-xs text-gray-600">
                {health.services.api === 'up' ? 'Oppe' :
                 health.services.api === 'degraded' ? 'Nedgradert' : 'Nede'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Shield className="h-5 w-5 text-gray-600" />
          <div>
            <div className="text-sm font-medium text-gray-700">Auth</div>
            <div className="flex items-center gap-1">
              {getStatusIcon(health.services.auth)}
              <span className="text-xs text-gray-600">
                {health.services.auth === 'up' ? 'Oppe' :
                 health.services.auth === 'degraded' ? 'Nedgradert' : 'Nede'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Activity className="h-5 w-5 text-gray-600" />
          <div>
            <div className="text-sm font-medium text-gray-700">Email</div>
            <div className="flex items-center gap-1">
              {getStatusIcon(health.services.email)}
              <span className="text-xs text-gray-600">
                {health.services.email === 'up' ? 'Oppe' :
                 health.services.email === 'degraded' ? 'Nedgradert' : 'Nede'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cpu className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">CPU</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{health.metrics.cpu}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${health.metrics.cpu}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HardDrive className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Memory</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{health.metrics.memory}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${health.metrics.memory}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HardDrive className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Disk</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{health.metrics.disk}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${health.metrics.disk}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Network className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Network</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{health.metrics.network}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${health.metrics.network}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
