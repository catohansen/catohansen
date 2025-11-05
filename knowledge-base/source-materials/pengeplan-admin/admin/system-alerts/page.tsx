'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Zap,
  Shield,
  Activity,
  Database,
  Server,
  Cpu,
  MemoryStick
} from 'lucide-react'

interface Alert {
  id: string
  name: string
  description: string
  type: 'system' | 'performance' | 'security' | 'business'
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  conditions: AlertCondition[]
  actions: AlertAction[]
  lastTriggered?: string
  triggerCount: number
}

interface AlertCondition {
  metric: string
  operator: '>' | '<' | '=' | '>=' | '<='
  threshold: number
  duration: number // minutes
}

interface AlertAction {
  type: 'email' | 'sms' | 'webhook' | 'slack'
  target: string
  enabled: boolean
}

interface AlertRule {
  id: string
  name: string
  description: string
  metric: string
  threshold: number
  operator: string
  severity: string
  enabled: boolean
  lastTriggered?: string
  triggerCount: number
}

export default function SystemAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [rules, setRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchAlertData()
    const interval = setInterval(fetchAlertData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAlertData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/system-alerts')
      const data = await response.json()
      setAlerts(data.alerts)
      setRules(data.rules)
    } catch (error) {
      console.error('Failed to fetch alert data:', error)
      // Fallback to mock data
      setAlerts([
        {
          id: '1',
          name: 'High CPU Usage',
          description: 'Alert when CPU usage exceeds 80%',
          type: 'performance',
          severity: 'high',
          enabled: true,
          conditions: [
            { metric: 'cpu_usage', operator: '>', threshold: 80, duration: 5 }
          ],
          actions: [
            { type: 'email', target: 'admin@pengeplan.no', enabled: true },
            { type: 'slack', target: '#alerts', enabled: true }
          ],
          lastTriggered: new Date(Date.now() - 300000).toISOString(),
          triggerCount: 3
        },
        {
          id: '2',
          name: 'Database Connection Errors',
          description: 'Alert when database connection errors exceed threshold',
          type: 'system',
          severity: 'critical',
          enabled: true,
          conditions: [
            { metric: 'db_errors', operator: '>', threshold: 10, duration: 1 }
          ],
          actions: [
            { type: 'email', target: 'admin@pengeplan.no', enabled: true },
            { type: 'sms', target: '+4741218242', enabled: true }
          ],
          lastTriggered: new Date(Date.now() - 600000).toISOString(),
          triggerCount: 1
        },
        {
          id: '3',
          name: 'Memory Usage Warning',
          description: 'Alert when memory usage exceeds 85%',
          type: 'performance',
          severity: 'medium',
          enabled: false,
          conditions: [
            { metric: 'memory_usage', operator: '>', threshold: 85, duration: 10 }
          ],
          actions: [
            { type: 'email', target: 'admin@pengeplan.no', enabled: true }
          ],
          triggerCount: 0
        }
      ])
      setRules([
        {
          id: '1',
          name: 'CPU Usage > 80%',
          description: 'High CPU usage detected',
          metric: 'cpu_usage',
          threshold: 80,
          operator: '>',
          severity: 'high',
          enabled: true,
          lastTriggered: new Date(Date.now() - 300000).toISOString(),
          triggerCount: 3
        },
        {
          id: '2',
          name: 'Database Errors > 10',
          description: 'High number of database errors',
          metric: 'db_errors',
          threshold: 10,
          operator: '>',
          severity: 'critical',
          enabled: true,
          lastTriggered: new Date(Date.now() - 600000).toISOString(),
          triggerCount: 1
        },
        {
          id: '3',
          name: 'Memory Usage > 85%',
          description: 'High memory usage detected',
          metric: 'memory_usage',
          threshold: 85,
          operator: '>',
          severity: 'medium',
          enabled: false,
          triggerCount: 0
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleAlert = async (alertId: string) => {
    try {
      await fetch(`/api/admin/system-alerts/${alertId}/toggle`, { method: 'POST' })
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
      ))
    } catch (error) {
      console.error('Failed to toggle alert:', error)
    }
  }

  const deleteAlert = async (alertId: string) => {
    try {
      await fetch(`/api/admin/system-alerts/${alertId}`, { method: 'DELETE' })
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    } catch (error) {
      console.error('Failed to delete alert:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Server className="h-4 w-4" />
      case 'performance': return <Activity className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      case 'business': return <Zap className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔔 System Alerts</h1>
          <p className="text-gray-600">Konfigurer og overvåk systemvarsler og notifikasjoner</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={fetchAlertData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Oppdater
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ny Alert
          </Button>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter(a => a.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              av {alerts.length} totale alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kritiske Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'critical' && a.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Krever umiddelbar oppmerksomhet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Triggers i Dag</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.reduce((sum, alert) => sum + alert.triggerCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Totale utløsninger
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Siste Aktivitet</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter(a => a.lastTriggered).length > 0 ? 'Aktiv' : 'Inaktiv'}
            </div>
            <p className="text-xs text-muted-foreground">
              System status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Management */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alert Konfigurasjon</TabsTrigger>
          <TabsTrigger value="rules">Alert Regler</TabsTrigger>
          <TabsTrigger value="history">Historikk</TabsTrigger>
          <TabsTrigger value="settings">Innstillinger</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(alert.type)}
                      <div>
                        <CardTitle className="text-lg">{alert.name}</CardTitle>
                        <CardDescription>{alert.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Betingelser</h4>
                        <div className="space-y-1">
                          {alert.conditions.map((condition, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {condition.metric} {condition.operator} {condition.threshold}% 
                              (i {condition.duration} min)
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Handlinger</h4>
                        <div className="space-y-1">
                          {alert.actions.map((action, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {action.type}: {action.target} 
                              {action.enabled ? ' ✅' : ' ❌'}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        {alert.lastTriggered ? (
                          <>Sist utløst: {new Date(alert.lastTriggered).toLocaleString()}</>
                        ) : (
                          'Aldri utløst'
                        )}
                        <span className="ml-4">
                          Utløsninger: {alert.triggerCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Rediger
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Slett
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(rule.severity)}>
                        {rule.severity.toUpperCase()}
                      </Badge>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => {
                          setRules(prev => prev.map(r => 
                            r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                          ))
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Metric:</span>
                        <div className="text-gray-600">{rule.metric}</div>
                      </div>
                      <div>
                        <span className="font-semibold">Operator:</span>
                        <div className="text-gray-600">{rule.operator}</div>
                      </div>
                      <div>
                        <span className="font-semibold">Threshold:</span>
                        <div className="text-gray-600">{rule.threshold}</div>
                      </div>
                      <div>
                        <span className="font-semibold">Triggers:</span>
                        <div className="text-gray-600">{rule.triggerCount}</div>
                      </div>
                    </div>
                    {rule.lastTriggered && (
                      <div className="text-sm text-gray-600 pt-2 border-t">
                        Sist utløst: {new Date(rule.lastTriggered).toLocaleString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Historikk</CardTitle>
              <CardDescription>Historikk over alle alert utløsninger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Historikk kommer snart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notifikasjon Innstillinger
                </CardTitle>
                <CardDescription>Konfigurer hvordan du mottar varsler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">E-post Notifikasjoner</h4>
                    <p className="text-sm text-gray-600">Motta alerts via e-post</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">SMS Notifikasjoner</h4>
                    <p className="text-sm text-gray-600">Motta kritiske alerts via SMS</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Slack Integrasjon</h4>
                    <p className="text-sm text-gray-600">Send alerts til Slack kanaler</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sikkerhet Innstillinger
                </CardTitle>
                <CardDescription>Konfigurer sikkerhetsrelaterte alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Login Forsøk</h4>
                    <p className="text-sm text-gray-600">Alert ved mistenkelige login forsøk</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">API Rate Limiting</h4>
                    <p className="text-sm text-gray-600">Alert ved API misbruk</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Database Sikkerhet</h4>
                    <p className="text-sm text-gray-600">Alert ved database sikkerhetsproblemer</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


