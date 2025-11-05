/**
 * Admin Verge Consent Management Dashboard
 * Comprehensive consent management system for verge-client relationships
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Download, 
  RefreshCw, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Plus, 
  Filter, 
  BarChart3,
  Target,
  Lock,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  History,
  Scale,
  Timer,
  Calendar as CalendarIcon
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

interface Consent {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  vergeId: string
  vergeName: string
  vergeEmail: string
  type: 'FULL_ACCESS' | 'LIMITED_ACCESS' | 'EMERGENCY_ACCESS' | 'BUSINESS_ACCESS' | 'SENIOR_ACCESS'
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  grantedAt: string | null
  expiresAt: string | null
  lastReviewedAt: string | null
  nextReviewDue: string
  permissions: string[]
  conditions: string[]
  restrictions: string[]
  renewalHistory: Array<{
    date: string
    action: string
    reason: string
    grantedBy: string
    adminName: string
  }>
  metadata: {
    consentVersion: string
    legalBasis: string
    dataCategories: string[]
    retentionPeriod: string
    withdrawalMethod: string
    lastModified: string
  }
  complianceChecks: {
    gdprCompliant: boolean
    dataMinimization: boolean
    purposeLimitation: boolean
    accuracyCheck: boolean
    storageLimit: boolean
    securityMeasures: boolean
    lastAudit: string | null
    nextAudit: string
  }
}

interface ConsentTemplate {
  id: string
  name: string
  type: string
  description: string
  permissions: string[]
  conditions: string[]
  defaultDuration: number
  renewalRequired: boolean
}

interface ConsentStatistics {
  totalConsents: number
  activeConsents: number
  pendingConsents: number
  expiredConsents: number
  suspendedConsents: number
  criticalPriority: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  expiringWithin30Days: number
  complianceIssues: number
}

export default function AdminVergeConsentPage() {
  const [consents, setConsents] = useState<Consent[]>([])
  const [templates, setTemplates] = useState<ConsentTemplate[]>([])
  const [statistics, setStatistics] = useState<ConsentStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedConsents, setSelectedConsents] = useState<string[]>([])

  const fetchData = useCallback(async (type: string = 'consents') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { consentType: typeFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/verge/consent?${params}`)
      if (response.ok) {
        const result = await response.json()
        
        switch (type) {
          case 'consents':
            setConsents(result.data)
            break
          case 'templates':
            setTemplates(result.data)
            break
        }
        
        if (result.statistics) {
          setStatistics(result.statistics)
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, typeFilter, priorityFilter, searchTerm])

  useEffect(() => {
    fetchData('consents')
    fetchData('templates')
  }, [fetchData])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData(activeTab === 'overview' ? 'consents' : activeTab)
      }, refreshInterval * 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, activeTab, fetchData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'EXPIRED':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'REVOKED':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_ACCESS': return 'bg-blue-100 text-blue-800'
      case 'LIMITED_ACCESS': return 'bg-purple-100 text-purple-800'
      case 'EMERGENCY_ACCESS': return 'bg-red-100 text-red-800'
      case 'BUSINESS_ACCESS': return 'bg-indigo-100 text-indigo-800'
      case 'SENIOR_ACCESS': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <ShieldCheck className="h-4 w-4 text-green-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'EXPIRED':
        return <ShieldAlert className="h-4 w-4 text-orange-600" />
      case 'SUSPENDED':
        return <ShieldX className="h-4 w-4 text-red-600" />
      case 'REVOKED':
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('no-NO')
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('no-NO')
  }

  const getDaysUntilExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null
    const expiry = new Date(expiresAt)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleAction = async (action: string, data: any) => {
    try {
      const response = await fetch('/api/admin/verge/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`${action} successful:`, result.message)
        // Refresh data
        fetchData('consents')
        fetchData('templates')
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
    }
  }

  const handleBulkAction = async (operation: string) => {
    if (selectedConsents.length === 0) return
    
    await handleAction('bulk_action', {
      operation,
      consentIds: selectedConsents
    })
    
    setSelectedConsents([])
  }

  const exportData = async () => {
    try {
      const dataToExport = {
        consents,
        templates,
        statistics,
        exportedAt: new Date().toISOString()
      }
      
      const dataStr = JSON.stringify(dataToExport, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `consent-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const filteredConsents = consents.filter(consent => {
    const matchesSearch = consent.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consent.vergeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consent.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || consent.status === statusFilter
    const matchesType = typeFilter === 'all' || consent.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || consent.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  if (loading && consents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consent management system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Consent Management
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive consent management for verge-client relationships
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <label className="text-sm text-gray-600">Auto-refresh</label>
            </div>
            <Button onClick={() => fetchData('consents')} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Consent
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Total Consents</p>
                    <p className="text-xl font-bold text-blue-600">{statistics.totalConsents}</p>
                  </div>
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Active</p>
                    <p className="text-xl font-bold text-green-600">{statistics.activeConsents}</p>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">{statistics.pendingConsents}</p>
                  </div>
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Expiring Soon</p>
                    <p className="text-xl font-bold text-orange-600">{statistics.expiringWithin30Days}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Critical Priority</p>
                    <p className="text-xl font-bold text-red-600">{statistics.criticalPriority}</p>
                  </div>
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Compliance Issues</p>
                    <p className="text-xl font-bold text-purple-600">{statistics.complianceIssues}</p>
                  </div>
                  <Scale className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="consents" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Consents ({consents.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics && [
                    { label: 'Critical', count: statistics.criticalPriority, color: 'bg-red-500' },
                    { label: 'High', count: statistics.highPriority, color: 'bg-orange-500' },
                    { label: 'Medium', count: statistics.mediumPriority, color: 'bg-yellow-500' },
                    { label: 'Low', count: statistics.lowPriority, color: 'bg-green-500' }
                  ].map((priority) => (
                    <div key={priority.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                        <span className="text-sm font-medium">{priority.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={statistics.totalConsents > 0 ? (priority.count / statistics.totalConsents) * 100 : 0} 
                          className="w-20 h-2" 
                        />
                        <span className="text-sm font-bold">{priority.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expiring Consents */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-red-600" />
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consents
                    .filter(c => {
                      const daysUntil = getDaysUntilExpiry(c.expiresAt)
                      return daysUntil !== null && daysUntil <= 30 && daysUntil >= 0 && c.status === 'ACTIVE'
                    })
                    .sort((a, b) => {
                      const daysA = getDaysUntilExpiry(a.expiresAt) || 999
                      const daysB = getDaysUntilExpiry(b.expiresAt) || 999
                      return daysA - daysB
                    })
                    .slice(0, 5)
                    .map((consent) => {
                      const daysUntil = getDaysUntilExpiry(consent.expiresAt)
                      return (
                        <div key={consent.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <div>
                              <p className="font-medium text-sm">{consent.clientName}</p>
                              <p className="text-xs text-gray-600">{consent.vergeName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            < Badge className={getPriorityColor(consent.priority)} variant="outline">
                              {daysUntil} days
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{consent.type}</p>
                          </div>
                        </div>
                      )
                    })}
                  
                  {consents.filter(c => {
                    const daysUntil = getDaysUntilExpiry(c.expiresAt)
                    return daysUntil !== null && daysUntil <= 30 && daysUntil >= 0 && c.status === 'ACTIVE'
                  }).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No consents expiring within 30 days</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consents.filter(c => c.status === 'PENDING').map((consent) => (
                    <div key={consent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <div>
                          <p className="font-medium text-sm">{consent.clientName}</p>
                          <p className="text-xs text-gray-600">{consent.type} - {consent.vergeName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleAction('grant_consent', { id: consent.id })}
                        >
                          Grant
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAction('revoke_consent', { id: consent.id })}
                        >
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}

                  {consents.filter(c => c.status === 'PENDING').length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No pending consent requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics && [
                    { label: 'GDPR Compliant', count: consents.filter(c => c.complianceChecks.gdprCompliant).length },
                    { label: 'Security Measures', count: consents.filter(c => c.complianceChecks.securityMeasures).length },
                    { label: 'Data Minimization', count: consents.filter(c => c.complianceChecks.dataMinimization).length },
                    { label: 'Purpose Limitation', count: consents.filter(c => c.complianceChecks.purposeLimitation).length }
                  ].map((compliance) => (
                    <div key={compliance.label} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{compliance.label}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={statistics.totalConsents > 0 ? (compliance.count / statistics.totalConsents) * 100 : 0} 
                          className="w-20 h-2" 
                        />
                        <span className="text-sm font-bold">{compliance.count}/{statistics.totalConsents}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consents Tab */}
        <TabsContent value="consents" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-purple-600" />
                  Filters & Search
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    {showAdvancedFilters ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                    Advanced
                  </Button>
                  {selectedConsents.length > 0 && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleBulkAction('approve')}>
                        Bulk Approve ({selectedConsents.length})
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                        Bulk Suspend
                      </Button>
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search consents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="REVOKED">Revoked</option>
                  </select>
                </div>

                <div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="FULL_ACCESS">Full Access</option>
                    <option value="LIMITED_ACCESS">Limited Access</option>
                    <option value="EMERGENCY_ACCESS">Emergency Access</option>
                    <option value="BUSINESS_ACCESS">Business Access</option>
                    <option value="SENIOR_ACCESS">Senior Access</option>
                  </select>
                </div>

                <div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Priorities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => fetchData('consents')} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={() => setShowCreateForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consents List */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Consent Management ({filteredConsents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredConsents.map((consent) => {
                  const daysUntilExpiry = getDaysUntilExpiry(consent.expiresAt)
                  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0
                  
                  return (
                    <Card 
                      key={consent.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedConsent?.id === consent.id ? 'ring-2 ring-purple-500' : ''
                      } ${isExpiringSoon ? 'border-orange-300 bg-orange-50/50' : ''}`}
                      onClick={() => setSelectedConsent(consent)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedConsents.includes(consent.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                if (e.target.checked) {
                                  setSelectedConsents([...selectedConsents, consent.id])
                                } else {
                                  setSelectedConsents(selectedConsents.filter(id => id !== consent.id))
                                }
                              }}
                              className="rounded"
                            />
                            {getStatusIcon(consent.status)}
                            <div>
                              <h3 className="font-bold text-gray-900">{consent.clientName}</h3>
                              <p className="text-sm text-gray-600">Verge: {consent.vergeName}</p>
                              <p className="text-sm text-gray-500">{consent.clientEmail}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(consent.status)} variant="outline">
                                {consent.status}
                              </Badge>
                              <Badge className={getTypeColor(consent.type)} variant="outline">
                                {consent.type}
                              </Badge>
                              <Badge className={getPriorityColor(consent.priority)} variant="outline">
                                {consent.priority}
                              </Badge>
                            </div>
                            {isExpiringSoon && (
                              < Badge className="bg-orange-100 text-orange-800" variant="outline">
                                Expires in {daysUntilExpiry} days
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Granted:</span>
                            <p className="text-gray-600">{formatDate(consent.grantedAt)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Expires:</span>
                            <p className="text-gray-600">{formatDate(consent.expiresAt)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Last Review:</span>
                            <p className="text-gray-600">{formatDate(consent.lastReviewedAt)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Next Review:</span>
                            <p className="text-gray-600">{formatDate(consent.nextReviewDue)}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="font-medium text-gray-700 text-sm">Permissions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {consent.permissions.slice(0, 4).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs bg-blue-50">
                                {permission.replace('_', ' ')}
                              </Badge>
                            ))}
                            {consent.permissions.length > 4 && (
                              <Badge variant="outline" className="text-xs bg-gray-50">
                                +{consent.permissions.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="font-medium text-gray-700 text-sm">Compliance:</span>
                          <div className="flex gap-2 mt-1">
                            {consent.complianceChecks.gdprCompliant && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                GDPR ✓
                              </Badge>
                            )}
                            {consent.complianceChecks.securityMeasures && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                Security ✓
                              </Badge>
                            )}
                            {!consent.complianceChecks.gdprCompliant && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                GDPR ✗
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <History className="h-3 w-3 mr-1" />
                            History
                          </Button>
                          {consent.status === 'PENDING' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction('grant_consent', { id: consent.id })
                                }}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Grant
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction('revoke_consent', { id: consent.id })
                                }}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Deny
                              </Button>
                            </>
                          )}
                          {consent.status === 'ACTIVE' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction('extend_consent', { id: consent.id })
                                }}
                              >
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                Extend
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction('suspend_consent', { id: consent.id })
                                }}
                              >
                                <Lock className="h-3 w-3 mr-1" />
                                Suspend
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Consent Templates ({templates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{template.name}</h3>
                          < Badge className={getTypeColor(template.type)} variant="outline">
                            {template.type}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Duration:</span>
                        <p className="text-gray-600">{template.defaultDuration} days</p>
                      </div>
                      
                      <div className="text-sm mt-2">
                        <span className="font-medium text-gray-700">Permissions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs bg-gray-50">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                          {template.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              +{template.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GDPR Compliance */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  GDPR Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consents.map((consent) => (
                    <div key={consent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {consent.complianceChecks.gdprCompliant ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{consent.clientName}</p>
                          <p className="text-xs text-gray-600">{consent.metadata.legalBasis}</p>
                        </div>
                      </div>
                      <Badge 
                        className={consent.complianceChecks.gdprCompliant ? 
                          'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} 
                        variant="outline"
                      >
                        {consent.complianceChecks.gdprCompliant ? 'Compliant' : 'Non-compliant'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audit Schedule */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  Audit Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consents
                    .filter(c => c.complianceChecks.nextAudit)
                    .sort((a, b) => new Date(a.complianceChecks.nextAudit).getTime() - new Date(b.complianceChecks.nextAudit).getTime())
                    .slice(0, 5)
                    .map((consent) => (
                    <div key={consent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{consent.clientName}</p>
                          <p className="text-xs text-gray-600">{consent.vergeName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatDate(consent.complianceChecks.nextAudit)}</p>
                        < Badge variant="outline">
                          {consent.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
