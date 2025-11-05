'use client'

import { useState, useEffect } from 'react'
import { 
  Crown, 
  Shield, 
  Users, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Database,
  Server,
  Lock,
  Key,
  Eye,
  Activity,
  TrendingUp,
  BarChart3,
  Globe,
  Zap,
  Brain,
  RefreshCw,
  Download,
  Power,
  Wrench
} from 'lucide-react'

import { useLanguage } from '@/app/contexts/LanguageContext'
import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminCard } from '@/components/admin/AdminCard'

interface OwnerData {
  user: {
    id: string
    email: string
    role: string
    status: string
    createdAt: string
    lastLoginAt: string
  }
  systemStats: {
    totalUsers: number
    activeUsers: number
    totalBills: number
    totalBudgets: number
    totalDebts: number
    totalSavings: number
    failedLogins: number
    adminActions: number
    securityViolations: number
    systemHealth: string
    uptime: string
    lastActivity: {
      name: string
      email: string
      updatedAt: string
    } | null
    metrics: {
      userGrowth: string
      systemLoad: string
      responseTime: string
      errorRate: string
    }
  }
}

export default function OwnerPanel() {
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const { t } = useLanguage()

  useEffect(() => {
    fetchOwnerData()
  }, [])

  const fetchOwnerData = async () => {
    try {
      setLoading(true)
      
      // Fetch multiple data sources
      const [usersResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/users', {
          headers: {
            'x-user-email': 'cato@catohansen.no'
          }
        }),
        fetch('/api/admin/owner/stats', {
          headers: {
            'x-user-email': 'cato@catohansen.no'
          }
        })
      ])
      
      if (!usersResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch owner data')
      }
      
      const [usersData, statsData] = await Promise.all([
        usersResponse.json(),
        statsResponse.json()
      ])
      
      // Find owner user
      const ownerUser = usersData.users.find((user: any) => user.email === 'cato@catohansen.no')
      
      setOwnerData({
        user: ownerUser,
        systemStats: statsData.data
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmergencyControl = async (action: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/owner/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'cato@catohansen.no'
        },
        body: JSON.stringify({ action, reason })
      })

      if (!response.ok) {
        throw new Error('Failed to execute emergency action')
      }

      const result = await response.json()
      alert(`${action} executed: ${result.message}`)
    } catch (err: any) {
      alert(`Error executing ${action}: ${err.message}`)
    }
  }

  const handleSystemControl = (action: string) => {
    const reason = prompt(`Reason for ${action}:`)
    if (reason) {
      handleEmergencyControl(action, reason)
    }
  }

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">{t('loading')}</span>
        </div>
      </AdminPageLayout>
    )
  }

  if (error) {
    return (
      <AdminPageLayout>
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('errorLoadingData')} {error}
          </AlertDescription>
        </Alert>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout>
      {/* Global Language Selector - Top Right */}
      <LanguageSelector position="top-right" />
      
      <div className="space-y-6">

        {/* Owner Header */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">👑</span>
                  {t('ownerPanel')}
                </h1>
                <p className="text-gray-600 mt-2">
                  {t('systemOwnerControlPanel')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOwnerData}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t('refresh')}
              </Button>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2">
                <Crown className="h-4 w-4 mr-2" />
                {t('systemOwner')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Owner Status */}
        <AdminCard>
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">{t('ownerStatus')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{ownerData?.user.email}</div>
              <div className="text-sm text-gray-600">{t('ownerEmail')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{ownerData?.user.status}</div>
              <div className="text-sm text-gray-600">{t('status')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ownerData?.user.role}</div>
              <div className="text-sm text-gray-600">{t('role')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {ownerData?.user.lastLoginAt ? 
                  new Date(ownerData.user.lastLoginAt).toLocaleDateString('nb-NO') : 
                  'Never'
                }
              </div>
              <div className="text-sm text-gray-600">{t('lastLogin')}</div>
            </div>
          </div>
        </AdminCard>

        {/* System Statistics */}
        <AdminCard>
          <div className="flex items-center gap-4 mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">{t('systemStatistics')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{ownerData?.systemStats.totalUsers}</div>
              <div className="text-sm text-gray-600">{t('totalUsers')}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{ownerData?.systemStats.activeUsers}</div>
              <div className="text-sm text-gray-600">{t('activeUsers')}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{ownerData?.systemStats.totalBills}</div>
              <div className="text-sm text-gray-600">{t('totalBills')}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{ownerData?.systemStats.totalBudgets}</div>
              <div className="text-sm text-gray-600">{t('totalBudgets')}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{ownerData?.systemStats.totalDebts}</div>
              <div className="text-sm text-gray-600">{t('totalDebts')}</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">{ownerData?.systemStats.totalSavings}</div>
              <div className="text-sm text-gray-600">{t('totalSavings')}</div>
            </div>
          </div>
        </AdminCard>

        {/* Emergency Controls */}
        <AdminCard>
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">{t('emergencyControls')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleSystemControl('emergency_access')}
              variant="destructive"
              className="h-20 flex flex-col gap-2"
            >
              <AlertTriangle className="h-6 w-6" />
              <span>{t('emergencyAccess')}</span>
            </Button>
            <Button 
              onClick={() => handleSystemControl('backup')}
              variant="outline"
              className="h-20 flex flex-col gap-2"
            >
              <Database className="h-6 w-6" />
              <span>{t('systemBackup')}</span>
            </Button>
            <Button 
              onClick={() => handleSystemControl('restart')}
              variant="outline"
              className="h-20 flex flex-col gap-2"
            >
              <Server className="h-6 w-6" />
              <span>{t('systemRestart')}</span>
            </Button>
            <Button 
              onClick={() => handleSystemControl('maintenance')}
              variant="outline"
              className="h-20 flex flex-col gap-2"
            >
              <Settings className="h-6 w-6" />
              <span>{t('maintenanceMode')}</span>
            </Button>
          </div>
        </AdminCard>

        {/* Security Metrics */}
        <AdminCard>
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">{t('securityMetrics')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{ownerData?.systemStats.failedLogins}</div>
              <div className="text-sm text-gray-600">{t('failedLogins')}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{ownerData?.systemStats.adminActions}</div>
              <div className="text-sm text-gray-600">{t('adminActions')}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{ownerData?.systemStats.securityViolations}</div>
              <div className="text-sm text-gray-600">{t('securityViolations')}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 capitalize">{ownerData?.systemStats.systemHealth}</div>
              <div className="text-sm text-gray-600">{t('systemHealth')}</div>
            </div>
          </div>
        </AdminCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Button 
            onClick={() => window.location.href = '/admin/users'}
            className="h-20 flex flex-col gap-2"
          >
            <Users className="h-6 w-6" />
            <span>{t('manageUsers')}</span>
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin/security'}
            variant="outline"
            className="h-20 flex flex-col gap-2"
          >
            <Shield className="h-6 w-6" />
            <span>{t('securityDashboard')}</span>
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin/settings'}
            variant="outline"
            className="h-20 flex flex-col gap-2"
          >
            <Settings className="h-6 w-6" />
            <span>{t('systemSettings')}</span>
          </Button>
        </div>
      </div>
    </AdminPageLayout>
  )
}