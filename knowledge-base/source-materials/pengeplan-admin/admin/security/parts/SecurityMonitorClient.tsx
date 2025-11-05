'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Globe, 
  Lock, 
  Eye,
  RefreshCw,
  Clock,
  User,
  MapPin
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SecurityMetrics {
  totalLogins: number
  failedLogins: number
  suspiciousEvents: number
  rateLimitHits: number
  uniqueIPs: number
  uniqueUsers: number
}

interface SecurityEvent {
  id: string
  action: string
  actorEmail?: string
  createdAt: string
  ipHash?: string
  payload?: unknown
}

interface Props {
  initialMetrics: SecurityMetrics
  initialRecentLogins: SecurityEvent[]
  initialFailedLogins: SecurityEvent[]
  initialSuspiciousActivity: SecurityEvent[]
  initialSecurityEvents: SecurityEvent[]
}

export default function SecurityMonitorClient({
  initialMetrics,
  initialRecentLogins,
  initialFailedLogins,
  initialSuspiciousActivity,
  initialSecurityEvents
}: Props) {
  const [metrics] = useState<SecurityMetrics>(initialMetrics)
  // const [recentLogins] = useState<SecurityEvent[]>(initialRecentLogins)
  // const [failedLogins] = useState<SecurityEvent[]>(initialFailedLogins)
  // const [suspiciousActivity] = useState<SecurityEvent[]>(initialSuspiciousActivity)
  const [securityEvents] = useState<SecurityEvent[]>(initialSecurityEvents)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      // In a real implementation, you would fetch fresh data from an API
      // For now, we'll just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Failed to refresh security data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'USER_LOGIN':
        return <Shield className="h-4 w-4 text-green-500" />
      case 'LOGIN_FAILED':
        return <Lock className="h-4 w-4 text-red-500" />
      case 'RATE_LIMIT_EXCEEDED':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'SUSPICIOUS_REQUEST':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'UNAUTHORIZED_ACCESS':
        return <Lock className="h-4 w-4 text-red-500" />
      default:
        return <Eye className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionBadge = (action: string) => {
    const variants: Record<string, { variant: unknown; className: string }> = {
      'USER_LOGIN': { variant: 'default', className: 'bg-green-100 text-green-800' },
      'LOGIN_FAILED': { variant: 'destructive', className: '' },
      'RATE_LIMIT_EXCEEDED': { variant: 'secondary', className: 'bg-orange-100 text-orange-800' },
      'SUSPICIOUS_REQUEST': { variant: 'destructive', className: '' },
      'UNAUTHORIZED_ACCESS': { variant: 'destructive', className: '' }
    }
    
    const config = variants[action] || { variant: 'outline', className: '' }
    
    return (
      <Badge variant={config.variant as any} className={config.className}>
        {action.replace(/_/g, ' ')}
      </Badge>
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Nå'
    if (diffMins < 60) return `${diffMins}m siden`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}t siden`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d siden`
  }

  const getRiskLevel = (): 'low' | 'medium' | 'high' => {
    if (metrics.failedLogins > 10 || metrics.suspiciousEvents > 5) return 'high'
    if (metrics.failedLogins > 5 || metrics.suspiciousEvents > 2) return 'medium'
    return 'low'
  }

  const riskLevel = getRiskLevel()

  return (
    <div className="space-y-6">
      {/* Risk Level Alert */}
      {riskLevel !== 'low' && (
        <Card className={`border-l-4 ${
          riskLevel === 'high' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                riskLevel === 'high' ? 'text-red-500' : 'text-orange-500'
              }`} />
              <div>
                <h3 className="font-semibold">
                  {riskLevel === 'high' ? 'Høy sikkerhetsrisiko' : 'Moderat sikkerhetsrisiko'}
                </h3>
                <p className="text-sm text-gray-600">
                  {riskLevel === 'high' 
                    ? 'Flere mislykkede innloggingsforsøk eller mistenkelig aktivitet oppdaget'
                    : 'Noen sikkerhetshendelser krever oppmerksomhet'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Innlogginger (24t)</CardTitle>
              <Shield className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.totalLogins}</div>
            <div className="text-sm text-gray-600">Vellykkede innlogginger</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Mislykkede forsøk</CardTitle>
              <Lock className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.failedLogins}</div>
            <div className="text-sm text-gray-600">Feilede innloggingsforsøk</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Mistenkelig aktivitet</CardTitle>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.suspiciousEvents}</div>
            <div className="text-sm text-gray-600">Sikkerhetshendelser (7d)</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Rate Limit</CardTitle>
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.rateLimitHits}</div>
            <div className="text-sm text-gray-600">Rate limit treff (24t)</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Unike IP-adresser</CardTitle>
              <MapPin className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.uniqueIPs}</div>
            <div className="text-sm text-gray-600">Aktive IP-adresser</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Aktive brukere</CardTitle>
              <Users className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{metrics.uniqueUsers}</div>
            <div className="text-sm text-gray-600">Unike brukere (24t)</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sikkerhetshendelser</h2>
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Oppdater
        </Button>
      </div>

      {/* Security Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4">Hendelse</th>
                  <th className="text-left p-4">Bruker</th>
                  <th className="text-left p-4">IP</th>
                  <th className="text-left p-4">Tidspunkt</th>
                  <th className="text-left p-4">Handlinger</th>
                </tr>
              </thead>
              <tbody>
                {securityEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(event.action)}
                        {getActionBadge(event.action)}
                      </div>
                    </td>
                    <td className="p-4">
                      {event.actorEmail ? (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {event.actorEmail}
                        </div>
                      ) : (
                        <span className="text-gray-500">Anonym</span>
                      )}
                    </td>
                    <td className="p-4">
                      {event.ipHash ? (
                        <span className="font-mono text-sm">{event.ipHash}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{formatTimeAgo(event.createdAt)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Vis
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sikkerhetshendelse Detaljer</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  Lukk
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Hendelse</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getActionIcon(selectedEvent.action)}
                    {getActionBadge(selectedEvent.action)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Bruker</label>
                  <div>{selectedEvent.actorEmail || 'Anonym'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">IP-adresse</label>
                  <div className="font-mono text-sm">{selectedEvent.ipHash || '-'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tidspunkt</label>
                  <div>{new Date(selectedEvent.createdAt).toLocaleString('no-NO')}</div>
                </div>
              </div>
              
              {Boolean(selectedEvent.payload) && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Detaljer</label>
                  <pre className="mt-1 p-3 bg-gray-50 border rounded-md text-xs overflow-x-auto">
                    {String(JSON.stringify(selectedEvent.payload as any, null, 2))}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}














