'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Shield, 
  Bot, 
  Database, 
  Users, 
  Clock, 
  Filter,
  Bell,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Alert = {
  id: string
  type: 'security' | 'system' | 'ai' | 'user'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  timestamp: string
  resolved: boolean
  source: string
}

export default function AlertsPage() {
  const [mounted, setMounted] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadAlerts()
  }, [])

  async function loadAlerts() {
    try {
      // Mock data for now
      setTimeout(() => {
        setAlerts([
          {
            id: '1',
            type: 'security',
            severity: 'critical',
            title: 'Suspicious login attempt detected',
            description: 'Multiple failed login attempts from IP 192.168.1.100',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            resolved: false,
            source: 'Auth System'
          },
          {
            id: '2',
            type: 'ai',
            severity: 'warning',
            title: 'AI quota approaching limit',
            description: 'OpenAI API quota is at 85% capacity',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            resolved: false,
            source: 'AI Monitor'
          },
          {
            id: '3',
            type: 'system',
            severity: 'info',
            title: 'Database backup completed',
            description: 'Daily backup completed successfully',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            resolved: true,
            source: 'Backup System'
          },
          {
            id: '4',
            type: 'user',
            severity: 'warning',
            title: 'High user activity detected',
            description: 'Unusual spike in user registrations',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            resolved: false,
            source: 'User Analytics'
          }
        ])
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Failed to load alerts:', error)
      setLoading(false)
    }
  }

  function resolveAlert(id: string) {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ))
  }

  function getSeverityIcon(severity: string) {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />
      case 'ai': return <Bot className="h-4 w-4" />
      case 'system': return <Database className="h-4 w-4" />
      case 'user': return <Users className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  function getSeverityBadge(severity: string) {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Kritisk</Badge>
      case 'warning': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Advarsel</Badge>
      case 'info': return <Badge variant="outline">Info</Badge>
      default: return <Badge variant="outline">Ukjent</Badge>
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.type === filter
    const matchesSearch = search === '' || 
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolved).length
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.resolved).length

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Center</h1>
          <p className="text-gray-600 mt-2">
            Sikkerhetsvarsler, systemhendelser og AI-monitorering
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Slack-varsler
          </Button>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Løs alle
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
                <div className="text-sm text-gray-600">Kritiske</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                <div className="text-sm text-gray-600">Advarsler</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{alerts.length}</div>
                <div className="text-sm text-gray-600">Totalt</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => a.resolved).length}
                </div>
                <div className="text-sm text-gray-600">Løst</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filtrer:</span>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="security">Sikkerhet</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="user">Brukere</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Søk i varsler..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="rounded-xl">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAlerts.length === 0 ? (
          <Card className="rounded-xl">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen varsler</h3>
              <p className="text-gray-600">Alle systemer fungerer normalt</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map(alert => (
            <Card key={alert.id} className={`rounded-xl ${alert.resolved ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        {getSeverityBadge(alert.severity)}
                        {alert.resolved && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Løst
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{new Date(alert.timestamp).toLocaleString('no-NO')}</span>
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Løs
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}



































