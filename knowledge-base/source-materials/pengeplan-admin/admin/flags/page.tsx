'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Flag, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  Plus, 
  Edit, 
  Eye, 
  Globe, 
  Activity, 
  TrendingUp, 
  RefreshCw, 
  Search,
  Save
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string
  value: string | number | boolean | Record<string, unknown>
  type: 'boolean' | 'string' | 'number' | 'json' | 'percentage'
  environment: 'development' | 'staging' | 'production'
  status: 'active' | 'inactive' | 'archived'
  rolloutPercentage: number
  targeting: {
    enabled: boolean
    rules: TargetingRule[]
  }
  variants: FlagVariant[]
  defaultVariant: string
  requiresApproval: boolean
  tags: string[]
  owner: string
  createdAt: string
  updatedAt: string
  lastModifiedBy: string
}

interface TargetingRule {
  id: string
  name: string
  conditions: Condition[]
  variant: string
  percentage: number
  enabled: boolean
}

interface Condition {
  type: 'user_id' | 'email' | 'role' | 'country' | 'device' | 'browser' | 'custom_property'
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than'
  value: string | number
}

interface FlagVariant {
  id: string
  name: string
  value: string | number | boolean | Record<string, unknown>
  description: string
  weight: number
  isControl: boolean
}

interface FlagChangeRequest {
  id: string
  flagKey: string
  proposedValue: string | number | boolean | Record<string, unknown>
  reason: string
  requestedBy: string
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: string
  environment: string
}

interface FlagAnalytics {
  flagKey: string
  environment: string
  impressions: number
  conversions: number
  conversionRate: number
  variantPerformance: {
    variant: string
    impressions: number
    conversions: number
    conversionRate: number
  }[]
  timeRange: string
}

interface FlagAuditLog {
  id: string
  flagKey: string
  action: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated' | 'rollout_changed'
  oldValue?: string | number | boolean | Record<string, unknown>
  newValue?: string | number | boolean | Record<string, unknown>
  performedBy: string
  performedAt: string
  reason?: string
  environment: string
}

