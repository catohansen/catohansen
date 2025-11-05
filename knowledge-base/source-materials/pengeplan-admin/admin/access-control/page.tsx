'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Users, 
  Settings, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import RbacMatrixV2 from '@/components/admin/RbacMatrixV2'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'

export default function AccessControlPage() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalRoles: 0,
    totalPermissions: 0,
    totalUsers: 0,
    recentChanges: 0
  })

  useEffect(() => {
    setMounted(true)
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const response = await fetch('/api/admin/rbac/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load RBAC stats:', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <AdminPageLayout
      title="🛡️ Tilgangskontroll"
      description="Administrer roller, rettigheter og systemtilganger"
      headerColor="blue"
    >

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roller</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-gray-600">
              System- og tilpassede roller
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rettigheter</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPermissions}</div>
            <p className="text-xs text-gray-600">
              Tilgjengelige funksjoner
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brukere</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-600">
              Aktive systembrukere
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Endringer</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentChanges}</div>
            <p className="text-xs text-gray-600">
              Siste 24 timer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RBAC Matrix v2 */}
      <RbacMatrixV2 />

      {/* Quick Actions */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Hurtighandlinger</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Standardroller</h3>
                  <p className="text-sm text-gray-600">
                    Bruker, Verge, Admin, SuperAdmin
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Sikkerhet</h3>
                  <p className="text-sm text-gray-600">
                    Automatisk audit og logging
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Tilpasning</h3>
                  <p className="text-sm text-gray-600">
                    Opprett egne roller og rettigheter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="rounded-xl border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Sikkerhetsmerknad</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-orange-700 space-y-2">
            <p>
              <strong>Viktig:</strong> Endringer i roller og rettigheter påvirker umiddelbart 
              alle brukere med den rollen. Vær forsiktig når du endrer systemroller.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Alle endringer logges automatisk i audit-systemet</li>
              <li>Systemroller (USER, GUARDIAN, ADMIN) kan ikke slettes</li>
              <li>Test endringer i utviklingsmiljø først</li>
              <li>Backup RBAC-konfigurasjon regelmessig</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </AdminPageLayout>
  )
}
