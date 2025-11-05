'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PPBadge } from '@/components/ui/PPBadge'
import { PPSection } from '@/components/ui/PPSection'

interface SystemStats {
  users: {
    total: number
    active: number
    demo: number
    byRole: Record<string, number>
  }
  data: {
    transactions: number
    budgets: number
    notifications: number
    supportSchemes: number
  }
  performance: {
    avgResponseTime: number
    uptime: string
    errorRate: number
  }
  storage: {
    databaseSize: string
    documentsSize: string
    totalSize: string
  }
}

export default function SystemOverviewPage() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    fetchSystemStats()
    const interval = setInterval(fetchSystemStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/system/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setLastUpdated(new Date().toLocaleString('nb-NO'))
      } else {
        console.error('Failed to fetch system stats')
      }
    } catch (error) {
      console.error('Error fetching system stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const runSystemMaintenance = async () => {
    if (!confirm('Er du sikker på at du vil kjøre systemvedlikehold?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/system/maintenance', {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Vedlikehold fullført: ${result.message}`)
        await fetchSystemStats()
      } else {
        const error = await response.json()
        alert(`Vedlikehold feilet: ${error.error}`)
      }
    } catch (error) {
      alert(`Feil: ${error}`)
    }
  }

  if (isLoading && !stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-pp-dark">System Oversikt</h1>
          <p className="text-gray-600 mt-2">
            Komplett oversikt over systemets tilstand og ytelse
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Sist oppdatert: {lastUpdated}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={fetchSystemStats}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? 'Oppdaterer...' : 'Oppdater'}
          </Button>
          <Button 
            onClick={runSystemMaintenance}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Kjør Vedlikehold
          </Button>
        </div>
      </div>

      {stats && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-pp-purple mb-2">
                {stats.users.total}
              </div>
              <div className="text-sm text-gray-600">Totale Brukere</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.users.active} aktive
              </div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.data.transactions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Transaksjoner</div>
              <div className="text-xs text-gray-500 mt-1">
                Alle brukere
              </div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.performance.avgResponseTime}ms
              </div>
              <div className="text-sm text-gray-600">Gj.snitt Responstid</div>
              <div className="text-xs text-gray-500 mt-1">
                Siste 24t
              </div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {stats.performance.uptime}
              </div>
              <div className="text-sm text-gray-600">Oppetid</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.performance.errorRate}% feilrate
              </div>
            </Card>
          </div>

          {/* User Distribution */}
          <PPSection title="Brukerfordeling" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Etter Rolle</h4>
                <div className="space-y-2">
                  {Object.entries(stats.users.byRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm">{role}</span>
                      <Badge variant={role === 'SUPERADMIN' ? 'destructive' : role === 'ADMIN' ? 'secondary' : 'default'}>
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-3">Brukertyper</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vanlige brukere</span>
                    <Badge>{stats.users.total - stats.users.demo}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Demo brukere</span>
                    <Badge className="bg-blue-100 text-blue-800">{stats.users.demo}</Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-3">Aktivitet</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aktive brukere</span>
                    <Badge className="bg-green-100 text-green-800">{stats.users.active}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Inaktive</span>
                    <Badge className="bg-gray-100 text-gray-800">{stats.users.total - stats.users.active}</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </PPSection>

          {/* Data Overview */}
          <PPSection title="Data Oversikt" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.data.budgets}
                </div>
                <div className="text-sm text-gray-600">Budsjetter</div>
              </Card>
              
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {stats.data.notifications}
                </div>
                <div className="text-sm text-gray-600">Varsler</div>
              </Card>
              
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats.data.supportSchemes}
                </div>
                <div className="text-sm text-gray-600">Støtteordninger</div>
              </Card>
              
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {stats.storage.totalSize}
                </div>
                <div className="text-sm text-gray-600">Total Lagring</div>
              </Card>
            </div>
          </PPSection>

          {/* System Health */}
          <PPSection title="System Helse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Database</h4>
                  <PPBadge variant="success">Online</PPBadge>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Størrelse: {stats.storage.databaseSize}</div>
                  <div>Tilkoblinger: Aktive</div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">API</h4>
                  <PPBadge variant="success">Operasjonell</PPBadge>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Responstid: {stats.performance.avgResponseTime}ms</div>
                  <div>Feilrate: {stats.performance.errorRate}%</div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Overvåking</h4>
                  <PPBadge variant="success">Aktiv</PPBadge>
                </div>
                <div className="text-sm text-gray-600">
                  <div>AI-QA: Kjører</div>
                  <div>Sentry: Aktivert</div>
                </div>
              </Card>
            </div>
          </PPSection>
        </>
      )}
    </div>
  )
}