export default function FlagsAdminPage() {
  const [mounted, setMounted] = useState(false)
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [changeRequests, setChangeRequests] = useState<FlagChangeRequest[]>([])
  const [analytics, setAnalytics] = useState<FlagAnalytics[]>([])
  const [auditLogs, setAuditLogs] = useState<FlagAuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [environmentFilter, setEnvironmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadFlagsData = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadFlags(),
        loadChangeRequests(),
        loadAnalytics(),
        loadAuditLogs()
      ])
    } catch (error) {
      console.error('Error loading flags data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadFlags = async () => {
    try {
      const response = await fetch('/api/admin/flags')
      if (response.ok) {
        const data = await response.json()
        setFlags(data)
      }
    } catch (error) {
      console.error('Failed to load flags:', error)
    }
  }

  const loadChangeRequests = async () => {
    try {
      const response = await fetch('/api/admin/flags/change-requests')
      if (response.ok) {
        const data = await response.json()
        setChangeRequests(data)
      }
    } catch (error) {
      console.error('Failed to load change requests:', error)
    }
  }

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/flags/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const loadAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/flags/audit-logs')
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data)
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error)
    }
  }

  const toggleFlag = async (flagKey: string, environment: string) => {
    try {
      const response = await fetch(`/api/admin/flags/${flagKey}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment })
      })
      
      if (response.ok) {
        loadFlags()
        loadAuditLogs()
      }
    } catch (error) {
      console.error('Failed to toggle flag:', error)
    }
  }

  const approveChangeRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/flags/change-requests/${requestId}/approve`, {
        method: 'POST'
      })
      
      if (response.ok) {
        loadChangeRequests()
        loadFlags()
        loadAuditLogs()
      }
    } catch (error) {
      console.error('Failed to approve change request:', error)
    }
  }

  const rejectChangeRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/flags/change-requests/${requestId}/reject`, {
        method: 'POST'
      })
      
      if (response.ok) {
        loadChangeRequests()
        loadAuditLogs()
      }
    } catch (error) {
      console.error('Failed to reject change request:', error)
    }
  }

  useEffect(() => {
    setMounted(true)
    loadFlagsData()
  }, [loadFlagsData])

  if (!mounted) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'inactive':
        return <Pause className="w-4 h-4 text-gray-600" />
      case 'archived':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production': return 'bg-red-100 text-red-800'
      case 'staging': return 'bg-yellow-100 text-yellow-800'
      case 'development': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'boolean': return <Switch className="w-4 h-4" />
      case 'string': return <Edit className="w-4 h-4" />
      case 'number': return <BarChart3 className="w-4 h-4" />
      case 'json': return <Settings className="w-4 h-4" />
      case 'percentage': return <TrendingUp className="w-4 h-4" />
      default: return <Flag className="w-4 h-4" />
    }
  }

  const filteredFlags = flags.filter(flag => {
    const matchesSearch = flag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEnvironment = environmentFilter === 'all' || flag.environment === environmentFilter
    const matchesStatus = statusFilter === 'all' || flag.status === statusFilter
    return matchesSearch && matchesEnvironment && matchesStatus
  })

  const pendingRequests = changeRequests.filter(req => req.status === 'pending')

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Laster feature flags...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Flags</h1>
        <p className="text-gray-600">Administrer feature flags, A/B testing og gradual rollout</p>
      </div>

      {/* Flags Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt flags</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flags.length}</div>
            <p className="text-xs text-muted-foreground">
              {flags.filter(f => f.status === 'active').length} aktive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venter godkjenning</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Endringsforespørsler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produksjon</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {flags.filter(f => f.environment === 'production' && f.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aktive i prod
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A/B tester</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {flags.filter(f => f.variants.length > 1).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Med varianter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Flags Management Tabs */}
      <Tabs defaultValue="flags" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="flags">Flags</TabsTrigger>
            <TabsTrigger value="requests">Forespørsler</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger value="settings">Innstillinger</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={loadFlagsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Oppdater
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ny flag
            </Button>
          </div>
        </div>

        {/* Flags Tab */}
        <TabsContent value="flags" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Feature Flags</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk etter flags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Miljø" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle miljøer</SelectItem>
                  <SelectItem value="production">Produksjon</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Utvikling</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statuser</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                  <SelectItem value="archived">Arkivert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredFlags.map((flag) => (
              <Card key={flag.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(flag.type)}
                      <div>
                        <CardTitle className="text-lg">{flag.name}</CardTitle>
                        <p className="text-sm text-gray-500 font-mono">{flag.key}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getEnvironmentColor(flag.environment)}>
                        {flag.environment}
                      </Badge>
                      <Badge className={getStatusColor(flag.status)}>
                        {flag.status}
                      </Badge>
                      {flag.requiresApproval && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Godkjenning
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Beskrivelse</Label>
                      <p className="text-sm text-gray-600">{flag.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Nåværende verdi</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono">
                          {typeof flag.value === 'boolean' ? 
                            (flag.value ? 'true' : 'false') : 
                            JSON.stringify(flag.value)
                          }
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Rollout</Label>
                        <div className="mt-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${flag.rolloutPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{flag.rolloutPercentage}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Eier</Label>
                        <p className="text-sm text-gray-600">{flag.owner}</p>
                      </div>
                    </div>

                    {flag.variants.length > 1 && (
                      <div>
                        <Label className="text-sm font-medium">Varianter</Label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {flag.variants.map((variant) => (
                            <Badge 
                              key={variant.id} 
                              variant={variant.isControl ? "default" : "outline"}
                              className={variant.isControl ? "bg-blue-100 text-blue-800" : ""}
                            >
                              {variant.name}: {JSON.stringify(variant.value)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {flag.tags.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Tags</Label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {flag.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-gray-500">
                        Oppdatert {new Date(flag.updatedAt).toLocaleDateString('no-NO')} av {flag.lastModifiedBy}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleFlag(flag.key, flag.environment)}
                        >
                          {flag.status === 'active' ? 
                            <Pause className="h-4 w-4 mr-2" /> : 
                            <Play className="h-4 w-4 mr-2" />
                          }
                          {flag.status === 'active' ? 'Deaktiver' : 'Aktiver'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Rediger
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Se detaljer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Change Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Endringsforespørsler</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Foreslått verdi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Begrunnelse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Forespurt av
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Handlinger
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {changeRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 font-mono">{request.flagKey}</div>
                            <div className="text-sm text-gray-500">{request.environment}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono bg-gray-50 p-2 rounded">
                            {JSON.stringify(request.proposedValue)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {request.reason}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.requestedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(request.status)}
                            <Badge className={`ml-2 ${getStatusColor(request.status)}`}>
                              {request.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(request.requestedAt).toLocaleDateString('no-NO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => rejectChangeRequest(request.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Avvis
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => approveChangeRequest(request.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Godkjenn
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Flag Analytics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.map((analytic) => (
              <Card key={`${analytic.flagKey}-${analytic.environment}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono">{analytic.flagKey}</CardTitle>
                    <Badge className={getEnvironmentColor(analytic.environment)}>
                      {analytic.environment}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Impressions</Label>
                        <div className="text-2xl font-bold">{analytic.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Conversions</Label>
                        <div className="text-2xl font-bold">{analytic.conversions.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Conversion Rate</Label>
                      <div className="text-2xl font-bold text-green-600">
                        {analytic.conversionRate.toFixed(2)}%
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Variant Performance</Label>
                      <div className="space-y-2 mt-2">
                        {analytic.variantPerformance.map((variant, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="font-mono">{variant.variant}</span>
                            <div className="flex items-center space-x-2">
                              <span>{variant.conversionRate.toFixed(1)}%</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(variant.conversions / analytic.impressions) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Audit Log</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Handling
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endring
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utført av
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Miljø
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-mono">{log.flagKey}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{log.action}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {log.oldValue && log.newValue && (
                              <div className="space-y-1">
                                <div className="text-xs text-red-600">
                                  Fra: {JSON.stringify(log.oldValue)}
                                </div>
                                <div className="text-xs text-green-600">
                                  Til: {JSON.stringify(log.newValue)}
                                </div>
                              </div>
                            )}
                            {log.reason && (
                              <div className="text-xs text-gray-500 mt-1">
                                {log.reason}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.performedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(log.performedAt).toLocaleDateString('no-NO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getEnvironmentColor(log.environment)}>
                            {log.environment}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flag Innstillinger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-approval">Automatisk godkjenning</Label>
                    <p className="text-sm text-gray-600">
                      Godkjenn automatisk endringer for utviklingsmiljø
                    </p>
                  </div>
                  <Switch id="auto-approval" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="audit-logging">Audit-logging</Label>
                    <p className="text-sm text-gray-600">
                      Logg alle endringer for audit-sporing
                    </p>
                  </div>
                  <Switch id="audit-logging" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics-tracking">Analytics-tracking</Label>
                    <p className="text-sm text-gray-600">
                      Spor flag-ytelse og konverteringer
                    </p>
                  </div>
                  <Switch id="analytics-tracking" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rollout-safety">Rollout-sikkerhet</Label>
                    <p className="text-sm text-gray-600">
                      Begrens maksimal rollout til 50% i produksjon
                    </p>
                  </div>
                  <Switch id="rollout-safety" defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Lagre innstillinger
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

