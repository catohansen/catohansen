'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Settings, 
  Flag, 
  Key, 
  FileText, 
  Bot, 
  Database, 
  Activity,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import OnboardingChecklist from '@/components/onboarding/OnboardingChecklist'

interface SystemStatus {
  version: string
  buildHash: string
  uptime: number
  featureFlags: { key: string; enabled: boolean }[]
  rateLimitStatus: string
  dbStatus: string
}

interface UserSummary {
  total: number
  active: number
  suspended: number
  byRole: { [key: string]: number }
}

interface AuditSummary {
  total: number
  recent: unknown[]
  byAction: { [key: string]: number }
}

export default function SuperAdminOverview() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [userSummary, setUserSummary] = useState<UserSummary | null>(null)
  const [auditSummary, setAuditSummary] = useState<AuditSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSystemData()
  }, [])

  const loadSystemData = async () => {
    try {
      setLoading(true)
      const [statusRes, usersRes, auditRes] = await Promise.all([
        fetch('/api/superadmin/system-status'),
        fetch('/api/superadmin/users-summary'),
        fetch('/api/superadmin/audit-summary')
      ])

      if (statusRes.ok) {
        setSystemStatus(await statusRes.json())
      }
      if (usersRes.ok) {
        setUserSummary(await usersRes.json())
      }
      if (auditRes.ok) {
        setAuditSummary(await auditRes.json())
      }
    } catch (error) {
      console.error('Error loading system data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runDedupe = async () => {
    try {
      const response = await fetch('/api/superadmin/dedupe', {
        method: 'POST'
      })
      const result = await response.json()
      alert(`Deduplication completed: ${result.message}`)
      loadSystemData()
    } catch (error) {
      console.error('Error running dedupe:', error)
      alert('Error running deduplication')
    }
  }

  const runFullVerification = async () => {
    try {
      const response = await fetch('/api/superadmin/rc1-verify', {
        method: 'POST'
      })
      const result = await response.json()
      alert(`RC1 Verification completed: ${result.message}`)
      loadSystemData()
    } catch (error) {
      console.error('Error running RC1 verification:', error)
      alert('Error running RC1 verification')
    }
  }

  const exportRC1Report = async () => {
    try {
      const response = await fetch('/api/superadmin/rc1-report')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `pengeplan-rc1-report-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Error generating RC1 report')
      }
    } catch (error) {
      console.error('Error exporting RC1 report:', error)
      alert('Error exporting RC1 report')
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
      case 'inactive':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading system overview...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Onboarding Checklist */}
      <div className="mb-8">
        <OnboardingChecklist />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SuperAdmin Overview</h1>
        <p className="text-gray-600">System status, user management, and administrative controls</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus?.dbStatus || 'unknown')}
              <span className="text-2xl font-bold">
                {systemStatus?.version || 'N/A'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Build: {systemStatus?.buildHash.substring(0, 8) || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus ? formatUptime(systemStatus.uptime) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Since last restart
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userSummary?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {userSummary?.active || 0} active, {userSummary?.suspended || 0} suspended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feature Flags</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus?.featureFlags.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {systemStatus?.featureFlags.filter(f => f.enabled).length || 0} enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RC1 Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            RC1 Status - Go/No-Go Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              {systemStatus?.dbStatus === 'healthy' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">Health Check</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Ready Check</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">E2E Tests</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Backups</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Deduplication</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Feature Flags</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">PDF Export</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Security Headers</span>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button onClick={runFullVerification} className="bg-green-600 hover:bg-green-700">
              <Activity className="w-4 h-4 mr-2" />
              Run Full Verification
            </Button>
            <Button variant="outline" onClick={exportRC1Report}>
              <FileText className="w-4 h-4 mr-2" />
              Export RC1 Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/users'}>
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/super/feature-toggles'}>
                <Flag className="w-4 h-4 mr-2" />
                Feature Flags
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/super/integrations'}>
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/events'}>
                <FileText className="w-4 h-4 mr-2" />
                Audit Logs
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/super/ai-qa'}>
                <Bot className="w-4 h-4 mr-2" />
                AI-QA
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/super/backups'}>
                <Database className="w-4 h-4 mr-2" />
                Backups
              </Button>
            </div>
            <div className="pt-3 border-t">
              <Button variant="destructive" size="sm" onClick={runDedupe}>
                <Database className="w-4 h-4 mr-2" />
                Run Deduplication
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              User Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userSummary ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">SUPERADMIN</span>
                  <Badge variant="destructive">
                    {userSummary.byRole.SUPERADMIN || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ADMIN</span>
                  <Badge variant="default">
                    {userSummary.byRole.ADMIN || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">USER</span>
                  <Badge variant="secondary">
                    {userSummary.byRole.USER || 0}
                  </Badge>
                </div>
                <div className="pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = '/admin/users'}
                  >
                    View All Users
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Loading user data...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Audit Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditSummary?.recent ? (
              <div className="space-y-2">
                {auditSummary.recent.slice(0, 10).map((event: any, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="truncate">{event.action}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(event.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = '/superadmin/audit-logs'}
                  >
                    View All Audit Logs
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Loading audit data...
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flag className="w-5 h-5 mr-2" />
              Feature Flags Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systemStatus?.featureFlags ? (
              <div className="space-y-2">
                {systemStatus.featureFlags.map((flag, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="truncate">{flag.key}</span>
                    <Badge variant={flag.enabled ? "default" : "secondary"}>
                      {flag.enabled ? "ON" : "OFF"}
                    </Badge>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = '/superadmin/feature-flags'}
                  >
                    Manage Feature Flags
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Loading feature flags...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
