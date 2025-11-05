'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Users, 
  UserCheck, 
  UserX, 
  Settings,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface TwoFactorPolicy {
  requireForUsers: boolean
  requireForVerge: boolean
  requireForAdmin: boolean
  requireForSuperAdmin: boolean
  gracePeriodDays: number
  enforcementDate: string
}

interface TwoFactorStats {
  totalUsers: number
  usersWith2FA: number
  vergeWith2FA: number
  adminWith2FA: number
  superAdminWith2FA: number
}

export default function TwoFactorPolicyPage() {
  const [policy, setPolicy] = useState<TwoFactorPolicy>({
    requireForUsers: false,
    requireForVerge: false,
    requireForAdmin: true,
    requireForSuperAdmin: true,
    gracePeriodDays: 30,
    enforcementDate: ''
  })
  
  const [stats, setStats] = useState<TwoFactorStats>({
    totalUsers: 0,
    usersWith2FA: 0,
    vergeWith2FA: 0,
    adminWith2FA: 0,
    superAdminWith2FA: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPolicy()
    loadStats()
  }, [])

  const loadPolicy = async () => {
    try {
      const response = await fetch('/api/admin/security/2fa-policy')
      if (response.ok) {
        const data = await response.json()
        setPolicy(data.policy)
      }
    } catch (error) {
      console.error('Error loading 2FA policy:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/security/2fa-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading 2FA stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePolicy = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/security/2fa-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy })
      })
      
      if (response.ok) {
        alert('✅ 2FA-policy oppdatert!')
        await loadStats()
      } else {
        alert('Feil ved oppdatering av policy')
      }
    } catch (error) {
      console.error('Error saving policy:', error)
      alert('Feil ved lagring av policy')
    } finally {
      setSaving(false)
    }
  }

  const calculateCompliance = (total: number, with2FA: number) => {
    if (total === 0) return 0
    return Math.round((with2FA / total) * 100)
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getComplianceBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800">Høy</Badge>
    if (percentage >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Middels</Badge>
    return <Badge className="bg-red-100 text-red-800">Lav</Badge>
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Laster 2FA-policy...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">2FA Policy Management</h1>
        <p className="text-gray-600">Administrer to-faktor autentisering på tvers av organisasjonen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Policy-innstillinger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-users">Krev 2FA for brukere</Label>
                  <p className="text-sm text-gray-600">Alle vanlige brukere må aktivere 2FA</p>
                </div>
                <Switch
                  id="require-users"
                  checked={policy.requireForUsers}
                  onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, requireForUsers: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-verge">Krev 2FA for verge</Label>
                  <p className="text-sm text-gray-600">Alle verge-brukere må aktivere 2FA</p>
                </div>
                <Switch
                  id="require-verge"
                  checked={policy.requireForVerge}
                  onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, requireForVerge: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-admin">Krev 2FA for admin</Label>
                  <p className="text-sm text-gray-600">Alle admin-brukere må aktivere 2FA</p>
                </div>
                <Switch
                  id="require-admin"
                  checked={policy.requireForAdmin}
                  onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, requireForAdmin: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-superadmin">Krev 2FA for superadmin</Label>
                  <p className="text-sm text-gray-600">Alle superadmin-brukere må aktivere 2FA</p>
                </div>
                <Switch
                  id="require-superadmin"
                  checked={policy.requireForSuperAdmin}
                  onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, requireForSuperAdmin: checked }))}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="grace-period">Overgangsperiode (dager)</Label>
                  <p className="text-sm text-gray-600">Antall dager brukere har på å aktivere 2FA</p>
                </div>
                <input
                  id="grace-period"
                  type="number"
                  min="0"
                  max="365"
                  value={policy.gracePeriodDays}
                  onChange={(e) => setPolicy(prev => ({ ...prev, gracePeriodDays: parseInt(e.target.value) || 0 }))}
                  className="w-20 px-2 py-1 border rounded"
                />
              </div>
            </div>

            <Button 
              onClick={savePolicy} 
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Lagrer...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Lagre policy
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Compliance Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance-statistikk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Brukere</div>
                    <div className="text-sm text-gray-600">{stats.usersWith2FA} av {stats.totalUsers}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getComplianceColor(calculateCompliance(stats.totalUsers, stats.usersWith2FA))}`}>
                    {calculateCompliance(stats.totalUsers, stats.usersWith2FA)}%
                  </div>
                  {getComplianceBadge(calculateCompliance(stats.totalUsers, stats.usersWith2FA))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Verge</div>
                    <div className="text-sm text-gray-600">{stats.vergeWith2FA} aktive</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getComplianceColor(calculateCompliance(stats.totalUsers, stats.vergeWith2FA))}`}>
                    {stats.vergeWith2FA > 0 ? '100%' : '0%'}
                  </div>
                  {stats.vergeWith2FA > 0 ? 
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge> :
                    <Badge className="bg-gray-100 text-gray-800">Ingen</Badge>
                  }
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Admin</div>
                    <div className="text-sm text-gray-600">{stats.adminWith2FA} aktive</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getComplianceColor(calculateCompliance(stats.totalUsers, stats.adminWith2FA))}`}>
                    {stats.adminWith2FA > 0 ? '100%' : '0%'}
                  </div>
                  {stats.adminWith2FA > 0 ? 
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge> :
                    <Badge className="bg-gray-100 text-gray-800">Ingen</Badge>
                  }
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserX className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium">Superadmin</div>
                    <div className="text-sm text-gray-600">{stats.superAdminWith2FA} aktive</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getComplianceColor(calculateCompliance(stats.totalUsers, stats.superAdminWith2FA))}`}>
                    {stats.superAdminWith2FA > 0 ? '100%' : '0%'}
                  </div>
                  {stats.superAdminWith2FA > 0 ? 
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge> :
                    <Badge className="bg-gray-100 text-gray-800">Ingen</Badge>
                  }
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Viktig:</strong> Endringer i policy påvirker alle nye innlogginger. 
                Eksisterende brukere har overgangsperioden på å aktivere 2FA.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
