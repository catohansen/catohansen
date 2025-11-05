'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Settings, 
  Database, 
  Activity, 
  Shield, 
  Bot,
  FileText,
  BarChart3,
  Zap,
  Globe,
  Key,
  ToggleLeft
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AppShell from '@/components/layout/AppShell'
import { AIQAStatusCard } from '@/components/aiqa/AIQAStatusCard'

interface SystemStats {
  users: { total: number; active: number; admins: number }
  data: { budgets: number; transactions: number; notifications: number }
  performance: { uptime: string; responseTime: number; errorRate: number }
  aiqa: { status: string; lastRun: string; passRate: number }
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/system/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Brukeradministrasjon',
      description: 'Administrer brukere, roller og tilganger',
      icon: Users,
      href: '/admin/super/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Systeminnstillinger',
      description: 'API-nøkler, integrasjoner og konfigurasjoner',
      icon: Settings,
      href: '/admin/super/settings',
      color: 'bg-green-500'
    },
    {
      title: 'Funksjonsbrytere',
      description: 'Aktiver/deaktiver systemmoduler',
      icon: ToggleLeft,
      href: '/admin/super/feature-toggles',
      color: 'bg-teal-500'
    },
    {
      title: 'AI-QA Overvåking',
      description: 'Intelligent kvalitetssikring og systemtester',
      icon: Bot,
      href: '/admin/super/aiqa',
      color: 'bg-purple-500'
    },
    {
      title: 'Systemstatistikk',
      description: 'Ytelse, oppetid og systemhelse',
      icon: BarChart3,
      href: '/admin/super/system',
      color: 'bg-orange-500'
    },
    {
      title: 'Dokumentasjon',
      description: 'API-dokumentasjon og systemguider',
      icon: FileText,
      href: '/admin/super/docs',
      color: 'bg-indigo-500'
    },
    {
      title: 'API Nøkler',
      description: 'Administrer OpenAI, Stripe og andre API nøkler',
      icon: Key,
      href: '/admin/super/api-keys',
      color: 'bg-yellow-500'
    },
    {
      title: 'Sikkerhet',
      description: 'Audit logs, rate limiting og sikkerhet',
      icon: Shield,
      href: '/admin/super/security',
      color: 'bg-red-500'
    }
  ]

  if (isLoading) {
    return (
      <AppShell role="superadmin">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell role="superadmin">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                SuperAdmin Dashboard
              </h1>
              <p className="text-gray-600">
                Komplett kontroll over Pengeplan systemet
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Globe className="h-3 w-3 mr-1" />
                v0.2.6
              </Badge>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-50 text-blue-700">
                {stats?.users.active || 0} aktive
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.users.total || 0}
              </h3>
              <p className="text-sm text-gray-600">Totale brukere</p>
              <p className="text-xs text-gray-500">
                {stats?.users.admins || 0} administratorer
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-50 text-green-700">
                {stats?.data.transactions || 0} transaksjoner
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.data.budgets || 0}
              </h3>
              <p className="text-sm text-gray-600">Aktive budsjetter</p>
              <p className="text-xs text-gray-500">
                {stats?.data.notifications || 0} varsler
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-50 text-orange-700">
                {stats?.performance.responseTime || 0}ms
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.performance.uptime || '99.9%'}
              </h3>
              <p className="text-sm text-gray-600">Oppetid</p>
              <p className="text-xs text-gray-500">
                {stats?.performance.errorRate || 0}% feilrate
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className={`${
                stats?.aiqa.status === 'ok' ? 'bg-green-50 text-green-700' : 
                stats?.aiqa.status === 'degraded' ? 'bg-yellow-50 text-yellow-700' : 
                'bg-red-50 text-red-700'
              }`}>
                {stats?.aiqa.status?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.aiqa.passRate || 0}%
              </h3>
              <p className="text-sm text-gray-600">AI-QA Pass Rate</p>
              <p className="text-xs text-gray-500">
                Sist kjørt: {stats?.aiqa.lastRun || 'Aldri'}
              </p>
            </div>
          </Card>
        </div>

        {/* AI-QA Status */}
        <div className="mb-8">
          <AIQAStatusCard compact={false} showActions={true} autoRefresh={true} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hurtighandlinger
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {action.description}
                    </p>
                    <Button
                      onClick={() => window.location.href = action.href}
                      variant="outline"
                      size="sm"
                    >
                      Åpne
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Siste Aktivitet
            </h2>
            <Button variant="outline" size="sm">
              Se alle
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bot className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  AI-QA kjøring fullført
                </p>
                <p className="text-xs text-gray-500">
                  5/5 tester passerte - Status: OK
                </p>
              </div>
              <span className="text-xs text-gray-500">2 min siden</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Ny bruker registrert
                </p>
                <p className="text-xs text-gray-500">
                  cato@catohansen.no (SUPERADMIN)
                </p>
              </div>
              <span className="text-xs text-gray-500">10 min siden</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  System deployment
                </p>
                <p className="text-xs text-gray-500">
                  v0.2.6 deployed successfully
                </p>
              </div>
              <span className="text-xs text-gray-500">1 time siden</span>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}