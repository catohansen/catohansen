'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Eye, 
  Key,
  Activity,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

interface SecurityStatus {
  overall: 'excellent' | 'good' | 'warning' | 'critical'
  lastScan: string
  vulnerabilities: number
  activeThreats: number
  twoFactorEnabled: boolean
  passwordStrength: 'strong' | 'medium' | 'weak'
  sessionSecurity: 'secure' | 'warning' | 'insecure'
  dataEncryption: boolean
  backupStatus: 'current' | 'outdated' | 'failed'
}

const mockSecurityStatus: SecurityStatus = {
  overall: 'excellent',
  lastScan: '2025-10-13T08:15:00Z',
  vulnerabilities: 0,
  activeThreats: 0,
  twoFactorEnabled: true,
  passwordStrength: 'strong',
  sessionSecurity: 'secure',
  dataEncryption: true,
  backupStatus: 'current'
}

export function AdminSecurityStatus() {
  const [status, setStatus] = useState<SecurityStatus>(mockSecurityStatus)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />
      default: return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/admin/security/status')
      const data = await response.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      console.error('Error refreshing security status:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatLastScan = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
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
          <Shield className="h-5 w-5 text-gray-600" />
          Sikkerhetsstatus
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
          {getStatusIcon(status.overall)}
          <span className="text-lg font-medium text-gray-900">
            {status.overall === 'excellent' ? 'Utmerket' :
             status.overall === 'good' ? 'God' :
             status.overall === 'warning' ? 'Advarsel' : 'Kritisk'}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Sist sikkerhetssjekk: {formatLastScan(status.lastScan)}
        </p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{status.vulnerabilities}</div>
          <div className="text-sm text-gray-600">Sårbarheter</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{status.activeThreats}</div>
          <div className="text-sm text-gray-600">Aktive trusler</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {status.twoFactorEnabled ? '✓' : '✗'}
          </div>
          <div className="text-sm text-gray-600">2FA aktivert</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {status.dataEncryption ? '✓' : '✗'}
          </div>
          <div className="text-sm text-gray-600">Kryptering</div>
        </div>
      </div>

      {/* Security Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Passordstyrke</span>
          </div>
          <span className={`text-sm px-2 py-1 rounded-full ${
            status.passwordStrength === 'strong' ? 'bg-green-100 text-green-800' :
            status.passwordStrength === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status.passwordStrength === 'strong' ? 'Sterk' :
             status.passwordStrength === 'medium' ? 'Medium' : 'Svak'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Sesjonssikkerhet</span>
          </div>
          <span className={`text-sm px-2 py-1 rounded-full ${
            status.sessionSecurity === 'secure' ? 'bg-green-100 text-green-800' :
            status.sessionSecurity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status.sessionSecurity === 'secure' ? 'Sikker' :
             status.sessionSecurity === 'warning' ? 'Advarsel' : 'Usikker'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Backup status</span>
          </div>
          <span className={`text-sm px-2 py-1 rounded-full ${
            status.backupStatus === 'current' ? 'bg-green-100 text-green-800' :
            status.backupStatus === 'outdated' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status.backupStatus === 'current' ? 'Oppdatert' :
             status.backupStatus === 'outdated' ? 'Utdatert' : 'Feilet'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/admin/security'}
            className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Eye className="h-4 w-4 inline mr-1" />
            Detaljert sikkerhet
          </button>
          <button
            onClick={() => window.location.href = '/admin/security/scan'}
            className="flex-1 bg-gray-600 text-white text-sm py-2 px-3 rounded-md hover:bg-gray-700 transition-colors"
          >
            <AlertCircle className="h-4 w-4 inline mr-1" />
            Kjør skanning
          </button>
        </div>
      </div>
    </div>
  )
}
