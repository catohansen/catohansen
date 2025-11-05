'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Settings,
  History,
  Activity
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface UpdateCheckResult {
  currentVersion: string
  latestVersion: string
  updateAvailable: boolean
  updateType: 'patch' | 'minor' | 'major'
  changelog: string
  features: string[]
  improvements: string[]
  breakingChanges: string[]
  estimatedUpdateTime: string
  riskLevel: 'low' | 'medium' | 'high'
  recommended: boolean
}

interface AIComponentStatus {
  component: string
  version: string
  status: 'active' | 'inactive' | 'error' | 'updating'
  lastChecked: string
  nextCheck: string
  updateAvailable: boolean
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export function DeepSeekUpdaterPanel() {
  const [updateCheck, setUpdateCheck] = useState<UpdateCheckResult | null>(null)
  const [componentStatuses, setComponentStatuses] = useState<AIComponentStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/deepseek-updates')
      const data = await response.json()
      
      if (data.success) {
        setUpdateCheck(data.data.updateCheck)
        setComponentStatuses(data.data.componentStatuses)
      }
    } catch (error) {
      console.error('Error fetching DeepSeek updates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (version: string) => {
    try {
      setActionLoading('update')
      const response = await fetch('/api/admin/deepseek-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          version
        })
      })
      
      if (response.ok) {
        await fetchUpdates()
      }
    } catch (error) {
      console.error('Error updating DeepSeek:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleForceUpdate = async (version: string) => {
    try {
      setActionLoading('force-update')
      const response = await fetch('/api/admin/deepseek-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'force-update',
          version
        })
      })
      
      if (response.ok) {
        await fetchUpdates()
      }
    } catch (error) {
      console.error('Error force updating DeepSeek:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRollback = async (version: string) => {
    try {
      setActionLoading('rollback')
      const response = await fetch('/api/admin/deepseek-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback',
          version
        })
      })
      
      if (response.ok) {
        await fetchUpdates()
      }
    } catch (error) {
      console.error('Error rolling back DeepSeek:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'updating': return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'error': return 'bg-yellow-100 text-yellow-800'
      case 'updating': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            DeepSeek AI Oppdateringer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Laster DeepSeek-oppdateringer...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🚀 DeepSeek AI Oppdateringer</h2>
          <p className="text-gray-600">Automatisk sjekk og oppgradering av DeepSeek AI</p>
        </div>
        <Button onClick={fetchUpdates} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sjekk Oppdateringer
        </Button>
      </div>

      {/* Update Status */}
      {updateCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Oppdateringsstatus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{updateCheck.currentVersion}</div>
                <div className="text-sm text-gray-600">Nåværende versjon</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{updateCheck.latestVersion}</div>
                <div className="text-sm text-gray-600">Siste versjon</div>
              </div>
              <div className="text-center">
                <Badge className={getRiskColor(updateCheck.riskLevel)}>
                  {updateCheck.riskLevel.toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Risikonivå</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{updateCheck.estimatedUpdateTime}</div>
                <div className="text-sm text-gray-600">Estimert tid</div>
              </div>
            </div>

            {updateCheck.updateAvailable && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Oppdatering tilgjengelig!</h4>
                </div>
                <p className="text-sm text-blue-700 mb-3">{updateCheck.changelog}</p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(updateCheck.latestVersion)}
                    disabled={actionLoading === 'update'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {actionLoading === 'update' ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Oppdater
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleForceUpdate(updateCheck.latestVersion)}
                    disabled={actionLoading === 'force-update'}
                  >
                    {actionLoading === 'force-update' ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Force Oppdater
                  </Button>
                </div>
              </div>
            )}

            {!updateCheck.updateAvailable && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Systemet er oppdatert!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Du har den nyeste versjonen av DeepSeek AI
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Component Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            AI-komponenter Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {componentStatuses.map((component) => (
              <div key={component.component} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(component.status)}
                  <div>
                    <div className="font-medium">{component.component}</div>
                    <div className="text-sm text-gray-600">Versjon {component.version}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(component.status)}>
                    {component.status.toUpperCase()}
                  </Badge>
                  <Badge className={getPriorityColor(component.priority)}>
                    {component.priority.toUpperCase()}
                  </Badge>
                  {component.updateAvailable && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Oppdatering tilgjengelig
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update Details */}
      {updateCheck && updateCheck.updateAvailable && (
        <Tabs defaultValue="features" className="space-y-4">
          <TabsList>
            <TabsTrigger value="features">Nye funksjoner</TabsTrigger>
            <TabsTrigger value="improvements">Forbedringer</TabsTrigger>
            <TabsTrigger value="breaking">Breaking Changes</TabsTrigger>
            <TabsTrigger value="history">Historikk</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Nye funksjoner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {updateCheck.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improvements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Forbedringer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {updateCheck.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breaking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Breaking Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {updateCheck.breakingChanges.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{change}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Oppdateringshistorikk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Ingen oppdateringshistorikk tilgjengelig
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}



